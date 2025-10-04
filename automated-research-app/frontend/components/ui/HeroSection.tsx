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
    <div className="text-center mb-6 pt-4 animate-fade-in-up">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
        <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          AI-Powered Research
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
        {title}
        <span className="block text-transparent bg-clip-text bg-gradient-apple text-2xl">
          {subtitle}
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed mb-4">
        {description}
      </p>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="flex justify-center space-x-6 mt-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-base font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
