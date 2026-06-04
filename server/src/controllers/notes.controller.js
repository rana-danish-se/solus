import Note from '../models/note.model.js';
import Settings from '../models/settings.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { callLLM } from '../services/llm/index.js';
import { buildUserContext } from '../prompts/index.js';
import { buildNoteProcessingPrompt } from '../prompts/notes.js';

function parseLLMJson(raw) {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[NotesController] Failed to parse LLM JSON:', cleaned);
    throw new Error('Invalid JSON returned from LLM');
  }
}

async function processNoteWithAI(title, content, userContext) {
  const prompt = buildNoteProcessingPrompt(userContext, title, content);
  const raw = await callLLM(prompt);
  const parsed = parseLLMJson(raw);
  const { summary = '', type = 'insight', tags = [], takeaways = [] } = parsed;
  return { summary, type, tags, takeaways };
}

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, source } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const settings = await Settings.findOne({ type: 'global' });
  const userContext = buildUserContext(settings);

  const aiData = await processNoteWithAI(title, content, userContext);

  const note = await Note.create({
    title,
    content,
    source: source || '',
    summary: aiData.summary,
    type: aiData.type,
    tags: aiData.tags,
    takeaways: aiData.takeaways,
  });

  res.status(201).json(note);
});

export const getAllNotes = asyncHandler(async (req, res) => {
  const { type, tag } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (tag) filter.tags = tag;

  const notes = await Note.find(filter).sort({ createdAt: -1 });
  res.json(notes);
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json(note);
});

export const updateNote = asyncHandler(async (req, res) => {
  const { title, content, source, summary, type, tags, takeaways } = req.body;
  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (content !== undefined) updateFields.content = content;
  if (source !== undefined) updateFields.source = source;
  if (summary !== undefined) updateFields.summary = summary;
  if (type !== undefined) updateFields.type = type;
  if (tags !== undefined) updateFields.tags = tags;
  if (takeaways !== undefined) updateFields.takeaways = takeaways;

  const note = await Note.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json(note);
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json({ success: true, message: 'Note deleted' });
});
