// routes/courseRoutes.js (ESM Syntax)
import express from "express";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware.js";
import {
  getCourseDashboard,
  enrollInCourse,
  getListOfEnrollments,
} from "../../controllers/User/enrollmentController.js";
import {
  getAllCourses,
  getCourseById,
} from "../../controllers/User/courseController.js";

const router = express.Router();

// 3.2.2. Course Discovery & Enrollment Status (GET)
// Endpoint: /api/courses/dashboard
router.get("/dashboard", authMiddleware, getCourseDashboard);

// 3.2.3. Course Enrollment (POST)
// Endpoint: /api/courses/:courseId/enroll
router.post("/:courseId/enroll", authMiddleware, enrollInCourse);

router.get(
  "/enrollmentlist/:courseId",
  authMiddleware,
  isAdmin,
  getListOfEnrollments
);

router.get("/", getAllCourses);

router.get("/:courseId", authMiddleware, getCourseById);

export default router;
