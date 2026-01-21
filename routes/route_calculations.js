const express = require("express");
const router = express.Router();
const calculationController = require("../controllers/con_calculations");
const authMiddleware = require("../middleware/auth");

// POST /api/calculations - Create new calculation (optional auth)
router.post("/", optionalAuth, calculationController.createCalculation);

// GET /api/calculations/user/me - Get all calculations for logged-in user (PROTECTED)
router.get(
  "/user/me",
  authMiddleware.verifyToken,
  calculationController.getUserCalculations
);

// GET /api/calculations/:id - Get calculation by ID
router.post("/", optionalAuth, calculationController.createCalculation);
router.get(
  "/user/me",
  authMiddleware.verifyToken,
  calculationController.getUserCalculations
);
router.get("/:id", calculationController.getCalculationById);

// Middleware to optionally authenticate (doesn't reject if no token)
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Set user if token is valid
    } catch (error) {
      // Invalid token, but we don't reject - just continue without user
      req.user = null;
    }
  }

  next();
}

module.exports = router;
