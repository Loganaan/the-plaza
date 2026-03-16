'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ListingDetail } from '@/app/marketplace/types';

export default function EditListing() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        const data = (await response.json()) as ListingDetail;
        setListing(data);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setPrice(String(data.price));
        setImageUrl(data.imageUrl ?? '');
        setCategory(data.category?.field ?? '');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/listings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price,
          imageUrl,
          category,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to update listing');
      }

      router.push(`/marketplace/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/listings/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to delete listing');
      }

      router.push('/marketplace');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-sm text-gray-500">Loading listing...</p>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-sm text-red-500">{error}</p>
        <button
          type="button"
          onClick={() => router.push('/marketplace')}
          className="mt-4 px-4 py-2 rounded bg-gray-200 text-gray-900"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded border var-border bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 rounded border var-border bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
          min="0"
          step="0.01"
          required
        />
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded border var-border bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
        />
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 rounded border var-border bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded border var-border bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
          rows={5}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded text-black font-semibold bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="px-4 py-2 rounded border border-red-400 text-red-500 hover:bg-red-50 transition disabled:opacity-60"
          >
            Delete Listing
          </button>
          <button
            type="button"
            onClick={() => router.push(`/marketplace/${params.id}`)}
            className="px-4 py-2 rounded border var-border text-var-text hover:bg-var-surface"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
