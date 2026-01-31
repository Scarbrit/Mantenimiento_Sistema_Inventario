import { body } from 'express-validator';

export const saleValidator = [
  body('variant_id').isUUID().withMessage('Variant ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('unit_price').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('customer_name').optional().isString(),
  body('customer_phone').optional().isString(),
  body('notes').optional().isString(),
];
