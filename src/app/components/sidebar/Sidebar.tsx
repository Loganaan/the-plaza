"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Discussion Board", href: "/discussions" },
  "Media",
  "Pages",
  "Comments",
  "Appearance",
  "Plugins",
  "Users",
  "Settings",
  "Tools",
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <aside
      className={`w-64 ${
        isDarkMode ? "bg-[#1c1c1c]" : "bg-white"
      } flex flex-col justify-between p-4`}
    >
      <div>
        <h1
          className={`text-2xl font-bold mb-8 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          } pb-4`}
        >
          The Plaza
        </h1>
        <nav className="space-y-2">
          {navItems.map((item) =>
            typeof item === "string" ? (
              <button
                key={item}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <span className="capitalize">{item}</span>
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
                    : ""
                }`}
              >
                <span className="capitalize">{item.label}</span>
              </a>
            )
          )}
        </nav>
      </div>
      {/* Bottom Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span>Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
            aria-label="Toggle dark mode"
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-yellow-400 rounded-full transition-transform ${
                isDarkMode ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>
        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
          Logout
        </button>
      </div>
    </aside>
  );
}
