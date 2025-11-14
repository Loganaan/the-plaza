"use client";

import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="max-w-3xl mb-8">
      <div className={`flex items-center rounded-full px-4 py-2 ${
        isDarkMode ? "bg-[#1c1c1c]" : "bg-gray-100 border border-gray-300"
      }`}>
        <input
          type="text"
          placeholder="Search..."
          className={`bg-transparent flex-1 outline-none ${
            isDarkMode ? "text-gray-300 placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
          }`}
          value={value}
          onChange={onChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
