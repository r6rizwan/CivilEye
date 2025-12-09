import express from "express";
import {
    createProfile,
    getProfile,
    updateProfile
} from "../controllers/profileController.js";

const router = express.Router();

// Create profile
router.post("/", createProfile);

// Get profile
router.get("/:email", getProfile);

// Update profile
router.put("/:email", updateProfile);

export default router;
