import express from "express";
import { createFeedback, getAllFeedback, getFeedbackByEmail } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/feedback", createFeedback);                 // user submits feedback
router.get("/feedback", getAllFeedback);                 // admin sees all feedback
router.get("/feedback/:email", getFeedbackByEmail);      // get feedback by user

export default router;
