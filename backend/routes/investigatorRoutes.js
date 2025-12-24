import express from "express";
import {
    createInvestigator,
    getInvestigators,
    getInvestigatorById,
    updateInvestigator,
    deleteInvestigator,
    getInvestigatorByEmail,
    sendOtp,
    verifyOtp,
} from "../controllers/investigatorController.js";

const router = express.Router();

// CREATE investigator
router.post("/", createInvestigator);

// GET all investigators
router.get("/", getInvestigators);

// GET by email (KEEP THIS ABOVE :id)
router.get("/by-email/:email", getInvestigatorByEmail);

// GET a single investigator
router.get("/:id", getInvestigatorById);

// UPDATE investigator
router.put("/:id", updateInvestigator);

// DELETE investigator
router.delete("/:id", deleteInvestigator);

// OTP AUTH
router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);

export default router;
