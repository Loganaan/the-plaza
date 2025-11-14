"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Listing } from "@/app/marketplace/types.ts";

interface ListingsGridProps {
  listings: Listing[];
  loading: boolean;
  error: string | null;
}

const ListingsGrid: React.FC<ListingsGridProps> = ({ listings, loading, error }) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] rounded-lg p-4 flex flex-col gap-3 shadow-lg animate-pulse"
          >
            <div className="bg-gray-800 h-40 rounded-lg" />
            <div>
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-4 bg-gray-700 rounded w-12 mb-1" />
              <div className="h-3 bg-gray-700 rounded w-24" />
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
        <p className="text-gray-400">No listings available</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          onClick={() => router.push(`/marketplace/${listing.id}`)}
          className="bg-[#1c1c1c] rounded-lg p-4 flex flex-col gap-3 shadow-lg hover:bg-[#252525] transition-colors cursor-pointer"
        >
          <div className="bg-gray-800 h-40 rounded-lg flex items-center justify-center text-gray-600 overflow-hidden relative">
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
          <div>
            <p className="text-sm font-semibold truncate" title={listing.title}>
              {listing.title}
            </p>
            <p className="text-sm font-bold text-green-400">
              ${listing.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 line-clamp-2">
              {listing.description || "No description available"}
            </p>
            {listing.category && (
              <p className="text-xs text-yellow-400 mt-1">
                {listing.category.field}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Listed: {new Date(listing.dateListed).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingsGrid;
