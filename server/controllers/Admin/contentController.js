// controllers/CourseContentController.js

import db from "../../db/models/index.js";
const CourseContent = db.CourseContent;

/**
 * GET /content/:courseId
 * Fetch all content for a course (ordered properly)
 */
export const getContentByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const content = await CourseContent.findAll({
      where: { courseId },
      order: [["order_index", "ASC"]],
    });

    if (!content || content.length === 0) {
      return res.status(404).json({
        message: "No content found for this course",
      });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching course content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /content/item/:id
 * Fetch a single content item by ID
 */
export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await CourseContent.findByPk(id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching content by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PUT /content/:id
 * Update a content item (Admin only)
 */
export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, order_index } = req.body;

    const contentItem = await CourseContent.findByPk(id);

    if (!contentItem) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Update only fields that are actually provided
    if (title !== undefined) contentItem.title = title;
    if (content !== undefined) contentItem.content = content;
    if (order_index !== undefined) contentItem.order_index = order_index;

    await contentItem.save();

    return res.status(200).json({
      message: "Content updated successfully",
      updatedContent: contentItem,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /content/:id
 * Permanently delete content (Admin only)
 */
export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const contentItem = await CourseContent.findByPk(id);

    if (!contentItem) {
      return res.status(404).json({ message: "Content not found" });
    }

    await contentItem.destroy();

    res.status(200).json({
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
