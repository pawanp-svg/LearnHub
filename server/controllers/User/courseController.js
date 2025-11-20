import db from "../../db/models/index.js";
const Course = db.Course;
const Enrollment = db.Enrollment;

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: {
        isDeleted: false,
        status: "Published",
      },
    });
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId; // coming from route param
    const userId = req.user.userId; // provided by authMiddleware

    // 1. Fetch the course
    const course = await Course.findOne({
      where: { id: courseId, isDeleted: false },
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not available." });
    }

    // 2. Check enrollment (only if user is logged in)
    let isEnrolled = false;

    if (userId) {
      const enrollment = await Enrollment.findOne({
        where: { userId, courseId },
      });

      isEnrolled = !!enrollment;
    }

    // 3. Return course + enrollment state
    return res.status(200).json({
      ...course.toJSON(),
      isEnrolled,
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
