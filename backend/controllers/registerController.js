import Register from "../models/Register.js";

// STEP 1: Register User + Generate OTP
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
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Create or update user if already exists (important)
        let user = await Register.findOne({ email });

        if (user) {
            // If user already exists but not verified → update OTP only
            user.fullName = fullName;
            user.gender = gender;
            user.dob = dob;
            user.city = city;
            user.address = address;
            user.pincode = pincode;
            user.mobileNo = mobileNo;
            user.otp = otp;
            user.otpExpires = otpExpires;
            user.isVerified = false;

            await user.save();
        } else {
            // Create new record
            user = await Register.create({
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
        }

        res.status(201).json({
            message: "User registered. OTP sent.",
            otp, // REMOVE THIS IN PRODUCTION
            email: user.email
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// STEP 2: Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await Register.findOne({ email });

        if (!user)
            return res.status(404).json({ error: "User not found" });

        if (user.otp !== otp)
            return res.status(400).json({ error: "Invalid OTP" });

        if (user.otpExpires < Date.now())
            return res.status(400).json({ error: "OTP expired" });

        // Mark verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // ⭐ IMPORTANT: return email so frontend redirects correctly
        res.json({
            message: "OTP verified successfully",
            email: user.email
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
