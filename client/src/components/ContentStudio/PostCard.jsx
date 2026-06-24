'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { deletePost } from '@/services/content.service';
import useToastStore from '@/store/toastStore';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  pending_approval: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-indigo-100 text-indigo-700',
  published: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  draft: 'Draft',
  pending_approval: 'Pending Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  failed: 'Failed',
};

export default function PostCard({ post, onClick, showStage = false, onDelete }) {
  const addToast = useToastStore((state) => state.addToast);
  const [isDeleting, setIsDeleting] = useState(false);

  const previewText = post.sections?.hook?.slice(0, 100) || post.ideaId?.topic?.slice(0, 100) || 'No content yet';
  
  async function handleDelete(e) {
    e.stopPropagation();
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deletePost(post._id);
      addToast('Post deleted', 'success');
      onDelete?.(post._id);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
    }
  }
  
  let stageText = '';
  if (showStage && post.status !== 'published') {
    const hasHook = post.sections?.hook?.trim();
    const hasBody = post.sections?.body?.trim();
    const hasCta = post.sections?.cta?.trim();
    
    if (!hasHook) stageText = 'Awaiting Hook';
    else if (!hasBody) stageText = 'Hook done, Awaiting Body';
    else if (!hasCta) stageText = 'Body done, Awaiting CTA';
    else stageText = 'Ready to Approve';
  }

  const isPublished = post.status === 'published';
  const dateToShow = isPublished ? post.publishedAt : post.scheduledAt || post.updatedAt || post.createdAt;
  const formattedDate = dateToShow ? format(new Date(dateToShow), 'MMM d, yyyy h:mm a') : '';

  return (
    <button
      onClick={() => onClick?.(post)}
      className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 min-w-[280px] max-w-[320px] flex flex-col text-left"
      style={{ cursor: 'pointer' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        {post.pillar && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-glow/10 text-glow border border-glow/20 shrink-0">
            {post.pillar}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${STATUS_COLORS[post.status] || STATUS_COLORS.draft}`}>
            {STATUS_LABELS[post.status] || post.status}
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-highlight hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
            title="Delete post"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-glow border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-foreground leading-relaxed mb-2 flex-1 line-clamp-3">
        {previewText}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {showStage && stageText && (
          <span className="text-[11px] text-highlight bg-highlight/10 px-2 py-0.5 rounded-md">
            {stageText}
          </span>
        )}
        {formattedDate && (
          <span className="text-[11px] text-highlight flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </span>
        )}
      </div>
    </button>
  );
}