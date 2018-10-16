"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_data_handler_1 = __importDefault(require("./get-data.handler"));
const add_instrument_handler_1 = __importDefault(require("./add-instrument.handler"));
const path_1 = require("path");
const webpack_1 = __importDefault(require("webpack"));
const webpack_config_1 = __importDefault(require("./../webpack.config"));
const bodyParser = __importStar(require("body-parser"));
const routes = [
    {
        method: 'get',
        path: '/data',
        handler: get_data_handler_1.default
    },
    {
        method: 'post',
        path: '/instrument',
        handler: add_instrument_handler_1.default
    }
];
class Server {
    constructor(config) {
        this.config = config;
        this.app = express_1.default();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.registerStaticRoute();
        this.registerRoutes();
    }
    start() {
        this.app.listen(this.config.port, () => console.log(`Server listening on port ${this.config.port}!`));
    }
    registerRoutes() {
        routes.forEach((route) => {
            console.log(`Registering api method ${route.method.toUpperCase()}\t${route.path}\t'${route.handler.name}'`);
            this.app.use(route.path, (req, res, done) => {
                const handler = this.routeWrapper(route.handler);
                return (req.method.toLowerCase() === route.method.toLowerCase()) ? handler(req, res, done) : done();
            });
        });
    }
    routeWrapper(handler) {
        return (req, res, next) => {
            const errHandler = (err) => {
                console.error(err);
                res.status(500);
                res.end(err.message);
            };
            try {
                handler(req, res, next).then((result) => {
                    res.json(result);
                }).catch(errHandler);
            }
            catch (e) {
                errHandler(e);
            }
        };
    }
    ;
    registerStaticRoute(compileWebpack = true) {
        const path = path_1.resolve(__dirname, '../../public');
        console.log(`Registering static server on '${path}'`);
        this.app.use(express_1.default.static(path));
        if (compileWebpack) {
            console.log(`Webpack compile required...`);
            webpack_1.default(webpack_config_1.default).run((err, stats) => {
                if (err) {
                    console.error(`Webpack compile ERROR`);
                    console.error(err);
                }
                else {
                    console.log(`Webpack compiled Successfully`);
                    console.log((stats.endTime - stats.startTime) + 'ms');
                }
            });
        }
    }
}
exports.default = Server;
