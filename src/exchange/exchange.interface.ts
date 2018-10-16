import {MongooseDocumentOptionals} from "mongoose";

export interface CurrencyExchange extends MongooseDocumentOptionals {
    code: string;
    date: string;
    i: number;
    rates: Array<CurrencyExchangeRate>;
}

export interface CurrencyExchangeRate  {
    code: string;
    value: number;
}
