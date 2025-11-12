// middleware/authMiddleware.js (ESM Syntax)
import jwt from "jsonwebtoken";

// NOTE: Use the same secret key used in your authController.js
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  // 1. Check for the token in the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Token is missing or not in the correct 'Bearer <token>' format
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // 2. Extract the token (remove 'Bearer ')
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Attach the decoded user payload to the request object
    // The payload contains { userId: user.id, role: user.role }
    req.user = decoded;
    console.log("Decoded JWT payload:", decoded);

    // 5. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed (e.g., expired, invalid signature)
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).send("Access Denied");
  }
  next();
};
