import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, DollarSign, TrendingUp, Package } from 'lucide-react';
import { analyticsApi } from '../../api/analyticsApi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const { data: dailyStats } = useQuery({
    queryKey: ['dailyStats'],
    queryFn: () => analyticsApi.getDailyStats(),
  });

  const { data: monthlyStats } = useQuery({
    queryKey: ['monthlyStats'],
    queryFn: () =>
      analyticsApi.getMonthlyStats(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      ),
  });

  const { data: inventoryValue } = useQuery({
    queryKey: ['inventoryValue'],
    queryFn: () => analyticsApi.getTotalInventoryValue(),
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue', dateRange],
    queryFn: () =>
      analyticsApi.getRevenueByDateRange(dateRange.start_date, dateRange.end_date),
  });

  const { data: topProducts } = useQuery({
    queryKey: ['topProducts'],
    queryFn: () => analyticsApi.getTopSellingProducts(10),
  });

  const { data: profitData } = useQuery({
    queryKey: ['profitByMonth'],
    queryFn: () => analyticsApi.getProfitByMonth(new Date().getFullYear()),
  });

  return (
    <div className="space-y-6" data-aos="fade-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive insights and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Today Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                PKR {parseFloat(dailyStats?.data?.total_revenue || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-gold-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Today Profit
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                PKR {parseFloat(dailyStats?.data?.total_profit || 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Inventory Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                PKR {parseFloat(inventoryValue?.data?.total_inventory_value || 0).toLocaleString()}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Items
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inventoryValue?.data?.total_items || 0}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) =>
                setDateRange({ ...dateRange, start_date: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) =>
                setDateRange({ ...dateRange, end_date: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData?.data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#D4AF37"
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Profit by Month */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Monthly Profit
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitData?.data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#D4AF37" name="Profit" />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Top Selling Products
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Variant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Total Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Profit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {topProducts?.data?.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {product.product_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {product.variant_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {product.total_sold}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    PKR {parseFloat(product.total_revenue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">
                    PKR {parseFloat(product.total_profit || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
