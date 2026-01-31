import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createUser = async (userData) => {
  const { email, password, first_name, last_name, role, verification_token } = userData;
  const password_hash = await bcrypt.hash(password, 10);
  
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, verification_token)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, first_name, last_name, role, is_verified, created_at`,
    [email, password_hash, first_name, last_name, role || 'staff', verification_token]
  );
  
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, email, first_name, last_name, role, is_verified, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const verifyUser = async (token) => {
  const result = await pool.query(
    'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING *',
    [token]
  );
  return result.rows[0];
};

export const setResetPasswordToken = async (email, token, expires) => {
  const result = await pool.query(
    'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3 RETURNING *',
    [token, expires, email]
  );
  return result.rows[0];
};

export const getUserByResetToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
    [token]
  );
  return result.rows[0];
};

export const updatePassword = async (userId, newPassword) => {
  const password_hash = await bcrypt.hash(newPassword, 10);
  const result = await pool.query(
    'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2 RETURNING id, email',
    [password_hash, userId]
  );
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, email, first_name, last_name, role, is_verified, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

export const updateUserRole = async (userId, role) => {
  const result = await pool.query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, role',
    [role, userId]
  );
  return result.rows[0];
};
