'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Pencil, RotateCcw } from 'lucide-react';
import {
  generateCTA,
  regenerateCTA,
  updateSection,
} from '@/services/content.service';
import useToastStore from '@/store/toastStore';

export default function StepCTA({ onComplete, onBack, postId, post: initialPost }) {
  const addToast = useToastStore((state) => state.addToast);

  const [post, setPost] = useState(initialPost);
  const [ctaText, setCtaText] = useState(initialPost?.sections?.cta || '');
  const [isGenerating, setIsGenerating] = useState(!initialPost?.sections?.cta);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(ctaText);

  useEffect(() => {
    if (!initialPost?.sections?.cta && postId) {
      generateCTA(postId)
        .then((p) => {
          setPost(p);
          setCtaText(p.sections?.cta || '');
          setEditText(p.sections?.cta || '');
        })
        .catch((err) => {
          addToast(err.response?.data?.message || 'Failed to generate CTA', 'error');
        })
        .finally(() => setIsGenerating(false));
    }
  }, [initialPost?.sections?.cta, postId, addToast]);

  async function handleRegenerate() {
    if (!post?._id) return;
    setIsRegenerating(true);
    try {
      const p = await regenerateCTA(post._id);
      setPost(p);
      setCtaText(p.sections?.cta || '');
      setEditText(p.sections?.cta || '');
      setIsEditing(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to regenerate CTA', 'error');
    } finally {
      setIsRegenerating(false);
    }
  }

  async function handleConfirm() {
    if (!post?._id) return;
    setIsSaving(true);
    try {
      if (editText !== ctaText) {
        const updated = await updateSection(post._id, 'cta', editText);
        setPost(updated);
        setCtaText(updated.sections?.cta || '');
      }
      onComplete({ postId: post._id, post });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save CTA', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (isGenerating) {
    return (
      <div className="p-8">
        <h2 className="text-lg font-bold text-foreground mb-1">CTA</h2>
        <p className="text-sm text-highlight mb-6">Writing your call to action...</p>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-gray-200 rounded-lg" />
            <div className="h-10 w-28 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const displayText = isEditing ? editText : ctaText;

  return (
    <div className="p-8">
      <h2 className="text-lg font-bold text-foreground mb-1">CTA</h2>
      <p className="text-sm text-highlight mb-6">The closing question and hashtags.</p>

      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors leading-relaxed"
          autoFocus
        />
      ) : (
        <div
          onClick={() => { setIsEditing(true); setEditText(ctaText); }}
          className="group relative bg-[#F5F5F7] rounded-xl px-5 py-4 cursor-pointer transition-colors hover:bg-gray-100"
        >
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{displayText}</p>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1 text-[11px] text-highlight bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
              <Pencil className="w-3 h-3" />
              Edit
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          className="text-sm text-highlight hover:text-foreground transition-colors"
        >
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
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
            Looks good →
          </button>
        </div>
      </div>
    </div>
  );
}