"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "@/app/context/ThemeContext";

interface ReportItem {
  id: number;
  reason: string;
  message: string | null;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
  listing: {
    id: number;
    title: string;
    price: number;
    imageUrl: string | null;
    dateListed: string;
    category: { field: string } | null;
    seller: { id: number; name: string | null; email: string };
  };
  reporter: { id: number; name: string | null; email: string };
}

interface DiscussionReportItem {
  id: number;
  reason: string;
  message: string | null;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
  discussion: {
    id: number;
    title: string;
    createdAt: string;
    category: { name: string } | null;
    author: { id: number; name: string | null; email: string } | null;
  };
  reporter: { id: number; name: string | null; email: string };
}

const reasonLabels: Record<string, string> = {
  scam: "Scam or misleading",
  prohibited: "Prohibited item",
  harassment: "Harassment or abuse",
  spam: "Spam or duplicate",
  other: "Other",
};

const statusLabels: Record<ReportItem["status"], string> = {
  open: "Open",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const statusPillStyles: Record<ReportItem["status"], string> = {
  open: "text-gray-300 border-gray-800",
  resolved: "text-gray-300 border-gray-800",
  dismissed: "text-gray-300 border-gray-800",
};

const statusDotStyles: Record<ReportItem["status"], string> = {
  open: "bg-yellow-400",
  resolved: "bg-emerald-400",
  dismissed: "bg-gray-400",
};

const statusRailStyles: Record<ReportItem["status"], string> = {
  open: "bg-yellow-400",
  resolved: "bg-emerald-400",
  dismissed: "bg-gray-400",
};

export default function ReportsPage() {
  const { isDarkMode, isAdmin } = useTheme();
  const { status } = useSession();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [discussionReports, setDiscussionReports] = useState<DiscussionReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setError("Please log in to view reports.");
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const [listingResponse, discussionResponse] = await Promise.all([
          fetch("/api/reports", {
            headers: { "x-admin-override": "true" },
          }),
          fetch("/api/discussion-reports", {
            headers: { "x-admin-override": "true" },
          }),
        ]);

        if (!listingResponse.ok) {
          const payload = await listingResponse.json().catch(() => ({}));
          throw new Error(payload?.error || "Failed to fetch listing reports");
        }

        if (!discussionResponse.ok) {
          const payload = await discussionResponse.json().catch(() => ({}));
          throw new Error(payload?.error || "Failed to fetch discussion reports");
        }

        const listingData = await listingResponse.json();
        const discussionData = await discussionResponse.json();
        setReports(Array.isArray(listingData) ? listingData : []);
        setDiscussionReports(Array.isArray(discussionData) ? discussionData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAdmin, status]);

  const reportCount = useMemo(
    () => reports.length + discussionReports.length,
    [reports.length, discussionReports.length]
  );

  if (!isAdmin) {
    return (
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-[#121212]" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-lg p-6 text-center shadow-sm ${
              isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
            }`}
          >
            <h1 className="text-2xl font-bold mb-2">Admin Reports</h1>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Enable admin mode to view listing reports.
            </p>
            <Link
              href="/marketplace"
              className="mt-4 inline-flex items-center justify-center rounded px-4 py-2 text-black font-semibold bg-gradient-to-r from-[#F7C600] to-[#C97A00] hover:opacity-90 transition"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? "bg-[#121212]" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Reports
            </h1>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Review reports submitted by community members.
            </p>
          </div>
          <div className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500" aria-hidden="true" />
            {reportCount} total
          </div>
        </div>

        {loading && (
          <div className={`rounded-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Loading reports...</p>
          </div>
        )}

        {error && !loading && (
          <div className={`rounded-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && reports.length === 0 && discussionReports.length === 0 && (
          <div className={`rounded-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No reports yet.</p>
          </div>
        )}

        {reports.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Listing Reports
              </h2>
              <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {reports.length}
              </span>
            </div>
            {reports.map((report) => {
              const reasonLabel = reasonLabels[report.reason] || report.reason;
              return (
                <div
                  key={report.id}
                  className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm ${
                    isDarkMode ? "bg-[#1c1c1c] border-gray-800" : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${statusRailStyles[report.status]}`}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Report #{report.id}
                      </p>
                      <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {reasonLabel}
                      </h2>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Reported {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusPillStyles[report.status]
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusDotStyles[report.status]}`}
                        aria-hidden="true"
                      />
                      {statusLabels[report.status]}
                    </span>
                  </div>

                  {report.message && (
                    <div
                      className={`mt-4 rounded-xl border p-4 text-sm ${
                        isDarkMode
                          ? "bg-[#181818] border-gray-800 text-gray-300"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      {report.message}
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div
                      className={`rounded-xl border p-4 ${
                        isDarkMode ? "bg-[#181818] border-gray-800" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <p className={`text-xs font-semibold uppercase ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Listing
                      </p>
                      <Link
                        href={`/marketplace/${report.listing.id}`}
                        className={`mt-1 block text-sm font-semibold hover:underline ${
                          isDarkMode ? "text-yellow-200" : "text-yellow-700"
                        }`}
                      >
                        {report.listing.title}
                      </Link>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        ${report.listing.price.toFixed(2)}
                        {report.listing.category?.field ? ` • ${report.listing.category.field}` : ""}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Listed {new Date(report.listing.dateListed).toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-4 ${
                        isDarkMode ? "bg-[#181818] border-gray-800" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <p className={`text-xs font-semibold uppercase ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Reporter
                      </p>
                      <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                        {report.reporter.name || "Unnamed user"}
                      </p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {report.reporter.email}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Seller: {report.listing.seller.name || "Unnamed"} ({report.listing.seller.email})
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {discussionReports.length > 0 && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Discussion Reports
              </h2>
              <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {discussionReports.length}
              </span>
            </div>
            {discussionReports.map((report) => {
              const reasonLabel = reasonLabels[report.reason] || report.reason;
              return (
                <div
                  key={report.id}
                  className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm ${
                    isDarkMode ? "bg-[#1c1c1c] border-gray-800" : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${statusRailStyles[report.status]}`}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Report #{report.id}
                      </p>
                      <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {reasonLabel}
                      </h2>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Reported {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusPillStyles[report.status]
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusDotStyles[report.status]}`}
                        aria-hidden="true"
                      />
                      {statusLabels[report.status]}
                    </span>
                  </div>

                  {report.message && (
                    <div
                      className={`mt-4 rounded-xl border p-4 text-sm ${
                        isDarkMode
                          ? "bg-[#181818] border-gray-800 text-gray-300"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      {report.message}
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div
                      className={`rounded-xl border p-4 ${
                        isDarkMode ? "bg-[#181818] border-gray-800" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <p className={`text-xs font-semibold uppercase ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Discussion
                      </p>
                      <Link
                        href={`/discussions/${report.discussion.id}`}
                        className={`mt-1 block text-sm font-semibold hover:underline ${
                          isDarkMode ? "text-yellow-200" : "text-yellow-700"
                        }`}
                      >
                        {report.discussion.title}
                      </Link>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {report.discussion.category?.name
                          ? `Category: ${report.discussion.category.name}`
                          : "Uncategorized"}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Posted {new Date(report.discussion.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-4 ${
                        isDarkMode ? "bg-[#181818] border-gray-800" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <p className={`text-xs font-semibold uppercase ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Reporter
                      </p>
                      <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                        {report.reporter.name || "Unnamed user"}
                      </p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {report.reporter.email}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Author: {report.discussion.author?.name || "Unknown"}
                        {report.discussion.author?.email ? ` (${report.discussion.author.email})` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
