import Config from "../config";
import express, {Express, Handler, NextFunction, Request, Response} from 'express';
import { resolve } from 'path';
import webpack, {Stats} from 'webpack';
import webpackConfig from "./../webpack.config";
import * as bodyParser from "body-parser";
import {resources, routes} from "../routes";
import {ResourceBase, RouteDef} from "./resource";

export default class Server {

    private routeNamespace = '/api';

    private app: Express;

    constructor(private config: Config) {
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
        // console.log(`Registering methods of single handlers`);
        routes.forEach(route => this.registerRoute(route));
        resources.forEach((clazz: any) => {
            // console.log(`Registering methods for '${clazz._name}'`);
            const instance = new clazz() as ResourceBase;
            instance.getRoutes().forEach((route) => {
                this.registerRoute(route);
            });
        });
    }

    private registerRoute(route: RouteDef)  {
        const path = this.routeNamespace + route.path;
        console.log(`Registering route ${route.method.toUpperCase()}\t${path}\t'${route.handler.name}'`);
        this.app.use(path, (req, res, done) => {
            const handler = this.routeWrapper(route.handler);
            return (req.method.toLowerCase() === route.method.toLowerCase()) ? handler(req, res, done) : done();
        });
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

    private registerStaticRoute() {
        const path = resolve(__dirname, '../../public');
        console.log(`Registering static server on '${path}'`);
        this.app.use(express.static(path));
    }

    public compileWebpack() {
        console.log(`Webpack compile...`);
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


