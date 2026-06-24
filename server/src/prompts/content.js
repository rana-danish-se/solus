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

export function generateIdeaPrompt(strategy, recentTopics = [], currentPillar = null) {
  const strategyContext = buildStrategyContext(strategy || {});
  const recentTopicsList = buildRecentTopicsList(recentTopics);

  const pillarRotationRule = currentPillar
    ? `\nPILLAR ROTATION RULE: The pillar field in your response MUST NOT be: ${currentPillar}. You must choose a different pillar from the list above.`
    : '';

  return `
ROLE
You are a LinkedIn content strategist for Rana Danish, a student and freelance AI engineer based in Pakistan, currently studying at COMSATS University. You understand his voice, his audience, and what makes a post land on the platform.

${strategyContext}

RECENTLY USED TOPICS (do NOT repeat or closely mirror any of these):
${recentTopicsList}
${pillarRotationRule}

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
Short, punchy opening paragraph that hooks the reader in 1–2 sentences.

Another short paragraph that continues the thought and adds personal context or builds on the idea.

A third paragraph if needed to flesh out the point. Keep it conversational, not academic.

→ Key takeaway or important insight worth highlighting.

Closing paragraph that ties it back to the opening. One or two sentences, max.

End with a question that invites comments?

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
- Match the TONE from the strategy above AND the VOICE & TONE from the user profile.
- Write in natural paragraphs with proper English punctuation and line breaks. One blank line between paragraphs.
- Keep paragraphs short (1–3 sentences each). No walls of text.
- Use "→" sparingly — only for 1–2 key takeaways or important insights, not for every line. Most of the post should be normal paragraphs.
- Use bold or emphasis naturally where it fits (not via Unicode math characters — just plain text with natural emphasis).
- End the post with a single engagement question (one line, ending with a question mark).
- End with 4–5 relevant hashtags on the final line, separated by single spaces.
- Do NOT include any preamble like "Here's your post:" or "Sure!". Return the post text only.
- Do NOT wrap the output in JSON, code fences, or backticks.

FORMATTING REFERENCE (natural structure — adapt freely, don't copy verbatim)

${formatExample}

TASK
Write the full LinkedIn post for the approved idea above. Return only the post text — nothing else.
`.trim();
}

export function generateHookPrompt(idea, strategy, userSettings = {}) {
  const userContext = `
USER PROFILE
- Name: ${userSettings?.fullName || 'Rana Danish'}
- Headline: ${userSettings?.headline || ''}
- Voice & Tone: ${userSettings?.voice || ''}
`.trim();

  const ideaBlock = `
APPROVED IDEA
- Topic: ${idea?.topic || ''}
- Angle: ${idea?.angle || ''}
`.trim();

  return `
ROLE
You are a LinkedIn ghostwriter who writes scroll-stopping hooks. You never open with "I", "Today", "Excited", or any buzzword. You write one or two lines that make someone stop scrolling and read the rest.

${userContext}

${ideaBlock}

WRITING RULES
- Write exactly 1–2 lines. No more.
- Do NOT start with "I", "Today", "I'm excited", "I wanted to share", or any variation.
- No buzzwords: "game-changer", "revolutionary", "unlocking", "supercharged", "leverage", "deep dive".
- Must be scroll-stopping — a bold claim, a surprising take, a relatable struggle, or a provocative question.
- Conversational tone. Write like you speak.
- Use proper English punctuation.
- Keep it plain text. No bold, no formatting.
- Return only the hook text. No labels, no explanation, no JSON, no quotes around it.
- Do NOT return the entire response as a single unbroken block of text. Paragraph breaks are part of the output requirement, not optional.

TASK
Write the hook (opening 1–2 lines) for this LinkedIn post idea. Return only the hook text.
`.trim();
}

