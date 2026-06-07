export function buildUserContext(settingsDoc) {
  if (!settingsDoc) return '';

  const {
    fullName = '',
    headline = '',
    about = '',
    goals = '',
    voice = '',
    services = [],
  } = settingsDoc;

  const servicesList = Array.isArray(services) && services.length
    ? services.join(', ')
    : 'None specified';

  return `
USER PROFILE
- Name: ${fullName}
- Headline: ${headline}
- About: ${about}
- Goals: ${goals}
- Voice & Tone: ${voice}
- Services Offered: ${servicesList}
`.trim();
}

export { generateIdeaPrompt, generatePostPrompt } from './content.js';
