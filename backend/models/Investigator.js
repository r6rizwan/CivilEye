import mongoose from "mongoose";

const investigatorSchema = new mongoose.Schema(
    {
        investigatorId: { type: String, required: true, unique: true }, // e.g., inv-01
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },

        department: { type: String, default: "Cyber Crime Unit" },
        designation: { type: String, default: "Investigator" },

        // complaintId values from Complaint model
        assignedComplaints: [{ type: String }],

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },

        dateJoined: { type: Date, default: Date.now }
    }
);

export default mongoose.model("Investigator", investigatorSchema);
