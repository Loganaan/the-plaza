'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/app/context/ThemeContext';
import ProfileTab from './components/ProfileTab';
import AccountTab from './components/AccountTab';
import PreferencesTab from './components/PreferencesTab';
import PrivacyTab from './components/PrivacyTab';
import StatsTab from './components/StatsTab';

interface UserData {
  name: string;
  email: string;
  picture: string;
  bio: string;
  location: string;
  createdAt: string;
  canReceiveMessages: boolean;
  listingVisibility: string;
  profileVisibility: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
}

interface Stats {
  listingsCreated: number;
  discussionsCreated: number;
  repliesCreated: number;
}

export default function SettingsPage() {
  const { isDarkMode } = useTheme();
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setError('Please log in to access settings');
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setUserData(data.user);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status]);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'stats', label: 'Stats' },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-300 dark:border-gray-700">
          <div className="flex gap-4 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? `border-b-2 ${isDarkMode ? 'border-blue-500 text-blue-500' : 'border-blue-600 text-blue-600'}`
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {activeTab === 'profile' && userData && <ProfileTab userData={userData} />}
          {activeTab === 'account' && userData && <AccountTab userData={userData} />}
          {activeTab === 'preferences' && userData && <PreferencesTab userData={userData} />}
          {activeTab === 'privacy' && userData && <PrivacyTab userData={userData} />}
          {activeTab === 'stats' && stats && userData && <StatsTab stats={stats} userData={userData} />}
        </div>
      </div>
    </div>
  );
}
