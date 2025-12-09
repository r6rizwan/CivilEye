import Complaint from "../models/Complaint.js";

// CREATE COMPLAINT (with files)
export const createComplaint = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            complaintId,
            complaintType,
            description,
            email
        } = req.body;

        // multer file path
        // store only the saved filename (sanitized by multer middleware)
        let fileName = "";
        if (req.file) {
            // multer's diskStorage filename returns the sanitized filename
            fileName = req.file.filename || req.file.path || "";
        }

        const complaint = await Complaint.create({
            complaintId,
            complaintType,
            description,
            email,
            file: fileName,
            status: "Pending",
        });

        res.status(201).json({
            message: "Complaint filed successfully",
            complaint
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ADMIN: get all complaints
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// USER: get complaints by email
export const getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ email: req.params.email });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        res.json(complaint);
    } catch (error) {
        res.status(404).json({ error: "Complaint not found" });
    }
};

// UPDATE STATUS
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

// ASSIGN INVESTIGATOR
export const assignComplaint = async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(
            req.params.id,
            { assignedTo: req.body.assignedTo, status: "Assigned" },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ADD SOLUTION
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

// TRACK COMPLAINT
export const trackComplaint = async (req, res) => {
    try {
        const id  = req.params.id;
        const userEmail = req.params.email;
        // console.log("Tracking complaint:", id, "for email:", userEmail);

        if (!userEmail) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Search complaint by complaintId or _id
        const complaint = await Complaint.findOne({
            $or: [{ complaintId: id }]
        });

        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        // SECURITY CHECK → Only owner can view
        if (complaint.email !== userEmail) {
            return res.status(403).json({ error: "No complaint matching the given ID" });
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get complaints assigned to an investigator
export const getComplaintsAssignedToInvestigator = async (req, res) => {
    try {
        const { email } = req.params;

        const complaints = await Complaint.find({ assignedTo: email });

        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
