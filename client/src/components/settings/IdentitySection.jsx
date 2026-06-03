import useSettingsStore from '@/store/settingsStore';

export default function IdentitySection() {
  const { settings, updateField } = useSettingsStore();

  const handleChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  return (
    <section className="mb-12">
      <div className="border-b border-highlight/15 pb-2 mb-6">
        <h3 className="text-xs font-bold text-highlight tracking-widest uppercase">Identity</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={settings.fullName || ''}
            onChange={handleChange}
            placeholder="e.g. Dani Solus"
            className="w-full px-4 py-2.5 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Headline</label>
          <input
            type="text"
            name="headline"
            value={settings.headline || ''}
            onChange={handleChange}
            placeholder="e.g. Creative Strategist"
            className="w-full px-4 py-2.5 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={settings.email || ''}
            onChange={handleChange}
            placeholder="e.g. dani@solus.os"
            className="w-full px-4 py-2.5 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={settings.phone || ''}
            onChange={handleChange}
            placeholder="+1 (555) 012-3456"
            className="w-full px-4 py-2.5 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Tagline</label>
        <input
          type="text"
          name="tagline"
          value={settings.tagline || ''}
          onChange={handleChange}
          placeholder="e.g. Building the future of personal computing through Solus OS"
          className="w-full px-4 py-2.5 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
        />
      </div>
    </section>
  );
}
