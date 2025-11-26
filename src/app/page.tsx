"use client";
import { useTheme } from "./context/ThemeContext";

export default function Dashboard() {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className={`text-5xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
          Welcome to <span className={`text-gradient bg-gradient-to-r ${isDarkMode ? "from-yellow-400 to-yellow-600" : "from-yellow-500 to-yellow-700"} bg-clip-text text-transparent`}>The Plaza</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-lg">
          A marketplace for buying and selling items
        </p>
      </div>
    </div>
  );
}
