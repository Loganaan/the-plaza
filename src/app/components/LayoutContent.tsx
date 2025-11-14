"use client";
import React from "react";
import Sidebar from "./sidebar/Sidebar";
import { useTheme } from "../context/ThemeContext";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex min-h-screen ${
        isDarkMode ? "bg-[#121212] text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
