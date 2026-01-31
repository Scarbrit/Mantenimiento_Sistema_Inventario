import { body } from 'express-validator';

export const categoryValidator = [
  body('name').notEmpty().withMessage('Category name is required'),
  body('description').optional().isString(),
];
