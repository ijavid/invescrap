let { InstrumentObject } = require("./instrument");

let data = '[[Date.UTC(2008,9,15,20,00,00),4524.98],[Date.UTC(2008,9,16,20,00,00),4557.38]]';
let result = InstrumentObject.parseSeries(data);
console.log(result);

let id = '2592';
let instrument = new InstrumentObject(id, id, 'isin', 'title');
console.log(instrument);


InstrumentObject.requestLiveData(id).then((data: any) => {
     console.log(data.isin);
     console.log(data.series);
     let result = InstrumentObject.parseSeries(data.series);
         console.log(result);
});

InstrumentObject.create(id).then((ins: any) => {
    // console.log(ins);
    ins.update().then((ins: any) => {
        console.log(ins);
    })
});