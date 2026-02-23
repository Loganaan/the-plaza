
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';

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
  const { isDarkMode } = useTheme();
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

  if (!discussion) return <div className={`p-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Title & Description */}
      <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>{discussion.title}</h1>
      <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{discussion.description}</p>

      {/* Replies */}
      <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Replies</h2>
      <ul className="mb-4">
        {replies.map((r) => (
          <li key={r.id} className={`p-3 rounded border mb-2 ${
            isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'
          }`}>
            {r.content}
          </li>
        ))}
      </ul>

      {/* Reply Form */}
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className={`w-full p-3 rounded border mb-3 focus:outline-none focus:ring-2 ${
          isDarkMode 
            ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:ring-yellow-500' 
            : 'bg-white text-black placeholder-gray-400 border-gray-300 focus:ring-yellow-600'
        }`}
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
