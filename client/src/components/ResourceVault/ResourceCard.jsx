'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit3, Trash2, ExternalLink, Globe } from 'lucide-react';
import { deleteResource } from '@/services/resources.service';
import useToastStore from '@/store/toastStore';

const CATEGORY_STYLES = {
  'AI Tools': 'bg-glow/10 text-glow border-glow/20',
  'Dev Tools': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Learning: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Freelancing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'Job Search': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Productivity: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  Marketing: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  Design: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  Utilities: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  'SaaS Inspiration': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
};

export default function ResourceCard({ resource, onDeleted }) {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const [faviconError, setFaviconError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { _id, url, title, siteName, favicon, description, category, tags = [] } = resource;

  const badgeClass =
    CATEGORY_STYLES[category] || 'bg-highlight/10 text-secondary border-highlight/20';

  const handleEdit = (e) => {
    e.stopPropagation();
    router.push(`/resource-vault/${_id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this resource permanently? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deleteResource(_id);
      addToast('Resource deleted', 'success');
      if (onDeleted) onDeleted(_id);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete resource', 'error');
      setIsDeleting(false);
    }
  };

  return (
    <div className="group bg-white border border-highlight/15 rounded-2xl p-5 hover:border-glow/40 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Header: favicon + title + siteName */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-highlight/10 flex items-center justify-center overflow-hidden">
          {favicon && !faviconError ? (
            <Image
              src={favicon}
              alt={`${siteName || 'site'} favicon`}
              width={24}
              height={24}
              className="object-contain"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <Globe className="w-5 h-5 text-highlight" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] font-semibold text-foreground leading-snug line-clamp-2 hover:text-glow transition-colors flex items-start gap-1.5"
          >
            <span className="break-words">{title || url}</span>
            <ExternalLink className="w-3.5 h-3.5 text-highlight flex-shrink-0 mt-0.5" />
          </a>
          {siteName && (
            <p className="text-xs text-highlight mt-0.5 truncate">{siteName}</p>
          )}
        </div>
      </div>

      {/* Body: description */}
      {description && (
        <p className="text-sm text-secondary leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>
      )}

      {/* Category + Tags */}
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        {category && (
          <span
            className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${badgeClass}`}
          >
            {category}
          </span>
        )}
        {tags.slice(0, 3).map((tag, i) => (
          <span
            key={i}
            className="px-2 py-0.5 text-[10px] font-medium text-secondary bg-highlight/10 rounded-md"
          >
            #{tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-0.5 text-[10px] font-medium text-highlight">
            +{tags.length - 3}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-highlight/10">
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-md transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
