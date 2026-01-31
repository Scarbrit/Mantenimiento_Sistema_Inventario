import crypto from 'crypto';

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const calculateProfit = (sellingPrice, purchasePrice, quantity) => {
  return (sellingPrice - purchasePrice) * quantity;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
  }).format(amount);
};
