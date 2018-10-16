import {default as mongoose, MongooseDocumentOptionals} from "mongoose";

export interface CurrencyExchange extends MongooseDocumentOptionals {
    code: string;
    data: string;
    i: number;
    rates: CurrencyExchangeRate;
}

export interface CurrencyExchangeRate  {
    code: string;
    value: number;
}

export interface CurrencyExchangeDocument extends CurrencyExchange, mongoose.Document { }