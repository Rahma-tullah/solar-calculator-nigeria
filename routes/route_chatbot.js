const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbot");

// POST /api/chat - Send message to chatbot
router.post("/", chatbotController.sendMessage);

module.exports = router;
