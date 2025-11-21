"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Listing } from "@/app/marketplace/types.ts";
import { useTheme } from "../../context/ThemeContext";

interface ListingsGridProps {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  onCategoryClick?: (category: string) => void;
}

const ListingsGrid: React.FC<ListingsGridProps> = ({ listings, loading, error, onCategoryClick }) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 flex flex-col gap-3 shadow-lg animate-pulse ${
              isDarkMode ? "bg-[#1c1c1c]" : "bg-gray-100"
            }`}
          >
            <div className={`h-40 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-gray-300"
            }`} />
            <div>
              <div className={`h-4 rounded mb-2 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-400"
              }`} />
              <div className={`h-4 rounded w-12 mb-1 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-400"
              }`} />
              <div className={`h-3 rounded w-24 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-400"
              }`} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="col-span-4 text-center py-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }
  if (listings.length === 0) {
    return (
      <div className="col-span-4 text-center py-8">
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          No listings available
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className={`rounded-lg p-4 flex flex-col gap-3 shadow-lg transition-all relative overflow-hidden group ${
            isDarkMode 
              ? "bg-[#1c1c1c]" 
              : "bg-white border border-gray-200 hover:bg-gray-200"
          }`}
        >
          {isDarkMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-50 transition-opacity rounded-lg pointer-events-none" />
          )}
          <div 
            onClick={() => router.push(`/marketplace/${listing.id}`)}
            className={`h-40 rounded-lg flex items-center justify-center overflow-hidden relative cursor-pointer ${
              isDarkMode ? "bg-gray-800 text-gray-600" : "bg-gray-200 text-gray-400"
            }`}>
            {listing.imageUrl ? (
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <div className="relative z-10">
            <p 
              onClick={() => router.push(`/marketplace/${listing.id}`)}
              className={`text-sm font-semibold truncate transition-colors cursor-pointer hover:underline ${
                isDarkMode ? "text-gray-200 group-hover:text-white" : "text-gray-900"
              }`} 
              title={listing.title}
            >
              {listing.title}
            </p>
            <p className={`text-sm font-bold transition-colors ${
              isDarkMode ? "text-green-400 group-hover:text-green-300" : "text-green-600"
            }`}>
              ${listing.price.toFixed(2)}
            </p>
            <p className={`text-xs line-clamp-2 transition-colors ${
              isDarkMode ? "text-gray-400 group-hover:text-gray-200" : "text-gray-600"
            }`}>
              {listing.description || "No description available"}
            </p>
            {listing.category && (
              <p 
                onClick={(e) => {
                  e.stopPropagation();
                  if (listing.category) {
                    onCategoryClick?.(listing.category.field);
                  }
                }}
                className={`text-xs mt-1 transition-colors cursor-pointer hover:underline ${
                  isDarkMode ? "text-yellow-400 group-hover:text-yellow-200" : "text-yellow-600 group-hover:text-yellow-800"
                }`}
              >
                {listing.category.field}
              </p>
            )}
            <p className={`text-xs mt-1 transition-colors ${
              isDarkMode ? "text-gray-500 group-hover:text-gray-300" : "text-gray-500"
            }`}>
              Listed: {new Date(listing.dateListed).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingsGrid;
