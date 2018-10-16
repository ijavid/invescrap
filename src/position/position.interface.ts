import {MongooseDocumentOptionals} from "mongoose";
import {Instrument} from "../instrument/instrument.interface";

export interface Position extends MongooseDocumentOptionals {
    instrument_id?: string,
    instrument?: Instrument,
    value: number;
    date: Date,
    cost: number;
    currency: string;
}

