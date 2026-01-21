const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function listModels() {
  try {
    // Try the different model names
    const modelNames = [
      "gemini-pro",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash-latest",
      "gemini-2.0-flash-exp",
    ];

    console.log("Testing models...\n");

    for (const modelName of modelNames) {
      try {
        console.log(`Trying ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`✅ ${modelName} works!`);
        console.log(`Response: ${response.text()}\n`);
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
