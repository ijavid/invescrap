import * as soap from 'soap';
import {CurrencyExchange, CurrencyExchangeRate} from "./exchange.interface";
import * as _ from "lodash";
import {Parser} from "xml2js";

const parser = new Parser();

export default function getCurrentExchangeRates(): Promise<CurrencyExchange> {
    return fetchCurrentExchangeRates().then(parseCurrentExchangeRatesResponse);
}

export function fetchCurrentExchangeRates(): Promise<string> {
    const url = 'http://www.mnb.hu/arfolyamok.asmx?wsdl';
    let client: any;
    return new Promise((resolve, reject) => {
        soap.createClientAsync(url)
            .then((c: any) => {
                client = c;
                // console.log(client.describe());
                return client.GetCurrentExchangeRatesAsync();
            })
            .then((response: any) => {
                // console.log('----');
                // console.log(client.lastRequest);
                // console.log('----');
                return  response[0].GetCurrentExchangeRatesResult;
            })
            .then(resolve)
            .catch(reject)
    })
}

export function parseCurrentExchangeRatesResponse(xml: string): Promise<CurrencyExchange> {
    return new Promise((resolve, reject) => {
        return parser.parseString(xml, (err: any, result: any) => {
            if( err) {
                reject(err);
            } else {
                const day = _.get(result, 'MNBCurrentExchangeRates.Day[0]');
                if (!day) {
                    reject(result);
                }
                const currencyExchange = {
                    code: "HUF",
                    date: day.$.date,
                    i: Date.parse(day.$.date),
                    rates: day.Rate.map((curr: any) => {
                        const unit = parseFloat(curr.$.unit);
                        const value = parseFloat(curr._.replace(',', '.')) / unit;
                        const code = curr.$.curr;
                        return <CurrencyExchangeRate> {
                            code, value
                        };
                    })
                };
                resolve(currencyExchange);
            }
        });
    });
}
