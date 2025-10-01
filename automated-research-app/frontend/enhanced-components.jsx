// 🎨 IMMEDIATE UI/UX IMPROVEMENTS YOU CAN TRY
// These components can be implemented right away to enhance the current app

import React from "react";
import {
  Brain,
  BarChart3,
  Workflow,
  Users,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  Search,
  Plus,
  Filter,
  ChevronRight,
  Sparkles,
  Moon,
  Sun,
  Play,
  Pause,
  Eye,
  Download,
} from "lucide-react";

// 1. ENHANCED SIDEBAR COMPONENT
// =============================
const EnhancedSidebar = () => {
  const navigationItems = [
    { icon: Brain, label: "Research", path: "/", badge: null, active: true },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard", badge: "Live" },
    { icon: Workflow, label: "Workflows", path: "/workflows", badge: "Beta" },
    { icon: Users, label: "Interviews", path: "/interviews", badge: null },
    { icon: FileText, label: "Reports", path: "/reports", badge: null },
    { icon: Settings, label: "Settings", path: "/settings", badge: null },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40">
      {/* Logo Section */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            ResearchAI
          </h1>
          <p className="text-xs text-gray-500">Intelligent Research</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              User
            </p>
            <p className="text-xs text-gray-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, badge, active }) => (
  <a href="#" className={`nav-item ${active ? "active" : ""}`}>
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
    {badge && <span className="nav-item-badge">{badge}</span>}
  </a>
);

// 2. ENHANCED HEADER WITH BREADCRUMBS
// ====================================
const EnhancedHeader = () => (
  <header className="ml-64 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-30">
    <div className="flex items-center justify-between h-full px-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-500">Research</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900 dark:text-white font-medium">
          New Study
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Status Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700 dark:text-green-400">
            AI Connected
          </span>
        </div>

        {/* Quick Actions */}
        <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggleButton />
      </div>
    </div>
  </header>
);

// 3. ENHANCED HERO SECTION
// =========================
const EnhancedHeroSection = () => (
  <div className="text-center mb-12 pt-8">
    {/* Badge */}
    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
      <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
        AI-Powered Research
      </span>
    </div>

    {/* Main Heading */}
    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
      Discover User Insights
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        In Minutes
      </span>
    </h1>

    {/* Subtitle */}
    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
      Generate personas, conduct AI interviews, and synthesize actionable
      insights using advanced multi-agent workflows
    </p>

    {/* Stats */}
    <div className="flex justify-center space-x-8 mt-8">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          3 min
        </div>
        <div className="text-sm text-gray-500">Average Study</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          15+
        </div>
        <div className="text-sm text-gray-500">AI Interviews</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          5-10
        </div>
        <div className="text-sm text-gray-500">Key Insights</div>
      </div>
    </div>
  </div>
);

// 4. ENHANCED RESEARCH FORM
// ==========================
const EnhancedResearchForm = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto">
    {/* Form Header */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Start New Research
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Configure your research parameters and let AI handle the rest
      </p>
    </div>

    {/* Form Content */}
    <div className="p-8">
      <form className="space-y-6">
        {/* Research Question */}
        <div className="form-group">
          <label className="form-label">Research Question</label>
          <textarea
            className="apple-input-enhanced min-h-[120px]"
            placeholder="What would you like to research? (e.g., How do developers approach API documentation?)"
          />
          <p className="form-description">
            Be specific about what you want to learn. Good questions lead to
            better insights.
          </p>
        </div>

        {/* Target Demographic */}
        <div className="form-group">
          <label className="form-label">Target Demographic</label>
          <input
            type="text"
            className="apple-input-enhanced"
            placeholder="Who would you like to interview? (e.g., Software developers, Product managers)"
          />
          <p className="form-description">
            Describe your ideal interview participants as specifically as
            possible.
          </p>
        </div>

        {/* Advanced Options (Collapsible) */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer text-gray-700 dark:text-gray-300 font-medium py-2">
            Advanced Options
            <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
          </summary>
          <div className="mt-4 space-y-4 form-section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Number of Personas</label>
                <select className="apple-input-enhanced">
                  <option>3 (Default)</option>
                  <option>5</option>
                  <option>10</option>
                </select>
              </div>
              <div>
                <label className="form-label">Questions per Interview</label>
                <select className="apple-input-enhanced">
                  <option>5 (Default)</option>
                  <option>7</option>
                  <option>10</option>
                </select>
              </div>
            </div>
          </div>
        </details>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button type="submit" className="button-gradient flex-1">
            <Play className="h-5 w-5 mr-2" />
            Start Research
          </button>
          <button type="button" className="button-outline">
            <Eye className="h-5 w-5 mr-2" />
            Preview
          </button>
        </div>
      </form>
    </div>
  </div>
);

// 5. RESEARCH TEMPLATES GRID
// ===========================
const ResearchTemplatesGrid = () => {
  const templates = [
    {
      title: "Developer Onboarding",
      description: "Understand how developers learn new tools and platforms",
      icon: "👨‍💻",
      tags: ["Developer Experience", "Onboarding"],
      estimated: "3 min",
    },
    {
      title: "Product Feedback",
      description: "Gather insights on product features and user satisfaction",
      icon: "💭",
      tags: ["Product Management", "UX"],
      estimated: "4 min",
    },
    {
      title: "User Journey Mapping",
      description: "Discover pain points in your user's workflow",
      icon: "🗺️",
      tags: ["UX Research", "Journey"],
      estimated: "5 min",
    },
    {
      title: "Feature Validation",
      description: "Test new feature concepts before development",
      icon: "🔬",
      tags: ["Product Validation", "MVP"],
      estimated: "3 min",
    },
    {
      title: "Competitive Analysis",
      description: "Understand how users perceive competitive solutions",
      icon: "⚔️",
      tags: ["Market Research", "Strategy"],
      estimated: "4 min",
    },
    {
      title: "Custom Study",
      description: "Start from scratch with your own research question",
      icon: "✨",
      tags: ["Custom", "Flexible"],
      estimated: "Variable",
    },
  ];

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Research Templates
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <TemplateCard key={index} {...template} />
        ))}
      </div>
    </div>
  );
};

