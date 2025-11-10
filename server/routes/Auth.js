// routes/authRoutes.js (ESM Syntax)
import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// 3.2.1. Registration Route
router.post("/register", register);

// 3.2.1. Login Route
router.post("/login", login);

export default router;
