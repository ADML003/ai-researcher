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
  title = "Discover User Insights",
  subtitle = "In Minutes",
  description = "Generate personas, conduct AI interviews, and synthesize actionable insights using advanced multi-agent workflows",
  stats = [
    { value: "3 min", label: "Average Study" },
    { value: "15+", label: "AI Interviews" },
    { value: "5-10", label: "Key Insights" },
  ],
}) => {
  return (
    <div className="text-center mb-12 pt-8 animate-fade-in-up">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          AI-Powered Research
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
        {title}
        <span className="block text-transparent bg-clip-text bg-gradient-apple">
          {subtitle}
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="flex justify-center space-x-8 mt-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
