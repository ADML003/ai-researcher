"use client";

import React from "react";

interface Template {
  title: string;
  description: string;
  icon: string;
  tags: string[];
  estimated: string;
  question?: string;
  demographic?: string;
}

interface TemplateGridProps {
  onSelectTemplate?: (template: Template) => void;
}

const templates: Template[] = [
  {
    title: "Developer Onboarding",
    description: "Understand how developers learn new tools and platforms",
    icon: "👨‍💻",
    tags: ["Developer Experience", "Onboarding"],
    estimated: "3 min",
    question:
      "What challenges do developers face when learning new development tools and how can we improve their onboarding experience?",
    demographic: "Software developers with 1-5 years of experience",
  },
  {
    title: "Product Feedback",
    description: "Gather insights on product features and user satisfaction",
    icon: "💭",
    tags: ["Product Management", "UX"],
    estimated: "4 min",
    question:
      "How do users currently interact with our product features and what improvements would enhance their experience?",
    demographic: "Current product users and potential customers",
  },
  {
    title: "User Journey Mapping",
    description: "Discover pain points in your user's workflow",
    icon: "🗺️",
    tags: ["UX Research", "Journey"],
    estimated: "5 min",
    question:
      "What are the key pain points and friction areas in the user journey from discovery to conversion?",
    demographic: "Target users across different stages of the customer journey",
  },
  {
    title: "Feature Validation",
    description: "Test new feature concepts before development",
    icon: "🔬",
    tags: ["Product Validation", "MVP"],
    estimated: "3 min",
    question:
      "Would this new feature solve a real problem for users and how would they expect it to work?",
    demographic: "Target users who would benefit from the proposed feature",
  },
  {
    title: "Competitive Analysis",
    description: "Understand how users perceive competitive solutions",
    icon: "⚔️",
    tags: ["Market Research", "Strategy"],
    estimated: "4 min",
    question:
      "How do users compare our solution to competitors and what drives their choice decisions?",
    demographic: "Users familiar with competitive products in the market",
  },
  {
    title: "Custom Study",
    description: "Start from scratch with your own research question",
    icon: "✨",
    tags: ["Custom", "Flexible"],
    estimated: "Variable",
  },
];

const TemplateCard: React.FC<
  Template & { onSelect?: (template: Template) => void }
> = ({ onSelect, ...template }) => (
  <div
    className="feature-card cursor-pointer"
    onClick={() => onSelect?.(template)}
  >
    <div className="text-3xl mb-4">{template.icon}</div>
    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
      {template.title}
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {template.description}
    </p>

    <div className="flex flex-wrap gap-2 mb-4">
      {template.tags.map((tag, index) => (
        <span key={index} className="insight-tag neutral text-xs">
          {tag}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">~{template.estimated}</span>
      <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
        Use Template
      </button>
    </div>
  </div>
);

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  onSelectTemplate,
}) => {
  return (
    <div className="mt-12 animate-slide-in-right">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Research Templates
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <TemplateCard key={index} {...template} onSelect={onSelectTemplate} />
        ))}
      </div>
    </div>
  );
};

export default TemplateGrid;
