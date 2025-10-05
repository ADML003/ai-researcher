"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, BarChart3, Users, FileText, User } from "lucide-react";

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  { icon: Brain, label: "Research", path: "/" },
  { icon: BarChart3, label: "Dashboard", path: "/dashboard", badge: "Live" },
  { icon: Users, label: "Interviews", path: "/interviews" },
  { icon: FileText, label: "Reports", path: "/reports" },
];

interface NavItemProps extends NavigationItem {
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  path,
  badge,
  active,
}) => (
  <Link href={path} className={`nav-item ${active ? "active" : ""}`}>
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
    {badge && <span className="nav-item-badge">{badge}</span>}
  </Link>
);

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const pathname = usePathname();

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 ${className}`}
    >
      {/* Logo Section */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="p-2 bg-gradient-apple rounded-xl">
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
          <NavItem key={index} {...item} active={pathname === item.path} />
        ))}
      </nav>

      {/* Bottom Section - User Profile */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="w-8 h-8 bg-gradient-apple rounded-full flex items-center justify-center text-white text-sm font-semibold">
            <User className="h-4 w-4" />
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

export default Sidebar;
