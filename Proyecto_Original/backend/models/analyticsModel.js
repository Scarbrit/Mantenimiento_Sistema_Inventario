import pool from '../config/database.js';

export const getDailyStats = async (date) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_sales,
      COALESCE(SUM(total_amount), 0) as total_revenue,
      COALESCE(SUM(profit), 0) as total_profit,
      COALESCE(SUM(quantity), 0) as total_items_sold
    FROM sales
    WHERE DATE(sale_date) = $1`,
    [date]
  );
  return result.rows[0];
};

export const getMonthlyStats = async (year, month) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_sales,
      COALESCE(SUM(total_amount), 0) as total_revenue,
      COALESCE(SUM(profit), 0) as total_profit,
      COALESCE(SUM(quantity), 0) as total_items_sold
    FROM sales
    WHERE EXTRACT(YEAR FROM sale_date) = $1 AND EXTRACT(MONTH FROM sale_date) = $2`,
    [year, month]
  );
  return result.rows[0];
};

export const getTotalInventoryValue = async () => {
  const result = await pool.query(
    `SELECT 
      COALESCE(SUM(purchase_price * quantity), 0) as total_inventory_value,
      COALESCE(SUM(selling_price * quantity), 0) as total_potential_revenue,
      COUNT(*) as total_variants,
      SUM(quantity) as total_items
    FROM product_variants`
  );
  return result.rows[0];
};

export const getRevenueByDateRange = async (startDate, endDate) => {
  const result = await pool.query(
    `SELECT 
      DATE(sale_date) as date,
      COUNT(*) as sales_count,
      COALESCE(SUM(total_amount), 0) as revenue,
      COALESCE(SUM(profit), 0) as profit
    FROM sales
    WHERE sale_date >= $1 AND sale_date <= $2
    GROUP BY DATE(sale_date)
    ORDER BY date`,
    [startDate, endDate]
  );
  return result.rows;
};

export const getTopSellingProducts = async (limit = 10) => {
  const result = await pool.query(
    `SELECT 
      p.name as product_name,
      pv.variant_name,
      SUM(s.quantity) as total_sold,
      SUM(s.total_amount) as total_revenue,
      SUM(s.profit) as total_profit
    FROM sales s
    JOIN product_variants pv ON s.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    GROUP BY p.id, p.name, pv.id, pv.variant_name
    ORDER BY total_sold DESC
    LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getLowStockItems = async () => {
  const result = await pool.query(
    `SELECT 
      pv.*,
      p.name as product_name
    FROM product_variants pv
    JOIN products p ON pv.product_id = p.id
    WHERE pv.quantity <= pv.min_stock_level
    ORDER BY pv.quantity ASC`
  );
  return result.rows;
};

export const getProfitByMonth = async (year) => {
  const result = await pool.query(
    `SELECT 
      EXTRACT(MONTH FROM sale_date) as month,
      COUNT(*) as sales_count,
      COALESCE(SUM(total_amount), 0) as revenue,
      COALESCE(SUM(profit), 0) as profit
    FROM sales
    WHERE EXTRACT(YEAR FROM sale_date) = $1
    GROUP BY EXTRACT(MONTH FROM sale_date)
    ORDER BY month`,
    [year]
  );
  return result.rows;
};
