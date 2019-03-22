import mongoose from "mongoose";
import {Position} from "./position.interface";
import {Instrument} from "../instrument/instrument.interface";

export interface PositionDocument extends Position, mongoose.Document { }

const PositionSchema = new mongoose.Schema({
    instrument:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument'
    },
    value: Number,
    date: String,
    cost: Number,
    currency: String
});

export const PositionModel = mongoose.model<PositionDocument>('Position', PositionSchema);