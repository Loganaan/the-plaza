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
      label: 'Listings',
      value: stats?.listingsCreated || 0,
      note: 'Items posted',
    },
    {
      label: 'Discussions',
      value: stats?.discussionsCreated || 0,
      note: 'Threads started',
    },
    {
      label: 'Replies',
      value: stats?.repliesCreated || 0,
      note: 'Messages sent',
    },
  ];

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
              className={`rounded-xl border p-5 shadow-sm ${
                isDarkMode ? 'bg-[#1c1c1c] border-gray-800' : 'bg-white border-gray-200'
              }`}
            >
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {card.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {card.value}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Account Information
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div
            className={`rounded-xl border p-4 ${
              isDarkMode ? 'bg-[#1c1c1c] border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Member since
            </p>
            <p className={`mt-2 text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {formatDate(userData?.createdAt)}
            </p>
          </div>
          <div
            className={`rounded-xl border p-4 ${
              isDarkMode ? 'bg-[#1c1c1c] border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Account name
            </p>
            <p className={`mt-2 text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {userData?.name || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Standing
        </h3>
        <div
          className={`rounded-xl border p-5 ${
            isDarkMode ? 'bg-[#1c1c1c] border-gray-800' : 'bg-white border-gray-200'
          }`}
        >
          <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Current level
          </p>
          <p className={`mt-2 text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Member
          </p>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Keep engaging to unlock badges.
          </p>
        </div>
      </div>
    </div>
  );
}
