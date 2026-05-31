# Personal OS — Full Requirements & Build Roadmap

## Project Identity: Solus
**Solus** is your solo operating system—a unified central workspace designed to manage your professional identity, track tasks, and automate content pipelines.

---

## Tech Stack

| Layer | Choice |
|---|---|
| **Frontend** | Next.js (App Router) |
| **Backend** | Node.js + Express (Unified Monorepo or API subfolder, hosted on Vercel Serverless) |
| **Database** | MongoDB Atlas (Free Tier) |
| **AI (LLM)** | Gemini API (Google AI Studio Free Tier) OR Groq API (Free Tier for Llama-3/Mixtral) |
| **Image Generation** | Free API Providers (SiliconFlow FLUX.1-Schnell, Hugging Face Inference API, Cloudflare Workers AI, or Gemini Imagen 3 Free Trial) |
| **Auth** | NextAuth.js (Auth.js) |
| **Notifications** | Twilio (WhatsApp API) |
| **Job Queue / Cron** | Vercel Cron Jobs (Simple URL fetch scheduling) or cron-job.org |
| **Hosting** | Vercel (Both Client and Serverless Node/Express backend routes) |

---

## Build Order

Build in this exact sequence. Each phase is a working, usable product before moving to the next.

---

## Phase 1 — Foundation (Week 1–2)

**Goal:** Project setup, multi-app routing, authentication, layout, database, navigation.

### Requirements
- Next.js workspace paired with an Express.js backend API structure running on Vercel Serverless Functions.
- MongoDB connection using Mongoose.
- NextAuth authentication (Credentials provider to start).
- Sidebar navigation with all module links.
- Dashboard home page (empty states for now).
- User settings page (name, bio, services, communication style, goals).
- Environment config (`.env`) for Gemini/Groq keys, MongoDB URIs, and webhook secrets.
- Base layout with dark/light mode.

**Deliverable:** You can log in and navigate the shell of the app.

---

## Phase 2 — Module 6: Learning Hub (Week 3–4)

**Goal:** Build your second brain first. You'll use it during development to store everything you learn.

### Requirements
- Create / edit / delete notes.
- Tag notes (concept, snippet, prompt, framework, insight).
- **AI summarization** — paste article text → call Gemini/Groq API → get clean Markdown summary + key takeaways.
- Learning journal — daily log of what you learned.
- **AI knowledge search** — semantic natural language queries over your notes ("what do I know about hoisting?") powered by Gemini embeddings or basic Atlas search indexes.

**Deliverable:** Fully working personal knowledge base.

---

## Phase 3 — Module 4: Resource Vault (Week 5)

**Goal:** Stop losing useful links and tools.

### Requirements
- Save resource (title, URL, category, description, tags, date).
- Predefined categories: AI Tools, Dev Tools, Learning, Freelancing, Job Search, Productivity, Marketing, Design, Utilities, SaaS Inspiration.
- Edit / delete resources.
- **AI search via Groq/Gemini processing** ("show all PDF-related tools", "show freelancing resources").
- Filter by category and tag.
- Browser extension spec documented (build later).

**Deliverable:** Fully working resource manager.

---

## Phase 4 — Module 1: Content Creation & Social Automation (Week 6–10)

**Goal:** The core automation feature.

### 4A — Content Strategy Configuration
- Platform-specific strategy settings (LinkedIn, Twitter/X, Reddit).
- Content pillars management (add/edit/delete pillars).
- Tone of voice, target audience, posting frequency, writing style per platform.
- Pillar rotation schedule.

### 4B — AI Content Planner
- Scheduled triggers via **Vercel Cron Jobs** calling your Express endpoint daily.
- Generate content ideas per platform using Gemini/Groq following strategy + pillars.
- Avoid topic repetition (store all past topics in DB).
- Suggest hooks and angles per idea.
- Save ideas to Idea Bank.

### 4C — Approval Workflow
- Idea review screen (approve / edit / regenerate).
- Full post generation from approved idea using LLM context.
- Section-level regeneration (hook, body, CTA separately).
- Final approval before scheduling.

