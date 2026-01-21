const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

// POST /api/auth/signup - Create new account
router.post("/signup", authController.signup);

// POST /api/auth/login - Login to account
router.post("/login", authController.login);

// GET /api/auth/profile - Get current user profile (PROTECTED)
router.get("/profile", authMiddleware.verifyToken, authController.getProfile);

// POST /api/auth/signup/installer - Create installer account
router.post("/signup/installer", authController.signupInstaller);

module.exports = router;
