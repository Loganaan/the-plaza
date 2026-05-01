'use client';

import { useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

interface ProfileTabProps {
  userData: {
    name: string;
    picture: string;
    bio: string;
    location: string;
  };
}

export default function ProfileTab({ userData }: ProfileTabProps) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    bio: userData?.bio || '',
    location: userData?.location || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        throw new Error('Failed to update profile');
      }

      await response.json();
      setMessage('✓ Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('✗ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? 'bg-[#1c1c1c] border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          maxLength={500}
          rows={4}
          placeholder="Write a short bio about yourself..."
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? 'bg-[#1c1c1c] border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
        />
        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {formData.bio.length}/500
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          maxLength={100}
          placeholder="City, State"
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? 'bg-[#1c1c1c] border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
        />
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.includes('✓')
              ? isDarkMode
                ? 'bg-green-900/20 text-green-200'
                : 'bg-green-100 text-green-800'
              : isDarkMode
              ? 'bg-red-900/20 text-red-200'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 disabled:opacity-60 text-black font-semibold py-2 rounded-lg transition"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
