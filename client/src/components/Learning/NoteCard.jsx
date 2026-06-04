'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

const TYPE_STYLES = {
  concept: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  snippet: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  prompt: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  framework: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  insight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

export default function NoteCard({ note }) {
  const router = useRouter();
  const { _id, title, summary, type, tags = [] } = note;

  const badgeClass = TYPE_STYLES[type] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';

  const handleClick = () => {
    router.push(`/learning-hub/${_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-highlight/15 rounded-2xl p-5 cursor-pointer hover:border-glow/40 hover:shadow-md transition-all duration-200 flex flex-col h-full"
    >
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="text-[15px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-glow transition-colors">
          {title}
        </h3>
        <span
          className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${badgeClass} flex-shrink-0`}
        >
          {type}
        </span>
      </div>

      <p className="text-sm text-secondary leading-relaxed line-clamp-3 mb-4 flex-1">
        {summary || 'No summary available.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-highlight/10">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
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
        <ArrowRight className="w-4 h-4 text-highlight group-hover:text-glow group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </div>
  );
}
