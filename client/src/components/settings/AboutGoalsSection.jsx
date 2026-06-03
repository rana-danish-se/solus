import useSettingsStore from '@/store/settingsStore';

export default function AboutGoalsSection() {
  const { settings, updateField } = useSettingsStore();

  const handleChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  const getCharCount = (text) => text?.length || 0;

  return (
    <section className="mb-12">
      <div className="border-b border-highlight/15 pb-2 mb-6">
        <h3 className="text-xs font-bold text-highlight tracking-widest uppercase">About & Goals</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-foreground">About Me</label>
          <span className="text-xs text-highlight">{getCharCount(settings.about)}/500</span>
        </div>
        <textarea
          name="about"
          value={settings.about || ''}
          onChange={handleChange}
          maxLength={500}
          placeholder="Write a brief bio about your professional background and interests..."
          rows={5}
          className="w-full px-4 py-3 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors resize-y"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-foreground">Goals</label>
          <span className="text-xs text-highlight">{getCharCount(settings.goals)}/500</span>
        </div>
        <textarea
          name="goals"
          value={settings.goals || ''}
          onChange={handleChange}
          maxLength={500}
          placeholder="What are you currently working towards?"
          rows={4}
          className="w-full px-4 py-3 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors resize-y"
        />
      </div>
    </section>
  );
}
