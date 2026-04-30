"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/app/marketplace/types.ts";
import { useTheme } from "../../context/ThemeContext";

interface ListingsGridProps {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  onCategoryClick?: (category: string) => void;
  onListingDeleted?: (listingId: number) => void;
  showMine?: boolean;
  onDeleteListing?: (listingId: number) => void;
}

const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  loading,
  error,
  onCategoryClick,
  onListingDeleted,
  showMine = false,
  onDeleteListing,
}) => {
  const { isDarkMode, isAdmin } = useTheme();

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
      {listings.map((listing) => {
        const ListingCard = () => {
          const [isHovered, setIsHovered] = useState(false);
          const [showAltText, setShowAltText] = useState(false);
          const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
          const [isDeleting, setIsDeleting] = useState(false);
          const [deleteError, setDeleteError] = useState<string | null>(null);
          const categoryField = listing.category?.field?.trim();

          const handleDeleteListing = async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (isDeleting) {
              return;
            }

            setIsDeleting(true);
            setDeleteError(null);

            try {
              const headers = isAdmin ? { "x-admin-override": "true" } : undefined;
              const response = await fetch(`/api/listings/${listing.id}`, {
                method: "DELETE",
                headers,
              });

              if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.error || "Failed to delete listing");
              }

              onListingDeleted?.(listing.id);
              setShowDeleteConfirm(false);
            } catch (err) {
              setDeleteError(err instanceof Error ? err.message : "Failed to delete listing");
            } finally {
              setIsDeleting(false);
            }
          };
          
          return (
            <div
              key={listing.id}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`rounded-lg p-4 flex flex-col gap-3 shadow-lg relative overflow-hidden transition-colors border ${
                isDarkMode 
                  ? "bg-[#1c1c1c] border-transparent" 
                  : isHovered 
                    ? "bg-gray-200 border-gray-300" 
                    : "bg-white border-gray-200"
              }`}
            >
              {isDarkMode && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-opacity duration-200 rounded-lg pointer-events-none" 
                  style={{ opacity: isHovered ? 0.5 : 0 }}
                />
              )}
          <div
            className={`h-40 rounded-lg overflow-hidden relative ${
              isDarkMode ? "bg-gray-800 text-gray-600" : "bg-gray-200 text-gray-400"
            }`}
          >
            <Link
              href={`/marketplace/${listing.id}`}
              aria-label={`View listing: ${listing.title}`}
              className="absolute inset-0 z-0 flex items-center justify-center rounded-lg border-2 border-transparent focus:outline-none focus-visible:border-cyan-400"
            >
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
            </Link>
            {/* Alt button */}
            {isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAltText(!showAltText);
                }}
                className={`absolute bottom-2 right-2 px-2 py-1 text-xs font-semibold rounded transition-all z-10 animate-in fade-in duration-200 ${
                  isDarkMode 
                    ? "bg-gray-900/80 text-white hover:bg-gray-900" 
                    : "bg-white/80 text-gray-900 hover:bg-white"
                } shadow-md`}
                title="Show alt text"
              >
                alt
              </button>
            )}
            {/* Alt text overlay */}
            {showAltText && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAltText(false);
                }}
                className={`absolute inset-0 flex items-center justify-center p-4 z-20 cursor-pointer ${
                  isDarkMode ? "bg-black/90" : "bg-white/95"
                }`}
              >
                <p className={`text-xs text-center ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                  TEMP TEXT, TO BE FILLED IN ON LISTING CREATION
                </p>
              </div>
            )}
          </div>
              <div className="relative z-10">
                {showMine && (
                  <div className="absolute right-0 top-0 flex items-center gap-2">
                    <Link
                      href={`/marketplace/${listing.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-semibold px-2 py-1 rounded border transition ${
                        isDarkMode
                          ? "border-gray-600 text-gray-200 hover:bg-gray-800"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!onDeleteListing) return;
                        if (window.confirm("Delete this listing? This cannot be undone.")) {
                          onDeleteListing(listing.id);
                        }
                      }}
                      className={`text-xs font-semibold px-2 py-1 rounded border transition ${
                        isDarkMode
                          ? "border-red-500 text-red-400 hover:bg-red-900/20"
                          : "border-red-300 text-red-500 hover:bg-red-50"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                )}
                <Link
                  href={`/marketplace/${listing.id}`}
                  className={`text-sm font-semibold truncate transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded ${
                    isDarkMode ? (isHovered ? "text-white" : "text-gray-200") : "text-gray-900"
                  }`}
                  title={listing.title}
                >
                  {listing.title}
                </Link>
                <p className={`text-sm font-bold transition-colors ${
                  isDarkMode ? (isHovered ? "text-green-300" : "text-green-400") : "text-green-600"
                }`}>
                  ${listing.price.toFixed(2)}
                </p>
                <p className={`text-xs line-clamp-2 transition-colors ${
                  isDarkMode ? (isHovered ? "text-gray-200" : "text-gray-400") : "text-gray-600"
                }`}>
                  {listing.description || "No description available"}
                </p>
                {categoryField && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryClick?.(categoryField);
                    }}
                    className={`text-xs mt-1 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded ${
                      isDarkMode ? (isHovered ? "text-yellow-200" : "text-yellow-400") : "text-yellow-600 hover:text-yellow-800"
                    }`}
                  >
                    {categoryField}
                  </button>
                )}
                <p className={`text-xs mt-1 transition-colors ${
                  isDarkMode ? (isHovered ? "text-gray-300" : "text-gray-500") : "text-gray-500"
                }`}>
                  Listed: {new Date(listing.dateListed).toLocaleDateString()}
                </p>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    className="mt-2 w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              {/* Delete Confirmation Modal */}
              {showDeleteConfirm && (
                <div 
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(false);
                  }}
                >
                  <div 
                    className={`rounded-lg p-6 max-w-md w-full mx-4 shadow-xl ${
                      isDarkMode ? "bg-[#2c2c2c]" : "bg-white"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      Confirm Deletion
                    </h3>
                    <p className={`mb-6 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Are you sure you wish to delete this listing?
                    </p>
                    {deleteError && (
                      <p className="mb-4 text-sm text-red-500">{deleteError}</p>
                    )}
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(false);
                        }}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded font-semibold transition-colors ${
                          isDarkMode 
                            ? "bg-gray-700 hover:bg-gray-600 text-white" 
                            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                        }`}
                      >
                        No
                      </button>
                      <button
                        onClick={handleDeleteListing}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
                      >
                        {isDeleting ? "Deleting..." : "Yes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        };
        
        return <ListingCard key={listing.id} />;
      })}
    </div>
  );
};

export default ListingsGrid;
