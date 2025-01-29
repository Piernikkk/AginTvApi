import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    path: String,
    original_name: String,
    is_public: Boolean,
    episode: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Episode'
    },
    movie: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Movie'
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    created_at: {
        type: Date,
        default: () => Date.now(),
    },
    url: String,
    quality: String,
    sub: [String],
    dub: [String],
});

export default mongoose.model('File', fileSchema);