import {MongooseDocumentOptionals} from "mongoose";

export interface Instrument  extends MongooseDocumentOptionals {
    instrument_id: string,
    isin: string,
    title: string
    series: Array<InstrumentData>;
}

export interface InstrumentData {
    date: string;
    value: number;
    i?: number;
}
