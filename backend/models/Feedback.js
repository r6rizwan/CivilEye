import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            match: /.+\@.+\..+/,
        },
        aboutService: {
            type: String,
            required: true,
            trim: true,
        },
        comments: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);

export default mongoose.model("Feedback", feedbackSchema);
