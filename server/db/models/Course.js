// models/Course.js (ESM Syntax)
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Course = sequelize.define(
    "Course",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // The actual FK relationship is defined in models/index.js
      },
      course_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      // Soft Delete Fields
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      // Sequelize Options
      tableName: "Courses",
      timestamps: true,
      paranoid: false, // Manual soft delete management
      scopes: {
        active: {
          where: { isDeleted: false },
        },
      },
    }
  );

  return Course;
};
