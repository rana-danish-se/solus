'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ tags = [], onChange, placeholder = 'Type a tag and press Enter' }) {
  const [input, setInput] = useState('');

  const addTag = (raw) => {
    const value = raw.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setInput('');
      return;
    }
    onChange([...tags, value]);
    setInput('');
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="w-full px-3 py-2 bg-background border border-highlight/20 rounded-lg focus-within:ring-2 focus-within:ring-glow/30 focus-within:border-glow transition-colors flex flex-wrap items-center gap-2 min-h-[44px]">
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-secondary bg-highlight/10 rounded-md"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-highlight hover:text-foreground transition-colors"
            aria-label={`Remove ${tag}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-highlight py-1"
      />
    </div>
  );
}
