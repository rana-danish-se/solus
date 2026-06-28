export function buildConversationReplyPrompt(userContext, prospect, summary, recentMessages, latestMessage) {
  const prospectBlock = `
- Name: ${prospect?.name || 'Unknown'}
- Type: ${prospect?.type || 'Unknown'}
- Headline: ${prospect?.headline || 'Not specified'}
- About: ${prospect?.about || 'Not specified'}
- Niche: ${prospect?.niche || 'Not specified'}
- Location: ${prospect?.location || 'Not specified'}
- Goal of this conversation: ${prospect?.goalOfConversation || 'Not specified'}
- Private notes: ${prospect?.notes || 'None'}
`.trim();

  const summaryBlock = summary || 'This is the start of the conversation.';

  const recentMessagesBlock = Array.isArray(recentMessages) && recentMessages.length
    ? recentMessages.map((m) => `${m.role === 'prospect' ? 'Prospect' : 'Me'}: ${m.content}`).join('\n')
    : '(no recent messages)';

  return `
${userContext}

PROSPECT PROFILE
${prospectBlock}

CONVERSATION GOAL
${prospect?.goalOfConversation || 'Not specified'}

CONVERSATION CONTEXT (summarized history)
${summaryBlock}

RECENT MESSAGES
${recentMessagesBlock}

LATEST MESSAGE FROM PROSPECT
${latestMessage || '(none)'}

TASK
Generate 3 reply options. Each should:
- Sound natural and human, not AI-generated
- Match the user's voice and tone from their profile
- Move the conversation toward the stated goal
- Be appropriately professional but not robotic
- For team conversations: subtly gather skills, pricing, technique, or portfolio access

Return raw JSON only. No markdown, no code fences, no explanation.

{
  "replies": [
    { "label": "Direct", "message": "..." },
    { "label": "Warm", "message": "..." },
    { "label": "Strategic", "message": "..." }
  ]
}
`.trim();
}

export function buildSummarizationPrompt(existingSummary, messagesToSummarize) {
  const messagesBlock = Array.isArray(messagesToSummarize) && messagesToSummarize.length
    ? messagesToSummarize.map((m) => `${m.role === 'prospect' ? 'Prospect' : 'Me'}: ${m.content}`).join('\n')
    : '(no messages)';

  return `
Summarize the following LinkedIn conversation into a single concise paragraph.
Preserve: key points discussed, relationship stage, any commitments made,
what has been revealed about the prospect, and what has NOT been asked yet.

Existing summary (if any):
${existingSummary || '(none)'}

Messages to add:
${messagesBlock}

Return plain text only. No JSON, no markdown, no code fences.
`.trim();
}