### 4D — Free AI Image Generation
- Generate platform-specific images using open/free API layers:
  - **SiliconFlow API** or **Hugging Face Inference Clients** running `FLUX.1-schnell` (highly accessible free/low-cost tiers).
  - Alternatively, use Cloudflare Workers AI or Gemini's native `Imagen 3` endpoints if within free limits.
- Multiple variations (up to 3 options).
- Regenerate option / Upload custom image.
- Image history per post.

### 4E — WhatsApp Notifications (Twilio)
- Notify when new ideas are generated.
- Notify when post is ready for review.
- Notify on engagement milestones.

### 4F — Publishing
- LinkedIn posting via LinkedIn API (Posts endpoint).
- Twitter/X posting via X API.
- Reddit posting via Reddit API.
- Schedule posts (datetime picker matching against future Vercel Cron ticks or internal timestamp evaluations).
- Save as draft / Immediate publish option.

### 4G — Analytics Dashboard
- Pull engagement data per platform where API allows.
- Track: impressions, likes, comments, shares, follower growth, engagement rate.
- Weekly and monthly reports.

**Deliverable:** Full content automation pipeline with WhatsApp approval flows and free AI-generated assets.

---

## Phase 5 — Module 7: Personal Brand Intelligence (Week 11)

**Goal:** Turn your content history into strategic intelligence.

### Requirements
- Content repository (all posts stored with metadata).
- Idea Bank (save ideas, hooks, story angles, observations).
- Growth analytics view (followers, engagement, reach over time).
- **Content gap analysis** — Free tier LLM identifies missing pillars, underrepresented topics, high-opportunity areas.
- Best performing topics report.

**Deliverable:** Strategic content intelligence layer on top of Phase 4.

---

## Phase 6 — Module 3: Freelance Project & Income Tracker (Week 12–13)

**Goal:** Know exactly where your money comes from and where it goes.

### Requirements

#### Client Management
- Store: name, contact details, industry, notes, source.
- Client profile page.

#### Project Tracking
- Store: name, client, description, start/end date, status, technologies, challenges, deliverables.
- Project status: Active / Completed / On Hold / Cancelled.

#### Financial Tracking
- Project value, payments received, outstanding payments, expenses, profit per project.
- Mark payment as received (partial or full).

#### Analytics
- Total revenue, monthly revenue, revenue by client, revenue by service.
- Average project value.
- Outstanding payments summary.

#### Portfolio Generation
- One-click convert project → portfolio entry.
- One-click convert project → LinkedIn post via Gemini/Groq.
- One-click convert project → resume bullet point.
- One-click convert project → case study draft.

**Deliverable:** Full freelance financial and project tracker.

---

## Phase 7 — Module 9: Achievement & Portfolio Engine (Week 14)

**Goal:** Convert your work into proof automatically.

### Requirements
- Track: projects, client wins, certifications, open-source contributions, hackathons, learning milestones.
- Auto-generate from any achievement:
  - LinkedIn post
  - Portfolio entry
  - Resume bullet point
  - Case study
  - Interview story (STAR format via prompt template execution)
- Achievement timeline view.

**Deliverable:** Everything you do becomes content and proof automatically.

---

## Phase 8 — Module 5: Career Application Assistant (Week 15–16)

**Goal:** Apply smarter and faster.

### Requirements

#### Job Analysis
- Input job URL or paste job description.
- AI (Gemini/Groq) extracts: company, role, required skills, responsibilities, culture signals.

#### Document Generation
- Generate personalized: cover letter, application email, LinkedIn message, follow-up email, freelance proposal, Upwork proposal.
- Uses your stored resume, projects, skills, portfolio from the system.

#### Resume & Profile Storage
- Store your resume data (skills, experience, projects, education).
- Update anytime; all generated docs pull from latest version.

#### Application Tracker
- Store: company, role, date, status, notes, interview dates.
- Pipeline: Applied → Screening → Interview → Offer → Rejected / Accepted.
- Visual pipeline board (Kanban).

**Deliverable:** Full job application automation with personalized doc generation.

---

## Phase 9 — Module 2: AI Sales & Conversation Assistant (Week 17–19)

