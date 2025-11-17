import db from "../../db/models/index.js";
const { Enrollment, User, Course } = db;

export const viewEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [
        { model: User, attributes: ["id", "first_name", "last_name", "email"] },
        { model: Course, attributes: ["id", "course_name"] },
      ],
    });

    if (!enrollments.length)
      return res.status(404).json({ message: "No enrollments found for this course" });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Error fetching enrollments" });
  }
};
