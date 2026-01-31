import pool from '../config/database.js';

export const getAllProducts = async (filters = {}) => {
  let query = `
    SELECT 
      p.*,
      c.name as category_name,
      b.name as brand_name,
      u.first_name || ' ' || u.last_name as created_by_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE 1=1
  `;
  const params = [];
  let paramCount = 1;

  if (filters.category_id) {
    query += ` AND p.category_id = $${paramCount}`;
    params.push(filters.category_id);
    paramCount++;
  }

  if (filters.brand_id) {
    query += ` AND p.brand_id = $${paramCount}`;
    params.push(filters.brand_id);
    paramCount++;
  }

  if (filters.search) {
    query += ` AND (p.name ILIKE $${paramCount} OR p.sku ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
    params.push(`%${filters.search}%`);
    paramCount++;
  }

  query += ` ORDER BY p.created_at DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await pool.query(
    `SELECT 
      p.*,
      c.name as category_name,
      b.name as brand_name,
      u.first_name || ' ' || u.last_name as created_by_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const createProduct = async (productData) => {
  const { name, description, category_id, brand_id, sku, base_price, image_url, created_by } = productData;
  
  const result = await pool.query(
    `INSERT INTO products (name, description, category_id, brand_id, sku, base_price, image_url, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, description, category_id, brand_id, sku, base_price, image_url, created_by]
  );
  
  return result.rows[0];
};

export const updateProduct = async (id, productData) => {
  const { name, description, category_id, brand_id, sku, base_price, image_url } = productData;
  
  const result = await pool.query(
    `UPDATE products 
     SET name = $1, description = $2, category_id = $3, brand_id = $4, sku = $5, base_price = $6, image_url = $7
     WHERE id = $8
     RETURNING *`,
    [name, description, category_id, brand_id, sku, base_price, image_url, id]
  );
  
  return result.rows[0];
};

export const deleteProduct = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const getProductVariants = async (productId) => {
  const result = await pool.query(
    'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY created_at DESC',
    [productId]
  );
  return result.rows;
};

export const getVariantById = async (id) => {
  const result = await pool.query('SELECT * FROM product_variants WHERE id = $1', [id]);
  return result.rows[0];
};

export const createVariant = async (variantData) => {
  const { product_id, variant_name, sku, purchase_price, selling_price, quantity, min_stock_level } = variantData;
  
  const result = await pool.query(
    `INSERT INTO product_variants (product_id, variant_name, sku, purchase_price, selling_price, quantity, min_stock_level)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [product_id, variant_name, sku, purchase_price, selling_price, quantity, min_stock_level]
  );
  
  return result.rows[0];
};

export const updateVariant = async (id, variantData) => {
  const { variant_name, sku, purchase_price, selling_price, quantity, min_stock_level } = variantData;
  
  const result = await pool.query(
    `UPDATE product_variants 
     SET variant_name = $1, sku = $2, purchase_price = $3, selling_price = $4, quantity = $5, min_stock_level = $6
     WHERE id = $7
     RETURNING *`,
    [variant_name, sku, purchase_price, selling_price, quantity, min_stock_level, id]
  );
  
  return result.rows[0];
};

export const deleteVariant = async (id) => {
  const result = await pool.query('DELETE FROM product_variants WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const updateVariantQuantity = async (id, quantityChange) => {
  const result = await pool.query(
    `UPDATE product_variants 
     SET quantity = quantity + $1
     WHERE id = $2
     RETURNING *`,
    [quantityChange, id]
  );
  return result.rows[0];
};
