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
const dotenv = __importStar(require("dotenv"));
const server_1 = __importDefault(require("./server"));
dotenv.config();
const options = {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGODB || 'mongodb://localhost:27017/invescrap',
    env: process.env.ENV || process.env.NODE_ENV || 'dev',
    logLevel: process.env.LOG_LEVEL || 'debug',
    webpack: process.env.WEBPACK === 'true'
};
const server = new server_1.default(options);
server.start();
