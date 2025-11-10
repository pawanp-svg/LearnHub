// Note: You must run 'npm install bcryptjs' (or similar) and update this file
// with the actual hash before running the seed command.
// Example: const HASHED_PASSWORD_PLACEHOLDER = await bcrypt.hash('YourSecureAdminPassword', 10);
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const HASHED_PASSWORD_PLACEHOLDER = process.env.ADMINPASSWORD;
const ADMIN_EMAIL = "admin@example.com";

const up = async (queryInterface, Sequelize) => {
  // Check if an admin already exists to prevent duplicates on re-seeding
  const [existingAdmin] = await queryInterface.sequelize.query(
    `SELECT id FROM "Users" WHERE email = '${ADMIN_EMAIL}' AND role = 'Admin' LIMIT 1;`
  );

  if (existingAdmin.length === 0) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: ADMIN_EMAIL,
          password_hash: HASHED_PASSWORD_PLACEHOLDER,
          role: "Admin",
          first_name: "System",
          last_name: "Admin",
          isDeleted: false, // Ensure the initial account is active
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  }
};

const down = async (queryInterface, Sequelize) => {
  // The down function removes the record inserted by the up function
  await queryInterface.bulkDelete(
    "Users",
    {
      email: ADMIN_EMAIL,
      role: "Admin",
    },
    {}
  );
};

export default { up, down };
