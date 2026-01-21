const express = require("express");
const router = express.Router();
const emailController = require("../controllers/con_emails");

// POST /api/calculations/:id/email - Send calculation results via email
router.post("/:id/email", emailController.sendCalculationEmail);

module.exports = router;
