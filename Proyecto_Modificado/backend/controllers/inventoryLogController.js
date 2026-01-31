import * as inventoryLogModel from '../models/inventoryLogModel.js';

export const getAllInventoryLogs = async (req, res) => {
  try {
    const filters = {
      variant_id: req.query.variant_id,
      action: req.query.action,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      limit: req.query.limit || 100,
    };

    const logs = await inventoryLogModel.getAllInventoryLogs(filters);
    res.json(logs);
  } catch (error) {
    console.error('Get inventory logs error:', error);
    res.status(500).json({ message: 'Server error fetching inventory logs' });
  }
};
