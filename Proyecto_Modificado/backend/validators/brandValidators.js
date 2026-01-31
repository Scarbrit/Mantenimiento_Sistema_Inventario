import { body } from 'express-validator';

export const brandValidator = [
  body('name').notEmpty().withMessage('Brand name is required'),
  body('description').optional().isString(),
];
