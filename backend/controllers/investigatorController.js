import Investigator from "../models/Investigator.js";
import jwt from "jsonwebtoken";

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

        res.status(201).json({
            message: "Investigator created successfully",
            investigator
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send OTP to investigator
export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        const investigator = await Investigator.findOne({ phone });

        if (!investigator) {
            return res.status(404).json({
                error: "Phone number not registered"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        investigator.otp = otp;
        investigator.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await investigator.save();

        // ⚠️ DEV MODE: show OTP
        res.json({
            message: "OTP generated",
            otp, // REMOVE later when SMS is added
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        const investigator = await Investigator.findOne({ phone });

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
