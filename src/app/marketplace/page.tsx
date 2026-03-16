"use client";

import { useEffect, useState } from "react";
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
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

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

  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreating) {
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          price: Number(newPrice),
          description: newDescription,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create listing");
      }

      setListings((prev) => [data as Listing, ...prev]);
      setShowQuickCreate(false);
      setNewTitle("");
      setNewPrice("");
      setNewDescription("");
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => {
            setCreateError(null);
            setShowQuickCreate(true);
          }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition-colors"
        >
          Quick Listing
        </button>
      </div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} listings={listings} />
        <div className="flex items-center gap-2 whitespace-nowrap">
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
      </div>
      <ListingsGrid 
        listings={sortedListings} 
        loading={loading} 
        error={error} 
        onCategoryClick={handleCategoryClick}
        onListingDeleted={handleListingDeleted}
      />

      {showQuickCreate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            if (!isCreating) {
              setShowQuickCreate(false);
            }
          }}
        >
          <form
            onSubmit={handleCreateListing}
            onClick={(e) => e.stopPropagation()}
            className={`rounded-lg p-6 w-full max-w-md mx-4 shadow-xl ${
              isDarkMode ? "bg-[#2c2c2c]" : "bg-white"
            }`}
          >
            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Create Quick Listing
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className={`w-full rounded px-3 py-2 border outline-none ${
                  isDarkMode
                    ? "bg-[#1c1c1c] border-gray-700 text-gray-200 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />

              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
                className={`w-full rounded px-3 py-2 border outline-none ${
                  isDarkMode
                    ? "bg-[#1c1c1c] border-gray-700 text-gray-200 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />

              <textarea
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                className={`w-full rounded px-3 py-2 border outline-none resize-none ${
                  isDarkMode
                    ? "bg-[#1c1c1c] border-gray-700 text-gray-200 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            {createError && <p className="mt-3 text-sm text-red-500">{createError}</p>}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={isCreating}
                onClick={() => setShowQuickCreate(false)}
                className={`px-4 py-2 rounded font-semibold transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
