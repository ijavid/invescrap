import {Request, Response} from "express";
import {requestInstrumentData, updateInstrumentData} from "../instrument/instrument";
import {InstrumentModel} from "../instrument/instrument.schema";

export default function addInstrument(req: Request, res: Response): Promise<any> {
    if (req.body && req.body.instrument_id) {
        const instrument_id = req.body.instrument_id;
        return InstrumentModel.findOne({ instrument_id }).then((exists) => {
            if (exists) {
                return updateInstrumentData(exists);
            } else {
                return requestInstrumentData(instrument_id).then((data) => {
                    return InstrumentModel.create(data);
                });
            }
        });
    } else {
        throw Error('Missing instrument_id');
    }
}