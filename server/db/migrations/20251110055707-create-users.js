// Note: In an ESM context, 'DataTypes' is not directly passed.
// Sequelize CLI usually handles dependency injection for migration functions.
// Assuming the function signature still works to access DataTypes/Sequelize objects.

const up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable("Users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("Admin", "Student"), allowNull: false },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },

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
  await queryInterface.dropTable("Users");
};

export default { up, down };
