import {Request, Response} from "express";
import {createPosition} from "../position/position";

export default function addPosition(req: Request, res: Response): Promise<any> {
    return createPosition(req.body);
}