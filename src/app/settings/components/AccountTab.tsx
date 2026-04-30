'use client';

import { useTheme } from '@/app/context/ThemeContext';

interface AccountTabProps {
  userData: {
    email: string;
    name: string;
    createdAt: string;
  };
}

export default function AccountTab({ userData }: AccountTabProps) {
  const { isDarkMode } = useTheme();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Email Address
        </h3>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1c1c1c]' : 'bg-gray-100'}`}>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{userData?.email}</p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your primary email address. Contact support to change it.
          </p>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Account Created
        </h3>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1c1c1c]' : 'bg-gray-100'}`}>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {formatDate(userData?.createdAt)}
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Member since
          </p>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Connected Accounts
        </h3>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1c1c1c]' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Google</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connected</p>
            </div>
            <span className="text-green-500 font-semibold">✓</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Danger Zone
        </h3>
        <div className={`p-4 rounded-lg border-2 border-red-500 ${isDarkMode ? 'bg-red-900/10' : 'bg-red-50'}`}>
          <button disabled className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors">
            Delete Account
          </button>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            This action is permanent and cannot be undone. Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
