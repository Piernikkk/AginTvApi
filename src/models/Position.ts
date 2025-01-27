import mongoose from "mongoose";


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
});

export default mongoose.model('Position', positionSchema);