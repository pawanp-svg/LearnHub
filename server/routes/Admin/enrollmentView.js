import express from "express";
import { viewEnrollments } from "../../controllers/Admin/viewController.js";

const router = express.Router();

router.get("/:courseId", viewEnrollments);

export default router;
