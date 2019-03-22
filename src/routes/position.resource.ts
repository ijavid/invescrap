import {Resource, ResourceBase, Route} from "../server/resource";
import * as _ from 'lodash';
import moment from "moment";
import {Position} from "../position/position.interface";
import {PositionModel} from "../position/position.schema";
import {Request, Response} from "express";
import {createPosition} from "../position/position";
import {InstrumentData} from "../instrument/instrument.interface";
import {CurrencyExchangeModel} from "../exchange/exchange.schema";
import {CurrencyExchangeRate} from "../exchange/exchange.interface";


export interface PerformanceData extends Position {
    startPrice: number;
    startValue: number; // value * startPrice

    currentPrice: number;
    currentValue: number; // value * currentValue

    pl: number; // currentValue - startValue
    netpl: number; // currentValue - startValue - initial cost
    pldb: number; // PL / db
    grspl: number; // pldb * db

    perf: string;
    netperf: string;

    title: string;

    lastCloseDate: string;
}

export interface Series {
    currentValue: PerformanceData;
    values?: Array<PerformanceData>;
    data?: Array<GraphValue>;
}

export interface GraphValue {
    date: number,
    value: number
    perf: number
}

class CurrencyExchanger {
    private values: {[key: string]: Array<CurrencyExchangeRate>} = {};

    public get = async (date: string, code: string): Promise<CurrencyExchangeRate> => {
            if(!this.values[date] ) {
                let exchange = await CurrencyExchangeModel.findOne({ date } );
                if (!exchange) {
                    // fallback
                    exchange = await CurrencyExchangeModel.findOne();
                }
                this.values[date] = exchange.rates;
            }
            const rates = this.values[date];
            return _.find(rates, { code });
        };
    public reset = () => {
        this.values = {};
    }
}

@Resource('/position')
export default class PositionResource extends ResourceBase {

    private exchanger = new CurrencyExchanger();

    @Route('', 'POST')
    addPosition(req: Request, res: Response): Promise<any> {
        return createPosition(req.body);
    }

    @Route('/', 'GET')
    getPositionsWithCurrentValue(): Promise<Array<PerformanceData>> {
        this.exchanger.reset();
        return PositionModel.find().populate('instrument').exec().then((positions: Array<Position>) => {
            return Promise.all(positions.map(async (p: Position) => {
                const buyDate = moment(p.date).format('YYYY-MM-DD');
                const startValue = _.find(p.instrument.series, {date: buyDate}) || {value: 0, date: ''};
                const currentValue = this.getLastCloseValue(p.instrument.series);
                const pos = await this.calculatePerformance(p, startValue, currentValue);
                return <PerformanceData> pos;
            }));
        });
    }

    @Route('/values/', 'GET')
    getPositionsValues(): Promise<Array<Series>> {
        this.exchanger.reset();
        const resolution = 1; // days

        return PositionModel.find().populate('instrument').exec().then((positions: Array<Position>) => {
            return Promise.all(positions.map(async (p: Position) => {
                const buyDate = moment(p.date).format('YYYY-MM-DD');
                const startValue = _.find(p.instrument.series, {date: buyDate}) || {value: 0, date: ''};

                const current = this.getLastCloseValue(p.instrument.series);
                const currentValue = await this.calculatePerformance(p, startValue, current);

                const values = [];
                const data = [];
                for (let m = moment(p.date); m.isBefore(moment(current.date)); m.add(resolution, 'days')) {
                    const date = m.format('YYYY-MM-DD');
                    // dates.push(date);
                    const value = <InstrumentData> _.find(p.instrument.series, {date});
                    if(value) {
                        const perf = await this.calculatePerformance(p, startValue, value);
                        values.push(perf);
                        data.push(<GraphValue> {
                            date: Date.parse(value.date),
                            value: perf.netpl,
                            perf: (perf.netpl / perf.startValue * 100)
                        })
                    }
                }


                return {
                    currentValue,
                    // values,
                    data
                };
            }));
        });
    }

    private async calculatePerformance(p: Position, startValue: InstrumentData, currentValue: InstrumentData): Promise<PerformanceData> {
        const pos = <PerformanceData> _.pick(p, ['value', 'currency', 'cost', 'date']);
        pos.lastCloseDate = currentValue.date;
        pos.title = p.instrument.title;
        pos.startPrice = startValue.value;
        pos.startValue = pos.startPrice * pos.value;
        pos.currentPrice = currentValue.value;
        pos.currentValue = pos.currentPrice * pos.value;
        pos.pldb = pos.currentPrice - pos.startPrice;
        pos.grspl = pos.pldb * pos.value;
        pos.pl = pos.currentValue - pos.startValue;
        pos.netpl = pos.pl - pos.cost;

        pos.perf = (pos.pl / pos.startValue * 100).toFixed(2) + '%';
        pos.netperf = (pos.netpl / pos.startValue * 100).toFixed(2) + '%';

        if (pos.currency !== 'HUF') {
            const rate = await this.exchanger.get(currentValue.date, pos.currency);
            if (rate) {
                pos.startValue = pos.startValue * rate.value;
                pos.currentValue = pos.currentValue * rate.value;
                pos.netpl = pos.netpl * rate.value;
                pos.currency = 'HUF';
            }
        }

        return pos;
    }



    private getLastCloseValue(series: InstrumentData[]): InstrumentData {
        let diff = 0;
        let currentValue;
        while (diff < 7) {
            const lastCloseDate = moment().add(-diff, 'days').format('YYYY-MM-DD');
            currentValue =
                _.find(series, {date: lastCloseDate});
            if (currentValue) {
                break;
            } else {
                diff++;
            }
        }
        return currentValue || { value: 0, date: '' };
    }
}