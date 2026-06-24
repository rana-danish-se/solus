'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { getPosts, getIdeas } from '@/services/content.service';
import PostCard from '@/components/ContentStudio/PostCard';
import EmptySection from '@/components/ContentStudio/EmptySection';
import useToastStore from '@/store/toastStore';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LoadingSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="min-w-[280px] max-w-[320px] bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse shrink-0">
          <div className="flex gap-2 mb-3">
            <div className="h-4 w-16 bg-gray-200 rounded-full" />
            <div className="h-4 w-14 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

function Section({ title, posts, isLoading, emptyMessage, cardProps = {}, onDelete }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs uppercase tracking-wider text-highlight font-semibold">{title}</h2>
        <span className="text-[11px] text-highlight bg-highlight/10 px-2 py-0.5 rounded-full">{posts.length}</span>
      </div>
      {isLoading ? (
        <LoadingSkeleton />
      ) : posts.length === 0 ? (
        <EmptySection message={emptyMessage} />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} {...cardProps} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ContentStudioDashboard() {
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();

  const [allPosts, setAllPosts] = useState([]);
  const [pendingIdeasCount, setPendingIdeasCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [previewPost, setPreviewPost] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [posts, ideas] = await Promise.all([
          getPosts(),
          getIdeas({ status: 'pending' }),
        ]);
        if (mounted) {
          setAllPosts(Array.isArray(posts) ? posts : []);
          setPendingIdeasCount(Array.isArray(ideas) ? ideas.length : 0);
        }
      } catch (err) {
        if (mounted) {
          addToast(err.response?.data?.message || 'Failed to load content', 'error');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [addToast]);

  const inProgressPosts = allPosts.filter((p) =>
    ['draft', 'pending_approval', 'approved'].includes(p.status)
  );
  const scheduledPosts = allPosts.filter((p) => p.status === 'scheduled');
  const publishedPosts = allPosts.filter((p) => p.status === 'published');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Content Studio</h1>
          {pendingIdeasCount > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-glow/10 text-glow border border-glow/20">
              {pendingIdeasCount} idea{pendingIdeasCount !== 1 ? 's' : ''} waiting
            </span>
          )}
        </div>
        <button
          onClick={() => router.push('/content-studio/new')}
          className="flex items-center gap-2 px-4 py-2 bg-glow text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* In Progress */}
      <Section
        title="In Progress"
        posts={inProgressPosts}
        isLoading={isLoading}
        emptyMessage="No posts in progress. Start a new post to begin."
        cardProps={{
          showStage: true,
          onClick: (post) => router.push(`/content-studio/${post._id}`),
        }}
        onDelete={(postId) => setAllPosts((prev) => prev.filter((p) => p._id !== postId))}
      />

      {/* Scheduled */}
      <Section
        title="Scheduled"
        posts={scheduledPosts}
        isLoading={isLoading}
        emptyMessage="No scheduled posts. Approve and schedule a post to see it here."
        onDelete={(postId) => setAllPosts((prev) => prev.filter((p) => p._id !== postId))}
      />

      {/* Published */}
      <Section
        title="Published"
        posts={publishedPosts}
        isLoading={isLoading}
        emptyMessage="No published posts yet."
        cardProps={{
          onClick: (post) => setPreviewPost(post),
        }}
        onDelete={(postId) => {
          setAllPosts((prev) => prev.filter((p) => p._id !== postId));
          if (previewPost?._id === postId) setPreviewPost(null);
        }}
      />

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-start justify-center pt-[10vh]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] mx-4 max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Post Preview</h3>
                {previewPost.status && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-100 text-emerald-700">
                    Published
                  </span>
                )}
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="p-1.5 text-highlight hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto flex-1">
              {previewPost.publishedAt && (
                <p className="text-xs text-highlight mb-4 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Published {formatDate(previewPost.publishedAt)}
                </p>
              )}
              <div className="bg-[#F5F5F7] rounded-xl p-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground font-sans">
                {previewPost.content || [previewPost.sections?.hook, previewPost.sections?.body, previewPost.sections?.cta].filter(Boolean).join('\n\n')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}