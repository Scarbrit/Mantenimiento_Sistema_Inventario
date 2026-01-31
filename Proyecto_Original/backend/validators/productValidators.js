import { body } from 'express-validator';

export const productValidator = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('base_price').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('category_id').optional().isUUID().withMessage('Invalid category ID'),
  body('brand_id').optional().isUUID().withMessage('Invalid brand ID'),
];

export const variantValidator = [
  body('product_id').isUUID().withMessage('Product ID is required'),
  body('variant_name').notEmpty().withMessage('Variant name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('purchase_price').isFloat({ min: 0 }).withMessage('Purchase price must be a positive number'),
  body('selling_price').isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('min_stock_level').optional().isInt({ min: 0 }).withMessage('Min stock level must be a non-negative integer'),
];

export const stockAdjustmentValidator = [
  body('quantity_change').isInt().withMessage('Quantity change must be an integer'),
  body('notes').optional().isString(),
];
