import {PositionDocument, PositionModel} from "./position.schema";
import {Position} from "./position.interface";
import {InstrumentModel} from "../instrument/instrument.schema";

export function createPosition(pos: Position): Promise<PositionDocument> {
    if (!pos.instrument_id) {
        throw Error('missing instrument id');
    }
    return InstrumentModel.findOne({ instrument_id: pos.instrument_id } ).then((instrument) => {
        if (!instrument) {
            throw Error('instrument not found: ' + pos.instrument_id );
        }
        pos.instrument = instrument;
        return PositionModel.create(pos);
    })
}