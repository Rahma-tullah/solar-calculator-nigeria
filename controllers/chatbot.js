const chatbotService = require("../services/chatbotService");

const chatbotController = {
  // Handle chat message
  sendMessage: async (req, res) => {
    try {
      const { message } = req.body;

      // Validate message
      if (!message || message.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      // Get AI response
      const response = await chatbotService.chat(message);

      res.status(200).json(response);
    } catch (error) {
      console.error("Chatbot controller error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing chat message",
        error: error.message,
      });
    }
  },
};

module.exports = chatbotController;
