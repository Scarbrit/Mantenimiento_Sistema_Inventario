import api from './axios';

export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  createVariant: (data) => api.post(`/products/${data.product_id}/variants`, data),
  updateVariant: (id, data) => api.put(`/products/variants/${id}`, data),
  deleteVariant: (id) => api.delete(`/products/variants/${id}`),
  adjustStock: (id, data) => api.post(`/products/variants/${id}/adjust-stock`, data),
};
