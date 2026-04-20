'use client';

import { useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

interface PrivacyTabProps {
  userData: {
    canReceiveMessages: boolean;
    listingVisibility: string;
    profileVisibility: string;
  };
}

export default function PrivacyTab({ userData }: PrivacyTabProps) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    canReceiveMessages: userData?.canReceiveMessages ?? true,
    listingVisibility: userData?.listingVisibility ?? 'public',
    profileVisibility: userData?.profileVisibility ?? 'public',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, type, value } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }

      setMessage('✓ Privacy settings updated');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('✗ Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Messaging
        </h3>
        <div className={`p-4 rounded-lg flex items-center gap-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <input
            type="checkbox"
            name="canReceiveMessages"
            checked={formData.canReceiveMessages}
            onChange={handleChange}
            className="w-4 h-4 rounded"
          />
          <label className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Allow others to send you messages
          </label>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Listing Visibility
        </h3>
        <select
          name="listingVisibility"
          value={formData.listingVisibility}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="public">Public - Everyone can see your listings</option>
          <option value="contacts-only">Contacts Only - Only your contacts can see</option>
          <option value="private">Private - No one can see your listings</option>
        </select>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Control who can view your marketplace listings
        </p>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Profile Visibility
        </h3>
        <select
          name="profileVisibility"
          value={formData.profileVisibility}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="public">Public - Everyone can view your profile</option>
          <option value="private">Private - Only you can view your profile</option>
        </select>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Control who can view your profile information and stats
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
