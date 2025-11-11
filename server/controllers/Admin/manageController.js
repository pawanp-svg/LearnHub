import { Course, CourseContent } from "../../db/models/index.js";

export const createCourse = async (req, res) => {
  try {
    const { adminId, course_name, description, price, status } = req.body;

    const newCourse = await Course.create({
      adminId,
      course_name,
      description,
      price,
      status,
    });

    res.status(201).json({ message: "Course created successfully", newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.scope("active").findAll({
      include: [{ model: CourseContent, as: "contents" }],
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({
      where: { id, isDeleted: false },
      include: [{ model: CourseContent, as: "contents" }],
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Course.update(req.body, { where: { id } });

    if (!updated[0])
      return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.update({ isDeleted: true, deletedAt: new Date() });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};
