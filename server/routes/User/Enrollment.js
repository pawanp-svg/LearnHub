// routes/courseRoutes.js (ESM Syntax)
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  getCourseDashboard,
  enrollInCourse,
} from "../../controllers/User/enrollmentController.js";

const router = express.Router();

// 3.2.2. Course Discovery & Enrollment Status (GET)
// Endpoint: /api/courses/dashboard
router.get("/dashboard", authMiddleware, getCourseDashboard);

// 3.2.3. Course Enrollment (POST)
// Endpoint: /api/courses/:courseId/enroll
router.post("/:courseId/enroll", authMiddleware, enrollInCourse);

export default router;
