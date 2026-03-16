"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Listing } from "@/app/marketplace/types.ts";
import SearchBar from "./components/SearchBar";
import ListingsGrid from "./components/ListingsGrid";

export default function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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
        setListings(data);
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

  const handleCategoryClick = (category: string) => {
    setSearch(category);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} listings={listings} />
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
        listings={filteredListings} 
        loading={loading} 
        error={error} 
        onCategoryClick={handleCategoryClick}
      />
    </>
  );
}
