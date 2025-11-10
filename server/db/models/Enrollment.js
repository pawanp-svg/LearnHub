// models/Enrollment.js (ESM Syntax)
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Foreign key relationship defined in models/index.js
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Foreign key relationship defined in models/index.js
      },
      enrollment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM("Active", "Completed"),
        defaultValue: "Active",
        allowNull: false,
      },
    },
    {
      // Sequelize Options
      tableName: "Enrollments",
      timestamps: true,
      // Note: No soft-delete fields needed here
    }
  );

  return Enrollment;
};
