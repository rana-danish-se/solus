'use client';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, X, Save } from 'lucide-react';
import { getContentStrategies, updateContentStrategy } from '@/services/contentStrategy.service';
import useToastStore from '@/store/toastStore';

const PLATFORMS = ['linkedin'];

export default function ContentStrategySection() {
  const addToast = useToastStore((state) => state.addToast);

  const [strategies, setStrategies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [newPillar, setNewPillar] = useState('');
  const [newAvoidTopic, setNewAvoidTopic] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getContentStrategies();
        if (!mounted) return;
        const map = {};
        const arr = Array.isArray(data) ? data : [];
        for (const s of arr) {
          map[s.platform] = s;
        }
        setStrategies(map);
      } catch {
        // silent
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getField = useCallback(
    (platform, field, fallback = '') => {
      return strategies[platform]?.[field] ?? fallback;
    },
    [strategies]
  );

  const updateField = useCallback(
    (platform, field, value) => {
      setStrategies((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          platform,
          [field]: value,
        },
      }));
    },
    []
  );

  const addArrayItem = useCallback(
    (platform, field, value) => {
      if (!value.trim()) return;
      const arr = getField(platform, field, []);
      if (arr.includes(value.trim())) return;
      updateField(platform, field, [...arr, value.trim()]);
    },
    [getField, updateField]
  );

  const removeArrayItem = useCallback(
    (platform, field, index) => {
      const arr = getField(platform, field, []);
      updateField(
        platform,
        field,
        arr.filter((_, i) => i !== index)
      );
    },
    [getField, updateField]
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const platform of PLATFORMS) {
        const data = strategies[platform];
        if (data) {
          await updateContentStrategy(platform, data);
        }
      }
      addToast('Content strategy saved', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save content strategy', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="border-b border-highlight/15 pb-2 mb-6">
          <h3 className="text-xs font-bold text-highlight tracking-widest uppercase">Content Strategy</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-highlight">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading strategy...
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="border-b border-highlight/15 pb-2 mb-6 flex items-center justify-between">
        <h3 className="text-xs font-bold text-highlight tracking-widest uppercase">Content Strategy</h3>
      </div>

      {PLATFORMS.map((platform) => {
        const label = platform.charAt(0).toUpperCase() + platform.slice(1);
        const pillars = getField(platform, 'pillars', []);
        const avoidTopics = getField(platform, 'avoidTopics', []);

        return (
          <div key={platform} className="mb-8 last:mb-0">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-glow" />
              {label}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Audience */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Target Audience</label>
                <textarea
                  value={getField(platform, 'audience')}
                  onChange={(e) => updateField(platform, 'audience', e.target.value)}
                  placeholder="e.g. Tech founders, AI engineers, SaaS builders..."
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors resize-y"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Tone</label>
                <input
                  type="text"
                  value={getField(platform, 'tone')}
                  onChange={(e) => updateField(platform, 'tone', e.target.value)}
                  placeholder="e.g. Direct, conversational, optimistic"
                  className="w-full px-3 py-2 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
                />
              </div>

              {/* Format Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Format Notes</label>
                <textarea
                  value={getField(platform, 'formatNotes')}
                  onChange={(e) => updateField(platform, 'formatNotes', e.target.value)}
                  placeholder="e.g. Short paragraphs, bullet points, personal stories preferred..."
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors resize-y"
                />
              </div>

              {/* Max posts per week */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Max Posts / Week</label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={getField(platform, 'maxPostsPerWeek', 4)}
                  onChange={(e) => updateField(platform, 'maxPostsPerWeek', parseInt(e.target.value) || 4)}
                  className="w-full px-3 py-2 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
                />
              </div>

              {/* Preferred posting time */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Posting Time</label>
                <input
                  type="time"
                  value={getField(platform, 'preferredPostingTime')}
                  onChange={(e) => updateField(platform, 'preferredPostingTime', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
                />
              </div>
            </div>

            {/* Pillars */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-foreground mb-1.5">Content Pillars</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {pillars.map((p, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-glow/10 text-glow text-xs font-medium rounded-md">
                    {p}
                    <button onClick={() => removeArrayItem(platform, 'pillars', i)} className="hover:text-glow/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPillar}
                  onChange={(e) => setNewPillar(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem(platform, 'pillars', newPillar);
                      setNewPillar('');
                    }
                  }}
                  placeholder="Add a pillar (e.g. AI Tutorials)"
                  className="flex-1 px-3 py-2 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
                />
                <button
                  onClick={() => {
                    addArrayItem(platform, 'pillars', newPillar);
                    setNewPillar('');
                  }}
                  className="px-3 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Avoid Topics */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-foreground mb-1.5">Topics to Avoid</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {avoidTopics.map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 text-xs font-medium rounded-md">
                    {t}
                    <button onClick={() => removeArrayItem(platform, 'avoidTopics', i)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAvoidTopic}
                  onChange={(e) => setNewAvoidTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem(platform, 'avoidTopics', newAvoidTopic);
                      setNewAvoidTopic('');
                    }
                  }}
                  placeholder="Add a topic to avoid (e.g. Politics)"
                  className="flex-1 px-3 py-2 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
                />
                <button
                  onClick={() => {
                    addArrayItem(platform, 'avoidTopics', newAvoidTopic);
                    setNewAvoidTopic('');
                  }}
                  className="px-3 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-6 pt-4 border-t border-highlight/10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 text-sm"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Strategy'}
        </button>
      </div>
    </section>
  );
}
