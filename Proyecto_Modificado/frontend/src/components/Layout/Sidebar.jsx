import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Users,
  Tag,
  Award,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, access: 'all' },
    { path: '/products', label: 'Products', icon: Package, access: 'all' },
    { path: '/sales', label: 'Sales', icon: ShoppingCart, access: 'all' },
    { path: '/inventory-logs', label: 'Inventory Logs', icon: FileText, access: 'all' },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, access: 'superadmin' },
    { path: '/users', label: 'Users', icon: Users, access: 'superadmin' },
    { path: '/categories', label: 'Categories', icon: Tag, access: 'admin' },
    { path: '/brands', label: 'Brands', icon: Award, access: 'admin' },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.access === 'all') return true;
    if (item.access === 'admin' && isAdmin) return true;
    if (item.access === 'superadmin' && isSuperAdmin) return true;
    return false;
  });

  return (
    <>
      {/* Sidebar - responsive with slide-in animation */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white dark:bg-dark-800 
          border-r border-gray-200 dark:border-dark-700 
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gold-600 dark:text-gold-500">
            Menu
          </h2>
          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 pb-4 overflow-y-auto">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      // Close sidebar on mobile when a link is clicked
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gold-500 text-white dark:bg-gold-600'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;