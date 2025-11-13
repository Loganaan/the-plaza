"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatBox from "./components/ChatBox";
import type { ListingDetail } from "@/app/marketplace/types";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#121212] text-gray-200">
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="mb-6">
              <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
            </div>
            <div className="bg-[#1c1c1c] rounded-lg p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-gray-800 h-96 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex min-h-screen bg-[#121212] text-gray-200">
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.push('/marketplace')}
              className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              ← Back to Marketplace
            </button>
            <div className="bg-[#1c1c1c] rounded-lg p-8 text-center">
              <p className="text-red-400">{error || 'Listing not found'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#121212] text-gray-200">
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/marketplace')}
            className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Marketplace
          </button>

          <div className="bg-[#1c1c1c] rounded-lg p-8 shadow-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="bg-gray-800 h-96 rounded-lg flex items-center justify-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20"
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
              </div>

              {/* Details */}
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <p className="text-2xl font-bold text-green-400">
                    ${listing.price.toFixed(2)}
                  </p>
                </div>

                {listing.category && (
                  <div className="inline-block">
                    <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      {listing.category.field}
                    </span>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-400">
                    {listing.description || "No description available"}
                  </p>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-auto">
                  <h2 className="text-sm font-semibold mb-2 text-gray-400">Seller Information</h2>
                  <p className="text-sm">
                    <span className="text-gray-400">Name:</span>{" "}
                    {listing.seller.name || "Anonymous"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Email:</span>{" "}
                    {listing.seller.email}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Listed:</span>{" "}
                    {new Date(listing.dateListed).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Status:</span>{" "}
                    <span className={`capitalize ${listing.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                      {listing.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Box */}
        {listing.conversations.length > 0 && (
          <ChatBox conversation={listing.conversations[0]} />
        )}
      </main>
    </div>
  );
}
