import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
    season: Number,
    episode: Number,
    name: String,
    description: String,
    air_date: Date,
    cover_url: String,
    tmdb_movie_id: String, 
    duration: Number,
});

export default mongoose.model('Episode', episodeSchema);

