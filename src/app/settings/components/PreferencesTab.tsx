'use client';

import { useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

interface PreferencesTabProps {
  userData: {
    notificationsEnabled: boolean;
    emailNotifications: boolean;
  };
}

export default function PreferencesTab({ userData }: PreferencesTabProps) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    notificationsEnabled: userData?.notificationsEnabled ?? true,
    emailNotifications: userData?.emailNotifications ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = async (key: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, [key]: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      setMessage('✓ Preferences updated');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('✗ Failed to update preferences');
      setFormData((prev) => ({ ...prev, [key]: !value }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Notifications
        </h3>

        <div className="space-y-4">
          {/* Push Notifications */}
          <div className={`p-4 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Push Notifications</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Receive notifications when someone messages you
              </p>
            </div>
            <button
              disabled={loading}
              onClick={() => handleToggle('notificationsEnabled', !formData.notificationsEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                formData.notificationsEnabled ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  formData.notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Email Notifications */}
          <div className={`p-4 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Notifications</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Receive email summaries of activity
              </p>
            </div>
            <button
              disabled={loading}
              onClick={() => handleToggle('emailNotifications', !formData.emailNotifications)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                formData.emailNotifications ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  formData.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
