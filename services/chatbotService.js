const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const chatbotService = {
  // Handle chat messages
  chat: async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // System prompt to guide the chatbot's behavior
      const systemContext = `
You are a helpful assistant for a Nigerian solar energy calculator website. Your role is to:

1. Help users understand how solar energy works in Nigeria
2. Explain how to use the solar calculator
3. Answer questions about solar panels, inverters, batteries, and installations
4. Provide information about costs, savings, and benefits of solar energy
5. Guide users through the calculator form fields
6. Explain the results they receive

Key information about Nigeria:
- Northern states have better sunlight than southern states
- Grid power (NEPA) is often unreliable, making solar + battery backup essential
- Most systems are hybrid (solar + grid backup with batteries)
- Fuel costs for generators are significant

Be friendly, concise, and helpful. Keep responses under 150 words unless explaining something complex. Focus on practical advice for Nigerian users.

If asked about specific installers or pricing, remind users to use the calculator and installer directory on the site for accurate information.
`;

      const prompt = `${systemContext}\n\nUser: ${userMessage}\n\nAssistant:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        message: text,
      };
    } catch (error) {
      console.error("Chatbot error:", error);

      // Fallback response if AI fails
      return {
        success: false,
        message:
          "I'm having trouble responding right now. Please try asking your question again, or contact our support team for assistance.",
        error: error.message,
      };
    }
  },
};

module.exports = chatbotService;
