"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Listing } from "@/app/marketplace/types.ts";
import SearchBar from "./components/SearchBar";
import ListingsGrid from "./components/ListingsGrid";

export default function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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

  const handleCategoryClick = (category: string) => {
    setSearch(category);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} listings={listings} />
        <Link
          href="/marketplace/new"
          className="inline-flex items-center justify-center rounded px-4 py-2 text-black font-semibold bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 transition"
        >
          Create Listing
        </Link>
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
