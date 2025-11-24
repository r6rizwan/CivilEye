import express from "express";
import { createProfile, getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/profile", createProfile);
router.get("/profile/:email", getProfile);
router.put("/profile/:email", updateProfile);

export default router;
