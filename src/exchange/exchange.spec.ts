const { getCurrentExchangeRates } = require('./exchange');

getCurrentExchangeRates().then((result: any) => {
    console.log(result);
});
