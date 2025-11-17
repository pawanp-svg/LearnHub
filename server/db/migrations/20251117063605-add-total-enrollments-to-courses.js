// <timestamp>-add-total-enrollments-to-courses.js

const up = async (queryInterface, DataTypes) => {
  await queryInterface.addColumn("Courses", "totalEnrollments", {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Set the mandatory default value
  });
};

const down = async (queryInterface, DataTypes) => {
  await queryInterface.removeColumn("Courses", "totalEnrollments");
};

export default { up, down };
