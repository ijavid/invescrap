import {CurrencyExchange} from "../exchange/exhange.interface";
import * as mongoose from "mongoose";

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

export interface InstrumentDocument extends CurrencyExchange, mongoose.Document { }