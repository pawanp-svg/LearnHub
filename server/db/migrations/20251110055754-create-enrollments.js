const up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable("Enrollments", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Courses", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    enrollment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("Active", "Completed"),
      allowNull: false,
      defaultValue: "Active",
    },

    createdAt: { allowNull: false, type: DataTypes.DATE },
    updatedAt: { allowNull: false, type: DataTypes.DATE },
  });

  // Unique constraint
  await queryInterface.addConstraint("Enrollments", {
    fields: ["userId", "courseId"],
    type: "unique",
    name: "unique_user_course_enrollment",
  });
};

const down = async (queryInterface, DataTypes) => {
  await queryInterface.dropTable("Enrollments");
};

export default { up, down };
