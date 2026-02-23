
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SearchBar from './components/SearchBar';
import DiscussionsGrid from './components/DiscussionsGrid';

interface Discussion {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(''); 

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch('/api/discussions');
        if (!response.ok) throw new Error('Failed to fetch discussions');
        const data = await response.json();
        setDiscussions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const filteredDiscussions = search
    ? discussions.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.description.toLowerCase().includes(search.toLowerCase())
      )
    : discussions;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* New Discussion Button */}
        <Link
            href="/discussions/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-black rounded-md 
             bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90"
        >
          + New Discussion
        </Link>
      </div>

      {/* Grid */}
      <DiscussionsGrid discussions={filteredDiscussions} loading={loading} error={error} />
    </div>
  );
}
