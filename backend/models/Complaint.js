import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        complaintId: { type: String, required: true, unique: true },
        complaintType: { type: String, required: true },
        description: { type: String },
        dateTime: { type: Date, default: Date.now },
        file: { type: String }, // file path or URL
        email: { type: String, required: true }, // user who filed the complaint

        status: {
            type: String,
            enum: ["Pending", "Open", "Assigned", "Closed", "Resolved"],
            default: "Pending"
        },

        assignedTo: { type: String, default: null }, // Investigator email/ID
        createdAt: { type: Date, default: Date.now },
        solution: { type: String, default: "" } // officer's solution/remarks
    }
);

export default mongoose.model("Complaint", complaintSchema);
