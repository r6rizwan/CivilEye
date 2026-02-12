import Login from "../models/Login.js";
import Register from "../models/Register.js";
import Profile from "../models/Profile.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import Investigator from "../models/Investigator.js";

export const createPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Register.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(400).json({ error: "User not verified!" });
        }

        const existingLogin = await Login.findOne({ email });
        if (existingLogin) {
            return res.status(409).json({ error: "Password already set for this account" });
        }

        // Create login entry
        const login = await Login.create({
            email,
            password,
            utype: "User"
        });

        // Create profile also (if not already created)
        await Profile.updateOne(
            { email },
            {
                $setOnInsert: {
                    email,
                    fullName: user.fullName,
                    utype: "User"
                }
            },
            { upsert: true }
        );

        return res.json({
            message: "Password created successfully",
            login
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await Login.findOne({ email });
        if (!user) {
            const investigator = await Investigator.findOne({ email });
            if (!investigator) {
                return res.status(404).json({ error: "Email not found" });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await Otp.findOneAndUpdate(
            { email },
            { otpHash, otpExpiresAt },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const subject = "Password Reset OTP";
        const text = `Your OTP is ${otp}. It expires in 15 minutes.`;
        const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 15 minutes.</p>`;

        await sendEmail({ to: email, subject, text, html });

        return res.json({ message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const record = await Otp.findOne({ email });
        if (!record) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        if (record.otpExpiresAt < new Date()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({ error: "OTP expired" });
        }

        const isMatch = await bcrypt.compare(otp, record.otpHash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        await Otp.deleteOne({ email });

        const resetToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        return res.json({ message: "OTP verified", resetToken });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ error: "Reset token and new password are required" });
        }

        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        const { email } = decoded;

        let user = await Login.findOne({ email });
        if (!user) {
            const investigator = await Investigator.findOne({ email });
            if (!investigator) {
                return res.status(404).json({ error: "Email not found" });
            }

            user = new Login({
                email,
                password: newPassword,
                utype: "Investigator"
            });
            await user.save();
        } else {
            user.password = newPassword;
            await user.save(); // triggers hashing
        }

        return res.json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
