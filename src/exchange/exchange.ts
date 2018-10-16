import * as soap from 'soap';
import camaro from 'camaro';
import {CurrencyExchange} from "./exchange.interface";

export function getCurrentExchangeRates(): Promise<CurrencyExchange> {
    const url = 'http://www.mnb.hu/arfolyamok.asmx?wsdl';

    return new Promise((resolve, reject) => {
        soap.createClientAsync(url)
            .then((client: any) => {
                // console.log(client.describe());
                return client.GetCurrentExchangeRatesAsync();
            })
            .then((response: any) => {
                const xml = response[0].GetCurrentExchangeRatesResult;
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
            })
            .then(resolve)
            .catch(reject)
    })
}


