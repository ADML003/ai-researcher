/**
 * Enhanced Apple-inspired UI/UX Design System
 * This file contains proposed UI improvements and component designs
 */

// 1. NAVIGATION REDESIGN
// =====================

// Sidebar Navigation Component
const Sidebar = () => (
  <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 z-40">
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

    {/* Bottom Section - User Profile */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
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

// 2. ENHANCED HEADER
// ==================

const EnhancedHeader = () => (
  <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-30 ml-64">
    <div className="flex items-center justify-between h-full px-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-500">Research</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900 dark:text-white font-medium">
          New Study
        </span>
      </div>

      {/* Action Bar */}
      <div className="flex items-center space-x-3">
        {/* Status Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700 dark:text-green-400">
            Connected
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
        <ThemeToggle />
      </div>
    </div>
  </header>
);

// 3. MAIN CONTENT LAYOUTS
// ========================

// Research Form Layout (Enhanced)
const ResearchFormLayout = () => (
  <div className="flex-1 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900">
    <EnhancedHeader />

    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              AI-Powered Research
            </span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Discover User Insights
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              In Minutes
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Generate personas, conduct AI interviews, and synthesize actionable
            insights using advanced multi-agent workflows
          </p>
        </div>

        {/* Enhanced Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
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
            <ResearchForm />
          </div>
        </div>

        {/* Quick Templates */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Research Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {researchTemplates.map((template, index) => (
              <TemplateCard key={index} {...template} />
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);

// 4. DASHBOARD LAYOUT
// ===================

const DashboardLayout = () => (
  <div className="flex-1 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900">
    <EnhancedHeader />

    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Research Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor your research studies in real-time
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="apple-button-secondary">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
            <button className="apple-button-primary">
              <Plus className="h-5 w-5 mr-2" />
              New Study
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Interviews Panel */}
          <div className="lg:col-span-2">
            <LiveInterviewsPanel />
          </div>

          {/* Insights Panel */}
          <div>
            <InsightsPanel />
          </div>

          {/* Recent Studies */}
          <div className="lg:col-span-2">
            <RecentStudiesPanel />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActionsPanel />
          </div>
        </div>
      </div>
    </main>
  </div>
);

// 5. WORKFLOW BUILDER LAYOUT
// ===========================

const WorkflowBuilderLayout = () => (
  <div className="flex-1 ml-64 h-screen bg-gray-50 dark:bg-gray-900">
    <EnhancedHeader />

    <div className="flex h-[calc(100vh-4rem)]">
      {/* Workflow Canvas */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>

        {/* Floating Toolbar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <WorkflowToolbar />
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <PropertiesPanel />
      </div>
    </div>
  </div>
);

// 6. COMPONENT SPECIFICATIONS
// ============================

const componentSpecs = {
  colors: {
    primary: "from-blue-500 to-purple-600",
    success: "from-green-400 to-emerald-500",
    warning: "from-amber-400 to-orange-500",
    error: "from-red-400 to-pink-500",
  },

  animations: {
    fadeIn: "animate-in fade-in duration-500",
    slideUp: "animate-in slide-in-from-bottom-4 duration-500",
    scaleIn: "animate-in zoom-in-95 duration-300",
  },

  shadows: {
    card: "shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50",
    floating: "shadow-2xl shadow-gray-300/30 dark:shadow-gray-900/30",
  },
};

export {
  Sidebar,
  EnhancedHeader,
  ResearchFormLayout,
  DashboardLayout,
  WorkflowBuilderLayout,
  componentSpecs,
};
