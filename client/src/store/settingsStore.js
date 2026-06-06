import { create } from 'zustand';
import { getSettings, updateSettings } from '../services/settings.service';
import useToastStore from './toastStore';

const useSettingsStore = create((set, get) => ({
  settings: {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    tagline: '',
    socials: {
      linkedin: '',
      github: '',
      twitter: '',
      reddit: '',
      instagram: '',
      portfolio: '',
    },
    about: '',
    goals: '',
    voice: '',
    resume: '',
    services: [],
  },
  isLoading: false,
  isSaving: false,
  error: null,
  lastSynced: null,

  updateField: (field, value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [field]: value,
      },
    }));
  },

  updateSocialField: (field, value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        socials: {
          ...state.settings.socials,
          [field]: value,
        },
      },
    }));
  },

  addService: (service) => {
    set((state) => ({
      settings: {
        ...state.settings,
        services: [...state.settings.services, service],
      },
    }));
  },

  removeService: (serviceToRemove) => {
    set((state) => ({
      settings: {
        ...state.settings,
        services: state.settings.services.filter((s) => s !== serviceToRemove),
      },
    }));
  },

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getSettings();
      // Only set if data exists to avoid overwriting default structure with undefined
      if (data && data._id) {
        set({
          settings: {
            ...get().settings,
            ...data,
            socials: {
              ...get().settings.socials,
              ...(data.socials || {}),
            },
          },
          lastSynced: new Date(),
        });
      }
    } catch (error) {
      set({ error: error.response?.data?.message || error.message || 'Failed to fetch settings' });
    } finally {
      set({ isLoading: false });
    }
  },

  saveSettings: async () => {
    set({ isSaving: true, error: null });
    try {
      const currentSettings = get().settings;
      const data = await updateSettings(currentSettings);
      if (data && data._id) {
        set({
          lastSynced: new Date(),
        });
        useToastStore.getState().addToast('Settings saved successfully', 'success');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to save settings';
      set({ error: msg });
      useToastStore.getState().addToast(msg, 'error');
    } finally {
      set({ isSaving: false });
    }
  },
}));

export default useSettingsStore;
