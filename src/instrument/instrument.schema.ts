import mongoose from "mongoose";
import {Instrument} from "./instrument.interface";

export interface InstrumentDocument extends Instrument, mongoose.Document { }

const InstrumentSchema = new mongoose.Schema({
    instrument_id: String,
    isin: String,
    title: String,
    series: [{
        date: String,
        value: Number,
        i: Number
    }]
});

export const InstrumentModel = mongoose.model<InstrumentDocument>('Instrument', InstrumentSchema);