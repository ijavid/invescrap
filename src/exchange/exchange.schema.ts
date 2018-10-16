import {CurrencyExchangeDocument} from "./exchange.interface";
import * as mongoose from "mongoose";

const CurrencyExchangeSchema = new mongoose.Schema({
    code: String,
    data: String,
    i: Number,
    rates: {
        code: String,
        value: Number
    }
});

export const CurrencyExchangeModel = mongoose.model<CurrencyExchangeDocument>('CurrencyExchange', CurrencyExchangeSchema);