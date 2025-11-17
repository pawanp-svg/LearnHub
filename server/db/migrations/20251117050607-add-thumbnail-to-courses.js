// <timestamp>-add-thumbnail-to-courses.js

const up = async (queryInterface, DataTypes) => {
  await queryInterface.addColumn("Courses", "thumbnailUrl", {
    type: DataTypes.STRING,
    allowNull: true, // Allow NULL initially since existing rows won't have a value
  });
};

const down = async (queryInterface, DataTypes) => {
  await queryInterface.removeColumn("Courses", "thumbnailUrl");
};

export default { up, down };
