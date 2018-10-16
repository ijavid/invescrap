"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const request = __importStar(require("request-promise-native"));
class InstrumentObject {
    constructor(id, instrument_id, isin, title, series) {
        this.id = id;
        this.instrument_id = instrument_id;
        this.isin = isin;
        this.title = title;
        this.series = series || [];
    }
    update() {
        return InstrumentObject.requestLiveData(this.instrument_id).then((data) => {
            this.series = InstrumentObject.parseSeries(data.series);
            return this;
        });
    }
    static create(instrument_id) {
        return InstrumentObject.requestLiveData(instrument_id).then((data) => {
            const series = InstrumentObject.parseSeries(data.series);
            return new InstrumentObject(data.id, data.instrument_id, data.isin, data.title, series);
        });
    }
    static parseSeries(series) {
        // [[Date.UTC(yyyy,mm,dd,hh,mm,ss),####.##],[Date.UTC(yyyy,mm,dd,hh,mm,ss),####.##]]
        let samples = series.slice(2, -2).split('],[').map((sample) => {
            let result = /Date\.UTC\(([0-9,]*)\),([0-9.]*)/.exec(sample);
            if (result.length) {
                const dateArr = result[1].split(',').slice(0, 3);
                const month = parseInt(dateArr[1], 10) + 1;
                const date = dateArr[0] + '-' + (month > 10 ? month : '0' + month) + '-' + dateArr[2];
                const value = parseFloat(result[2]);
                return { date, value, i: Date.parse(date) };
            }
        });
        return samples;
    }
    static requestLiveData(instrument_id) {
        const url = 'https://www.erstemarket.hu/funds/chart/' + instrument_id;
        return request.get(url).then(JSON.parse);
    }
}
exports.InstrumentObject = InstrumentObject;
