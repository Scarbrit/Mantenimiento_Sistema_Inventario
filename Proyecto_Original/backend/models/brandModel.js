import pool from '../config/database.js';

export const getAllBrands = async () => {
  const result = await pool.query('SELECT * FROM brands ORDER BY name');
  return result.rows;
};

export const getBrandById = async (id) => {
  const result = await pool.query('SELECT * FROM brands WHERE id = $1', [id]);
  return result.rows[0];
};

export const createBrand = async (brandData) => {
  const { name, description } = brandData;
  const result = await pool.query(
    'INSERT INTO brands (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return result.rows[0];
};

export const updateBrand = async (id, brandData) => {
  const { name, description } = brandData;
  const result = await pool.query(
    'UPDATE brands SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  return result.rows[0];
};

export const deleteBrand = async (id) => {
  const result = await pool.query('DELETE FROM brands WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
