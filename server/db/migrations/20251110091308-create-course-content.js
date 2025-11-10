// create-course-content.js (ESM Syntax)
const up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable("CourseContent", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Courses", key: "id" }, // FK to Courses
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT },
    order_index: { type: DataTypes.INTEGER, allowNull: false },

    createdAt: { allowNull: false, type: DataTypes.DATE },
    updatedAt: { allowNull: false, type: DataTypes.DATE },
  });
};
const down = async (queryInterface, DataTypes) => {
  await queryInterface.dropTable("CourseContent");
};
export default { up, down };
