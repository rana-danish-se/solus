import useSettingsStore from '@/store/settingsStore';
import { Briefcase, Code, Hash, MessageSquare, Camera, Globe } from 'lucide-react';

export default function SocialsSection() {
  const { settings, updateSocialField } = useSettingsStore();

  const handleChange = (e) => {
    updateSocialField(e.target.name, e.target.value);
  };

  const InputWithIcon = ({ icon: Icon, name, value, placeholder }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-highlight" />
      </div>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
      />
    </div>
  );

  return (
    <section className="mb-12">
      <div className="border-b border-highlight/15 pb-2 mb-6">
        <h3 className="text-xs font-bold text-highlight tracking-widest uppercase">Socials</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputWithIcon icon={Briefcase} name="linkedin" value={settings.socials?.linkedin} placeholder="LinkedIn URL" />
        <InputWithIcon icon={Code} name="github" value={settings.socials?.github} placeholder="GitHub URL" />
        <InputWithIcon icon={Hash} name="twitter" value={settings.socials?.twitter} placeholder="Twitter/X Handle" />
        <InputWithIcon icon={MessageSquare} name="reddit" value={settings.socials?.reddit} placeholder="Reddit Username" />
        <InputWithIcon icon={Camera} name="instagram" value={settings.socials?.instagram} placeholder="Instagram Profile" />
        <InputWithIcon icon={Globe} name="portfolio" value={settings.socials?.portfolio} placeholder="Portfolio Website" />
      </div>
    </section>
  );
}
