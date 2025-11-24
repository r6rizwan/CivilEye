import Profile from "../models/Profile.js";

// Create profile
export const createProfile = async (req, res) => {
    try {
        const profile = await Profile.create(req.body);
        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get profile by email
export const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ email: req.params.email });
        if (!profile) return res.status(404).json({ error: "Profile not found" });

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
