import { validationResult } from 'express-validator';
import * as saleModel from '../models/saleModel.js';

export const createSale = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const saleData = {
      ...req.body,
      sold_by: req.user.id,
    };

    const sale = await saleModel.createSale(saleData);
    res.status(201).json(sale);
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ message: error.message || 'Server error creating sale' });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const filters = {
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    };

    const sales = await saleModel.getAllSales(filters);
    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Server error fetching sales' });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await saleModel.getSaleById(id);
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({ message: 'Server error fetching sale' });
  }
};
