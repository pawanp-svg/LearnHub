import express from "express";
import {
  createCourse,
  createContent,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../../controllers/Admin/manageController.js";
import { authMiddleware,isAdmin } from "../../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/",authMiddleware, isAdmin,createCourse);

router.post("/content",authMiddleware, isAdmin,createContent);

router.put("/:id",authMiddleware, isAdmin,updateCourse);

router.delete("/:id",authMiddleware, isAdmin,deleteCourse);

router.get("/", authMiddleware,getCourses);

router.get("/:id", authMiddleware,getCourseById);

export default router;
