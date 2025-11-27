import express from "express";
import { createPassword } from "../controllers/passwordController.js";

const router = express.Router();

router.post("/create-password", createPassword);

export default router;
