import {PositionModel} from "../position/position.schema";
import {Position} from "../position/position.interface";
import * as _ from 'lodash';
import moment from "moment";

export interface PerformanceData extends Position {
    startPrice: number;
    startValue: number; // value * startPrice

    currentPrice: number;
    currentValue: number; // value * currentValue

    pl: number; // currentValue - startValue
    netpl: number; // currentValue - startValue - initial cost
    pldb: number; // PL / db
    grspl: number; // pldb * db

    title: string;
}

export default function getData(): Promise<Array<PerformanceData>> {

    const lastCloseDate = moment().format('YYYY-MM-DD');
    const lastCloseDateBefore = moment().add(-1, 'days').format('YYYY-MM-DD');
    const lastCloseDateHolidays = moment().add(-5, 'days').format('YYYY-MM-DD');

    return PositionModel.find().populate('instrument').exec().then((positions: Array<Position>) => {
        return positions.map((p: Position) => {
            const buyDate = moment(p.date).format('YYYY-MM-DD');
            const currentValue =
                _.find(p.instrument.series, { date: lastCloseDate }) ||
                _.find(p.instrument.series, { date: lastCloseDateBefore }) ||
                _.find(p.instrument.series, { date: lastCloseDateHolidays }) ||
                { value: 0 }
            const startValue = _.find(p.instrument.series, { date: buyDate }) || { value: 0 }

            const pos = <PerformanceData> _.pick(p, ['value', 'currency', 'cost', 'date']);

            pos.title = p.instrument.title;
            pos.startPrice = startValue.value;
            pos.startValue = pos.startPrice * pos.value;
            pos.currentPrice = currentValue.value;
            pos.currentValue = pos.currentPrice * pos.value;
            pos.pldb = pos.currentPrice - pos.startPrice;
            pos.grspl = pos.pldb * pos.value;
            pos.pl = pos.currentValue - pos.startValue;
            pos.netpl = pos.pl - pos.cost;

            return <PerformanceData> pos;
        });
    });
}