export function generateBodyPrompt(idea, strategy, userSettings = {}, hook = '') {
  const strategyContext = buildStrategyContext(strategy || {});

  const userContext = `
USER PROFILE
- Name: ${userSettings?.fullName || 'Rana Danish'}
- Headline: ${userSettings?.headline || ''}
- Voice & Tone: ${userSettings?.voice || ''}
`.trim();

  const ideaBlock = `
APPROVED IDEA
- Topic: ${idea?.topic || ''}
- Angle: ${idea?.angle || ''}
- Pillar: ${idea?.pillar || ''}
`.trim();

  return `
ROLE
You are a LinkedIn ghostwriter who writes tight, scannable body sections. You write in short, conversational paragraphs with proper English punctuation.

${userContext}

${strategyContext}

${ideaBlock}

APPROVED HOOK (the opening to be consistent with):
${hook || '(no hook yet — write a standalone body)'}

WRITING RULES
- Write 2–4 short paragraphs. Each paragraph is 1–3 sentences.
- Separate each paragraph with a single blank line (two newline characters: \n\n). This is mandatory — do not run paragraphs together.
- Use proper English punctuation and natural line breaks.
- Keep it conversational, not academic or salesy.
- Optionally use "→" once or twice to highlight a key takeaway, but most of the body should be normal paragraphs.
- Do NOT start every line with an arrow or bullet.
- Do NOT include metrics, numbers, stats, or data.
- No bragging, no self-promotion, no "I did X" grandstanding.
- Do NOT repeat the hook. Assume the reader already read it.
- Keep it plain text (no bold, no special characters besides → for emphasis).
- Return only the body text. No labels, no explanation, no JSON.
- Do NOT return the entire response as a single unbroken block of text. Paragraph breaks are part of the output requirement, not optional.

EXAMPLE OUTPUT STRUCTURE (follow this exactly):
First paragraph here. One to three sentences.

Second paragraph here. One to three sentences.

Third paragraph here if needed.

TASK
Write the body section (2–4 short paragraphs) for this LinkedIn post. Return only the body text.
`.trim();
}

export function generateCTAPrompt(idea, strategy, userSettings = {}, hook = '', body = '') {
  const userContext = `
USER PROFILE
- Name: ${userSettings?.fullName || 'Rana Danish'}
- Headline: ${userSettings?.headline || ''}
`.trim();

  const ideaBlock = `
APPROVED IDEA
- Topic: ${idea?.topic || ''}
- Angle: ${idea?.angle || ''}
`.trim();

  return `
ROLE
You are a LinkedIn ghostwriter who writes closings that drive engagement. You write one specific question and a handful of relevant hashtags. No fluff, no summary, no sign-off.

${userContext}

${ideaBlock}

EXISTING POST CONTENT (write a CTA that fits this flow naturally):
Hook: ${hook || '(no hook written)'}
Body: ${body || '(no body written)'}

WRITING RULES
- You MUST output exactly two lines with a blank line between them. Line 1: the engagement question. One blank line. Line 2: the hashtags. Nothing else.
- The question must be specific to the post content — not generic like "What do you think?" or "Share your thoughts".
- The question must invite a comment or opinion. One sentence, short, ends with "?".
- Hashtag line: exactly 4–5 hashtags, space-separated, no commas.
- Do NOT use Unicode bold — this is raw CTA text.
- Do NOT include any closing reflection or sign-off like "Thanks for reading" or "Hope this helps".
- Return only the CTA text (question line, blank line, hashtag line). No labels, no explanation, no JSON.
- Do NOT return the entire response as a single unbroken block of text. Paragraph breaks are part of the output requirement, not optional.

EXAMPLE OUTPUT STRUCTURE (follow this exactly):
What has been your biggest challenge when explaining technical work to clients?

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4

TASK
Write the closing engagement question and hashtags for this LinkedIn post. Return only the CTA text.
`.trim();
}

export function generatePolishPrompt(assembledPost) {
  return `
ROLE
You are a LinkedIn post editor. You receive a draft post and return a polished, publish-ready version.

INPUT POST:
${assembledPost}

RULES
- Do NOT rewrite sentences. Do NOT change meaning. Do NOT add or remove ideas.
- Fix punctuation errors only where clearly wrong.
- Ensure proper paragraph separation — each paragraph separated by a single blank line (\\n\\n).
- Add Unicode bold using Mathematical Bold characters (e.g., 𝗯𝗼𝗹𝗱) to 3–6 key phrases or words that deserve emphasis. Do not bold entire sentences. Bold short impactful phrases only.
- CRITICAL: Do NOT use markdown **bold** or *italic*. LinkedIn does not render markdown. You MUST use Unicode Mathematical Bold characters only.
- The hook (first 1–2 lines) must NOT start with "I", "Today", or "Excited".
- The last line before hashtags must be an engagement question ending with "?".
- Hashtags stay on the final line, unchanged, space-separated.
- Return ONLY the polished post text. No labels, no explanation, no JSON, no backticks.

EXAMPLE — Correct Unicode bold usage:
Before: "The key to success is consistency."
After: "The key to success is 𝗰𝗼𝗻𝘀𝗶𝘀𝘁𝗲𝗻𝗰𝘆."

EXAMPLE — WRONG (do not do this):
"The key to success is **consistency**."

TASK
Polish the input post according to the rules above. Return only the polished post text.
`.trim();
}
