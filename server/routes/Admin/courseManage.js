import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../../controllers/Admin/manageController.js";

const router = express.Router();

router.post("/",authMiddleware, isAdmin,createCourse);

router.put("/:id",authMiddleware, isAdmin,updateCourse);

router.delete("/:id",authMiddleware, isAdmin,deleteCourse);

router.get("/", authMiddleware,getCourses);

router.get("/:id", authMiddleware,getCourseById);

export default router;
