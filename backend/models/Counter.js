import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: true,
            unique: true,
        },
        seq: {
            type: Number,
            default: 0,
        },
    },
    { versionKey: false }
);

export default mongoose.model("Counter", counterSchema);
