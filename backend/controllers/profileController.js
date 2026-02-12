import Profile from "../models/Profile.js";
import Register from "../models/Register.js";

// Create profile (called on user registration)
export const createProfile = async (req, res) => {
    try {
        const { email, fullName, utype } = req.body;

        if (req.user?.role === "User") {
            const userEmail = (req.user.email || "").toLowerCase();
            const bodyEmail = (email || "").toLowerCase();
            if (!userEmail || userEmail !== bodyEmail) {
                return res.status(403).json({ error: "Forbidden" });
            }
        }

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
        const email = req.params.email;
        let profile = await Profile.findOne({ email });

        if (!profile) {
            const reg = await Register.findOne({ email });
            if (!reg || !reg.isVerified) {
                return res.status(404).json({ error: "Profile not found" });
            }

            profile = await Profile.create({
                email,
                fullName: reg.fullName,
                phone: reg.mobileNo || "",
                gender: reg.gender || "",
                dob: reg.dob || "",
                address: reg.address || "",
                city: reg.city || "",
                pincode: reg.pincode || "",
                utype: "User",
            });
        }

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
