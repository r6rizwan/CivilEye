import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        education: { type: String, default: "" },
        occupation: { type: String, default: "" },
        profilePhoto: { type: String, default: "" }  // file path
    },
    { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
