// models/index.js (ESM Syntax)
import { Sequelize } from "sequelize";
import UserModel from "./User.js";
import CourseModel from "./Course.js";
import EnrollmentModel from "./Enrollment.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// --- Assuming sequelize is already configured and exported ---
// Replace this placeholder with your actual Sequelize instance setup if necessary
const dbName = process.env.DBNAME;
const connectionUsername = process.env.DBUSERNAME;
const dbPassword = process.env.DBPASSWORD;
const sequelize = new Sequelize(dbName, connectionUsername, dbPassword, {
  host: "localhost",
  dialect: "postgres", // or 'mysql', etc.
});
// -----------------------------------------------------------

const db = {};

// 1. Initialize Models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = UserModel(sequelize);
db.Course = CourseModel(sequelize);
db.Enrollment = EnrollmentModel(sequelize);

// 2. Define Associations (Relationships)

// --- User/Course (Admin Creation) ---
// Admin (User) can create many Courses
db.User.hasMany(db.Course, {
  foreignKey: "adminId",
  as: "AuthoredCourses", // Alias for fetching courses created by a specific admin
  onDelete: "RESTRICT", // Admin must remain active to own a course
});
db.Course.belongsTo(db.User, {
  foreignKey: "adminId",
  as: "Author",
});

// --- User/Course (Enrollment - Many-to-Many) ---
// Student (User) enrolls in many Courses, and a Course has many Students.
// This relationship is managed through the Enrollment junction table.
db.User.belongsToMany(db.Course, {
  through: db.Enrollment,
  foreignKey: "userId",
  as: "EnrolledCourses",
});
db.Course.belongsToMany(db.User, {
  through: db.Enrollment,
  foreignKey: "courseId",
  as: "EnrolledStudents",
});

// --- Course/CourseContent Relationship (One-to-Many) ---
// One Course has many CourseContent items
db.Course.hasMany(db.CourseContent, {
  foreignKey: "courseId",
  as: "ContentItems",
  onDelete: "CASCADE",
});
db.CourseContent.belongsTo(db.Course, {
  foreignKey: "courseId",
  as: "Course",
});
// --- Direct Enrollment Links ---
// Enrollment belongs directly to one User and one Course
db.Enrollment.belongsTo(db.User, { foreignKey: "userId" });
db.Enrollment.belongsTo(db.Course, { foreignKey: "courseId" });

// 3. Export the database object
export default db;
