import * as request from 'request-promise-native';
import {InstrumentDocument} from './instrument.schema';
import moment = require("moment");

export function updateInstrumentData(instrument: InstrumentDocument) {
    return requestInstrumentData(instrument.instrument_id).then((data) => {
        instrument.set('series', data.series);
        return instrument.save();
    })
}

export function parseSeries(series: string) {
    // [[Date.UTC(yyyy,mm,dd,hh,mm,ss),####.##],[Date.UTC(yyyy,mm,dd,hh,mm,ss),####.##]]
    let samples = series.slice(2, -2).split('],[').map((sample) => {
        let result = /Date\.UTC\(([0-9,]*)\),([0-9.]*)/.exec(sample);
        if (result.length) {
            const dateArr = result[1].split(',').slice(0, 3);
            const month = parseInt(dateArr[1], 10) + 1;
            const date = dateArr[0] + '-' + (month > 9 ? month : '0' + month) + '-' + dateArr[2];
            const value = parseFloat(result[2]);
            return {date, value, i: Date.parse(date)}
        }
    });
    return samples;
}

export function requestInstrumentData(instrument_id: string) {
    const url = 'https://www.erstemarket.hu/funds/chart/' + instrument_id;
    return request.get(url).then(JSON.parse).then((data) => {
        data.series = parseSeries(data.series);
        return getLatestPageData(data.isin).then((lastValue) => {
            if(data.series[data.series.length - 1].date !== lastValue.date) {
                data.series.push(lastValue);
            }
            return data;
        });
    })
}

export function getLatestPageData(isin: string) {
    const url = 'https://www.erstemarket.hu/befektetesi_alapok/alap/' + isin;
    return request.get(url).then((data) => {
        const lastPriceRegexp = /<span.*_last_price .*stream="([0-9.]*).*title="([A-Z]{3})".*<\/span>/;
        const lastPriceTimeRegexp = /<span.*_last_price_time .*stream="([0-9.]*).*<\/span>/;
        const lastPrice = lastPriceRegexp.exec(data);
        const lastPriceTime = lastPriceTimeRegexp.exec(data);

        if(lastPrice) {
            const result = {
                date: parseFloat(lastPriceTime[1]) * 1000,
                value: parseFloat(lastPrice[1]),
                currency: lastPrice[2]
            };
            const date = moment(result.date).format('YYYY-MM-DD');
            return {
                date,
                value: result.value,
                i: result.date
            }
        }
    })
}


