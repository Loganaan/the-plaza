'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewListing() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price,
          imageUrl,
          category,
        }),
      });

      if (res.ok) {
        router.push('/marketplace');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'Failed to create listing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = async (file: File | null) => {
    setImageFile(file);
    setUploadError(null);

    if (!file) {
      setImagePreview(null);
      setImageUrl('');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = typeof payload?.error === 'string'
          ? payload.error
          : 'Failed to upload image';
        throw new Error(message);
      }

      const data = await response.json();
      setImageUrl(data.url ?? '');
      setImagePreview(data.url ?? null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
      setImagePreview(null);
      setImageUrl('');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a Listing</h1>
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
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
          className="w-full p-3 rounded border var-border bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
        />
        {uploadingImage && (
          <p className="text-sm text-var-muted">Uploading image...</p>
        )}
        {uploadError && (
          <p className="text-sm text-red-500">{uploadError}</p>
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Listing preview"
            className="max-h-64 rounded border var-border object-cover"
          />
        )}
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
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded text-black font-semibold bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 transition disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
