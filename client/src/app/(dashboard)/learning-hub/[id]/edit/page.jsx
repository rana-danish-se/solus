'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Edit3, Loader2 } from 'lucide-react';
import { fetchNoteById, updateNote } from '@/services/notes.service';
import useToastStore from '@/store/toastStore';

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const addToast = useToastStore((state) => state.addToast);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const data = await fetchNoteById(id);
        if (mounted) {
          setTitle(data.title || '');
          setContent(data.content || '');
          setSource(data.source || '');
        }
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load note', 'error');
        router.push('/learning-hub');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, addToast, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      addToast('Title and content are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await updateNote(id, {
        title: title.trim(),
        content: content.trim(),
        source: source.trim(),
      });
      addToast('Note updated', 'success');
      router.push(`/learning-hub/${id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update note', 'error');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <button
        onClick={() => router.push(`/learning-hub/${id}`)}
        className="flex items-center gap-1.5 text-sm text-highlight hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-glow" />
          Edit Note
        </h1>
        <p className="text-sm text-highlight mt-1">
          Update your note. AI-generated fields (summary, type, tags, takeaways) are not reprocessed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
            disabled={isSaving}
            required
          />
        </Field>

        <Field label="Content" required>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full px-4 py-3 text-sm border border-highlight/20 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors font-mono leading-relaxed"
            disabled={isSaving}
            required
          />
        </Field>

        <Field label="Source (optional)">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="URL, book name, or where you learned this"
            className="w-full px-4 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
            disabled={isSaving}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push(`/learning-hub/${id}`)}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
