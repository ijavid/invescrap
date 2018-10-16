import * as mongoose from "mongoose";
import {Instrument, InstrumentDocument} from "./instrument.interface";

export interface InstrumentData {
    date: string;
    value: number;
    i: number;
}

export interface Instrument {
    id: string,
    instrument_id: string,
    isin: string,
    title: string
    series: Array<InstrumentData>;
}


const InstrumentSchema = new mongoose.Schema({
    code: String,
    data: String,
    i: Number,
    rates: {
        code: String,
        value: Number
    }
});

export const InstrumentModel = mongoose.model<InstrumentDocument>('Instrument', InstrumentSchema);