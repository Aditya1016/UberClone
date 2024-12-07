import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // TTL set to 24 hours (24 * 60 * 60 seconds)
    },
});

export const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
