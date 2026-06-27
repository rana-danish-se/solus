import api from '../lib/axios';

export const createConversation = async (data) => {
  const response = await api.post('/conversations', data);
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data;
};

export const getConversationById = async (id) => {
  const response = await api.get(`/conversations/${id}`);
  return response.data;
};

export const updateProspect = async (id, data) => {
  const response = await api.put(`/conversations/${id}/prospect`, data);
  return response.data;
};

export const addProspectMessage = async (id, content) => {
  const response = await api.post(`/conversations/${id}/messages`, { content });
  return response.data;
};

export const confirmSentMessage = async (id, messageContent) => {
  const response = await api.post(`/conversations/${id}/confirm`, { messageContent });
  return response.data;
};

export const archiveConversation = async (id) => {
  const response = await api.put(`/conversations/${id}/archive`);
  return response.data;
};

export const deleteConversation = async (id) => {
  const response = await api.delete(`/conversations/${id}`);
  return response.data;
};
