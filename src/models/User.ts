import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avatar: String,
    admin: Boolean,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    }
});

export default mongoose.model('User', userSchema);