"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const CurrencyExchangeSchema = new mongoose.Schema({
    code: String,
    data: String,
    i: Number,
    rates: {
        code: String,
        value: Number
    }
});
exports.CurrencyExchangeModel = mongoose.model('CurrencyExchange', CurrencyExchangeSchema);
