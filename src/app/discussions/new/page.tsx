
'use client';

import { useState } from 'react';

export default function NewDiscussion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      alert('Discussion created!');
      setTitle('');
      setDescription('');
    } else {
      alert('Failed to create discussion');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Start a New Discussion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded border var-border bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded border var-border bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
          rows={5}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded text-black font-semibold
                     bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 transition"
        >
          Create Discussion
        </button>
      </form>
    </div>
  );
}
