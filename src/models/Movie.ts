import mongoose from "mongoose";

export interface TMovie {
    _id: mongoose.Types.ObjectId;
    name: string;
    original_name: string;
    description: string;
    tv: boolean;
    air_date: Date;
    vertical_cover_url: string;
    horizontal_cover_url: string;
    background_url: string;
    logo_url: string;
    tmdb_id: string;
    genres: mongoose.Types.ObjectId[];
    seasons: {
        season_number: number;
        name: string;
        air_date: Date;
        description: string;
        vertical_cover_url: string;
    }[];
    episodes: mongoose.Types.ObjectId[];
}

const movieSchema = new mongoose.Schema<TMovie>({
    name: String,
    original_name: String,
    description: String,
    tv: Boolean,
    air_date: Date,
    vertical_cover_url: String,
    horizontal_cover_url: String,
    background_url: String,
    logo_url: String,
    tmdb_id: String,
    genres: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Genre'
    }],
    seasons: [{
        season_number: Number,
        name: String,
        air_date: Date,
        description: String,
        vertical_cover_url: String,
    }],
    episodes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Episode'
    }],
});

export default mongoose.model<TMovie>('Movie', movieSchema);