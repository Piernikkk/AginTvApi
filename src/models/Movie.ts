import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
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
    }]

});

export default mongoose.model('Movie', movieSchema);
// module.exports = mongoose.model('Movie', movieSchema);