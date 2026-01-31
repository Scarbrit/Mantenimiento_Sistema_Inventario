import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { setUser, clearUser } from './store/slices/authSlice';
import { setTheme } from './store/slices/themeSlice';
import { authApi } from './api/authApi';
import AOS from 'aos';

// Layout
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyEmail from './pages/Auth/VerifyEmail';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import ProductForm from './pages/Products/ProductForm';
import Sales from './pages/Sales/Sales';
import CreateSale from './pages/Sales/CreateSale';
import InventoryLogs from './pages/InventoryLogs/InventoryLogs';
import Analytics from './pages/Analytics/Analytics';
import Users from './pages/Users/Users';
import Categories from './pages/Categories/Categories';
import Brands from './pages/Brands/Brands';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSelector((state) => state.theme);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Set theme on mount
  useEffect(() => {
    dispatch(setTheme(theme));
  }, [dispatch, theme]);

  // Check authentication status on mount
  const { data: userData, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await authApi.getCurrentUser();
        return response.data.user;
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: 'always', // Always check on mount
  });

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData));
    } else if (userData === null || isError) {
      dispatch(clearUser());
    }
  }, [userData, isError, dispatch]);

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    if (isAuthenticated && authPages.includes(location.pathname)) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="sales" element={<Sales />} />
            <Route path="sales/new" element={<CreateSale />} />
            <Route path="inventory-logs" element={<InventoryLogs />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
          </Route>

          {/* Catch all - redirect to dashboard if authenticated, login otherwise */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;