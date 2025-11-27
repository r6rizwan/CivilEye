import express from "express";
import upload from "../middleware/upload.js";

import {
    createComplaint,
    getAllComplaints,
    getUserComplaints,
    getComplaintById,
    updateComplaintStatus,
    assignComplaint,
    addSolution
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", upload.single("file"), createComplaint);

router.get("/all", getAllComplaints);
router.get("/user/:email", getUserComplaints);
router.get("/:id", getComplaintById);
router.put("/:id/status", updateComplaintStatus);
router.put("/:id/assign", assignComplaint);
router.put("/:id/solution", addSolution);


export default router;
