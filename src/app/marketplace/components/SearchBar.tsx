"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  listings?: Array<{ title: string }>;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, listings = [] }) => {
  const { isDarkMode } = useTheme();
  const [suggestion, setSuggestion] = useState("");

  // Find the first matching suggestion when user types
  useEffect(() => {
    if (value.length >= 2) {
      const match = listings.find(listing => 
        listing.title.toLowerCase().startsWith(value.toLowerCase())
      );
      
      if (match) {
        // Show only the remaining part of the suggestion
        setSuggestion(match.title);
      } else {
        setSuggestion("");
      }
    } else {
      setSuggestion("");
    }
  }, [value, listings]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Accept suggestion on Tab or Right Arrow key
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
      e.preventDefault();
      const syntheticEvent = {
        target: { value: suggestion }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
      setSuggestion("");
    }
  };

  const handleClear = () => {
    const syntheticEvent = {
      target: { value: "" }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setSuggestion("");
  };
  
  return (
    <div className="max-w-3xl mb-8">
      <div className={`flex items-center rounded-full px-4 py-2 relative gap-2 ${
        isDarkMode ? "bg-[#3a3a3a]" : "bg-gray-100 border border-gray-300"
      }`}>
        <div className="flex-1 relative">
          {/* Ghost text for autocomplete suggestion */}
          {suggestion && value && (
            <div className={`absolute left-0 top-0 pointer-events-none ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}>
              <span className="invisible">{value}</span>
              <span>{suggestion.slice(value.length)}</span>
            </div>
          )}
          <input
            type="text"
            placeholder="Search..."
            className={`bg-transparent w-full outline-none relative z-10 ${
              isDarkMode ? "text-gray-300 placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
            }`}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        {value && (
          <button
            onClick={handleClear}
            className={`transition-colors ${
              isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
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
