import {
    fetchCurrentExchangeRates,
    parseCurrentExchangeRatesResponse
} from "./exchange";

fetchCurrentExchangeRates()
    .then(parseCurrentExchangeRatesResponse)
    .then((result: any) => {
        console.log(result);
    });
