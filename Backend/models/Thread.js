import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ThreadSchema = new Schema({
    threadId: {
        type: String,
        required: true,
        unique: true,
    },

    title: {
        type: String,
        required: true,
        default: "New Chat",
    },

    messages: [MessageSchema],

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Thread", ThreadSchema);
