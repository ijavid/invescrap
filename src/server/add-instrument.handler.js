"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instrument_object_1 = require("../instrument/instrument.object");
function addInstrument(req, res) {
    if (req.body && req.body.instrument_id) {
        return instrument_object_1.InstrumentObject.create(req.body.instrument_id).then((ins) => {
            return ins;
        });
    }
    else {
        throw Error('Missing instrument_id');
    }
}
exports.default = addInstrument;
