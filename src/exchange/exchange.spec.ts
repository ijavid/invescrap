const { getCurrentExchangeRates } = require('./exchange');

getCurrentExchangeRates().then((result) => {
    console.log(result);
});
