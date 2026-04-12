
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

interface DiscussionCategory {
  id: number;
  name: string;
}

interface Discussion {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  category: DiscussionCategory | null;
}

interface DiscussionsGridProps {
  discussions: Discussion[];
  loading: boolean;
  error: string | null;
  onCategoryClick?: (category: string) => void;
}

const DiscussionsGrid: React.FC<DiscussionsGridProps> = ({ discussions, loading, error, onCategoryClick }) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 shadow-lg animate-pulse ${
              isDarkMode ? "bg-[#1c1c1c]" : "bg-gray-100"
            }`}
          >
            <div className={`h-6 w-3/4 mb-3 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
            <div className={`h-4 w-full mb-2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
            <div className={`h-4 w-1/2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No discussions available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {discussions.map((d) => (
        <div
          key={d.id}
          onClick={() => router.push(`/discussions/${d.id}`)}
          className={`rounded-lg p-4 shadow-lg transition-colors cursor-pointer ${
            isDarkMode
              ? "bg-[#1c1c1c] hover:bg-[#252525]"
              : "bg-white border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
            {d.title}
          </h2>
          <p className={`text-sm mb-3 line-clamp-3 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
            {d.description}
          </p>
          {d.category && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (d.category) {
                  onCategoryClick?.(d.category.name);
                }
              }}
              className={`inline-block px-2 py-0.5 mb-2 rounded text-xs border cursor-pointer ${
                isDarkMode 
                  ? "bg-transparent text-gray-400 border-gray-700 hover:border-gray-600"
                  : "bg-transparent text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {d.category.name}
            </div>
          )}
          <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
            Posted: {new Date(d.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DiscussionsGrid;
