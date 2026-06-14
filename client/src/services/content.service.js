import api from '../lib/axios';

export const getIdeas = async (params = {}) => {
  const response = await api.get('/content/ideas', { params });
  return response.data;
};

export const generateIdeas = async () => {
  const response = await api.post('/content/ideas/generate');
  return response.data;
};

export const deleteIdea = async (id) => {
  const response = await api.delete(`/content/ideas/${id}`);
  return response.data;
};

export const approveIdea = async (id) => {
  const response = await api.patch(`/content/ideas/${id}/approve`);
  return response.data;
};

export const getPosts = async (params = {}) => {
  const response = await api.get('/content/posts', { params });
  return response.data;
};

export const generateHook = async (ideaId) => {
  const response = await api.post('/content/posts/generate-hook', { ideaId });
  return response.data;
};

export const regenerateHook = async (id) => {
  const response = await api.post(`/content/posts/${id}/regenerate-hook`);
  return response.data;
};

export const generateBody = async (id) => {
  const response = await api.post(`/content/posts/${id}/generate-body`);
  return response.data;
};

export const regenerateBody = async (id) => {
  const response = await api.post(`/content/posts/${id}/regenerate-body`);
  return response.data;
};

export const generateCTA = async (id) => {
  const response = await api.post(`/content/posts/${id}/generate-cta`);
  return response.data;
};

export const regenerateCTA = async (id) => {
  const response = await api.post(`/content/posts/${id}/regenerate-cta`);
  return response.data;
};

export const approvePost = async (id) => {
  const response = await api.patch(`/content/posts/${id}/approve`);
  return response.data;
};

export const updateSection = async (id, section, text) => {
  const response = await api.patch(`/content/posts/${id}/section`, { section, text });
  return response.data;
};

export const uploadPostImage = async (id, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post(`/content/posts/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const removePostImage = async (id) => {
  const response = await api.delete(`/content/posts/${id}/image`);
  return response.data;
};
