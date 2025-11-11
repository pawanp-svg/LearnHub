// controllers/enrollmentController.js (ESM Syntax)
import db from "../../db/models/index.js"; // Import your configured models
const { Course, Enrollment, Sequelize } = db;

/**
 * 1. GET Course Dashboard: Lists all available courses and indicates the current user's enrollment status.
 * GET /api/courses/dashboard
 */
export const getCourseDashboard = async (req, res) => {
  // The user ID is attached by authMiddleware
  const studentId = req.user.userId;

  try {
    // Fetch all published, non-deleted courses
    const courses = await Course.findAll({
      where: {
        isDeleted: false,
      },
      attributes: [
        "id",
        "course_name",
        "description",
        "price",
        // Use Sequelize literal to check for existing enrollment status
        [
          Sequelize.literal(`
                        CASE 
                            WHEN EXISTS(
                                SELECT 1 
                                FROM "Enrollments" AS E 
                                WHERE E."courseId" = "Course".id 
                                AND E."userId" = ${studentId}
                            ) 
                        THEN TRUE 
                        ELSE FALSE 
                        END
                    `),
          "isEnrolled", // This column will be TRUE if the user is enrolled
        ],
      ],
      raw: true,
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Course dashboard error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * 2. POST Enroll in Course: Creates a new record in the Enrollments table.
 * POST /api/courses/:courseId/enroll
 */
export const enrollInCourse = async (req, res) => {
  const studentId = req.user.userId;
  const courseId = req.params.courseId;

  try {
    // 1. Check if the course exists and is available
    // Note: Using a Sequelize scope 'active' if you defined one for isDeleted: false
    const course = await Course.findOne({
      where: { id: courseId, isDeleted: false },
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not available." });
    }

    // 2. Prevent duplicate enrollment
    const existingEnrollment = await Enrollment.findOne({
      where: { userId: studentId, courseId: courseId },
    });

    if (existingEnrollment) {
      // This satisfies the requirement to prevent duplicate enrollments
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course." });
    }

    // 3. Create the enrollment record
    const newEnrollment = await Enrollment.create({
      userId: studentId,
      courseId: courseId,
      status: "Active",
      enrollment_date: new Date(),
    });

    return res.status(201).json({
      message: "Successfully enrolled in the course!",
      enrollmentId: newEnrollment.id,
    });
  } catch (error) {
    console.error("Enrollment creation error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during enrollment." });
  }
};
