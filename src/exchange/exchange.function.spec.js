const { getCurrentExchangeRates } = require('./exchange.function');

getCurrentExchangeRates().then((result) => {
    console.log(result);
});
