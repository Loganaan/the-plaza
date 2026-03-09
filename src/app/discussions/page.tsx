
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SearchBar from './components/SearchBar';
import DiscussionsGrid from './components/DiscussionsGrid';
import CategoryFilter from './components/CategoryFilter';

interface DiscussionCategory {
  id: number;
  name: string;
}

interface Discussion {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  category: DiscussionCategory | null;
}

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(''); 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Get unique categories from discussions
  const categories = Array.from(
    new Set(discussions.map(d => d.category?.name).filter(Boolean))
  ) as string[];

  // Filter discussions by search and category
  const filteredDiscussions = discussions.filter((d) => {
    const matchesSearch = search
      ? d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase()) ||
        (d.category?.name.toLowerCase().includes(search.toLowerCase()) ?? false)
      : true;
    
    const matchesCategory = selectedCategory
      ? d.category?.name === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearch(""); // Clear search when selecting a category
  };

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

      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Grid */}
      <DiscussionsGrid 
        discussions={filteredDiscussions} 
        loading={loading} 
        error={error}
        onCategoryClick={handleCategoryClick}
      />
    </div>
  );
}
