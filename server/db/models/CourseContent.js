// models/CourseContent.js (ESM Syntax)
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CourseContent = sequelize.define(
    "CourseContent",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Foreign key relationship defined in models/index.js
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT, // Stores the lesson content or a URL/path
      },
      order_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Ensures content is displayed in the correct sequence
      },
    },
    {
      // Sequelize Options
      tableName: "CourseContent",
      timestamps: true,
      // Note: No soft-delete fields needed here
    }
  );

  return CourseContent;
};
