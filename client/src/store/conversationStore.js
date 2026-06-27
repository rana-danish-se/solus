import { create } from 'zustand';
import * as conversationService from '../services/conversation.service';
import useToastStore from './toastStore';

const useConversationStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  pendingReplies: [],
  isLoading: false,
  isGenerating: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await conversationService.getConversations();
      set({ conversations: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to load conversations';
      set({ error: msg, isLoading: false });
      useToastStore.getState().addToast(msg, 'error');
    }
  },

  fetchConversation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await conversationService.getConversationById(id);
      set({ activeConversation: data, isLoading: false, pendingReplies: [] });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to load conversation';
      set({ error: msg, isLoading: false });
      useToastStore.getState().addToast(msg, 'error');
    }
  },

  createConversation: async (data) => {
    set({ error: null });
    try {
      const result = await conversationService.createConversation(data);
      useToastStore.getState().addToast('Conversation created', 'success');
      return result;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to create conversation';
      set({ error: msg });
      useToastStore.getState().addToast(msg, 'error');
      return null;
    }
  },

  submitProspectMessage: async (id, content) => {
    set({ isGenerating: true, error: null });
    try {
      const data = await conversationService.addProspectMessage(id, content);
      set({ pendingReplies: data.replies || [], isGenerating: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to process message';
      set({ isGenerating: false, error: msg });
      useToastStore.getState().addToast(msg, 'error');
    }
  },

  confirmReply: async (id, messageContent) => {
    set({ error: null });
    try {
      const data = await conversationService.confirmSentMessage(id, messageContent);
      const active = get().activeConversation;
      if (active && active.messages) {
        set({
          activeConversation: {
            ...active,
            messages: [...active.messages, data.message || { role: 'assistant', content: messageContent, createdAt: new Date().toISOString() }],
          },
          pendingReplies: [],
        });
      } else {
        set({ pendingReplies: [] });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to confirm reply';
      set({ error: msg });
      useToastStore.getState().addToast(msg, 'error');
    }
  },

  updateProspect: async (id, data) => {
    set({ error: null });
    try {
      const updated = await conversationService.updateProspect(id, data);
      set((state) => ({
        activeConversation: state.activeConversation
          ? { ...state.activeConversation, prospect: updated.prospect || updated }
          : null,
      }));
      useToastStore.getState().addToast('Prospect updated', 'success');
      return updated;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to update prospect';
      set({ error: msg });
      useToastStore.getState().addToast(msg, 'error');
    }
  },

  archiveConversation: async (id) => {
    set({ error: null });
    try {
      await conversationService.archiveConversation(id);
      useToastStore.getState().addToast('Conversation archived', 'success');
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === id ? { ...c, archived: true } : c
        ),
        activeConversation: state.activeConversation?._id === id
          ? { ...state.activeConversation, archived: true }
          : state.activeConversation,
      }));
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to archive conversation';
      set({ error: msg });
      useToastStore.getState().addToast(msg, 'error');
    }
  },

  deleteConversation: async (id) => {
    set({ error: null });
    try {
      await conversationService.deleteConversation(id);
      useToastStore.getState().addToast('Conversation deleted', 'success');
      set((state) => ({
        conversations: state.conversations.filter((c) => c._id !== id),
        activeConversation: state.activeConversation?._id === id ? null : state.activeConversation,
      }));
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete conversation';
      set({ error: msg });
      useToastStore.getState().addToast(msg, 'error');
    }
  },

  clearPendingReplies: () => set({ pendingReplies: [] }),
}));

export default useConversationStore;
