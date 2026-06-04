export function buildNoteProcessingPrompt(userContext, title, content) {
  return `
${userContext}

TASK
You are a precise knowledge extraction engine. Given the user's profile above and the raw note below, produce a JSON object with the following fields ONLY. No markdown, no extra commentary, no code fences.

RAW NOTE
Title: ${title}
Content: ${content}

REQUIRED OUTPUT SCHEMA (JSON)
{
  "summary": "string - concise 2-3 sentence summary",
  "type": "string - one of: concept, snippet, prompt, framework, insight",
  "tags": ["string", "..."],
  "takeaways": ["string", "..."]
}

RULES
- "type" MUST be exactly one of the enum values.
- "tags" should be 3-6 lowercase keywords.
- "takeaways" should be 2-5 actionable bullet points.
- Output raw JSON only.
`.trim();
}
