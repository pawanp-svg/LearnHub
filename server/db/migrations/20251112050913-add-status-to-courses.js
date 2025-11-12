// <timestamp>-add-status-to-courses.js

const up = async (queryInterface, DataTypes) => {
  await queryInterface.addColumn("Courses", "status", {
    type: DataTypes.ENUM("Published", "Draft"),
    allowNull: false,
    defaultValue: "Draft", // Set a default value to avoid errors on existing rows
  });

  // IMPORTANT: For existing rows, set status to 'Draft' so they aren't NULL
  await queryInterface.sequelize.query(
    `UPDATE "Courses" SET status = 'Draft' WHERE status IS NULL;`
  );
};

const down = async (queryInterface, DataTypes) => {
  await queryInterface.removeColumn("Courses", "status");
};

export default { up, down };
