import { callGroq } from './groq.js';
import { callOpenRouter } from './openrouter.js';
import { callGemini } from './gemini.js';

const FALLBACK_CHAIN = ['groq', 'openrouter', 'gemini'];

export async function callLLM(prompt, options = {}) {
  const errors = [];

  for (const provider of FALLBACK_CHAIN) {
    try {
      if (provider === 'groq') {
        return await callGroq(prompt, options);
      }
      if (provider === 'openrouter') {
        return await callOpenRouter(prompt, options);
      }
      if (provider === 'gemini') {
        return await callGemini(prompt, options);
      }
    } catch (err) {
      console.warn(`[LLM] ${provider} failed, trying next: ${err.message}`);
      errors.push({ provider, message: err.message });
    }
  }

  const summary = errors.map((e) => `${e.provider}: ${e.message}`).join(' | ');
  throw new Error(`All LLM providers failed. ${summary}`);
}

export { callGroq, callOpenRouter, callGemini };
