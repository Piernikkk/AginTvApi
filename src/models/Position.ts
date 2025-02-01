import mongoose from "mongoose";
import { TEpisode } from "./Episode";

export interface TPosition {
    episode: TEpisode;
    user: any;
    position: number;
    duration: number;
    link: string;
}

const positionSchema = new mongoose.Schema({
    episode: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Episode'
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    position: Number,
    duration: Number,
    link: String,
}, { timestamps: true });

export default mongoose.model('Position', positionSchema);