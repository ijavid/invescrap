import * as soap from 'soap';
import camaro from 'camaro';
import {CurrencyExchange} from "./exchange.interface";
import {GetCurrentExchangeRatesRequest} from "./soap-requests";
import * as _ from "lodash";


const soapRequest = require('easy-soap-request');
export function getCurrentExchangeRates2(): Promise<CurrencyExchange> {
    const url = 'http://www.mnb.hu/arfolyamok.asmx?wsdl';
    const headers = {
        'user-agent': 'nodejs invescrap',
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': "http://www.mnb.hu/webservices/MNBArfolyamServiceSoap/GetCurrentExchangeRates"
    };
    return soapRequest(url, headers, GetCurrentExchangeRatesRequest)
        .then((result: any) => {
             return _.get(result, 'response.body', '');
        })
        .then(parseCurrentExchangeRatesResponse);
}

export function getCurrentExchangeRates(): Promise<CurrencyExchange> {
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
            .then(parseCurrentExchangeRatesResponse)
            .then(resolve)
            .catch(reject)
    })
}

export function parseCurrentExchangeRatesResponse(xml: string) {
    const template = {

        code: '#HUF',
        date: '//Day/@date',
        rates: ['//Rate', {
            code: '@curr',
            unit: 'number(@unit)',
            val: '.'
        }]
    };
    const result = camaro(xml, template);
    result.i = Date.parse(result.date);
    result.rates.forEach((curr: any) => {
        curr.value = parseFloat(curr.val.replace(',', '.')) / curr.unit;
        delete curr.val;
        delete curr.unit;
    });
    return result;
}
