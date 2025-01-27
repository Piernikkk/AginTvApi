import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    grantedAt: {
        type: Date,
        default: () => Date.now(),
    },
});

export default mongoose.model('Token', tokenSchema); 
