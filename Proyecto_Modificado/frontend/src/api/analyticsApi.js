import api from './axios';

export const analyticsApi = {
  getDailyStats: (date) => api.get('/analytics/daily', { params: { date } }),
  getMonthlyStats: (year, month) => api.get('/analytics/monthly', { params: { year, month } }),
  getTotalInventoryValue: () => api.get('/analytics/inventory-value'),
  getRevenueByDateRange: (startDate, endDate) => api.get('/analytics/revenue', { params: { start_date: startDate, end_date: endDate } }),
  getTopSellingProducts: (limit) => api.get('/analytics/top-selling', { params: { limit } }),
  getLowStockItems: () => api.get('/analytics/low-stock'),
  getProfitByMonth: (year) => api.get('/analytics/profit-by-month', { params: { year } }),
};
