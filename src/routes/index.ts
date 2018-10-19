import addInstrument from "./add-instrument.handler";
import {RouteDef} from "../server/resource";
import PositionResource from "./position.resource";

export const routes: Array<RouteDef> = [
    {
        method: 'post',
        path: '/instrument',
        handler: addInstrument
    }
];

export const resources = [
    PositionResource
];