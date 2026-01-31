import * as analyticsModel from '../models/analyticsModel.js';

export const getDailyStats = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const stats = await analyticsModel.getDailyStats(targetDate);
    res.json(stats);
  } catch (error) {
    console.error('Get daily stats error:', error);
    res.status(500).json({ message: 'Server error fetching daily stats' });
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().getMonth() + 1;
    
    const stats = await analyticsModel.getMonthlyStats(targetYear, targetMonth);
    res.json(stats);
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ message: 'Server error fetching monthly stats' });
  }
};

export const getTotalInventoryValue = async (req, res) => {
  try {
    const stats = await analyticsModel.getTotalInventoryValue();
    res.json(stats);
  } catch (error) {
    console.error('Get inventory value error:', error);
    res.status(500).json({ message: 'Server error fetching inventory value' });
  }
};

export const getRevenueByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const data = await analyticsModel.getRevenueByDateRange(start_date, end_date);
    res.json(data);
  } catch (error) {
    console.error('Get revenue by date range error:', error);
    res.status(500).json({ message: 'Server error fetching revenue data' });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await analyticsModel.getTopSellingProducts(limit);
    res.json(products);
  } catch (error) {
    console.error('Get top selling products error:', error);
    res.status(500).json({ message: 'Server error fetching top selling products' });
  }
};

export const getLowStockItems = async (req, res) => {
  try {
    const items = await analyticsModel.getLowStockItems();
    res.json(items);
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({ message: 'Server error fetching low stock items' });
  }
};

export const getProfitByMonth = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const data = await analyticsModel.getProfitByMonth(year);
    res.json(data);
  } catch (error) {
    console.error('Get profit by month error:', error);
    res.status(500).json({ message: 'Server error fetching profit data' });
  }
};
