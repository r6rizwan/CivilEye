import express from "express";
import {
    createInvestigator,
    getInvestigators,
    getInvestigatorById,
    updateInvestigator,
    deleteInvestigator
} from "../controllers/investigatorController.js";

const router = express.Router();

router.post("/investigators", createInvestigator);
router.get("/investigators", getInvestigators);
router.get("/investigators/:id", getInvestigatorById);
router.put("/investigators/:id", updateInvestigator);
router.delete("/investigators/:id", deleteInvestigator);

export default router;
