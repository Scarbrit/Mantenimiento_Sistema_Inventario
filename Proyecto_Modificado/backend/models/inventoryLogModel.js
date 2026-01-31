import pool from '../config/database.js';

export const createInventoryLog = async (logData) => {
  const { variant_id, action, quantity_change, previous_quantity, new_quantity, performed_by, notes } = logData;
  
  const result = await pool.query(
    `INSERT INTO inventory_logs (variant_id, action, quantity_change, previous_quantity, new_quantity, performed_by, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [variant_id, action, quantity_change, previous_quantity, new_quantity, performed_by, notes]
  );
  
  return result.rows[0];
};

export const getAllInventoryLogs = async (filters = {}) => {
  let query = `
    SELECT 
      il.*,
      pv.variant_name,
      pv.sku as variant_sku,
      p.name as product_name,
      u.first_name || ' ' || u.last_name as performed_by_name
    FROM inventory_logs il
    LEFT JOIN product_variants pv ON il.variant_id = pv.id
    LEFT JOIN products p ON pv.product_id = p.id
    LEFT JOIN users u ON il.performed_by = u.id
    WHERE 1=1
  `;
  const params = [];
  let paramCount = 1;

  if (filters.variant_id) {
    query += ` AND il.variant_id = $${paramCount}`;
    params.push(filters.variant_id);
    paramCount++;
  }

  if (filters.action) {
    query += ` AND il.action = $${paramCount}`;
    params.push(filters.action);
    paramCount++;
  }

  if (filters.start_date) {
    query += ` AND il.created_at >= $${paramCount}`;
    params.push(filters.start_date);
    paramCount++;
  }

  if (filters.end_date) {
    query += ` AND il.created_at <= $${paramCount}`;
    params.push(filters.end_date);
    paramCount++;
  }

  query += ` ORDER BY il.created_at DESC LIMIT $${paramCount}`;
  params.push(filters.limit || 100);

  const result = await pool.query(query, params);
  return result.rows;
};
