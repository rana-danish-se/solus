'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader2, RotateCcw, Sparkles, SkipForward } from 'lucide-react';
import { polishPost, updateSection } from '@/services/content.service';
import useToastStore from '@/store/toastStore';

export default function StepPolish({ onComplete, onBack, postId, post: initialPost }) {
  const addToast = useToastStore((state) => state.addToast);

  const [state, setState] = useState('loading');
  const [polishedContent, setPolishedContent] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (postId) {
      runPolish();
    }
  }, [postId]);

  async function runPolish() {
    setState('loading');
    setIsPolishing(true);
    setError(null);
    try {
      const result = await polishPost(postId);
      setPolishedContent(result.content || '');
      setState('review');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to polish post');
      setState('error');
    } finally {
      setIsPolishing(false);
    }
  }

  async function handleRePolish() {
    setIsPolishing(true);
    setState('loading');
    setError(null);
    try {
      const result = await polishPost(postId);
      setPolishedContent(result.content || '');
      setState('review');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to re-polish post');
      setState('error');
    } finally {
      setIsPolishing(false);
    }
  }

  async function handleSkip() {
    if (!postId || !initialPost) return;
    setIsSaving(true);
    try {
      const assembled = [
        initialPost.sections?.hook || '',
        initialPost.sections?.body || '',
        initialPost.sections?.cta || '',
      ].filter(Boolean).join('\n\n');

      await updateSection(postId, 'content', assembled);
      addToast('Skipped polish — using assembled content', 'info');
      onComplete({ postId, post: { ...initialPost, content: assembled } });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirm() {
    if (!postId) return;
    setIsSaving(true);
    try {
      await updateSection(postId, 'content', polishedContent);
      addToast('Post polished and saved', 'success');
      onComplete({ postId, post: { ...initialPost, content: polishedContent } });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save polished post', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (state === 'loading') {
    return (
      <div className="p-8">
        <h2 className="text-lg font-bold text-foreground mb-1">Polish</h2>
        <p className="text-sm text-highlight mb-6">Refining your post for LinkedIn...</p>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-glow border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-foreground font-medium">Polishing your post...</p>
          <p className="text-sm text-highlight mt-1">Adding emphasis, fixing punctuation, final formatting...</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="p-8">
        <h2 className="text-lg font-bold text-foreground mb-1">Polish</h2>
        <p className="text-sm text-highlight mb-6">Polishing encountered an issue.</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRePolish}
              disabled={isPolishing}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isPolishing ? 'animate-spin' : ''}`} />
              Try again
            </button>
            <button
              onClick={handleSkip}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-glow bg-glow/10 hover:bg-glow/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4" />
              Skip polish →
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button onClick={onBack} className="text-sm text-highlight hover:text-foreground transition-colors">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-lg font-bold text-foreground mb-1">Polish</h2>
      <p className="text-sm text-highlight mb-6">Review and edit your polished post.</p>

      <textarea
        ref={textareaRef}
        value={polishedContent}
        onChange={(e) => setPolishedContent(e.target.value)}
        rows={12}
        className="w-full min-h-[300px] bg-white border border-gray-200 rounded-xl p-5 text-sm leading-relaxed font-sans outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors resize-y"
        autoFocus
      />

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          className="text-sm text-highlight hover:text-foreground transition-colors"
        >
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRePolish}
            disabled={isPolishing}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isPolishing ? 'animate-spin' : ''}`} />
            {isPolishing ? 'Re-polishing...' : 'Re-polish'}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-glow text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Looks good →'}
          </button>
        </div>
      </div>
    </div>
  );
}