const TemplateCard = ({ title, description, icon, tags, estimated }) => (
  <div className="feature-card cursor-pointer">
    <div className="text-3xl mb-4">{icon}</div>
    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {description}
    </p>

    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag, index) => (
        <span key={index} className="insight-tag neutral text-xs">
          {tag}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">~{estimated}</span>
      <button className="text-blue-600 dark:text-blue-400 hover:underline">
        Use Template
      </button>
    </div>
  </div>
);

// 6. QUICK STATUS CARDS
// ======================
const QuickStatusCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <StatusCard
      title="Active Studies"
      value="3"
      change="+2"
      trend="positive"
      icon={Brain}
    />
    <StatusCard
      title="Completed Interviews"
      value="47"
      change="+12"
      trend="positive"
      icon={Users}
    />
    <StatusCard
      title="Generated Insights"
      value="156"
      change="+34"
      trend="positive"
      icon={Sparkles}
    />
    <StatusCard
      title="Reports Created"
      value="8"
      change="+3"
      trend="positive"
      icon={FileText}
    />
  </div>
);

const StatusCard = ({ title, value, change, trend, icon: Icon }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="metric-label">{title}</p>
        <p className="metric-value">{value}</p>
        <p className={`metric-change ${trend}`}>{change} this week</p>
      </div>
      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  </div>
);

// 7. USAGE INSTRUCTIONS
// ======================
const implementationInstructions = `
🚀 IMPLEMENTATION INSTRUCTIONS:

1. Replace your current page.tsx header section with <EnhancedHeader />
2. Add <EnhancedSidebar /> to your layout.tsx
3. Replace the hero section with <EnhancedHeroSection />
4. Upgrade your form with <EnhancedResearchForm />
5. Add <ResearchTemplatesGrid /> below the form
6. Include the enhanced CSS classes from enhanced-styles.css

📋 DEPENDENCIES TO ADD:
npm install lucide-react

🎨 CSS UPDATES:
- Copy enhanced-styles.css classes to your globals.css
- Update your Tailwind config to include the new colors
- Add the custom animations

⚡ IMMEDIATE IMPACT:
- More professional Apple-like appearance
- Better user guidance and flow
- Enhanced accessibility and mobile experience
- Preparation for advanced features

🔄 GRADUAL ROLLOUT:
You can implement these one component at a time without breaking existing functionality.
`;

export {
  EnhancedSidebar,
  EnhancedHeader,
  EnhancedHeroSection,
  EnhancedResearchForm,
  ResearchTemplatesGrid,
  QuickStatusCards,
  implementationInstructions,
};
