import api from '../lib/axios';

export const fetchResources = async (params = {}) => {
  const response = await api.get('/resources', { params });
  return response.data;
};

export const fetchResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const scrapeResourceMetadata = async (url) => {
  const response = await api.post('/resources/scrape', { url });
  return response.data;
};

export const createResource = async (data) => {
  const response = await api.post('/resources', data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};
