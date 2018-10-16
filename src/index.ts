import * as dotenv from "dotenv";
import Configuration from "./configuration.interface";
import Server from "./server";

dotenv.config();
const options: Configuration = {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGODB || 'mongodb://localhost:27017/invescrap',
    env: process.env.ENV || process.env.NODE_ENV || 'dev',
    logLevel: process.env.LOG_LEVEL || 'debug',
    webpack: process.env.WEBPACK === 'true'
};

const server = new Server(options);
server.start();

