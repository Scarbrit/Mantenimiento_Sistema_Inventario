import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { saleApi } from '../../api/saleApi';
import { analyticsApi } from '../../api/analyticsApi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superadmin';

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getAll(),
  });

  const { data: sales } = useQuery({
    queryKey: ['sales'],
    queryFn: () => saleApi.getAll(),
  });

  const { data: dailyStats } = useQuery({
    queryKey: ['dailyStats'],
    queryFn: () => analyticsApi.getDailyStats(),
    enabled: isSuperAdmin,
  });

  const totalProducts = products?.data?.length || 0;
  const totalVariants = products?.data?.reduce((acc, p) => acc + (p.variants?.length || 0), 0) || 0;
  const totalSales = sales?.data?.length || 0;
  const todayRevenue = dailyStats?.data?.total_revenue || 0;
  const todayProfit = dailyStats?.data?.total_profit || 0;

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Variants',
      value: totalVariants,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Sales',
      value: totalSales,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    ...(isSuperAdmin
      ? [
          {
            title: 'Today Revenue',
            value: `PKR ${todayRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-gold-500',
          },
          {
            title: 'Today Profit',
            value: `PKR ${todayProfit.toLocaleString()}`,
            icon: TrendingUp,
            color: 'bg-green-600',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6" data-aos="fade-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.first_name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 animate__animated animate__fadeInUp"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isSuperAdmin && (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/analytics"
              className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                View Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed reports and insights
              </p>
            </a>
            <a
              href="/products/new"
              className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Add Product
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add a new product to inventory
              </p>
            </a>
            <a
              href="/sales/new"
              className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                New Sale
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Record a new sale
              </p>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
