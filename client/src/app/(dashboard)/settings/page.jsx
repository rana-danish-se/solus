'use client';

import { useEffect } from 'react';
import useSettingsStore from '@/store/settingsStore';
import IdentitySection from '@/components/settings/IdentitySection';
import SocialsSection from '@/components/settings/SocialsSection';
import AboutGoalsSection from '@/components/settings/AboutGoalsSection';
import VoiceToneSection from '@/components/settings/VoiceToneSection';
import ServicesSection from '@/components/settings/ServicesSection';
import ResumeSection from '@/components/settings/ResumeSection';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const { fetchSettings, saveSettings, isLoading, isSaving, error, lastSynced } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = () => {
    saveSettings();
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const minutes = Math.floor((new Date() - date) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-8 pb-24 relative">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-highlight mt-1 text-sm">Manage your professional identity and global preferences.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-8 text-sm">
          {error}
        </div>
      )}

      <IdentitySection />
      <SocialsSection />
      <AboutGoalsSection />
      <VoiceToneSection />
      <ServicesSection />
      <ResumeSection />

      {/* Footer controls & status */}
      <div className="mt-12 pt-6 border-t border-highlight/15 flex items-center justify-between">
        <div className="text-xs text-highlight font-medium">
          {lastSynced && `Last synchronized: ${getTimeAgo(lastSynced)}`}
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
