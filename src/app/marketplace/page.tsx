"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Listing } from "@/app/marketplace/types.ts";
import SearchBar from "./components/SearchBar";
import ListingsGrid from "./components/ListingsGrid";
import { useTheme } from "../context/ThemeContext";

export default function Marketplace() {
  const { isDarkMode } = useTheme();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showMine, setShowMine] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    const fetchListings = async () => {
      if (showMine && status === "unauthenticated") {
        setListings([]);
        setError("Please log in to view your listings.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = showMine ? "/api/listings/mine" : "/api/listings";
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(showMine ? "Failed to fetch your listings" : "Failed to fetch listings");
        }
        const data = await response.json();
        // Handle paginated response structure
        const listingsArray = data.data || data;
        setListings(Array.isArray(listingsArray) ? listingsArray : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchListings();
    }
  }, [showMine, status]);

  // Optionally filter listings by search
  const filteredListings = search
    ? listings.filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        (l.description?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (l.category?.field.toLowerCase().includes(search.toLowerCase()) ?? false)
      )
    : listings;

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === "az") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "za") {
      return b.title.localeCompare(a.title);
    }

    if (sortBy === "priceHighLow") {
      return b.price - a.price;
    }

    if (sortBy === "priceLowHigh") {
      return a.price - b.price;
    }

    return 0;
  });

  const handleCategoryClick = (category: string) => {
    setSearch(category);
  };

  const handleListingDeleted = (listingId: number) => {
    setListings((prevListings) => prevListings.filter((listing) => listing.id !== listingId));
  };

  const handleDeleteListing = async (listingId: number) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to delete listing");
      }

      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete listing");
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <label
            htmlFor="marketplace-sort"
            className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Sort By
          </label>
          <select
            id="marketplace-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`rounded-md px-3 py-2 text-sm border outline-none ${
              isDarkMode
                ? "bg-[#2c2c2c] border-gray-700 text-gray-200"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="default">Default</option>
            <option value="az">Alphabetically (A to Z)</option>
            <option value="za">Alphabetically (Z to A)</option>
            <option value="priceHighLow">Pricing (High to Low)</option>
            <option value="priceLowHigh">Pricing (Low to High)</option>
          </select>
        </div>

        <div className="flex-1 lg:max-w-2xl">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} listings={listings} />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setShowMine((prev) => !prev)}
            disabled={status === "loading"}
            className={`inline-flex items-center justify-center rounded px-4 py-2 font-semibold transition border ${
              showMine
                ? "bg-yellow-400 text-black border-yellow-500"
                : "bg-transparent text-var-text border var-border hover:bg-var-surface"
            } ${status === "loading" ? "opacity-60" : ""}`}
          >
            {showMine ? "Viewing My Listings" : "Show My Listings"}
          </button>
          <Link
            href="/marketplace/new"
            className="inline-flex items-center justify-center rounded px-4 py-2 text-black font-semibold bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 transition"
          >
            Create Listing
          </Link>
        </div>
      </div>
      <ListingsGrid 
        listings={sortedListings} 
        loading={loading} 
        error={error} 
        onCategoryClick={handleCategoryClick}
        onListingDeleted={handleListingDeleted}
        showMine={showMine}
        onDeleteListing={handleDeleteListing}
      />
    </>
  );
}
