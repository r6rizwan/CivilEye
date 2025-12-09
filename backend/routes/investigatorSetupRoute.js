import express from "express";
import Investigator from "../models/Investigator.js";
import Login from "../models/Login.js";
import bcrypt from "bcryptjs";

const router = express.Router();
router.post("/create-temp-investigator", async (req, res) => {
    try {
        const {
            investigatorId,
            name,
            email,
            password,
            department,
            phone
        } = req.body;

        // 1️⃣ Create Investigator entry
        const investigator = await Investigator.create({
            investigatorId,
            name: name,
            email,
            phone,
            department,
            assignedComplaints: [],
            status: "Active"
        });

        // 2️⃣ Create Login entry using .save() so hashing works
        const login = new Login({
            email,
            password,       // MUST be plain — hashing is automatic
            utype: "Investigator"
        });

        await login.save(); // triggers pre-save hashing

        res.status(201).json({
            message: "Investigator created successfully",
            investigator,
            login
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;