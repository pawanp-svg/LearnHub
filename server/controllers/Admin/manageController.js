import db from "../../db/models/index.js";
const { Course, CourseContent } = db;

export const createContent = async (req, res) => {
  try {
    const { courseId, contents } = req.body;

    // Validate request
    if (!courseId || !Array.isArray(contents) || contents.length === 0) {
      return res
        .status(400)
        .json({ message: "courseId and contents[] are required" });
    }

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Attach courseId to each content item
    const contentPayload = contents.map((item) => ({
      courseId,
      title: item.title,
      content: item.content,
      order_index: item.order_index,
    }));

    // Bulk insert
    const createdContents = await CourseContent.bulkCreate(contentPayload, {
      returning: true,
    });

    res.status(201).json({
      message: "Contents created successfully",
      contents: createdContents,
    });
  } catch (error) {
    console.error("Error creating bulk content:", error);
    res.status(500).json({ message: "Failed to create contents" });
  }
};

// Optimized existing functions
export const createCourse = async (req, res) => {
  try {
    const { course_name, description, price, thumbnailUrl, is_published } =
      req.body;
    const adminId = req.user.userId;

    const existingCourse = await Course.findOne({
      where: {
        course_name,
        isDeleted: false,
      },
    });

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
      thumbnailUrl,
      is_published,
      status: is_published ? "Published" : "Draft",
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
    const id = req.params.id;
    const { course_name, description, price, thumbnailUrl } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.update({
      course_name,
      description,
      price,
      thumbnailUrl,
    });

    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    console.error(err);
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

export const courseStatus = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { status } = req.body; // expected: "Published" or "Draft"

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.status = status; // update status
    await course.save();

    res.json({ message: "Status updated successfully", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
