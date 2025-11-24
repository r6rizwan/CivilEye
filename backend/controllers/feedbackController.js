import Feedback from "../models/Feedback.js";

// Add feedback
export const createFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.create(req.body);
        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all feedback (Admin only)
export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get feedback by email (User)
export const getFeedbackByEmail = async (req, res) => {
    try {
        const feedback = await Feedback.find({ email: req.params.email });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
