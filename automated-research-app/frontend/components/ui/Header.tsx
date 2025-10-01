"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { ChevronRight, Bell, HelpCircle, Moon, Sun } from "lucide-react";

interface HeaderProps {
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbs = [{ label: "Research" }, { label: "New Study" }],
  className = "",
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`ml-64 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-30 ${className}`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-500"
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center space-x-3">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              AI Connected
            </span>
          </div>

          {/* Quick Actions */}
          <button
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
