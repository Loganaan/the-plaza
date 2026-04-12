"use client";

import { useTheme } from "../../context/ThemeContext";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryFilterProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="mb-6">
      <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* All Categories chip */}
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-3 py-1.5 rounded text-sm border ${
            selectedCategory === null
              ? isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-gray-900 text-white border-gray-900"
              : isDarkMode
                ? "bg-transparent text-gray-400 border-gray-700 hover:border-gray-600"
                : "bg-transparent text-gray-600 border-gray-300 hover:border-gray-400"
          }`}
        >
          All
        </button>

        {/* Category chips */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-3 py-1.5 rounded text-sm border ${
              selectedCategory === category
                ? isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-900 text-white border-gray-900"
                : isDarkMode
                  ? "bg-transparent text-gray-400 border-gray-700 hover:border-gray-600"
                  : "bg-transparent text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
