import { generateIdeaPrompt, generatePostPrompt, generateHookPrompt, generateBodyPrompt, generateCTAPrompt, generatePolishPrompt } from '../prompts/index.js';
import { callLLMWithPriority } from './llm/index.js';
import PostIdea from '../models/postIdea.model.js';

const IDEA_PROVIDER_ORDER = ['gemini', 'groq', 'openrouter'];
const POLISH_PROVIDER_ORDER = ['gemini', 'groq', 'openrouter'];

function parseLLMJson(raw) {
  let cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    cleaned = cleaned
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/(['"])?(\w+)(['"])?\s*:/g, '"$2":')
      .replace(/'/g, '"')
      .replace(/,\s*,/g, ',')
      .trim();
    return JSON.parse(cleaned);
  }
}

export async function generateIdeas(strategy, recentTopics = []) {
  const lastIdea = await PostIdea.findOne().sort({ createdAt: -1 }).select('pillar').lean();
  const currentPillar = lastIdea?.pillar || null;

  const prompt = generateIdeaPrompt(strategy, recentTopics, currentPillar);
  const raw = await callLLMWithPriority(prompt, {}, IDEA_PROVIDER_ORDER);

  let parsed;
  try {
    parsed = parseLLMJson(raw);
  } catch {
    throw new Error(`Failed to parse AI idea response as JSON. Raw output: ${raw}`);
  }

  return Array.isArray(parsed) ? parsed : [parsed];
}

export async function generatePost(idea, strategy, userSettings = {}) {
  const prompt = generatePostPrompt(idea, strategy, userSettings);
  return await callLLMWithPriority(prompt, {}, IDEA_PROVIDER_ORDER);
}

export async function generateHook(idea, strategy, userSettings = {}) {
  const prompt = generateHookPrompt(idea, strategy, userSettings);
  return await callLLMWithPriority(prompt, {}, IDEA_PROVIDER_ORDER);
}

export async function generateBody(idea, strategy, userSettings = {}, hook = '') {
  const prompt = generateBodyPrompt(idea, strategy, userSettings, hook);
  return await callLLMWithPriority(prompt, {}, IDEA_PROVIDER_ORDER);
}

export async function generateCTA(idea, strategy, userSettings = {}, hook = '', body = '') {
  const prompt = generateCTAPrompt(idea, strategy, userSettings, hook, body);
  return await callLLMWithPriority(prompt, {}, IDEA_PROVIDER_ORDER);
}

export function assembleSections(hook, body, cta) {
  const parts = [hook, body, cta].filter(Boolean);
  return parts.join('\n\n');
}

export async function polishPostContent(assembledPost) {
  const prompt = generatePolishPrompt(assembledPost);
  return await callLLMWithPriority(prompt, {}, POLISH_PROVIDER_ORDER);
}
