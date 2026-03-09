"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Discussion Board", href: "/discussions" },
  "Settings",
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode, isAdmin, toggleAdmin } = useTheme();
  // Initialize from localStorage to prevent flash
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed');
      return savedState === 'true';
    }
    return false;
  });

  // Save collapsed state to localStorage whenever it changes
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-64'} transition-[width] duration-300 ${
        isDarkMode ? "bg-[#1c1c1c]" : "bg-white border-r border-gray-300"
      } flex flex-col justify-between p-4`}
    >
      <div>
        <div className={`flex items-center justify-between mb-8 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          } pb-4`}>
          {!isCollapsed && <h1 className="text-2xl font-bold whitespace-nowrap">The Plaza</h1>}
          <button
            onClick={toggleCollapse}
            className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} p-2 rounded-lg transition-colors`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) =>
            typeof item === "string" ? (
              <button
                key={item}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
                title={isCollapsed ? item : ""}
              >
                <span className="capitalize whitespace-nowrap overflow-hidden">{isCollapsed ? item[0] : item}</span>
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } ${
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
                    : ""
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <span className="capitalize whitespace-nowrap overflow-hidden">{isCollapsed ? item.label[0] : item.label}</span>
              </a>
            )
          )}
        </nav>
      </div>
      {/* Bottom Controls */}
      <div className="space-y-4">
        {!isCollapsed && (
          <>
            <div className="flex items-center justify-between px-2">
              <span className="whitespace-nowrap">Dark Mode</span>
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
            <div className="flex items-center justify-between px-2">
              <span className="whitespace-nowrap">Admin</span>
              <button
                onClick={toggleAdmin}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-300"
                }`}
                aria-label="Toggle admin mode"
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-yellow-400 rounded-full transition-transform ${
                    isAdmin ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </>
        )}
        {isCollapsed ? (
          <button
            onClick={toggleDarkMode}
            className="w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
            title="Toggle dark mode"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
        ) : (
          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}
