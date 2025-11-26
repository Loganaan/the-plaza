
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

interface Discussion {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface DiscussionsGridProps {
  discussions: Discussion[];
  loading: boolean;
  error: string | null;
}

const DiscussionsGrid: React.FC<DiscussionsGridProps> = ({ discussions, loading, error }) => {
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
          <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
            Posted: {new Date(d.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DiscussionsGrid;
