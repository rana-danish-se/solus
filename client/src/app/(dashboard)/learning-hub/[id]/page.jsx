'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit3, Trash2, Sparkles, FileText, Link2, Calendar, Hash, Lightbulb } from 'lucide-react';
import { fetchNoteById, deleteNote } from '@/services/notes.service';
import useToastStore from '@/store/toastStore';

const TYPE_STYLES = {
  concept: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  snippet: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  prompt: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  framework: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  insight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const addToast = useToastStore((state) => state.addToast);

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const data = await fetchNoteById(id);
        if (mounted) setNote(data);
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load note', 'error');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, addToast]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this note permanently? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deleteNote(id);
      addToast('Note deleted', 'success');
      router.push('/learning-hub');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete note', 'error');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <p className="text-secondary">Note not found.</p>
        <button
          onClick={() => router.push('/learning-hub')}
          className="mt-4 text-sm text-glow hover:underline"
        >
          Back to Learning Hub
        </button>
      </div>
    );
  }

  const badgeClass = TYPE_STYLES[note.type] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  const created = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '';

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <button
        onClick={() => router.push('/learning-hub')}
        className="flex items-center gap-1.5 text-sm text-highlight hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Hub
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${badgeClass}`}
            >
              {note.type}
            </span>
            {created && (
              <span className="flex items-center gap-1 text-xs text-highlight">
                <Calendar className="w-3 h-3" />
                {created}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {note.title}
          </h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => router.push(`/learning-hub/${id}/edit`)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Original Content */}
        <div className="lg:col-span-3 space-y-4">
          <Section icon={FileText} title="Original Content">
            <div className="bg-white border border-highlight/15 rounded-2xl p-5">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-mono">
                {note.content}
              </p>
            </div>
          </Section>

          {note.source && (
            <Section icon={Link2} title="Source">
              <div className="bg-white border border-highlight/15 rounded-2xl p-4 flex items-center gap-2 text-sm text-secondary break-all">
                <Link2 className="w-4 h-4 text-highlight flex-shrink-0" />
                {note.source.startsWith('http') ? (
                  <a
                    href={note.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-glow hover:underline"
                  >
                    {note.source}
                  </a>
                ) : (
                  <span>{note.source}</span>
                )}
              </div>
            </Section>
          )}
        </div>

        {/* Right: AI Generated */}
        <div className="lg:col-span-2 space-y-4">
          <Section icon={Sparkles} title="AI Summary" accent>
            <div className="bg-gradient-to-br from-glow/5 to-accent/5 border border-glow/20 rounded-2xl p-5">
              <p className="text-sm text-foreground leading-relaxed">
                {note.summary || 'No summary generated.'}
              </p>
            </div>
          </Section>

          <Section icon={Lightbulb} title="Key Takeaways">
            <div className="bg-white border border-highlight/15 rounded-2xl p-5">
              {note.takeaways?.length ? (
                <ul className="space-y-2.5">
                  {note.takeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-glow flex-shrink-0" />
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-highlight">No takeaways generated.</p>
              )}
            </div>
          </Section>

          <Section icon={Hash} title="Tags">
            <div className="bg-white border border-highlight/15 rounded-2xl p-5">
              {note.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-md transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-highlight">No tags generated.</p>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, accent = false }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <Icon className={`w-4 h-4 ${accent ? 'text-glow' : 'text-highlight'}`} />
        <h2 className={`text-xs font-semibold uppercase tracking-wider ${accent ? 'text-glow' : 'text-highlight'}`}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
