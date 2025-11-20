import express from "express";
import {
  createCourse,
  createContent,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  courseStatus,
} from "../../controllers/Admin/manageController.js";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware.js";
import {
  getContentByCourse,
  deleteContent,
  getContentById,
  updateContent,
} from "../../controllers/Admin/contentController.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCourse);

router.put("/:id", authMiddleware, isAdmin, updateCourse);

router.delete("/:id", authMiddleware, isAdmin, deleteCourse);

router.get("/", authMiddleware, getCourses);

router.get("/:id", authMiddleware, getCourseById);

router.put("/status/:id", authMiddleware, isAdmin, courseStatus);

//content crud operations
router.post("/content", authMiddleware, isAdmin, createContent);
router.get("/content/course/:courseId", authMiddleware, getContentByCourse);
router.get("/content/:id", authMiddleware, getContentById);
router.put("/content/:id", authMiddleware, isAdmin, updateContent);
router.delete("/content/:id", authMiddleware, isAdmin, deleteContent);
export default router;
