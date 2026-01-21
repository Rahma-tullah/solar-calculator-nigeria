const Lead = require("../models/leads");
const Installer = require("../models/installers");

const leadController = {
  // Submit a lead to an installer
  submitLead: async (req, res) => {
    try {
      const { installer_id, calculation_id, message } = req.body;

      // Validate required fields
      if (!installer_id) {
        return res.status(400).json({
          success: false,
          message: "Installer ID is required",
        });
      }

      // Check if installer exists
      const installer = await Installer.getById(installer_id);
      if (!installer) {
        return res.status(404).json({
          success: false,
          message: "Installer not found",
        });
      }

      // Create lead
      const leadId = await Lead.create({
        user_id: req.user.user_id,
        installer_id,
        calculation_id,
        message,
      });

      // Get the created lead
      const lead = await Lead.getById(leadId);

      res.status(201).json({
        success: true,
        message: "Lead submitted successfully",
        data: lead,
      });
    } catch (error) {
      console.error("Submit lead error:", error);
      res.status(500).json({
        success: false,
        message: "Error submitting lead",
        error: error.message,
      });
    }
  },

  // Get all leads for current user
  getUserLeads: async (req, res) => {
    try {
      const leads = await Lead.getByUserId(req.user.user_id);

      res.status(200).json({
        success: true,
        count: leads.length,
        data: leads,
      });
    } catch (error) {
      console.error("Get user leads error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching leads",
        error: error.message,
      });
    }
  },

  // Get single lead by ID
  getLeadById: async (req, res) => {
    try {
      const { id } = req.params;
      const lead = await Lead.getById(id);

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found",
        });
      }

      // Check if user owns this lead
      if (lead.user_id !== req.user.user_id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      console.error("Get lead error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching lead",
        error: error.message,
      });
    }
  },

  // Get all leads for current installer
  getInstallerLeads: async (req, res) => {
    try {
      // Check if user is an installer
      if (req.user.role !== "installer") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Only installers can view leads.",
        });
      }

      // Find installer profile linked to this user
      const Installer = require("../models/installers");
      const db = require("../config/database");

      const [installers] = await db.query(
        "SELECT installer_id FROM installers WHERE user_id = ?",
        [req.user.user_id]
      );

      if (!installers || installers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Installer profile not found",
        });
      }

      const installerId = installers[0].installer_id;

      // Get all leads for this installer
      const leads = await Lead.getByInstallerId(installerId);

      res.status(200).json({
        success: true,
        count: leads.length,
        data: leads,
      });
    } catch (error) {
      console.error("Get installer leads error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching leads",
        error: error.message,
      });
    }
  },
};

module.exports = leadController;
