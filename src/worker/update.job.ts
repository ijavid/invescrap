import {updateInstrumentData} from "../instrument/instrument";
import {InstrumentModel} from "../instrument/instrument.schema";
import {CurrencyExchangeModel} from "../exchange/exchange.schema";
import {getCurrentExchangeRates} from "../exchange/exchange";

export default function updateJob() {

    console.log('Updating instruments and exchanges...');

    const instrumentJob = InstrumentModel.find({}).then((result) => {
        const promises = result.map((i) => {
            console.log(`Updating instrument: ${i.isin} ${i.instrument_id} ${i.title}`);
            return updateInstrumentData(i);
        });
        return Promise.all(promises);
    }).then(() => {
        console.log(`Update instrument DONE`);
    });

    const exchangeJob = getCurrentExchangeRates().then((result) => {
        console.log(`Checking exchange rates`);
        return CurrencyExchangeModel.findOne({ date: result.date}).then((exists) => {
            if (!exists) {
                console.log(`Exchange rate update required`);
                return CurrencyExchangeModel.create(result).then(() => {
                    console.log(`Exchange rate update DONE`);
                })
            } else {
                console.log(`Exchange rates up to date`);
            }
        });
    });

    return Promise.all([instrumentJob, exchangeJob]).then(() => {
        console.log('Update job DONE');
    });
}