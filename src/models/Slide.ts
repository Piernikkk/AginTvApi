import mongoose from "mongoose";
import { TMovie } from './Movie';

export interface TSlide {
    _id: mongoose.Types.ObjectId;
    movie: TMovie;
}

const slideSchema = new mongoose.Schema<TSlide>({
    movie: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Movie'
    },
});

export default mongoose.model<TSlide>('Slide', slideSchema);