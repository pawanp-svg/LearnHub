// controllers/authController.js (ESM Syntax)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Assuming your Sequelize models are exported/imported correctly
import db from "../db/models/index.js";

const User = db.User;

// --- Configuration ---
// NOTE: Use environment variables for the secret key!
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

/**
 * 3.2.1. Registration: Creates a new Student user
 */
export const register = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // 2. Hash the password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Create the new user (default role is 'Student' as per requirements)
    const newUser = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      role: "Student", // ACL: Default role for registration
    });

    // Optional: Immediately log in the user upon registration
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Registration successful. Welcome!",
      token,
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during registration." });
  }
};

/**
 * 3.2.1. Login: Authenticates user and issues a token
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email (and ensure not soft-deleted)
    // NOTE: If using Sequelize scopes, you would handle soft-delete filtering here
    const user = await User.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) {
      // Throw error for incorrect credentials without specifying if email or password was wrong
      return res.status(401).json({ message: "Invalid user credentials." });
    }

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      // Throw error for incorrect credentials
      return res.status(401).json({ message: "Invalid user credentials." });
    }

    // 3. Generate a JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during login." });
  }
};
