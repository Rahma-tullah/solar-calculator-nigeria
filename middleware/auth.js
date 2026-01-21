const jwt = require("jsonwebtoken");

const authMiddleware = {
  // Verify JWT token and authenticate user
  verifyToken: (req, res, next) => {
    try {
      // Get token from Authorization header
      // Expected format: "Bearer <token>"
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Access denied. No token provided.",
        });
      }

      // Extract token (remove "Bearer " prefix)
      const token = authHeader.substring(7);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info to request object
      req.user = decoded; // Contains { user_id, email }

      // Continue to next middleware/controller
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
  },

  // Optional: Check if user is an installer (we'll use this later)
  isInstaller: (req, res, next) => {
    // For now, just pass through
    // We'll implement roles later
    next();
  },
};

module.exports = authMiddleware;
