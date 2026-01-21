const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authController = {
  // Signup - Create new user
  signup: async (req, res) => {
    try {
      const { email, password, full_name, phone_number } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }
      // Validate email format
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create user
      const userId = await User.create({
        email,
        password_hash,
        full_name,
        phone_number,
      });

      // Generate JWT token

      const token = jwt.sign(
        { user_id: userId, email, role: "customer" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Get user data (without password)
      const user = await User.findById(userId);

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating account",
        error: error.message,
      });
    }
  },

  // Signup as installer
  signupInstaller: async (req, res) => {
    try {
      const {
        email,
        password,
        full_name,
        phone_number,
        installer_name,
        state,
        city,
        full_address,
        services_offered,
        description,
      } = req.body;

      // Validate required fields
      if (!email || !password || !installer_name || !state || !city) {
        return res.status(400).json({
          success: false,
          message:
            "Email, password, installer name, state, and city are required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create user with installer role
      const userId = await User.create({
        email,
        password_hash,
        full_name,
        phone_number,
        role: "installer",
      });

      // Create installer profile
      const Installer = require("../models/installers");
      const installerId = await Installer.create({
        user_id: userId,
        installer_name,
        phone_number,
        email,
        state,
        city,
        full_address,
        services_offered,
        description,
      });

      // Generate JWT token
      const token = jwt.sign(
        { user_id: userId, email, role: "installer" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Get user data
      const user = await User.findById(userId);

      res.status(201).json({
        success: true,
        message: "Installer account created successfully",
        data: {
          user,
          installer_id: installerId,
          token,
        },
      });
    } catch (error) {
      console.error("Installer signup error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating installer account",
        error: error.message,
      });
    }
  },
  // Login - Authenticate user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Compare password with hash
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate JWT token

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password_hash from user object before sending
      const { password_hash, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Error logging in",
        error: error.message,
      });
    }
  },

  // Get current user profile (requires authentication - we'll add middleware later)
  getProfile: async (req, res) => {
    try {
      // req.user will be set by auth middleware (we'll create this next)
      const user = await User.findById(req.user.user_id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching profile",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
