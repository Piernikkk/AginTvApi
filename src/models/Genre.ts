import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: String,
    tmdb_id: Number,
})

export default mongoose.model('Genre', genreSchema);