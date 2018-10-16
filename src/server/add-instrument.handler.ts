import {Request, Response} from "express";
import {InstrumentObject} from "../instrument/instrument.object";

export default function addInstrument(req: Request, res: Response): Promise<any> {
    if (req.body && req.body.instrument_id) {
        return InstrumentObject.create(req.body.instrument_id).then((ins) => {
            return ins;
        })
    } else {
        throw Error('Missing instrument_id');
    }
}