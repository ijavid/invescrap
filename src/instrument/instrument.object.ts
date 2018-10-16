import * as request from 'request-promise-native';
import {Instrument, InstrumentData} from "./instrument.interface";

export class InstrumentObject implements Instrument {

    public series: Array<InstrumentData>;

    constructor (
        public id: string,
        public instrument_id: string,
        public isin: string,
        public title: string,
        series?: Array<InstrumentData>
    ) {
        this.series = series || [];
    }

    public update() {
        return InstrumentObject.requestLiveData(this.instrument_id).then((data) => {
            this.series = InstrumentObject.parseSeries(data.series);
            return this;
        })
    }

    static create(instrument_id: string) {
        return InstrumentObject.requestLiveData(instrument_id).then((data) => {
            const series = InstrumentObject.parseSeries(data.series);
            return new InstrumentObject(data.id, data.instrument_id, data.isin, data.title, series);
        })
    }

    static parseSeries(series: string) {
        // [[Date.UTC(yyyy,mm,dd,hh,mm,ss),####.##],[Date.UTC(yyyy,mm,dd,hh,mm,ss),####.##]]
        let samples = series.slice(2,-2).split('],[').map((sample) => {
            let result = /Date\.UTC\(([0-9,]*)\),([0-9.]*)/.exec(sample);
            if (result.length) {
                const dateArr = result[1].split(',').slice(0,3);
                const month = parseInt(dateArr[1], 10) + 1;
                const date = dateArr[0] + '-' + (month > 10 ? month : '0' + month) + '-' + dateArr[2];
                const value = parseFloat(result[2]);
                return { date, value, i: Date.parse(date) }
            }
        });
        return samples;
    }

    static requestLiveData(instrument_id: string) {
        const url = 'https://www.erstemarket.hu/funds/chart/' + instrument_id;
        return request.get(url).then(JSON.parse);
    }

}
