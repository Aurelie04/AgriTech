'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const router = useRouter();

  const getRoleMenuItems = (role: string) => {
    switch (role) {
      case 'farmer':
        return [
          { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
          { name: 'Farm Management', icon: '🚜', path: '/farm-management' },
          { name: 'Crop Tracking', icon: '🌱', path: '/crop-tracking' },
          { name: 'Marketplace', icon: '🛒', path: '/marketplace' },
          { name: 'Weather', icon: '🌤️', path: '/weather' },
          { name: 'Analytics', icon: '📊', path: '/analytics' },
          { name: 'Equipment', icon: '🔧', path: '/equipment' },
          { name: 'Financing', icon: '💰', path: '/financing' },
          { name: 'Insurance', icon: '🛡️', path: '/insurance' },
          { name: 'Claims', icon: '📋', path: '/insurance/claims' },
        ];
      case 'buyer':
        return [
          { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
          { name: 'Product Catalog', icon: '📦', path: '/catalog' },
          { name: 'Orders', icon: '📋', path: '/orders' },
          { name: 'Suppliers', icon: '👥', path: '/suppliers' },
          { name: 'Quality Control', icon: '✅', path: '/quality' },
          { name: 'Logistics', icon: '🚚', path: '/logistics' },
          { name: 'Analytics', icon: '📊', path: '/analytics' },
          { name: 'Insurance', icon: '🛡️', path: '/insurance' },
        ];
      case 'trader':
        return [
          { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
          { name: 'Market Prices', icon: '📈', path: '/prices' },
          { name: 'Trading Platform', icon: '💹', path: '/trading' },
          { name: 'Portfolio', icon: '💼', path: '/portfolio' },
          { name: 'Analytics', icon: '📊', path: '/analytics' },
          { name: 'News & Updates', icon: '📰', path: '/news' },
          { name: 'Risk Management', icon: '⚠️', path: '/risk' },
          { name: 'Insurance', icon: '🛡️', path: '/insurance' },
        ];
      case 'financier':
        return [
          { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
          { name: 'Loan Applications', icon: '📝', path: '/applications' },
          { name: 'Portfolio', icon: '💼', path: '/portfolio' },
          { name: 'Risk Assessment', icon: '⚠️', path: '/risk' },
          { name: 'Credit Analysis', icon: '🔍', path: '/credit' },
          { name: 'Reports', icon: '📊', path: '/reports' },
          { name: 'Compliance', icon: '📋', path: '/compliance' },
          { name: 'Insurance', icon: '🛡️', path: '/insurance' },
        ];
      case 'logistics':
        return [
          { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
          { name: 'Fleet Management', icon: '🚛', path: '/fleet' },
          { name: 'Delivery Orders', icon: '📦', path: '/deliveries' },
          { name: 'Storage Facilities', icon: '🏭', path: '/storage' },
          { name: 'Route Optimization', icon: '🗺️', path: '/routes' },
          { name: 'Tracking', icon: '📍', path: '/tracking' },
          { name: 'Maintenance', icon: '🔧', path: '/maintenance' },
          { name: 'Insurance', icon: '🛡️', path: '/insurance' },
        ];
      default:
        return [
          { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
        ];
    }
  };

  const menuItems = getRoleMenuItems(user?.role || '');

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <img 
              src="/arimma-logo.svg" 
              alt="Arimma Agriculture Logo" 
              className="h-20 w-auto"
            />
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-lg">
                {user?.profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user?.profile?.first_name || 'User'}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors group"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button 
              onClick={() => handleNavigation('/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">⚙️</span>
              <span className="font-medium">Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xl">❓</span>
              <span className="font-medium">Help & Support</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
