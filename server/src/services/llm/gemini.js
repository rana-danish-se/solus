import { GoogleGenerativeAI } from '@google/generative-ai';

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
}

export async function callGemini(prompt, { model = 'gemini-1.5-flash', temperature = 0.2, maxTokens = 2048 } = {}) {
  try {
    const genAI = getClient();
    const generativeModel = genAI.getGenerativeModel({
      model,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });
    const result = await generativeModel.generateContent(prompt);
    return result.response?.text()?.trim() ?? '';
  } catch (err) {
    console.error('[LLM:gemini] call failed:', err.message);
    throw new Error(`Gemini call failed: ${err.message}`);
  }
}
