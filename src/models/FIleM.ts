import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    path: String,
    originalName: String,
    movie: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Movie'
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

export default mongoose.model('File', fileSchema);