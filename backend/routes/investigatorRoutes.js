import express from "express";
import {
    createInvestigator,
    getInvestigators,
    getInvestigatorById,
    updateInvestigator,
    deleteInvestigator
} from "../controllers/investigatorController.js";

const router = express.Router();

// CREATE investigator
router.post("/", createInvestigator);

// GET all investigators
router.get("/", getInvestigators);

// GET a single investigator
router.get("/:id", getInvestigatorById);

// UPDATE investigator
router.put("/:id", updateInvestigator);

// DELETE investigator
router.delete("/:id", deleteInvestigator);

export default router;
