import OpenAI from 'openai';

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }
    client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'Solus OS',
      },
    });
  }
  return client;
}

export async function callOpenRouter(prompt, { model = 'meta-llama/llama-3.1-8b-instruct:free', temperature = 0.2, maxTokens = 2048 } = {}) {
  try {
    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    });
    return completion.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (err) {
    console.error('[LLM:openrouter] call failed:', err.message);
    throw new Error(`OpenRouter call failed: ${err.message}`);
  }
}
