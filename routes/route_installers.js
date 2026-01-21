const express = require("express");
const router = express.Router();
const installerController = require("../controllers/con_installers");

// GET /api/installers - Get all installers (with optional ?state=Lagos filter)
router.get("/", installerController.getAllInstallers);

// GET /api/installers/:id - Get single installer by ID
router.get("/:id", installerController.getInstallerById);

module.exports = router;
