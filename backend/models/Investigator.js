import mongoose from "mongoose";

const investigatorSchema = new mongoose.Schema(
    {
        investigatorId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        address: { type: String },

        department: { type: String, default: "Cyber Crime Unit" },
        designation: { type: String, default: "Investigator" },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },

        // 🔐 OTP AUTH (TEMP)
        otp: { type: String },
        otpExpiresAt: { type: Date },

        dateJoined: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

export default mongoose.model("Investigator", investigatorSchema);
