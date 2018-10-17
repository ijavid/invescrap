import {getCurrentExchangeRates, getCurrentExchangeRates2} from "./exchange";

getCurrentExchangeRates2().then((result: any) => {
    console.log(result);
});

getCurrentExchangeRates().then((result: any) => {
    console.log(result);
});
