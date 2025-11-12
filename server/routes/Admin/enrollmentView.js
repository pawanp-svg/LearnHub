import express from "express";
import { viewEnrollments } from "../../controllers/Admin/viewController.js";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:courseId", authMiddleware, isAdmin,viewEnrollments);

export default router;
