import Investigator from "../models/Investigator.js";

// Create Investigator
export const createInvestigator = async (req, res) => {
    try {
        const investigator = await Investigator.create(req.body);
        res.status(201).json(investigator);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all investigators
export const getInvestigators = async (req, res) => {
    try {
        const investigators = await Investigator.find();
        res.json(investigators);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single investigator
export const getInvestigatorById = async (req, res) => {
    try {
        const investigator = await Investigator.findById(req.params.id);
        res.json(investigator);
    } catch (error) {
        res.status(404).json({ error: "Investigator not found" });
    }
};

// Update investigator
export const updateInvestigator = async (req, res) => {
    try {
        const updated = await Investigator.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete investigator
export const deleteInvestigator = async (req, res) => {
    try {
        await Investigator.findByIdAndDelete(req.params.id);
        res.json({ message: "Investigator removed" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get investigator by email
export const getInvestigatorByEmail = async (req, res) => {
    try {
        const investigator = await Investigator.findOne({ email: req.params.email });

        if (!investigator)
            return res.status(404).json({ error: "Investigator not found" });

        res.json(investigator);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
