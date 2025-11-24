import Register from "../models/Register.js";

// Create new user
export const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            gender,
            dob,
            city,
            address,
            pincode,
            email,
            mobileNo
        } = req.body;

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        const user = await Register.create({
            fullName,
            gender,
            dob,
            city,
            address,
            pincode,
            email,
            mobileNo,
            otp,
            otpExpires,
            isVerified: false
        });

        res.status(201).json({
            message: "User registered. OTP sent.",
            otp, // for testing only
            user
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await Register.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.otp !== otp)
            return res.status(400).json({ error: "Invalid OTP" });

        if (user.otpExpires < Date.now())
            return res.status(400).json({ error: "OTP expired" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.json({ message: "OTP verified successfully", user });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
