import express from "express";
import {
    createProfile,
    getProfile,
    updateProfile
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);                 // Create profile
router.get("/:email", getProfile);               // Get profile
router.put("/:email", updateProfile);            // Update profile

export default router;
