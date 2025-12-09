import express from "express";
import upload from "../middleware/upload.js";

import {
    createComplaint,
    getAllComplaints,
    getUserComplaints,
    getComplaintById,
    updateComplaintStatus,
    assignComplaint,
    addSolution,
    trackComplaint,
    getComplaintsAssignedToInvestigator
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", upload.single("file"), createComplaint);

router.get("/all", getAllComplaints);
router.get("/user/:email", getUserComplaints);
router.get("/:id", getComplaintById);
router.put("/:id/status", updateComplaintStatus);
router.put("/:id/assign", assignComplaint);
router.put("/:id/solution", addSolution);

// complaint tracking
router.get("/complaint-tracking/:id/:email", trackComplaint);

// Get complaints assigned to an investigator
router.get("/assigned/:email", getComplaintsAssignedToInvestigator);


export default router;
