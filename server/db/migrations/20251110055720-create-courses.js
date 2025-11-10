const up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable("Courses", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    course_name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },

    // Soft Delete Fields
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deletedAt: { type: DataTypes.DATE, allowNull: true },

    createdAt: { allowNull: false, type: DataTypes.DATE },
    updatedAt: { allowNull: false, type: DataTypes.DATE },
  });
};

const down = async (queryInterface, DataTypes) => {
  await queryInterface.dropTable("Courses");
};

export default { up, down };
