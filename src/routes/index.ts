import {NextFunction, Request, Response} from "express";
import addInstrument from "./add-instrument.handler";
import addPosition from "./add-position.handler";
import getData from "./get-data.handler";

export type HandlerFn = (req?: Request, res?: Response, done?: NextFunction) => Promise<any>;

export interface RouteDef {
    method: string,
    path: string,
    handler: HandlerFn
}

export const routes: Array<RouteDef> = [
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
