"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== null) {
      setIsDarkMode(storedTheme === "dark");
    }
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin !== null) {
      setIsAdmin(storedAdmin === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

  const toggleAdmin = () => {
    setIsAdmin((prev) => {
      const newValue = !prev;
      localStorage.setItem("admin", newValue ? "true" : "false");
      return newValue;
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, isAdmin, toggleAdmin }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
