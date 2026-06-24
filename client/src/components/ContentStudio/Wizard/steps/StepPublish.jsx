'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Send, CalendarClock, Loader2, Check } from 'lucide-react';
import { approvePost, publishPost } from '@/services/content.service';
import useToastStore from '@/store/toastStore';

function assemblePreview(post) {
  if (post?.content) return post.content;
  const parts = [post?.sections?.hook, post?.sections?.body, post?.sections?.cta].filter(Boolean);
  return parts.join('\n\n');
}

export default function StepPublish({ postId, post: initialPost, onComplete, onBack }) {
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();

  const [mode, setMode] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const previewText = assemblePreview(initialPost);
  const imageUrl = initialPost?.image?.url;

  async function handlePublish(scheduledAt = null) {
    if (!postId) return;
    setIsPublishing(true);
    try {
      await approvePost(postId);
      await publishPost(postId, scheduledAt);
      const msg = scheduledAt ? 'Post scheduled successfully' : 'Post published successfully';
      addToast(msg, 'success');
      router.push('/content-studio');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to publish post', 'error');
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-lg font-bold text-foreground mb-1">Review & Publish</h2>
      <p className="text-sm text-highlight mb-6">Final preview before going live.</p>

      {/* Preview card */}
      <div className="bg-[#F5F5F7] rounded-xl p-5 mb-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {previewText}
      </div>

      {imageUrl && (
        <div className="mb-6">
          <p className="text-xs text-highlight mb-2 font-semibold uppercase tracking-wider">Image</p>
          <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200 bg-[#F5F5F7]">
            <Image
              src={imageUrl}
              alt="Post image"
              fill
              className="object-contain"
              sizes="(max-width: 672px) 100vw, 672px"
            />
          </div>
        </div>
      )}

      {mode === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('publish')}
            className="bg-white border-2 border-glow/30 hover:border-glow rounded-xl p-6 text-left transition-all duration-200 hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-glow/10 flex items-center justify-center mb-3">
              <Send className="w-5 h-5 text-glow" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">Publish Now</h3>
            <p className="text-xs text-highlight leading-relaxed">
              Post goes live on LinkedIn immediately.
            </p>
          </button>

          <button
            onClick={() => setMode('schedule')}
            className="bg-white border-2 border-dashed border-gray-200 hover:border-glow/40 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center mb-3">
              <CalendarClock className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">Schedule</h3>
            <p className="text-xs text-highlight leading-relaxed">
              Choose a date and time for automatic publishing.
            </p>
          </button>
        </div>
      )}

      {mode === 'publish' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-sm text-amber-800">
              This will post to LinkedIn immediately. Make sure everything looks right.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMode(null)}
              className="text-sm text-highlight hover:text-foreground transition-colors"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode(null)}
                className="px-4 py-2 border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePublish()}
                disabled={isPublishing}
                className="flex items-center gap-2 px-5 py-2 bg-glow text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
              >
                {isPublishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isPublishing ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'schedule' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Schedule date & time
            </label>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMode(null)}
              className="text-sm text-highlight hover:text-foreground transition-colors"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode(null)}
                className="px-4 py-2 border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePublish(scheduleDate)}
                disabled={!scheduleDate || isPublishing}
                className="flex items-center gap-2 px-5 py-2 bg-glow text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
              >
                {isPublishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CalendarClock className="w-4 h-4" />
                )}
                {isPublishing ? 'Scheduling...' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}