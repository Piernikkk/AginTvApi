import mongoose from "mongoose";

const collections = new mongoose.Schema({
    name: String,
    system_collection: String,
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    movies: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Movie'
    }],
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

export default mongoose.model('Collections', collections);