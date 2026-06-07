function buildStrategyContext(strategy) {
  const pillars = Array.isArray(strategy?.pillars) && strategy.pillars.length
    ? strategy.pillars.map((p, i) => `  ${i + 1}. ${p}`).join('\n')
    : '  (no pillars defined)';

  const avoidTopics = Array.isArray(strategy?.avoidTopics) && strategy.avoidTopics.length
    ? strategy.avoidTopics.map((t, i) => `  ${i + 1}. ${t}`).join('\n')
    : '  (none)';

  return `
PLATFORM: ${strategy?.platform || 'linkedin'}
AUDIENCE: ${strategy?.audience || 'Not specified'}
TONE: ${strategy?.tone || 'Not specified'}
FORMAT NOTES: ${strategy?.formatNotes || 'Not specified'}

CONTENT PILLARS (rotate through these):
${pillars}

TOPICS TO AVOID (from strategy):
${avoidTopics}
`.trim();
}

function buildRecentTopicsList(recentTopics) {
  if (!Array.isArray(recentTopics) || recentTopics.length === 0) {
    return '  (no prior topics — this is a fresh start)';
  }
  return recentTopics
    .map((t, i) => `  ${i + 1}. ${typeof t === 'string' ? t : t?.topic || String(t)}`)
    .join('\n');
}

export function generateIdeaPrompt(strategy, recentTopics = []) {
  const strategyContext = buildStrategyContext(strategy || {});
  const recentTopicsList = buildRecentTopicsList(recentTopics);

  return `
ROLE
You are a LinkedIn content strategist for Rana Danish, a student and freelance AI engineer based in Pakistan, currently studying at COMSATS University. You understand his voice, his audience, and what makes a post land on the platform.

${strategyContext}

RECENTLY USED TOPICS (do NOT repeat or closely mirror any of these):
${recentTopicsList}

TASK
Generate exactly ONE new LinkedIn post idea that:
- Fits at least one of the content pillars listed above
- Speaks directly to the defined audience in the defined tone
- Has a fresh angle that is meaningfully different from every topic in the recent list
- Is realistic to write as a 150–300 word post with a personal hook, a concrete takeaway, and an engagement question

INSTRUCTIONS
- Think internally about the gap between the recent topics and the pillars, then pick the highest-leverage idea.
- The "angle" must be a specific hook or perspective — not a generic restatement of the topic.
- The "pillar" field must match the name of one of the pillars listed above (or be the closest one if a hybrid).
- Return ONLY a single raw JSON object. No prose, no markdown, no code fences, no backticks, no explanation before or after.

REQUIRED OUTPUT SCHEMA (raw JSON only)
{
  "topic": "string - one line describing the core idea of the post",
  "angle": "string - the unique hook or perspective that makes it interesting and worth reading",
  "pillar": "string - the content pillar this idea belongs to"
}
`.trim();
}

export function generatePostPrompt(idea, strategy, userSettings = {}) {
  const strategyContext = buildStrategyContext(strategy || {});

  const userContext = `
USER PROFILE
- Name: ${userSettings?.fullName || 'Rana Danish'}
- Headline: ${userSettings?.headline || ''}
- About: ${userSettings?.about || ''}
- Voice & Tone: ${userSettings?.voice || ''}
- Services: ${Array.isArray(userSettings?.services) && userSettings.services.length ? userSettings.services.join(', ') : 'Not specified'}
`.trim();

  const ideaBlock = `
APPROVED IDEA TO WRITE
- Topic: ${idea?.topic || ''}
- Angle: ${idea?.angle || ''}
- Pillar: ${idea?.pillar || ''}
`.trim();

  const formatExample = `
𝐇𝐞𝐚𝐝𝐥𝐢𝐧𝐞 𝐢𝐧 𝐔𝐧𝐢𝐜𝐨𝐝𝐞 𝐛𝐨𝐥𝐝 𝐡𝐞𝐫𝐞.

Short punchy opening paragraph that sets the scene in 1–2 sentences.

Another short paragraph that continues the thought and adds personal context.

Here is what it actually looked like:
→ 𝐁𝐨𝐥𝐝 𝐤𝐞𝐲 𝐩𝐡𝐫𝐚𝐬𝐞 plain text explanation after.
→ 𝐁𝐨𝐥𝐝 𝐤𝐞𝐲 𝐩𝐡𝐫𝐚𝐬𝐞 plain text explanation after.
→ 𝐁𝐨𝐥𝐝 𝐤𝐞𝐲 𝐩𝐡𝐫𝐚𝐬𝐞 plain text explanation after.

Closing reflection paragraph that ties it back to the opening.

Punchy one liner that lands the message.

Engagement question that invites comments?

#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5
`.trim();

  return `
ROLE
You are a LinkedIn ghostwriter who knows Rana Danish personally. You write in his voice, follow his exact formatting style, and never sound like a generic AI post. You write only the final post text — no labels, no explanation, no JSON wrapper.

${userContext}

${strategyContext}

${ideaBlock}

WRITING RULES
- Write in FIRST PERSON as Rana Danish.
- Match the TONE from the strategy above AND the VOICE & TONE from the user profile — they must feel consistent.
- Strictly follow the FORMAT NOTES from the strategy.
- Use Unicode bold characters (𝐀-𝐙 𝐚-𝐳) for the headline and for the bold key phrase in every arrow point. Do NOT use Markdown asterisks (**) or underscores.
- Use the arrow character "→" exactly as shown in the example for each bullet point.
- Keep proper line breaks between sections — single blank line between paragraphs and between the arrow block and the closing section.
- End the post with a single engagement question (one line, ending with a question mark).
- End with 4–5 relevant hashtags on the final line, separated by single spaces.
- Do NOT include any preamble like "Here's your post:" or "Sure!". Return the post text only.
- Do NOT wrap the output in JSON, code fences, or backticks.

FORMATTING REFERENCE (match this structure exactly, including line breaks and Unicode bold)

${formatExample}

TASK
Write the full LinkedIn post for the approved idea above. Return only the post text — nothing else.
`.trim();
}
