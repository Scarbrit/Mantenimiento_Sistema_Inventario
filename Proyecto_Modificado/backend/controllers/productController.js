import { validationResult } from 'express-validator';
import * as productModel from '../models/productModel.js';
import * as inventoryLogModel from '../models/inventoryLogModel.js';

export const getAllProducts = async (req, res) => {
  try {
    const filters = {
      category_id: req.query.category_id,
      brand_id: req.query.brand_id,
      search: req.query.search,
    };

    // Usar consulta optimizada que evita problema N+1
    const productsWithVariants = await productModel.getAllProductsWithVariants(filters);

    res.json(productsWithVariants);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const variants = await productModel.getProductVariants(id);
    res.json({ ...product, variants });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = {
      ...req.body,
      created_by: req.user.id,
    };

    const product = await productModel.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(500).json({ message: 'Server error creating product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const product = await productModel.updateProduct(id, req.body);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.deleteProduct(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

export const createVariant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const variant = await productModel.createVariant(req.body);

    // Log inventory addition
    await inventoryLogModel.createInventoryLog({
      variant_id: variant.id,
      action: 'added',
      quantity_change: variant.quantity,
      previous_quantity: 0,
      new_quantity: variant.quantity,
      performed_by: req.user.id,
      notes: 'Initial stock added',
    });

    res.status(201).json(variant);
  } catch (error) {
    console.error('Create variant error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Variant SKU already exists' });
    }
    res.status(500).json({ message: 'Server error creating variant' });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const oldVariant = await productModel.getVariantById(id);

    if (!oldVariant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    const variant = await productModel.updateVariant(id, req.body);

    // Log inventory change if quantity changed
    if (oldVariant.quantity !== variant.quantity) {
      await inventoryLogModel.createInventoryLog({
        variant_id: variant.id,
        action: 'updated',
        quantity_change: variant.quantity - oldVariant.quantity,
        previous_quantity: oldVariant.quantity,
        new_quantity: variant.quantity,
        performed_by: req.user.id,
        notes: 'Stock updated',
      });
    }

    res.json(variant);
  } catch (error) {
    console.error('Update variant error:', error);
    res.status(500).json({ message: 'Server error updating variant' });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await productModel.deleteVariant(id);

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    res.json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Delete variant error:', error);
    res.status(500).json({ message: 'Server error deleting variant' });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity_change, notes } = req.body;

    const oldVariant = await productModel.getVariantById(id);
    if (!oldVariant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    const newQuantity = oldVariant.quantity + quantity_change;
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const variant = await productModel.updateVariant(id, { ...oldVariant, quantity: newQuantity });

    // Log inventory change
    await inventoryLogModel.createInventoryLog({
      variant_id: variant.id,
      action: quantity_change > 0 ? 'added' : 'removed',
      quantity_change,
      previous_quantity: oldVariant.quantity,
      new_quantity: newQuantity,
      performed_by: req.user.id,
      notes: notes || 'Stock adjustment',
    });

    res.json(variant);
  } catch (error) {
    console.error('Adjust stock error:', error);
    res.status(500).json({ message: 'Server error adjusting stock' });
  }
};
