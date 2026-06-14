'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  PenTool,
  Sparkles,
  Loader2,
  Check,
  X,
  Trash2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Eye,
  CalendarClock,
  Save,
  ArrowLeft,
} from 'lucide-react';
import {
  getIdeas,
  generateIdeas as generateIdeasApi,
  deleteIdea,
  approveIdea,
  getPosts,
  generateHook,
  regenerateHook,
  generateBody,
  regenerateBody,
  generateCTA,
  regenerateCTA,
  approvePost,
  updateSection,
  uploadPostImage,
  removePostImage,
} from '@/services/content.service';
import useToastStore from '@/store/toastStore';

// ─── Utils ──────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function assemblePreview(hook, body, cta) {
  return [hook, body, cta].filter(Boolean).join('\n\n');
}

// ─── Main Page ──────────────────────────────────────────

export default function ContentStudioPage() {
  const addToast = useToastStore((state) => state.addToast);

  // Stage
  const [stage, setStage] = useState(1);

  // Ideas
  const [ideas, setIdeas] = useState([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Current progress
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [approvedIdeas, setApprovedIdeas] = useState([]);

  // Post builder
  const [post, setPost] = useState(null);
  const [isGeneratingHook, setIsGeneratingHook] = useState(false);
  const [isGeneratingBody, setIsGeneratingBody] = useState(false);
  const [isGeneratingCta, setIsGeneratingCta] = useState(false);
  const [isApprovingPost, setIsApprovingPost] = useState(false);
  const [expandedSection, setExpandedSection] = useState('hook');
  const [editingSection, setEditingSection] = useState(null);
  const [editText, setEditText] = useState('');

  // Stage 3
  const [scheduledDate, setScheduledDate] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isRemovingImage, setIsRemovingImage] = useState(false);

  // ─── Load pending ideas on mount ─────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getIdeas({ status: 'pending' });
        if (mounted) setIdeas(Array.isArray(data) ? data : []);
      } catch {
        // silent
      } finally {
        if (mounted) setIsLoadingIdeas(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ─── Load approved ideas for post builder ────────────
  const loadApprovedIdeas = useCallback(async () => {
    try {
      const data = await getIdeas({ status: 'approved' });
      const arr = Array.isArray(data) ? data : [];
      setApprovedIdeas(arr);
      return arr;
    } catch {
      return [];
    }
  }, []);

  // ─── Handlers: Stage 1 ───────────────────────────────
  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    try {
      const data = await generateIdeasApi();
      const arr = Array.isArray(data) ? data : [];
      setIdeas((prev) => [...arr, ...prev]);
      addToast(`Generated ${arr.length} idea${arr.length !== 1 ? 's' : ''}`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to generate ideas', 'error');
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleDeleteIdea = async (id) => {
    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
      addToast('Idea deleted', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete idea', 'error');
    }
  };

  const handleApproveIdea = async (id) => {
    try {
      await approveIdea(id);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
      addToast('Idea approved', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to approve idea', 'error');
    }
  };

  const handleContinueToPostBuilder = async () => {
    const approved = await loadApprovedIdeas();
    if (approved.length === 0) {
      addToast('No approved ideas to build posts from. Approve an idea first.', 'error');
      return;
    }
    setCurrentIdeaIndex(0);
    setPost(null);
    setExpandedSection('hook');
    setEditingSection(null);
    setStage(2);
  };

  // ─── Handlers: Stage 2 ───────────────────────────────
  const currentIdea = approvedIdeas[currentIdeaIndex];

  const handleGenerateHook = async () => {
    if (!currentIdea) return;
    setIsGeneratingHook(true);
    try {
      const newPost = await generateHook(currentIdea._id);
      setPost(newPost);
      setExpandedSection('hook');
      addToast('Hook generated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to generate hook', 'error');
    } finally {
      setIsGeneratingHook(false);
    }
  };

  const handleRegenerateHook = async () => {
    if (!post) return;
    setIsGeneratingHook(true);
    try {
      const updated = await regenerateHook(post._id);
      setPost(updated);
      addToast('Hook regenerated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to regenerate hook', 'error');
    } finally {
      setIsGeneratingHook(false);
    }
  };

  const handleGenerateBody = async () => {
    if (!post) return;
    setIsGeneratingBody(true);
    try {
      const updated = await generateBody(post._id);
      setPost(updated);
      setExpandedSection('body');
      addToast('Body generated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to generate body', 'error');
    } finally {
      setIsGeneratingBody(false);
    }
  };

  const handleRegenerateBody = async () => {
    if (!post) return;
    setIsGeneratingBody(true);
    try {
      const updated = await regenerateBody(post._id);
      setPost(updated);
      addToast('Body regenerated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to regenerate body', 'error');
    } finally {
      setIsGeneratingBody(false);
    }
  };

  const handleGenerateCTA = async () => {
    if (!post) return;
    setIsGeneratingCta(true);
    try {
      const updated = await generateCTA(post._id);
      setPost(updated);
      setExpandedSection('cta');
      addToast('CTA generated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to generate CTA', 'error');
    } finally {
      setIsGeneratingCta(false);
    }
  };

  const handleRegenerateCTA = async () => {
    if (!post) return;
    setIsGeneratingCta(true);
    try {
      const updated = await regenerateCTA(post._id);
      setPost(updated);
      addToast('CTA regenerated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to regenerate CTA', 'error');
    } finally {
      setIsGeneratingCta(false);
    }
  };

  const handleEditSection = async (section) => {
    if (!post) return;
    try {
      const updated = await updateSection(post._id, section, editText);
      setPost(updated);
      setEditingSection(null);
      setEditText('');
      addToast(`${section.charAt(0).toUpperCase() + section.slice(1)} updated`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update section', 'error');
    }
  };

  const handleApprovePost = async () => {
    if (!post) return;
    setIsApprovingPost(true);
    try {
      const updated = await approvePost(post._id);
      setPost(updated);
      addToast('Post approved!', 'success');

      // Move to next idea or stage 3
      if (currentIdeaIndex < approvedIdeas.length - 1) {
        setCurrentIdeaIndex((i) => i + 1);
        setPost(null);
        setExpandedSection('hook');
        setEditingSection(null);
      } else {
        setStage(3);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to approve post', 'error');
    } finally {
      setIsApprovingPost(false);
    }
  };

  const handleNextIdea = () => {
    if (currentIdeaIndex < approvedIdeas.length - 1) {
      setCurrentIdeaIndex((i) => i + 1);
      setPost(null);
      setExpandedSection('hook');
      setEditingSection(null);
    }
  };

  const sectionHasContent = (section) => {
    return post?.sections?.[section]?.trim();
  };

  // ─── Image handlers ──────────────────────────────────
  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !post) return;
    setIsUploadingImage(true);
    try {
      const updated = await uploadPostImage(post._id, file);
      setPost(updated);
      addToast('Image uploaded', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!post) return;
    setIsRemovingImage(true);
    try {
      const updated = await removePostImage(post._id);
      setPost(updated);
      addToast('Image removed', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to remove image', 'error');
    } finally {
      setIsRemovingImage(false);
    }
  };

  // ─── Render ──────────────────────────────────────────
  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <PenTool className="w-6 h-6 text-glow" />
            Content Studio
          </h1>
          <p className="text-sm text-highlight mt-1">
            {stage === 1 && 'Generate and approve content ideas'}
            {stage === 2 && 'Build your post section by section'}
            {stage === 3 && 'Review and schedule your post'}
          </p>
        </div>

        {/* Stage indicator */}
        <div className="flex items-center gap-2 text-xs">
          <StageDot active={stage === 1} done={stage > 1} label="Ideas" />
          <div className="w-6 h-px bg-highlight/20" />
          <StageDot active={stage === 2} done={stage > 2} label="Build" />
          <div className="w-6 h-px bg-highlight/20" />
          <StageDot active={stage === 3} done={false} label="Review" />
        </div>
      </div>

      {/* ────── STAGE 1: Idea Generation ────── */}
      {stage === 1 && (
        <>
          {/* Action bar */}
          <div className="flex items-center gap-3">
            {ideas.length > 0 && (
              <button
                onClick={handleContinueToPostBuilder}
                className="flex items-center gap-2 px-4 py-2.5 bg-glow text-white font-medium rounded-lg hover:bg-glow/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                Continue where you left off
              </button>
            )}
            <button
              onClick={handleGenerateIdeas}
              disabled={isGeneratingIdeas}
              className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isGeneratingIdeas ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGeneratingIdeas ? 'Generating...' : 'Generate Ideas'}
            </button>
          </div>

          {/* Ideas grid */}
          {isLoadingIdeas ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full" />
            </div>
          ) : ideas.length === 0 ? (
            <div className="bg-white border border-dashed border-highlight/30 rounded-2xl py-16 px-6 text-center">
              <Sparkles className="w-12 h-12 text-highlight/50 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-foreground mb-1">No ideas yet</h3>
              <p className="text-sm text-highlight mb-5 max-w-sm mx-auto">
                Generate fresh post ideas powered by your content strategy and AI.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ideas.map((idea) => (
                <div
                  key={idea._id}
                  className="bg-white border border-highlight/15 rounded-2xl p-5 flex flex-col"
                >
                  <div className="mb-1 flex items-center gap-2">
                    {idea.pillar && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border bg-glow/10 text-glow border-glow/20">
                        {idea.pillar}
                      </span>
                    )}
                    <span className="text-[10px] text-highlight">{formatDate(idea.createdAt)}</span>
                  </div>

                  <h3 className="text-[15px] font-semibold text-foreground leading-snug mt-2">
                    {idea.topic}
                  </h3>

                  {idea.angle && (
                    <p className="text-sm text-secondary mt-2 leading-relaxed flex-1">
                      {idea.angle}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-highlight/10">
                    <button
                      onClick={() => handleApproveIdea(idea._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded-md transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeleteIdea(idea._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generate overlay */}
          {isGeneratingIdeas && (
            <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white rounded-2xl px-8 py-7 shadow-2xl flex flex-col items-center gap-4">
                <Loader2 className="w-7 h-7 text-glow animate-spin" />
                <div className="text-center">
                  <h3 className="text-base font-semibold text-foreground">Generating ideas...</h3>
                  <p className="text-sm text-highlight mt-1">AI is brainstorming based on your strategy.</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ────── STAGE 2: Post Builder ────── */}
      {stage === 2 && (
        <>
          {/* Idea context bar */}
          {currentIdea && (
            <div className="bg-white border border-highlight/15 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {currentIdea.pillar && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border bg-glow/10 text-glow border-glow/20">
                        {currentIdea.pillar}
                      </span>
                    )}
                    <span className="text-[10px] text-highlight">
                      Idea {currentIdeaIndex + 1} of {approvedIdeas.length}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-foreground">{currentIdea.topic}</h2>
                  {currentIdea.angle && (
                    <p className="text-sm text-secondary mt-1">{currentIdea.angle}</p>
                  )}
                </div>
                <button
                  onClick={() => setStage(1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-md transition-colors shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              </div>
            </div>
          )}

          {/* No post yet — generate hook */}
          {!post && (
            <div className="bg-white border border-dashed border-highlight/30 rounded-2xl py-16 px-6 text-center">
              <PenTool className="w-12 h-12 text-highlight/50 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-foreground mb-1">Start building your post</h3>
              <p className="text-sm text-highlight mb-5 max-w-sm mx-auto">
                Generate a scroll-stopping hook first. Body and CTA come next.
              </p>
              <button
                onClick={handleGenerateHook}
                disabled={isGeneratingHook}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {isGeneratingHook ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGeneratingHook ? 'Generating...' : 'Generate Hook'}
              </button>
            </div>
          )}

          {/* Sections */}
          {post && (
            <div className="space-y-4">
              {/* Hook Section */}
              <SectionCard
                title="Hook"
                sectionKey="hook"
                content={post.sections?.hook}
                isExpanded={expandedSection === 'hook'}
                isLocked={false}
                isLoading={isGeneratingHook}
                editingSection={editingSection}
                editText={editText}
                onToggle={() => setExpandedSection(expandedSection === 'hook' ? null : 'hook')}
                onRegenerate={handleRegenerateHook}
                onStartEdit={() => {
                  setEditingSection('hook');
                  setEditText(post.sections?.hook || '');
                }}
                onEditChange={setEditText}
                onSaveEdit={() => handleEditSection('hook')}
                onCancelEdit={() => { setEditingSection(null); setEditText(''); }}
              />

              {/* Body Section */}
              <SectionCard
                title="Body"
                sectionKey="body"
                content={post.sections?.body}
                isExpanded={expandedSection === 'body'}
                isLocked={!sectionHasContent('hook')}
                isLoading={isGeneratingBody}
                editingSection={editingSection}
                editText={editText}
                onToggle={() => setExpandedSection(expandedSection === 'body' ? null : 'body')}
                onGenerate={handleGenerateBody}
                onRegenerate={handleRegenerateBody}
                onStartEdit={() => {
                  setEditingSection('body');
                  setEditText(post.sections?.body || '');
                }}
                onEditChange={setEditText}
                onSaveEdit={() => handleEditSection('body')}
                onCancelEdit={() => { setEditingSection(null); setEditText(''); }}
              />

              {/* CTA Section */}
              <SectionCard
                title="CTA"
                sectionKey="cta"
                content={post.sections?.cta}
                isExpanded={expandedSection === 'cta'}
                isLocked={!sectionHasContent('body')}
                isLoading={isGeneratingCta}
                editingSection={editingSection}
                editText={editText}
                onToggle={() => setExpandedSection(expandedSection === 'cta' ? null : 'cta')}
                onGenerate={handleGenerateCTA}
                onRegenerate={handleRegenerateCTA}
                onStartEdit={() => {
                  setEditingSection('cta');
                  setEditText(post.sections?.cta || '');
                }}
                onEditChange={setEditText}
                onSaveEdit={() => handleEditSection('cta')}
                onCancelEdit={() => { setEditingSection(null); setEditText(''); }}
              />

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleNextIdea}
                    disabled={currentIdeaIndex >= approvedIdeas.length - 1}
                    className="px-4 py-2.5 text-sm font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Skip to next idea
                  </button>
                </div>

                <button
                  onClick={handleApprovePost}
                  disabled={
                    !sectionHasContent('hook') ||
                    !sectionHasContent('body') ||
                    !sectionHasContent('cta') ||
                    isApprovingPost
                  }
                  className="flex items-center gap-2 px-6 py-2.5 bg-glow text-white font-medium rounded-lg hover:bg-glow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApprovingPost ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {isApprovingPost ? 'Approving...' : 'Approve Post'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ────── STAGE 3: Review & Schedule ────── */}
      {stage === 3 && post && (
        <>
          <div className="bg-white border border-highlight/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-glow" />
              <h2 className="text-base font-bold text-foreground">Post Preview</h2>
            </div>
            <div className="bg-[#F5F5F7] rounded-xl p-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground font-sans">
              {post.content || assemblePreview(post.sections?.hook, post.sections?.body, post.sections?.cta)}
            </div>
          </div>

          {/* Image Section */}
          <div className="bg-white border border-highlight/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-glow" />
              <h2 className="text-base font-bold text-foreground">Image</h2>
            </div>

            {post.image?.url ? (
              <div className="space-y-3">
                <img
                  src={post.image.url}
                  alt="Post image"
                  className="max-h-64 w-full object-contain rounded-lg border border-highlight/15 bg-[#F5F5F7]"
                />
                <button
                  onClick={handleRemoveImage}
                  disabled={isRemovingImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors disabled:opacity-50"
                >
                  {isRemovingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  {isRemovingImage ? 'Removing...' : 'Remove image'}
                </button>
              </div>
            ) : (
              <div>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-highlight/10 hover:bg-highlight/20 rounded-lg cursor-pointer transition-colors text-sm font-medium text-secondary w-fit">
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Upload image
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUploadImage}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-highlight mt-2">Optional. JPEG, PNG, or WebP.</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-highlight/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-5 h-5 text-glow" />
              <h2 className="text-base font-bold text-foreground">Schedule</h2>
            </div>

            <div className="max-w-xs">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Schedule for (optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              className="px-5 py-2.5 text-sm font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 inline mr-1.5" />
              Save as Draft
            </button>
            <button
              disabled={!scheduledDate}
              className="flex items-center gap-2 px-6 py-2.5 bg-glow text-white font-medium rounded-lg hover:bg-glow/90 transition-colors disabled:opacity-50"
            >
              <CalendarClock className="w-4 h-4" />
              {scheduledDate ? 'Schedule' : 'No date set'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────

function StageDot({ active, done, label }) {
  return (
    <div className={`flex items-center gap-1.5 ${active ? 'text-glow' : done ? 'text-emerald-600' : 'text-highlight'}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          active ? 'bg-glow' : done ? 'bg-emerald-500' : 'bg-highlight/40'
        }`}
      />
      <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
    </div>
  );
}

function SectionCard({
  title,
  sectionKey,
  content,
  isExpanded,
  isLocked,
  isLoading,
  editingSection,
  editText,
  onToggle,
  onGenerate,
  onRegenerate,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
}) {
  const isEditing = editingSection === sectionKey;

  return (
    <div className="bg-white border border-highlight/15 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        disabled={isLocked}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-highlight/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-highlight" />
          ) : (
            <ChevronRight className="w-4 h-4 text-highlight" />
          )}
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {isLocked && (
            <span className="text-[10px] text-highlight bg-highlight/10 px-2 py-0.5 rounded-md">
              Locked
            </span>
          )}
          {content?.trim() && !isLocked && (
            <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Done
            </span>
          )}
        </div>

        {!isLocked && content?.trim() && (
          <div className="flex items-center gap-2">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onRegenerate();
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-md transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </span>
          </div>
        )}
      </button>

      {/* Content */}
      {isExpanded && !isLocked && (
        <div className="px-5 pb-5 border-t border-highlight/10 pt-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editText}
                onChange={(e) => onEditChange(e.target.value)}
                rows={sectionKey === 'hook' ? 3 : sectionKey === 'cta' ? 3 : 6}
                className="w-full px-4 py-3 text-sm border border-highlight/20 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors font-sans leading-relaxed"
                autoFocus
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1.5 text-xs font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onSaveEdit}
                  className="px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : content?.trim() ? (
            <div className="space-y-3">
              <div className="bg-[#F5F5F7] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onStartEdit}
                  className="px-3 py-1.5 text-xs font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-md transition-colors"
                >
                  Edit
                </button>
                {onGenerate && (
                  <button
                    onClick={onRegenerate}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-md transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Regenerating...' : 'Regenerate'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-highlight mb-3">No {title.toLowerCase()} yet.</p>
              {onGenerate ? (
                <button
                  onClick={onGenerate}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 text-sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isLoading ? 'Generating...' : `Generate ${title}`}
                </button>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
