import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Package, 
  Image, 
  LogOut, 
  Phone,
  DollarSign,
  Camera,
  User,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import BusinessSettingsPanel from './BusinessSettingsPanel';
import ServicePackagesPanel from './ServicePackagesPanel';
import GalleryManagementPanel from './GalleryManagementPanel';
import TestimonialsPanel from './TestimonialsPanel';

type ActivePanel = 'business' | 'services' | 'gallery' | 'testimonials';

const AdminDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('business');
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: 'business' as ActivePanel,
      label: 'Business Settings',
      icon: <Phone size={20} />,
      description: 'Manage contact information'
    },
    {
      id: 'services' as ActivePanel,
      label: 'Service Packages',
      icon: <Package size={20} />,
      description: 'Edit pricing and service details'
    },
    {
      id: 'gallery' as ActivePanel,
      label: 'Gallery Management',
      icon: <Image size={20} />,
      description: 'Manage portfolio images'
    },
    {
      id: 'testimonials' as ActivePanel,
      label: 'Testimonials',
      icon: <MessageSquare size={20} />,
      description: 'Review and publish customer testimonials'
    }
  ];

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'business':
        return <BusinessSettingsPanel />;
      case 'services':
        return <ServicePackagesPanel />;
      case 'gallery':
        return <GalleryManagementPanel />;
      case 'testimonials':
        return <TestimonialsPanel />;
      default:
        return <BusinessSettingsPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-2 rounded-lg">
                <Settings size={24} />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">The Detail Proz Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    activePanel === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <p className={`text-sm ${
                    activePanel === item.id ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </button>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Services</span>
                  <span className="font-semibold text-purple-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gallery Images</span>
                  <span className="font-semibold text-purple-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published Reviews</span>
                  <span className="font-semibold text-purple-600">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-500">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderActivePanel()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;