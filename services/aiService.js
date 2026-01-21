const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const aiService = {
  // Analyze equipment list and return total power requirement in watts
  analyzeEquipment: async (equipmentList) => {
    try {
      // Get the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Create the prompt
      const prompt = `
You are a solar energy expert. Analyze the following list of electrical equipment and calculate the total power requirement in watts.

Equipment list: "${equipmentList}"

For each item:
- Estimate typical wattage based on common Nigerian household/business appliances
- Account for the quantity mentioned
- Consider startup power for items like ACs and fridges

Provide ONLY a JSON response in this exact format (no other text):
{
  "total_watts": <number>,
  "breakdown": [
    {"item": "item name", "quantity": <number>, "watts_per_unit": <number>, "total_watts": <number>}
  ]
}

Be realistic and conservative in your estimates.
`;

      // Generate response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      // Remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleanedText);

      return {
        totalWatts: parsed.total_watts,
        breakdown: parsed.breakdown,
      };
    } catch (error) {
      console.error("AI equipment analysis error:", error);

      // Fallback to a safe default if AI fails
      return {
        totalWatts: 3000,
        breakdown: [],
        error: "AI analysis failed, using default estimate",
      };
    }
  },
};

module.exports = aiService;
