import express from "express";
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

router.post("/complaints", createComplaint);
router.get("/complaints", getAllComplaints);
router.get("/complaints/user/:email", getUserComplaints);
router.get("/complaints/:id", getComplaintById);
router.put("/complaints/:id/status", updateComplaintStatus);
router.put("/complaints/:id/assign", assignComplaint);
router.put("/complaints/:id/solution", addSolution);

export default router;
