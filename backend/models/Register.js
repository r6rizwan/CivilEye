import mongoose from "mongoose";

const registerSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        dob: { type: Date, required: true },
        city: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, match: /^[0-9]{6}$/ },

        email: { type: String, required: true, unique: true, lowercase: true },
        mobileNo: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },

        otp: { type: String },             // stores OTP for email/phone verification
        otpExpires: { type: Date },        // OTP expiry time
        isVerified: { type: Boolean, default: false } // becomes true after OTP verification
    },
    { timestamps: true }
);

export default mongoose.model("Register", registerSchema);
