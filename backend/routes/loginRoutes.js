import express from "express";
import { createLogin, loginUser } from "../controllers/loginController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/login/create", authenticateToken, requireRole(["Admin"]), createLogin);
router.post("/login", loginUser);

export default router;