**Goal:** Never write a cold message or follow-up from scratch again.

### Requirements

#### AI Persona Setup
- Configure your background, services, communication style, goals, pricing.
- LLM acts as your custom persona wrapper.

#### Prospect Profiles
- Store: name, headline, company, platform, bio, notes, lead score.
- Manual lead score or AI-scored based on profile text analysis.

#### Conversation Workflow
- Paste prospect's message.
- AI analyzes: full conversation history + prospect metadata + your goals.
- AI generates: best response + 2 alternatives + reasoning.
- One-click copy to clipboard.

#### Sales Assistance
- Discovery call prep (AI generates questions based on prospect profile).
- Objection handling suggestions.
- Follow-up message generation.
- Proposal discussion talking points.
- Pricing conversation scripts.
- Closing message templates.

#### Lead CRM
- Track: lead, status, follow-up date, meetings, notes.
- Pipeline: Lead → Contacted → Qualified → Proposal Sent → Closed Won / Lost.
- Conversion rate analytics.

**Deliverable:** AI-powered sales co-pilot that knows you.

---

## Phase 10 — Module 8: Opportunity CRM (Week 20)

**Goal:** Never let an opportunity go cold.

### Requirements
- Track: freelance leads, recruiters, founders, partnerships, referrals, collaborations.
- Pipeline: Lead → Contacted → Qualified → Proposal Sent → Closed Won → Closed Lost.
- **AI follow-up assistant** — generate follow-ups, check-ins, re-engagement messages.
- Inactivity reminders (no activity in X days → hit Vercel Cron → check conditions → notify via WhatsApp webhook).
- Link opportunities to leads from Module 2.

**Deliverable:** Full opportunity pipeline with AI follow-up automation.

---

## Phase 11 — Module 10: Personal AI Brain (Week 21–22)

**Goal:** One AI that knows everything about you and answers anything.

### Requirements

#### Connected Data Sources
- Projects, clients, conversations, applications, resources, learning notes, content, achievements, revenue data.

#### Natural Language Query Interface
- Chat-style interface.
- Queries across all modules:
  - "What projects have I completed using AI?"
  - "Which client generated the most revenue?"
  - "Create a proposal for this lead."
  - "Generate a LinkedIn post from my latest project."
  - "What resources do I have about vector databases?"
- **Implementation via Free RAG**
  - Embed module data using free embedding APIs (like Gemini's text-embedding-004).
  - Use MongoDB Atlas Vector Search (free tier supports vector indices).
  - RAG pipeline — query → retrieve relevant context chunks from Atlas → Gemini/Groq generates answer with citations.

**Deliverable:** Your personal AI that knows your entire professional life.

---

## Phase 12 — Polish & Launch (Week 23–24)

- Mobile responsiveness.
- Performance optimization (Vercel edge caching where applicable).
- Error handling (handling free tier API rate limits gracefully) and empty states.
- Onboarding flow for first-time setup.
- Export data (CSV, JSON).
- Browser extension for Resource Vault (lightweight manifest v3 plugin that fetches your Vercel-hosted Express API).
- Public portfolio page (optional — shareable link of your work).

---

## Summary Build Order

| Phase | Module | Week |
|---|---|---|
| 1 | Foundation + Auth + Settings (Next.js + Express + Vercel) | 1–2 |
| 2 | Learning Hub (Groq/Gemini Integration) | 3–4 |
| 3 | Resource Vault | 5 |
| 4 | Content Automation (Vercel Crons + Free Image APIs) | 6–10 |
| 5 | Personal Brand Intelligence | 11 |
| 6 | Freelance & Income Tracker | 12–13 |
| 7 | Achievement & Portfolio Engine | 14 |
| 8 | Career Application Assistant | 15–16 |
| 9 | AI Sales & Conversation Assistant | 17–19 |
| 10 | Opportunity CRM (Automation Rules) | 20 |
| 11 | Personal AI Brain (MongoDB Atlas Vector Search + RAG) | 21–22 |
| 12 | Polish & Launch | 23–24 |

**Total estimated time: 24 weeks (6 months)**