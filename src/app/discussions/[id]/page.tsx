
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Discussion {
  id: number;
  title: string;
  description: string;
}

interface Reply {
  id: number;
  content: string;
}

export default function DiscussionDetail() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/discussions/${id}`)
        .then((res) => res.json())
        .then((data) => setDiscussion(data));

      fetch(`/api/replies?discussionId=${id}`)
        .then((res) => res.json())
        .then((data) => setReplies(data));
    }
  }, [id]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    const res = await fetch('/api/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: replyText, discussionId: parseInt(id as string) }),
    });
    if (res.ok) {
      const newReply = await res.json();
      setReplies([...replies, newReply]);
      setReplyText('');
    }
  };

  if (!discussion) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Title & Description */}
      <h1 className="text-2xl font-bold mb-4">{discussion.title}</h1>
      <p className="mb-6">{discussion.description}</p>

      {/* Replies */}
      <h2 className="text-xl font-semibold mb-2">Replies</h2>
      <ul className="mb-4">
        {replies.map((r) => (
          <li key={r.id} className="p-3 rounded border mb-2 bg-var-card">
            {r.content}
          </li>
        ))}
      </ul>

      {/* Reply Form */}
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="w-full p-3 rounded border mb-3 bg-var-surface text-var-text placeholder-var-muted focus:outline-none focus:ring-2 focus:ring-var-accent"
        placeholder="Write a reply..."
      />
      <button
        onClick={handleReply}
        className="px-4 py-2 rounded text-black font-semibold
                   bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 transition"
      >
        Reply
      </button>
    </div>
  );
}
