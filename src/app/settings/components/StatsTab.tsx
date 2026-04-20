'use client';

import { useTheme } from '@/app/context/ThemeContext';

interface StatsTabProps {
  stats: {
    listingsCreated: number;
    discussionsCreated: number;
    repliesCreated: number;
  };
  userData: {
    name: string;
    createdAt: string;
  };
}

export default function StatsTab({ stats, userData }: StatsTabProps) {
  const { isDarkMode } = useTheme();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statCards = [
    {
      label: 'Listings Created',
      value: stats?.listingsCreated || 0,
      icon: '📦',
      color: 'blue',
    },
    {
      label: 'Discussions Started',
      value: stats?.discussionsCreated || 0,
      icon: '💬',
      color: 'green',
    },
    {
      label: 'Replies Posted',
      value: stats?.repliesCreated || 0,
      icon: '✉️',
      color: 'purple',
    },
  ];

  const colorMap = {
    blue: isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200',
    green: isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200',
    purple: isDarkMode ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`p-6 rounded-lg border-2 ${colorMap[card.color as keyof typeof colorMap]}`}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {card.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Account Information
        </h3>
        <div className="space-y-3">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Member since</p>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatDate(userData?.createdAt)}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account Name</p>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {userData?.name || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Level & Badges
        </h3>
        <div className={`p-6 rounded-lg text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-4xl mb-2">🌟</p>
          <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Member</p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Keep engaging to unlock badges!
          </p>
        </div>
      </div>
    </div>
  );
}
