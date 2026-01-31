import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, XCircle } from 'lucide-react';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verified, setVerified] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: () => authApi.verifyEmail(token),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setVerified(true);
      toast.success('Email verified successfully!');
    }
    if (isError) {
      toast.error('Invalid or expired verification token');
    }
  }, [data, isError]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Verification Link
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The verification link is invalid or missing.
          </p>
          <Link
            to="/login"
            className="text-gold-600 dark:text-gold-500 hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8 text-center">
        {isLoading ? (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold-500 mx-auto"></div>
        ) : verified ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Email Verified!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your email has been successfully verified. You can now log in.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The verification link is invalid or has expired.
            </p>
            <Link
              to="/login"
              className="text-gold-600 dark:text-gold-500 hover:underline"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
