import express from "express";
import {
    getRecentCaseActivity,
    getComplaintTimeline
} from "../controllers/caseActivityController.js";

const router = express.Router();

// Admin dashboard
router.get("/recent", getRecentCaseActivity);

// Complaint timeline
router.get("/:complaintId", getComplaintTimeline);

export default router;
