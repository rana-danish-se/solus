import Groq from 'groq-sdk';

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set');
    }
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

export async function callGroq(prompt, { model = 'llama-3.1-8b-instant', temperature = 0.2, maxTokens = 2048 } = {}) {
  try {
    const groq = getClient();
    const completion = await groq.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    });
    return completion.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (err) {
    console.error('[LLM:groq] call failed:', err.message);
    throw new Error(`Groq call failed: ${err.message}`);
  }
}
