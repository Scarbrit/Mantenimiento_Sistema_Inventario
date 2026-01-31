import api from './axios';

export const inventoryLogApi = {
  getAll: (params) => api.get('/inventory-logs', { params }),
};
