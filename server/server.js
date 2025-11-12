import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/User/Enrollment.js";
import adminCourseRoutes from "./routes/Admin/courseManage.js";
import adminEnrollmentRoutes from "./routes/Admin/enrollmentView.js";
dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/courses", adminCourseRoutes);
app.use("/api/admin/enrollments", adminEnrollmentRoutes);
app.listen(PORT, () => {
  console.log(`Server is listening on PORT:${PORT}`);
});
