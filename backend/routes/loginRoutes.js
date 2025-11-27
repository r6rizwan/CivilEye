import express from "express";
import { createLogin, loginUser } from "../controllers/loginController.js";
import { createAdmin } from "../controllers/loginController.js";

const router = express.Router();

router.post("/login/create", createLogin);
router.post("/login", loginUser);

router.post("/create-admin", createAdmin);


export default router;
