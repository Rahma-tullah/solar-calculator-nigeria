const express = require("express");
const router = express.Router();
const leadController = require("../controllers/con_leads");
const authMiddleware = require("../middleware/auth");

// All lead routes require authentication
router.use(authMiddleware.verifyToken);

// POST /api/leads - Submit a lead to an installer
router.post("/", leadController.submitLead);

// GET /api/leads - Get all leads for current user
router.get("/", leadController.getUserLeads);

// GET /api/leads/installer/me - Get all leads for current installer
router.get("/installer/me", leadController.getInstallerLeads);

// GET /api/leads/:id - Get single lead by ID
router.get("/:id", leadController.getLeadById);

module.exports = router;
