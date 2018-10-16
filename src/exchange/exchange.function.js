"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const soap = __importStar(require("soap"));
const camaro_1 = __importDefault(require("camaro"));
function getCurrentExchangeRates() {
    const url = 'http://www.mnb.hu/arfolyamok.asmx?wsdl';
    return soap.createClientAsync(url).then((client) => {
        // console.log(client.describe());
        return client.GetCurrentExchangeRatesAsync();
    }).then((response) => {
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
        const result = camaro_1.default(xml, template);
        result.i = Date.parse(result.date);
        result.rates.forEach((curr) => {
            curr.value = parseFloat(curr.val.replace(',', '.')) / curr.unit;
            delete curr.val;
            delete curr.unit;
        });
        return result;
    });
}
exports.getCurrentExchangeRates = getCurrentExchangeRates;
