import db from "../../db/models/index.js";
const { Course } = db;
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
