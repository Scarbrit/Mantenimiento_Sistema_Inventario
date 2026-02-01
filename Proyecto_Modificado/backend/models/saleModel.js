import pool from '../config/database.js';
import { calculateProfit } from '../utils/helpers.js';

export const createSale = async (saleData) => {
  const { variant_id, quantity, unit_price, sold_by, customer_name, customer_phone, notes } = saleData;

  // Get variant to calculate profit and validate stock
  const variantResult = await pool.query('SELECT purchase_price, quantity FROM product_variants WHERE id = $1', [variant_id]);
  if (variantResult.rows.length === 0) {
    throw new Error('Variant not found');
  }

  const currentStock = variantResult.rows[0].quantity;
  // Validación de stock suficiente
  if (currentStock < quantity) {
    throw new Error(`Stock insuficiente. Disponible: ${currentStock}, Solicitado: ${quantity}`);
  }

  const purchase_price = variantResult.rows[0].purchase_price;
  const total_amount = unit_price * quantity;
  const profit = calculateProfit(unit_price, purchase_price, quantity);

  // Start transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create sale
    const saleResult = await client.query(
      `INSERT INTO sales (variant_id, quantity, unit_price, total_amount, profit, sold_by, customer_name, customer_phone, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [variant_id, quantity, unit_price, total_amount, profit, sold_by, customer_name, customer_phone, notes]
    );

    // Update variant quantity
    await client.query(
      'UPDATE product_variants SET quantity = quantity - $1 WHERE id = $2',
      [quantity, variant_id]
    );

    // Get updated variant quantity
    const variantUpdate = await client.query('SELECT quantity FROM product_variants WHERE id = $1', [variant_id]);
    const newQuantity = variantUpdate.rows[0].quantity;
    const oldQuantity = newQuantity + quantity;

    // Log inventory change
    await client.query(
      `INSERT INTO inventory_logs (variant_id, action, quantity_change, previous_quantity, new_quantity, performed_by, notes)
       VALUES ($1, 'sold', $2, $3, $4, $5, $6)`,
      [variant_id, -quantity, oldQuantity, newQuantity, sold_by, `Sale: ${quantity} units`]
    );

    await client.query('COMMIT');
    return saleResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getAllSales = async (filters = {}) => {
  let query = `
    SELECT 
      s.*,
      pv.variant_name,
      pv.sku as variant_sku,
      p.name as product_name,
      u.first_name || ' ' || u.last_name as sold_by_name
    FROM sales s
    JOIN product_variants pv ON s.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN users u ON s.sold_by = u.id
    WHERE 1=1
  `;
  const params = [];
  let paramCount = 1;

  if (filters.start_date) {
    query += ` AND s.sale_date >= $${paramCount}`;
    params.push(filters.start_date);
    paramCount++;
  }

  if (filters.end_date) {
    query += ` AND s.sale_date <= $${paramCount}`;
    params.push(filters.end_date);
    paramCount++;
  }

  query += ` ORDER BY s.sale_date DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

export const getSaleById = async (id) => {
  const result = await pool.query(
    `SELECT 
      s.*,
      pv.variant_name,
      pv.sku as variant_sku,
      p.name as product_name,
      u.first_name || ' ' || u.last_name as sold_by_name
    FROM sales s
    JOIN product_variants pv ON s.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN users u ON s.sold_by = u.id
    WHERE s.id = $1`,
    [id]
  );
  return result.rows[0];
};
