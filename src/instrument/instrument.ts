import * as request from 'request-promise-native';
import {InstrumentDocument} from './instrument.schema';

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
        return data;
    })

}


