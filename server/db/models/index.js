// models/index.js (ESM Syntax)
import { Sequelize } from "sequelize";
// 1. Import the model definition functions
import UserModel from "./User.js";
import CourseModel from "./Course.js";
import EnrollmentModel from "./Enrollment.js";
import CourseContentModel from "./CourseContent.js"; // Ensure this line is correct
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
// ----------------------------------------------------

const db = {};

// 1. Initialization Phase: Create Model Instances
// Pass the sequelize instance to the functions imported above
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = UserModel(sequelize);
db.Course = CourseModel(sequelize);
db.Enrollment = EnrollmentModel(sequelize);
db.CourseContent = CourseContentModel(sequelize); // Initialize the CourseContent model

// 2. Association Phase: Define Relationships (AFTER ALL models are in db)
// Loop through models and call the associate function (optional, but cleaner)

// --- A. Define Associations ---

// User/Course (Admin Creation)
db.User.hasMany(db.Course, {
  foreignKey: "adminId",
  as: "AuthoredCourses",
  onDelete: "RESTRICT",
});
db.Course.belongsTo(db.User, { foreignKey: "adminId", as: "Author" });

// Course/CourseContent (One-to-Many)
db.Course.hasMany(db.CourseContent, {
  foreignKey: "courseId",
  as: "ContentItems",
  onDelete: "CASCADE",
});
db.CourseContent.belongsTo(db.Course, { foreignKey: "courseId", as: "Course" });

// User/Course (Enrollment - Many-to-Many)
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

// Direct Enrollment Links
db.Enrollment.belongsTo(db.User, { foreignKey: "userId" });
db.Enrollment.belongsTo(db.Course, { foreignKey: "courseId" });

// 3. Export the database object
export default db;
