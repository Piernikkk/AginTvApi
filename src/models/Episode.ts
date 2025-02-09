import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
    season: Number,
    episode: Number,
    movie_name: String,
    name: String,
    description: String,
    air_date: Date,
    cover_url: String,
    tmdb_movie_id: String,
    duration: Number,
    sources: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'File',
        }
    ]
});

export type TEpisode = mongoose.Document & {
    season: number;
    episode: number;
    movie_name: string;
    name: string;
    description: string;
    air_date: Date;
    cover_url: string;
    tmdb_movie_id: string;
    duration: number;
    sources: mongoose.Types.ObjectId[];
};

export default mongoose.model('Episode', episodeSchema);

