
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

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

interface DiscussionsGridProps {
  discussions: Discussion[];
  loading: boolean;
  error: string | null;
  onCategoryClick?: (category: string) => void;
}

const DiscussionsGrid: React.FC<DiscussionsGridProps> = ({ discussions, loading, error, onCategoryClick }) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const reportReasons = [
    { value: "scam", label: "Scam or misleading" },
    { value: "prohibited", label: "Prohibited item" },
    { value: "harassment", label: "Harassment or abuse" },
    { value: "spam", label: "Spam or duplicate" },
    { value: "other", label: "Other" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 shadow-lg animate-pulse ${
              isDarkMode ? "bg-[#1c1c1c]" : "bg-gray-100"
            }`}
          >
            <div className={`h-6 w-3/4 mb-3 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
            <div className={`h-4 w-full mb-2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
            <div className={`h-4 w-1/2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No discussions available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {discussions.map((d) => {
        const DiscussionCard = () => {
          const [showReportModal, setShowReportModal] = useState(false);
          const [reportReason, setReportReason] = useState("harassment");
          const [reportMessage, setReportMessage] = useState("");
          const [reportError, setReportError] = useState<string | null>(null);
          const [isReporting, setIsReporting] = useState(false);
          const [reportSuccess, setReportSuccess] = useState(false);

          const handleReportDiscussion = async () => {
            if (isReporting) {
              return;
            }

            setIsReporting(true);
            setReportError(null);

            try {
              const response = await fetch("/api/discussion-reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  discussionId: Number.parseInt(d.id, 10),
                  reason: reportReason,
                  message: reportMessage.trim() || undefined,
                }),
              });

              if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload?.error || "Failed to submit report");
              }

              setReportSuccess(true);
              setReportMessage("");
            } catch (err) {
              setReportError(err instanceof Error ? err.message : "Failed to submit report");
            } finally {
              setIsReporting(false);
            }
          };

          return (
            <div
              key={d.id}
              onClick={() => router.push(`/discussions/${d.id}`)}
              className={`rounded-lg p-4 shadow-lg transition-colors cursor-pointer ${
                isDarkMode
                  ? "bg-[#1c1c1c] hover:bg-[#252525]"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                  {d.title}
                </h2>
              </div>
              <p className={`text-sm mb-3 line-clamp-3 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                {d.description}
              </p>
              {d.category && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (d.category) {
                      onCategoryClick?.(d.category.name);
                    }
                  }}
                  className={`inline-block px-2 py-0.5 mb-2 rounded text-xs border cursor-pointer ${
                    isDarkMode
                      ? "bg-transparent text-gray-400 border-gray-700 hover:border-gray-600"
                      : "bg-transparent text-gray-600 border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {d.category.name}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between">
                <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                  Posted: {new Date(d.createdAt).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportSuccess(false);
                    setReportError(null);
                    setShowReportModal(true);
                  }}
                  className={`inline-flex items-center justify-center h-8 w-8 rounded-full border transition-colors ${
                    isDarkMode
                      ? "border-yellow-500/70 text-yellow-200 hover:bg-yellow-500/10"
                      : "border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                  }`}
                  aria-label="Report discussion"
                  title="Report discussion"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M6 4v16" />
                    <path d="M6 4h10l-2 3 2 3H6" />
                  </svg>
                </button>
              </div>

              {showReportModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReportModal(false);
                  }}
                >
                  <div
                    className={`w-full max-w-md rounded-xl p-6 shadow-xl ${
                      isDarkMode ? "bg-[#1c1c1c]" : "bg-white"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Report discussion
                    </h3>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Reason
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 mb-4 ${
                        isDarkMode
                          ? "bg-[#181818] border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                    >
                      {reportReasons.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Details (optional)
                    </label>
                    <textarea
                      value={reportMessage}
                      onChange={(e) => setReportMessage(e.target.value)}
                      rows={4}
                      className={`w-full rounded-lg border px-3 py-2 ${
                        isDarkMode
                          ? "bg-[#181818] border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      placeholder="Share details to help moderators."
                    />
                    {reportError && (
                      <p className="mt-3 text-sm text-red-500">{reportError}</p>
                    )}
                    {reportSuccess && (
                      <p className="mt-3 text-sm text-green-500">Report submitted.</p>
                    )}
                    <div className="mt-5 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowReportModal(false)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                          isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isReporting}
                        onClick={handleReportDiscussion}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 disabled:opacity-60"
                      >
                        {isReporting ? "Submitting..." : "Submit report"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        };

        return <DiscussionCard key={d.id} />;
      })}
    </div>
  );
};

export default DiscussionsGrid;
