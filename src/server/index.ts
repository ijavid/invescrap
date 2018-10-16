import Configuration from "../configuration.interface";
import express, {Express, Handler, NextFunction, Request, Response} from 'express';
import getData from "./get-data.handler";
import addInstrument from "./add-instrument.handler";
import { resolve } from 'path';
import webpack, {Stats} from 'webpack';
import webpackConfig from "./../webpack.config";
import * as bodyParser from "body-parser";
import addPosition from "./add-position.handler";

interface RouteDef {
    method: string,
    path: string,
    handler: (req?: Request, res?: Response, done?: NextFunction) => Promise<any>
}

const routes: Array<RouteDef> = [
    {
        method: 'get',
        path: '/data',
        handler: getData
    },
    {
        method: 'post',
        path: '/instrument',
        handler: addInstrument
    },
    {
        method: 'post',
        path: '/position',
        handler: addPosition
    }
];

export default class Server {

    private app: Express;

    constructor(private config: Configuration) {
        this.app = express();

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.registerStaticRoute();
        this.registerRoutes();
    }

    public start() {
        this.app.listen(this.config.port, () => console.log(`Server listening on port ${this.config.port}!`));
    }

    private registerRoutes() {
        routes.forEach((route) => {
            console.log(`Registering api method ${route.method.toUpperCase()}\t${route.path}\t'${route.handler.name}'`);
            this.app.use(route.path, (req, res, done) => {
                const handler = this.routeWrapper(route.handler);
                return (req.method.toLowerCase() === route.method.toLowerCase()) ? handler(req, res, done) : done();
            });
        })
    }

    private routeWrapper(handler: Handler): Handler {
        return (req: Request, res: Response, next: NextFunction) => {
            const errHandler = (err: Error) => {
                console.error(err);
                res.status(500);
                res.end(err.message);
            };
            try {
                handler(req, res, next).then((result: any) => {
                    res.json(result);
                }).catch(errHandler)
            } catch (e) {
                errHandler(e);
            }
        }
    };

    private registerStaticRoute(compileWebpack = true) {
        const path = resolve(__dirname, '../../public');
        console.log(`Registering static server on '${path}'`);
        this.app.use(express.static(path));
        if (compileWebpack) {
            console.log(`Webpack compile required...`);
            webpack(webpackConfig).run((err: Error, stats: Stats) => {
                if(err) {
                    console.error(`Webpack compile ERROR`);
                    console.error(err);
                } else {
                    console.log(`Webpack compiled Successfully`);
                    // console.log((stats.endTime - stats.startTime) + 'ms');
                }
            })
        }
    }

}


