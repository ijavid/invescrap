import {Resource, ResourceBase, Route} from "../server/resource";
import * as _ from 'lodash';
import moment from "moment";
import {Position} from "../position/position.interface";
import {PositionModel} from "../position/position.schema";
import {Request, Response} from "express";
import {createPosition} from "../position/position";
import {InstrumentData} from "../instrument/instrument.interface";
import {CurrencyExchangeModel} from "../exchange/exchange.schema";


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

@Resource('/position')
export default class PositionResource extends ResourceBase {

    @Route('', 'POST')
    addPosition(req: Request, res: Response): Promise<any> {
        return createPosition(req.body);
    }

    @Route('/', 'GET')
    getPositionsWithCurrentValue(): Promise<Array<PerformanceData>> {
        const self = this;
        return PositionModel.find().populate('instrument').exec().then((positions: Array<Position>) => {
            return Promise.all(positions.map(async (p: Position) => {
                const buyDate = moment(p.date).format('YYYY-MM-DD');
                const currentValue = this.getLastCloseValue(p.instrument.series);
                const startValue = _.find(p.instrument.series, {date: buyDate}) || {value: 0}

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
                    let exchange = await CurrencyExchangeModel.findOne({ date: currentValue.date } );
                    if (!exchange) {

                        // fallback
                        exchange = await CurrencyExchangeModel.findOne();
                    }
                    if (exchange) {
                        const rate = _.find(exchange.rates, { code: pos.currency });
                        if (rate) {
                            pos.currentValue = pos.currentValue * rate.value;
                            pos.netpl = pos.netpl * rate.value;
                            pos.currency = 'HUF';
                        }
                    }
                }

                return <PerformanceData> pos;
            }));
        });
    }

    private getLastCloseValue(series: InstrumentData[]): InstrumentData {
        let diff = 0;
        let currentValue;
        while (diff < 7) {
            const lastCloseDate = moment().add(-diff, 'days').format('YYYY-MM-DD');
            currentValue =
                _.find(series, {date: lastCloseDate})
            if (currentValue) {
                break;
            } else {
                diff++;
            }
        }
        return currentValue || { value: 0, date: '' };

    }
}