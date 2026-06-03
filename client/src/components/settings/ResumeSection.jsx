import useSettingsStore from '@/store/settingsStore';

export default function ResumeSection() {
  const { settings, updateField } = useSettingsStore();

  const handleChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  return (
    <section className="mb-8">
      <div className="border-b border-highlight/15 pb-2 mb-6">
        <h3 className="text-xs font-bold text-highlight tracking-widest uppercase">Resume</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Markdown Resume Source</label>
        <div className="relative">
          <textarea
            name="resume"
            value={settings.resume || ''}
            onChange={handleChange}
            placeholder="# Dani Solus&#10;## Experience&#10;### Senior Product Designer | Apple"
            rows={12}
            className="w-full px-4 py-4 bg-[#f8f9fa] dark:bg-[#111111] border border-highlight/15 rounded-lg text-sm font-mono focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors resize-y"
          />
          <div className="absolute bottom-3 right-4 text-[10px] text-highlight tracking-widest uppercase font-bold pointer-events-none">
            Markdown Enabled
          </div>
        </div>
      </div>
    </section>
  );
}
