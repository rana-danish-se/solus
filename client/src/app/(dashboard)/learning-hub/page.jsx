'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';
import NoteCard from '@/components/Learning/NoteCard';
import { fetchNotes } from '@/services/notes.service';
import useToastStore from '@/store/toastStore';

const TYPES = ['all', 'concept', 'snippet', 'prompt', 'framework', 'insight'];

export default function LearningHubPage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchNotes();
        if (mounted) setNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        addToast(err.message || 'Failed to load notes', 'error');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [addToast]);

  const filteredNotes = useMemo(() => {
    let result = notes;
    if (typeFilter !== 'all') {
      result = result.filter((n) => n.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q)) ||
          n.summary?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [notes, typeFilter, search]);

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-glow" />
            Learning Hub
          </h1>
          <p className="text-sm text-highlight mt-1">
            Your second brain. Store, summarize, and search your knowledge.
          </p>
        </div>
        <button
          onClick={() => router.push('/learning-hub/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-highlight/15 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-highlight absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, tag, or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
          />
        </div>

        {/* Type Filter */}
        <div className="relative sm:w-52">
          <Filter className="w-4 h-4 text-highlight absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-highlight/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full"></div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <EmptyState hasNotes={notes.length > 0} onCreate={() => router.push('/learning-hub/new')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasNotes, onCreate }) {
  return (
    <div className="bg-white border border-dashed border-highlight/30 rounded-2xl py-16 px-6 text-center">
      <BookOpen className="w-12 h-12 text-highlight/50 mx-auto mb-4" />
      <h3 className="text-base font-semibold text-foreground mb-1">
        {hasNotes ? 'No notes match your filters' : 'Your knowledge base is empty'}
      </h3>
      <p className="text-sm text-highlight mb-5 max-w-sm mx-auto">
        {hasNotes
          ? 'Try adjusting your search or type filter to see more results.'
          : 'Capture what you learn. AI will summarize, tag, and organize it for you.'}
      </p>
      {!hasNotes && (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create your first note
        </button>
      )}
    </div>
  );
}
