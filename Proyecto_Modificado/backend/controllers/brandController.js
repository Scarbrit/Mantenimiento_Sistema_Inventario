import { validationResult } from 'express-validator';
import * as brandModel from '../models/brandModel.js';

export const getAllBrands = async (req, res) => {
  try {
    const brands = await brandModel.getAllBrands();
    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: 'Server error fetching brands' });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await brandModel.getBrandById(id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({ message: 'Server error fetching brand' });
  }
};

export const createBrand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const brand = await brandModel.createBrand(req.body);
    res.status(201).json(brand);
  } catch (error) {
    console.error('Create brand error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Brand name already exists' });
    }
    res.status(500).json({ message: 'Server error creating brand' });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const brand = await brandModel.updateBrand(id, req.body);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    console.error('Update brand error:', error);
    res.status(500).json({ message: 'Server error updating brand' });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await brandModel.deleteBrand(id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({ message: 'Server error deleting brand' });
  }
};
