import api from '../lib/axios';

export const getContentStrategies = async () => {
  const response = await api.get('/content-strategy');
  return response.data;
};

export const updateContentStrategy = async (platform, data) => {
  const response = await api.put(`/content-strategy/${platform}`, data);
  return response.data;
};
