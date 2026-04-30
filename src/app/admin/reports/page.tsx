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

const reasonLabels: Record<string, string> = {
  scam: "Scam or misleading",
  prohibited: "Prohibited item",
  harassment: "Harassment or abuse",
  spam: "Spam or duplicate",
  other: "Other",
};

export default function ReportsPage() {
  const { isDarkMode, isAdmin } = useTheme();
  const { status } = useSession();
  const [reports, setReports] = useState<ReportItem[]>([]);
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
        const response = await fetch("/api/reports", {
          headers: { "x-admin-override": "true" },
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || "Failed to fetch reports");
        }

        const data = await response.json();
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAdmin, status]);

  const reportCount = useMemo(() => reports.length, [reports]);

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
              Listing Reports
            </h1>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Review reports submitted by marketplace users.
            </p>
          </div>
          <div
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              isDarkMode ? "bg-gray-800 text-yellow-200" : "bg-white text-yellow-700"
            }`}
          >
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

        {!loading && !error && reports.length === 0 && (
          <div className={`rounded-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No reports yet.</p>
          </div>
        )}

        <div className="space-y-4">
          {reports.map((report) => {
            const reasonLabel = reasonLabels[report.reason] || report.reason;
            return (
              <div
                key={report.id}
                className={`rounded-lg border p-5 shadow-sm ${
                  isDarkMode ? "bg-[#1c1c1c] border-gray-800" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {reasonLabel}
                    </h2>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Reported {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      report.status === "open"
                        ? "bg-yellow-400/20 text-yellow-500"
                        : report.status === "resolved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                {report.message && (
                  <div className={`mt-3 rounded-md p-3 text-sm ${
                    isDarkMode ? "bg-[#181818] text-gray-300" : "bg-gray-50 text-gray-700"
                  }`}>
                    {report.message}
                  </div>
                )}

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div
                    className={`rounded-md p-3 ${
                      isDarkMode ? "bg-[#181818]" : "bg-gray-50"
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
                    className={`rounded-md p-3 ${
                      isDarkMode ? "bg-[#181818]" : "bg-gray-50"
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
      </div>
    </div>
  );
}
