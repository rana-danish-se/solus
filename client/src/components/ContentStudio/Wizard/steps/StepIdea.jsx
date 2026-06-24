'use client';
import { useState } from 'react';
import { Sparkles, Loader2, Check, PenLine, RotateCcw } from 'lucide-react';
import {
  generateIdeas as generateIdeasApi,
  createIdea as createIdeaApi,
  approveIdea,
  generateHook,
} from '@/services/content.service';
import useToastStore from '@/store/toastStore';

export default function StepIdea({ onComplete, onBack }) {
  const addToast = useToastStore((state) => state.addToast);

  const [mode, setMode] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const [customIdea, setCustomIdea] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateIdeasApi();
      const arr = Array.isArray(data) ? data : [];
      setIdeas(arr);
      setMode('results');
      if (arr.length === 0) {
        addToast('No ideas were generated. Try again.', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to generate ideas', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setSelectedIdeaId(null);
    await handleGenerate();
  };

  const handleUseIdea = async (idea) => {
    if (isContinuing) return;
    setIsContinuing(true);
    try {
      await approveIdea(idea._id);
      const post = await generateHook(idea._id);
      addToast('Hook generated from your idea', 'success');
      onComplete({ postId: post._id, post });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to proceed with this idea', 'error');
      setIsContinuing(false);
    }
  };

  const handleUseCustomIdea = async () => {
    if (!customIdea.trim() || isContinuing) return;
    setIsContinuing(true);
    try {
      const idea = await createIdeaApi({
        topic: customIdea.trim(),
        angle: '',
        pillar: 'general',
      });
      await approveIdea(idea._id);
      const post = await generateHook(idea._id);
      addToast('Post created from your idea.', 'success');
      onComplete({ postId: post._id, post });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create post', 'error');
      setIsContinuing(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-lg font-bold text-foreground mb-1">Choose your idea</h2>
      <p className="text-sm text-highlight mb-6">Start with an AI-generated idea or write your own.</p>

      {mode === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => { setMode('generating'); handleGenerate(); }}
            className="group bg-white border-2 border-dashed border-gray-200 hover:border-glow/40 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-glow/10 flex items-center justify-center mb-3 group-hover:bg-glow/20 transition-colors">
              <Sparkles className="w-5 h-5 text-glow" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">Generate Ideas</h3>
            <p className="text-xs text-highlight leading-relaxed">
              Let AI brainstorm post ideas based on your content strategy.
            </p>
          </button>

          <button
            onClick={() => setMode('custom')}
            className="group bg-white border-2 border-dashed border-gray-200 hover:border-glow/40 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center mb-3 group-hover:bg-highlight/20 transition-colors">
              <PenLine className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">Write my own</h3>
            <p className="text-xs text-highlight leading-relaxed">
              Type your own idea and we will build a post around it.
            </p>
          </button>
        </div>
      )}

      {mode === 'generating' && isGenerating && (
        <div className="py-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-glow animate-spin mb-4" />
          <p className="text-sm text-foreground font-medium">Brainstorming ideas...</p>
          <p className="text-xs text-highlight mt-1">This usually takes a few seconds.</p>
        </div>
      )}

      {mode === 'results' && !isGenerating && (
        <div className="space-y-4">
          {ideas.length === 0 ? (
            <p className="text-sm text-highlight py-8 text-center">No ideas returned. Try again.</p>
          ) : (
            <div className="space-y-3">
              {ideas.map((idea) => (
                <button
                  key={idea._id}
                  onClick={() => setSelectedIdeaId(idea._id === selectedIdeaId ? null : idea._id)}
                  className={`w-full text-left bg-white border rounded-xl p-5 transition-all duration-200 ${
                    selectedIdeaId === idea._id
                      ? 'border-glow ring-2 ring-glow/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {idea.pillar && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-glow/10 text-glow border border-glow/20">
                            {idea.pillar}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{idea.topic}</h3>
                      {idea.angle && (
                        <p className="text-xs text-secondary mt-1 leading-relaxed">{idea.angle}</p>
                      )}
                    </div>
                    {selectedIdeaId === idea._id && (
                      <div className="w-5 h-5 rounded-full bg-glow flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate ideas
            </button>

            <div className="flex-1" />

            <button
              onClick={() => setMode(null)}
              className="px-4 py-2 text-sm text-highlight hover:text-foreground transition-colors"
            >
              Back
            </button>

            <button
              onClick={() => {
                const idea = ideas.find((i) => i._id === selectedIdeaId);
                if (idea) handleUseIdea(idea);
              }}
              disabled={!selectedIdeaId || isContinuing}
              className="flex items-center gap-2 px-5 py-2 bg-glow text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isContinuing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isContinuing ? 'Creating post...' : 'Use this idea'}
            </button>
          </div>
        </div>
      )}

      {mode === 'custom' && (
        <div className="space-y-4">
          <textarea
            value={customIdea}
            onChange={(e) => setCustomIdea(e.target.value)}
            placeholder="What do you want to write about? Describe your post idea, the angle, and what you want to say..."
            rows={5}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setMode(null); setCustomIdea(''); }}
              className="text-sm text-highlight hover:text-foreground transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleUseCustomIdea}
              disabled={!customIdea.trim() || isContinuing}
              className="flex items-center gap-2 px-5 py-2 bg-glow text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isContinuing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PenLine className="w-4 h-4" />
              )}
              {isContinuing ? 'Creating post...' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}