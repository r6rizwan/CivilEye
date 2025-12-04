import Profile from "../models/Profile.js";
import Register from "../models/Register.js";

// Create profile (called on user registration)
export const createProfile = async (req, res) => {
    try {
        const { email, fullName, utype } = req.body;

        const exists = await Profile.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: "Profile already exists" });
        }

        const profile = await Profile.create({
            email,
            fullName,
            utype,
            ...req.body
        });

        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get profile
export const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ email: req.params.email });

        if (!profile)
            return res.status(404).json({ error: "Profile not found" });

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update profile
export const updateProfile = async (req, res) => {
    try {
        const updated = await Profile.findOneAndUpdate(
            { email: req.params.email },
            req.body,
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
