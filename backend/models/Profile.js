import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullName: { type: String, required: true },
        phone: { type: String },
        gender: { type: String },
        dob: { type: String },
        address: { type: String },
        city: { type: String },
        pincode: { type: String },

        // role: User / Admin / Investigator
        utype: {
            type: String,
            enum: ["User", "Admin", "Investigator"],
            required: true,
        },

        // Investigator-only fields
        department: { type: String, default: "" },
        badgeNumber: { type: String, default: "" },
        rank: { type: String, default: "" },

        profileImage: { type: String, default: "" },

        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
