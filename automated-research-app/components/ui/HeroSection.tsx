"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = "AI Research Assistant",
  subtitle = "Get Insights Fast",
  description = "Generate personas, conduct AI interviews, and get actionable insights in minutes",
  stats = [
    { value: "<3min", label: "Setup Time" },
    { value: "AI-Powered", label: "Interviews" },
    { value: "Smart", label: "Analysis" },
  ],
}) => {
  return (
    <div className="text-center mb-4 pt-2 pb-2 animate-fade-in-up">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-3 border border-blue-200 dark:border-blue-800/50">
        <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400 animate-pulse" />
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
          ✨ AI-Powered Research
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight leading-tight hero-title">
        {title}
        <span className="block hero-gradient-text text-xl md:text-2xl lg:text-3xl font-extrabold mt-1 leading-tight">
          {subtitle}
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed mb-3 font-medium">
        🚀 {description}
      </p>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="flex justify-center space-x-6 md:space-x-8 mt-2">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
