import Conversation from '../models/conversation.model.js';
import Settings from '../models/settings.model.js';
import { callLLMWithPriority } from './llm/index.js';
import { buildUserContext, buildConversationReplyPrompt, buildSummarizationPrompt } from '../prompts/index.js';

const REPLY_PROVIDER_ORDER = ['gemini', 'groq', 'openrouter'];
const SUMMARY_PROVIDER_ORDER = ['gemini', 'groq', 'openrouter'];

const MAX_FULL_MESSAGES = 10;
const SUMMARIZE_THRESHOLD = 15;

function parseReplyJson(raw) {
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
    try {
      return JSON.parse(cleaned);
    } catch {
      console.error('[ConversationService] Failed to parse LLM JSON:', cleaned);
      return { replies: [] };
    }
  }
}

export async function generateReplies(conversationId) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  if (conversation.messages.length > SUMMARIZE_THRESHOLD) {
    const summarized = await runSummarization(conversation);
    conversation.summary = summarized.summary;
    conversation.summaryUpTo = summarized.summaryUpTo;
  }

  const latestMessage = conversation.messages.length > 0
    ? conversation.messages[conversation.messages.length - 1].content
    : '';

  const recentMessages = conversation.messages.slice(-MAX_FULL_MESSAGES);

  const settings = await Settings.findOne({ type: 'global' });
  const userContext = buildUserContext(settings);

  const prompt = buildConversationReplyPrompt(
    userContext,
    conversation.prospect,
    conversation.summary,
    recentMessages,
    latestMessage
  );

  const raw = await callLLMWithPriority(prompt, {}, REPLY_PROVIDER_ORDER);
  const parsed = parseReplyJson(raw);
  const { replies = [] } = parsed;

  return replies;
}

export async function runSummarization(conversation) {
  const messagesToSummarize = conversation.messages.slice(
    conversation.summaryUpTo,
    conversation.messages.length - MAX_FULL_MESSAGES
  );

  if (messagesToSummarize.length === 0) {
    return conversation;
  }

  const prompt = buildSummarizationPrompt(conversation.summary, messagesToSummarize);
  const summaryText = await callLLMWithPriority(prompt, {}, SUMMARY_PROVIDER_ORDER);
  const trimmed = summaryText.trim();

  const updatedConversation = await Conversation.findByIdAndUpdate(
    conversation._id,
    {
      summary: trimmed,
      summaryUpTo: conversation.messages.length - MAX_FULL_MESSAGES,
    },
    { new: true }
  );

  return updatedConversation;
}

export async function confirmMessage(conversationId, messageContent) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const message = conversation.messages
    .filter((m) => m.role === 'me' && !m.confirmedSent)
    .reverse()
    .find((m) => m.content === messageContent);

  if (!message) {
    throw new Error('Matching unconfirmed message not found');
  }

  message.confirmedSent = true;
  await conversation.save();

  return conversation;
}
