import express from "express";
import { getAdminDashboardStats } from "../controllers/adminDashboardController.js";

const router = express.Router();

// Admin Dashboard KPIs
router.get("/admin/dashboard", getAdminDashboardStats);

export default router;
