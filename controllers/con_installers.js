const Installer = require("../models/installers");

const installerController = {
  // Get all installers (with optional state filter)
  getAllInstallers: async (req, res) => {
    try {
      const { state } = req.query; // Get state from query params (?state=Lagos)

      const installers = await Installer.getAll(state);

      res.status(200).json({
        success: true,
        count: installers.length,
        data: installers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching installers",
        error: error.message,
      });
    }
  },

  // Get single installer by ID
  getInstallerById: async (req, res) => {
    try {
      const { id } = req.params; // Get id from URL params (/api/installers/5)

      const installer = await Installer.getById(id);

      if (!installer) {
        return res.status(404).json({
          success: false,
          message: "Installer not found",
        });
      }

      res.status(200).json({
        success: true,
        data: installer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching installer",
        error: error.message,
      });
    }
  },
};

module.exports = installerController;
