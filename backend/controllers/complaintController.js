import Complaint from "../models/Complaint.js";

// Create complaint
export const createComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.create(req.body);
        res.status(201).json({ message: "Complaint filed successfully", complaint });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all complaints (Admin)
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get complaints by user email
export const getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ email: req.params.email });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single complaint by ID
export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        res.json(complaint);
    } catch (error) {
        res.status(404).json({ error: "Complaint not found" });
    }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Assign investigator
export const assignComplaint = async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(
            req.params.id,
            { assignedTo: req.body.assignedTo },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add solution
export const addSolution = async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(
            req.params.id,
            { solution: req.body.solution, status: "Resolved" },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
