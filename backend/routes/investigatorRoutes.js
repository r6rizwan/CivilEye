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
    getInvestigatorPasswordStatus,
} from "../controllers/investigatorController.js";
import { authenticateToken, requireRole, requireSelfEmailOrRole, requireSelfIdOrRole } from "../middleware/auth.js";

const router = express.Router();

// CREATE investigator (Admin)
router.post("/", authenticateToken, requireRole(["Admin"]), createInvestigator);

// OTP AUTH (Investigator)
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/password-status", getInvestigatorPasswordStatus);

// READ
router.get("/", authenticateToken, requireRole(["Admin"]), getInvestigators);
router.get("/by-email/:email", authenticateToken, requireSelfEmailOrRole(["Admin"]), getInvestigatorByEmail);
router.get("/:id", authenticateToken, requireSelfIdOrRole(["Admin"]), getInvestigatorById);

// UPDATE
router.put("/:id", authenticateToken, requireSelfIdOrRole(["Admin"]), updateInvestigator);

// DELETE
router.delete("/:id", authenticateToken, requireRole(["Admin"]), deleteInvestigator);

export default router;
