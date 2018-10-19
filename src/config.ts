import * as dotenv from "dotenv";

dotenv.config();

export default interface Config {
    port: string|number,
    mongoUrl: string,
    env: string;
    logLevel: string;
    webpack: boolean;
};

export const configuration: Config = {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGODB || 'mongodb://localhost:27017/invescrap',
    env: process.env.ENV || process.env.NODE_ENV || 'dev',
    logLevel: process.env.LOG_LEVEL || 'debug',
    webpack: process.env.WEBPACK === 'true'
};