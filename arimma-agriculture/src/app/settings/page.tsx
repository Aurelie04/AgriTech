'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_name: string;
  business_type: string;
  city: string;
  state: string;
  country: string;
  role: string;
  created_at: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  claim_updates: boolean;
  loan_updates: boolean;
  weather_alerts: boolean;
  market_updates: boolean;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'farmers_only';
  show_contact_info: boolean;
  show_farm_location: boolean;
  data_sharing: boolean;
  analytics_tracking: boolean;
}

interface SecuritySettings {
  two_factor_auth: boolean;
  login_alerts: boolean;
  session_timeout: number;
  password_change_required: boolean;
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile settings
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    business_name: '',
    business_type: '',
    city: '',
    state: '',
    country: 'South Africa',
    role: '',
    created_at: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    claim_updates: true,
    loan_updates: true,
    weather_alerts: true,
    market_updates: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_visibility: 'farmers_only',
    show_contact_info: true,
    show_farm_location: false,
    data_sharing: false,
    analytics_tracking: true
  });

  // Security settings
  const [security, setSecurity] = useState<SecuritySettings>({
    two_factor_auth: false,
    login_alerts: true,
    session_timeout: 30,
    password_change_required: false
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        business_name: user.business_name || '',
        business_type: user.business_type || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || 'South Africa',
        role: user.role || '',
        created_at: user.created_at || ''
      });
    }
  }, [user]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Profile updated successfully!');
      } else {
        showMessage('error', data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage('error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications)
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Notification settings updated!');
      } else {
        showMessage('error', data.error || 'Failed to update notifications');
      }
    } catch (error) {
      console.error('Notification update error:', error);
      showMessage('error', 'Failed to update notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/settings/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacy)
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Privacy settings updated!');
      } else {
        showMessage('error', data.error || 'Failed to update privacy settings');
      }
    } catch (error) {
      console.error('Privacy update error:', error);
      showMessage('error', 'Failed to update privacy settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/settings/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(security)
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Security settings updated!');
      } else {
        showMessage('error', data.error || 'Failed to update security settings');
      }
    } catch (error) {
      console.error('Security update error:', error);
      showMessage('error', 'Failed to update security settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.new_password !== passwordData.confirm_password) {
      showMessage('error', 'New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Password changed successfully!');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        showMessage('error', data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      showMessage('error', 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/settings/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Account deleted successfully');
        setTimeout(() => logout(), 2000);
      } else {
        showMessage('error', data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      showMessage('error', 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'account', name: 'Account', icon: '🏠' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img 
                src="/arimma-logo.svg" 
                alt="Arimma Agriculture Logo" 
                className="h-16 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                Dashboard
              </a>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings, preferences, and privacy options.
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-sm rounded-lg">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={profile.first_name}
                          onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={profile.last_name}
                          onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input
                          type="text"
                          value={profile.business_name}
                          onChange={(e) => setProfile({...profile, business_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                        <select
                          value={profile.business_type}
                          onChange={(e) => setProfile({...profile, business_type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select business type</option>
                          <option value="individual">Individual Farmer</option>
                          <option value="cooperative">Cooperative</option>
                          <option value="company">Agricultural Company</option>
                          <option value="buyer">Buyer/Trader</option>
                          <option value="financier">Financier</option>
                          <option value="logistics">Logistics Provider</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => setProfile({...profile, city: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                        <input
                          type="text"
                          value={profile.state}
                          onChange={(e) => setProfile({...profile, state: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={profile.country}
                          onChange={(e) => setProfile({...profile, country: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">General Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.email_notifications}
                            onChange={(e) => setNotifications({...notifications, email_notifications: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Email notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.sms_notifications}
                            onChange={(e) => setNotifications({...notifications, sms_notifications: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">SMS notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.push_notifications}
                            onChange={(e) => setNotifications({...notifications, push_notifications: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Push notifications</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Specific Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.claim_updates}
                            onChange={(e) => setNotifications({...notifications, claim_updates: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Insurance claim updates</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.loan_updates}
                            onChange={(e) => setNotifications({...notifications, loan_updates: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Loan application updates</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.weather_alerts}
                            onChange={(e) => setNotifications({...notifications, weather_alerts: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Weather alerts</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.market_updates}
                            onChange={(e) => setNotifications({...notifications, market_updates: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Market price updates</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.marketing_emails}
                            onChange={(e) => setNotifications({...notifications, marketing_emails: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Marketing emails</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleNotificationUpdate}
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Notifications'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Profile Visibility</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="profile_visibility"
                            value="public"
                            checked={privacy.profile_visibility === 'public'}
                            onChange={(e) => setPrivacy({...privacy, profile_visibility: e.target.value as any})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-3 text-sm text-gray-700">Public - Visible to everyone</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="profile_visibility"
                            value="farmers_only"
                            checked={privacy.profile_visibility === 'farmers_only'}
                            onChange={(e) => setPrivacy({...privacy, profile_visibility: e.target.value as any})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-3 text-sm text-gray-700">Farmers Only - Visible to other farmers</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="profile_visibility"
                            value="private"
                            checked={privacy.profile_visibility === 'private'}
                            onChange={(e) => setPrivacy({...privacy, profile_visibility: e.target.value as any})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-3 text-sm text-gray-700">Private - Only visible to you</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Information Sharing</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={privacy.show_contact_info}
                            onChange={(e) => setPrivacy({...privacy, show_contact_info: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Show contact information</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={privacy.show_farm_location}
                            onChange={(e) => setPrivacy({...privacy, show_farm_location: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Show farm location</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={privacy.data_sharing}
                            onChange={(e) => setPrivacy({...privacy, data_sharing: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Allow data sharing for research</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={privacy.analytics_tracking}
                            onChange={(e) => setPrivacy({...privacy, analytics_tracking: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Allow analytics tracking</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handlePrivacyUpdate}
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Privacy Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                  <div className="space-y-8">
                    {/* Password Change */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                            required
                            minLength={8}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                            required
                            minLength={8}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {loading ? 'Changing...' : 'Change Password'}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Security Options */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Security Options</h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={security.two_factor_auth}
                            onChange={(e) => setSecurity({...security, two_factor_auth: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Enable two-factor authentication</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={security.login_alerts}
                            onChange={(e) => setSecurity({...security, login_alerts: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Login alerts</span>
                        </label>
                        <div className="flex items-center space-x-4">
                          <label className="text-sm text-gray-700">Session timeout (minutes):</label>
                          <select
                            value={security.session_timeout}
                            onChange={(e) => setSecurity({...security, session_timeout: parseInt(e.target.value)})}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={120}>2 hours</option>
                            <option value={480}>8 hours</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={handleSecurityUpdate}
                          disabled={loading}
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Update Security Settings'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Coming Soon</h3>
                          <p className="mt-1 text-sm text-yellow-700">
                            Additional preference settings will be available in future updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Management */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>
                  <div className="space-y-8">
                    {/* Account Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                      <div className="bg-gray-50 rounded-md p-4">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Account ID</dt>
                            <dd className="text-sm text-gray-900">{profile.id}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                            <dd className="text-sm text-gray-900 capitalize">{profile.role}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                            <dd className="text-sm text-gray-900">
                              {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="text-sm text-gray-900">{profile.email}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                            <p className="mt-1 text-sm text-red-700">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <div className="mt-4">
                              <button
                                onClick={handleAccountDeletion}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {loading ? 'Deleting...' : 'Delete Account'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


