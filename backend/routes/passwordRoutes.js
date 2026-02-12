import express from "express";
import {
    createPassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
} from "../controllers/passwordController.js";

const router = express.Router();

router.post("/create-password", createPassword);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyotp", verifyOtp);
router.post("/resetpassword", resetPassword);

export default router;
