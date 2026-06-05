'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Archive } from 'lucide-react';
import ResourceCard from '@/components/ResourceVault/ResourceCard';
import { fetchResources } from '@/services/resources.service';
import { RESOURCE_CATEGORIES } from '@/lib/resourceConstants';
import useToastStore from '@/store/toastStore';

const DEBOUNCE_MS = 350;

export default function ResourceVaultPage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);

  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const params = {};
        if (categoryFilter !== 'all') params.category = categoryFilter;
        if (tagFilter !== 'all') params.tag = tagFilter;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        const data = await fetchResources(params);
        if (mounted) setResources(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) {
          addToast(err.response?.data?.message || err.message || 'Failed to load resources', 'error');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [addToast, categoryFilter, tagFilter, debouncedSearch]);

  const availableTags = useMemo(() => {
    const set = new Set();
    resources.forEach((r) => (r.tags || []).forEach((t) => set.add(t)));
    return ['all', ...Array.from(set).sort()];
  }, [resources]);

  const handleDeleted = (id) => {
    setResources((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Archive className="w-6 h-6 text-glow" />
            Resource Vault
          </h1>
          <p className="text-sm text-highlight mt-1">
            Your collection of tools, articles, and references. Never lose a useful link.
          </p>
        </div>
        <button
          onClick={() => router.push('/resource-vault/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-10 bg-white/90 backdrop-blur-md border border-highlight/15 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-highlight absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
          />
        </div>

        <div className="relative sm:w-52">
          <Filter className="w-4 h-4 text-highlight absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-highlight/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
          >
            <option value="all">All Categories</option>
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="relative sm:w-48">
          <Filter className="w-4 h-4 text-highlight absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-highlight/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
          >
            {availableTags.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All Tags' : `#${t}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      {!isLoading && resources.length > 0 && (
        <div className="flex items-center justify-between text-xs text-highlight px-1">
          <span>
            {resources.length} {resources.length === 1 ? 'resource' : 'resources'} saved
          </span>
          {(search.trim() || categoryFilter !== 'all' || tagFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setTagFilter('all');
              }}
              className="text-glow hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full"></div>
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          hasResources={false}
          onCreate={() => router.push('/resource-vault/new')}
          hasFilters={Boolean(search.trim() || categoryFilter !== 'all' || tagFilter !== 'all')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasResources, onCreate, hasFilters }) {
  return (
    <div className="bg-white border border-dashed border-highlight/30 rounded-2xl py-16 px-6 text-center">
      <Archive className="w-12 h-12 text-highlight/50 mx-auto mb-4" />
      <h3 className="text-base font-semibold text-foreground mb-1">
        {hasResources
          ? 'No resources match your filters'
          : hasFilters
            ? 'No resources match your filters'
            : 'Your vault is empty'}
      </h3>
      <p className="text-sm text-highlight mb-5 max-w-sm mx-auto">
        {hasFilters
          ? 'Try adjusting your search or filter to see more results.'
          : 'Save useful tools, articles, and references. AI will fetch metadata for you.'}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add your first resource
        </button>
      )}
    </div>
  );
}
