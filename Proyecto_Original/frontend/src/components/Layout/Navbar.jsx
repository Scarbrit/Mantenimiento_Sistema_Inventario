import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, LogOut, User, Menu } from 'lucide-react';
import { toggleTheme } from '../../store/slices/themeSlice';
import { clearUser } from '../../store/slices/authSlice';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  // Use React Query mutation for logout
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear Redux state
      dispatch(clearUser());
      // Clear React Query cache
      queryClient.clear();
      toast.success('Logged out successfully');
      // Navigate to login page with replace to prevent back button issues
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      // Even if logout API fails, still clear local state and redirect
      console.error('Logout error:', error);
      dispatch(clearUser());
      queryClient.clear();
      navigate('/login', { replace: true });
      toast.error('Logged out');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          
          <h1 className="text-xl sm:text-2xl font-bold text-gold-600 dark:text-gold-500">
            H-M-C Inventory
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* User info - hidden on small screens */}
          <div className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <User className="w-5 h-5" />
            <span className="font-medium">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({user?.role})
            </span>
          </div>
          
          {/* User icon only on small screens */}
          <div className="md:hidden flex items-center text-gray-700 dark:text-gray-300">
            <User className="w-5 h-5" />
          </div>
          
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gold-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
          
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-red-500 disabled:opacity-50"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;