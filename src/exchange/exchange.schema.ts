import {CurrencyExchange} from "./exchange.interface";
import mongoose from "mongoose";

export interface CurrencyExchangeDocument extends CurrencyExchange, mongoose.Document { }

const CurrencyExchangeSchema = new mongoose.Schema({
    code: String,
    date: String,
    i: Number,
    rates: [{
        code: String,
        value: Number
    }]
});

export const CurrencyExchangeModel = mongoose.model<CurrencyExchangeDocument>('CurrencyExchange', CurrencyExchangeSchema);