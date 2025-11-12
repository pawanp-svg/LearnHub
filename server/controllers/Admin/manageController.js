import db from "../../db/models/index.js";
const { Course, CourseContent } = db;

export const createContent = async (req, res) => {
  try {
    const { courseId, title, content, order_index } = req.body;

    // Check if the course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create new course content
    const newContent = await CourseContent.create({
      courseId,
      title,
      content,
      order_index,
    });

    res.status(201).json({
      message: "Content created successfully",
      newContent,
    });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Failed to create content" });
  }
};

// Optimized existing functions
export const createCourse = async (req, res) => {
  try {
    const { course_name, description, price } = req.body;
    const adminId = req.user.userId;

    const existingCourse = await Course.findOne({ where: { course_name } });
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: "Course already exists with the same name" });
    }

    const newCourse = await Course.create({
      adminId,
      course_name,
      description,
      price,
    });
    res.status(201).json({ message: "Course created successfully", newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isDeleted: false },
       order: [["id", "ASC"]], 
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
    const [updated] = await Course.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ message: "Course not found" });
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
