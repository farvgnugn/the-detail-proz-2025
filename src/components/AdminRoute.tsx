import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

const AdminRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

export default AdminRoute;