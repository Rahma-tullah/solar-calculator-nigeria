const Calculation = require("../models/calculations");
const Email = require("../models/emails");
const emailService = require("../services/emailService");

const emailController = {
  // Send calculation results via email
  sendCalculationEmail: async (req, res) => {
    try {
      const { id } = req.params; // calculation_id from URL
      const { recipient_email, recipient_name } = req.body;

      // Validate email
      if (!recipient_email) {
        return res.status(400).json({
          success: false,
          message: "Recipient email is required",
        });
      }

      // Get the calculation
      const calculation = await Calculation.getById(id);

      if (!calculation) {
        return res.status(404).json({
          success: false,
          message: "Calculation not found",
        });
      }

      // Create email record (pending)
      const emailId = await Email.create({
        calculation_id: id,
        recipient_email,
        recipient_name,
        email_status: "pending",
        sent_at: null,
      });

      // Send the email
      try {
        await emailService.sendCalculationResults(
          recipient_email,
          recipient_name,
          calculation
        );

        // Update status to sent
        await Email.updateStatus(emailId, "sent", new Date());

        res.status(200).json({
          success: true,
          message: "Email sent successfully",
          data: {
            email_id: emailId,
            recipient_email,
          },
        });
      } catch (emailError) {
        // Update status to failed
        await Email.updateStatus(emailId, "failed");

        throw emailError;
      }
    } catch (error) {
      console.error("Email controller error:", error);
      res.status(500).json({
        success: false,
        message: "Error sending email",
        error: error.message,
      });
    }
  },
};

module.exports = emailController;
