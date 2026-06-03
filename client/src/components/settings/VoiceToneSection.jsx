import useSettingsStore from '@/store/settingsStore';

export default function VoiceToneSection() {
  const { settings, updateField } = useSettingsStore();

  const handleChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  return (
    <section className="mb-12">
      <div className="border-b border-highlight/15 pb-2 mb-6">
        <h3 className="text-xs font-bold text-highlight tracking-widest uppercase">Voice & Tone</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Communication Style & Voice</label>
        <textarea
          name="voice"
          value={settings.voice || ''}
          onChange={handleChange}
          placeholder="Direct, empathetic, slightly technical, and optimistic..."
          rows={4}
          className="w-full px-4 py-3 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors resize-y"
        />
        <p className="mt-2 text-xs text-highlight italic">
          How you write, speak, and present yourself. AI will use this to generate content in your style.
        </p>
      </div>
    </section>
  );
}
