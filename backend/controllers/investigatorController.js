import Investigator from "../models/Investigator.js";
import Login from "../models/Login.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

const generateInvestigatorId = async () => {
    const lastInvestigator = await Investigator
        .findOne({})
        .sort({ dateJoined: -1 });

    if (!lastInvestigator || !lastInvestigator.investigatorId) {
        return "INV-01";
    }

    const lastNumber = parseInt(
        lastInvestigator.investigatorId.split("-")[1]
    );

    const nextNumber = String(lastNumber + 1).padStart(2, "0");
    return `INV-${nextNumber}`;
};

// Create Investigator
export const createInvestigator = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // check duplicate
        const existing = await Investigator.findOne({
            $or: [{ email }, { phone }]
        });

        if (existing) {
            return res.status(400).json({
                error: "Investigator already exists"
            });
        }

        const investigatorId = await generateInvestigatorId();

        const investigator = await Investigator.create({
            investigatorId,
            name,
            email,
            phone,
            address,
        });

        // Notify investigator to set first password using Forgot Password flow
        const subject = "Welcome to Crime Report Portal";
        const text = `Welcome ${name}. Your investigator profile has been created. Visit the login page and use "Set your password" with your registered email: ${email}.`;
        const html = `
            <p>Welcome <strong>${name}</strong>,</p>
            <p>Your investigator profile has been created.</p>
            <p>Go to the website login screen and select <strong>Set your password</strong> using this email: <strong>${email}</strong>.</p>
        `;

        let mailWarning = "";
        try {
            await sendEmail({ to: email, subject, text, html });
        } catch {
            mailWarning = "Investigator created, but welcome email could not be delivered.";
        }

        res.status(201).json({
            message: "Investigator created successfully",
            investigator,
            warning: mailWarning || undefined,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getInvestigatorPasswordStatus = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const investigator = await Investigator.findOne({ email });
        if (!investigator) {
            return res.status(404).json({ error: "Investigator not found" });
        }

        const login = await Login.findOne({ email, utype: "Investigator" });

        return res.json({
            exists: true,
            hasPassword: Boolean(login),
            email,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Send OTP to investigator (email-based)
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const investigator = await Investigator.findOne({ email });

        if (!investigator) {
            return res.status(404).json({
                error: "Email not registered"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        investigator.otp = otp;
        investigator.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await investigator.save();

        const subject = "Your Investigator OTP";
        const text = `Your OTP is ${otp}. It expires in 5 minutes.`;
        const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`;

        await sendEmail({ to: investigator.email, subject, text, html });

        res.json({
            message: "OTP sent to email",
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const investigator = await Investigator.findOne({ email });

        if (!investigator || investigator.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }

        if (investigator.otpExpiresAt < new Date()) {
            return res.status(401).json({ error: "OTP expired" });
        }

        // Clear OTP
        investigator.otp = null;
        investigator.otpExpiresAt = null;
        await investigator.save();

        const token = jwt.sign(
            {
                id: investigator._id,
                role: "Investigator",
                email: investigator.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            investigator
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all investigators
export const getInvestigators = async (req, res) => {
    try {
        const investigators = await Investigator.find();
        res.json(investigators);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single investigator
export const getInvestigatorById = async (req, res) => {
    try {
        const investigator = await Investigator.findById(req.params.id);
        res.json(investigator);
    } catch (error) {
        res.status(404).json({ error: "Investigator not found" });
    }
};

// Update investigator
export const updateInvestigator = async (req, res) => {
    try {
        const updated = await Investigator.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete investigator
export const deleteInvestigator = async (req, res) => {
    try {
        await Investigator.findByIdAndDelete(req.params.id);
        res.json({ message: "Investigator removed" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get investigator by email
export const getInvestigatorByEmail = async (req, res) => {
    try {
        const investigator = await Investigator.findOne({ email: req.params.email });

        if (!investigator)
            return res.status(404).json({ error: "Investigator not found" });

        res.json(investigator);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
