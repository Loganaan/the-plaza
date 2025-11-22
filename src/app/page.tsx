"use client";
import { useTheme } from "./context/ThemeContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const [listingCount, setListingCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // Fetch the total number of listings
    const fetchListingCount = async () => {
      try {
        const response = await fetch('/api/listings');
        if (response.ok) {
          const data = await response.json();
          setListingCount(data.length);
        }
      } catch (err) {
        console.error('Failed to fetch listing count:', err);
      }
    };

    fetchListingCount();
  }, []);

  useEffect(() => {
    // Animate the counter when listingCount changes
    if (listingCount === 0) return;

    const duration = 2000; // 2 seconds animation
    const steps = 60; // Number of updates
    const increment = listingCount / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayCount(listingCount);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [listingCount]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className={`text-5xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
          Welcome to <span className={`text-gradient bg-gradient-to-r ${isDarkMode ? "from-yellow-400 to-yellow-600" : "from-yellow-500 to-yellow-700"} bg-clip-text text-transparent`}>The Plaza</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-lg">
          A marketplace for buying and selling items
        </p>
        <div className="pt-8">
          <p className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            <span className={`font-bold bg-gradient-to-r ${isDarkMode ? "from-yellow-400 to-yellow-600" : "from-yellow-500 to-yellow-700"} bg-clip-text text-transparent`}>
              {displayCount.toLocaleString()}
            </span>
            {" "}
            item listings
          </p>
        </div>
      </div>
    </div>
  );
}
