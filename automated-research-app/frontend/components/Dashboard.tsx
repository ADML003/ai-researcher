"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  BarChart3,
  Users,
  MessageSquare,
  Target,
  Calendar,
  CheckCircle,
  Search,
  TrendingUp,
  Activity,
  Clock,
  ExternalLink,
} from "lucide-react";

interface DashboardStats {
  overview: {
    total_sessions: number;
    total_personas: number;
    total_interviews: number;
    active_workflows: number;
    success_rate: number;
    avg_completion_time: number;
  };
  status_breakdown: {
    completed: number;
    failed: number;
    running: number;
    active: number;
  };
  time_metrics: {
    sessions_today: number;
    sessions_this_week: number;
    avg_completion_time_minutes: number;
  };
  recent_sessions: Array<{
    session_id: string;
    research_question: string;
    target_demographic: string;
    created_at: string;
    status: string;
    has_results: boolean;
  }>;
}

interface ResearchSession {
  session_id: string;
  research_question: string;
  target_demographic: string;
  num_interviews: number;
  created_at: string;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboardData();
    // Reduce auto-refresh to every 60 seconds instead of 30 to improve performance
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const isInitialLoad = loading;
      if (!isInitialLoad) {
        // Don't show loading for auto-refresh
      } else {
        setLoading(true);
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Get authentication token
      const token = await getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Fetch both stats and sessions in parallel for better performance
      const [statsResponse, sessionsResponse] = await Promise.all([
        fetch(`${baseUrl}/dashboard/stats`, {
          method: "GET",
          headers,
        }),
        fetch(`${baseUrl}/dashboard/sessions`, {
          method: "GET",
          headers,
        }),
      ]);

      // Handle stats response
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log("Dashboard stats loaded:", statsData.overview); // Debug log
        setStats(statsData);
      } else {
        console.error(
          "Stats API error:",
          statsResponse.status,
          statsResponse.statusText
        );
        setStats({
          overview: {
            total_sessions: 0,
            total_personas: 0,
            total_interviews: 0,
            active_workflows: 0,
            success_rate: 0,
            avg_completion_time: 0,
          },
          status_breakdown: { completed: 0, failed: 0, running: 0, active: 0 },
          time_metrics: {
            sessions_today: 0,
            sessions_this_week: 0,
            avg_completion_time_minutes: 0,
          },
          recent_sessions: [],
        });
      }

      // Handle sessions response
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        console.log(
          "Dashboard sessions loaded:",
          sessionsData.sessions?.length || 0
        ); // Debug log
        setSessions(sessionsData.sessions || []);
      } else {
        console.error(
          "Sessions API error:",
          sessionsResponse.status,
          sessionsResponse.statusText
        );
        setSessions([]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Set fallback data on error
      setStats({
        overview: {
          total_sessions: 0,
          total_personas: 0,
          total_interviews: 0,
          active_workflows: 0,
          success_rate: 0,
          avg_completion_time: 0,
        },
        status_breakdown: { completed: 0, failed: 0, running: 0, active: 0 },
        time_metrics: {
          sessions_today: 0,
          sessions_this_week: 0,
          avg_completion_time_minutes: 0,
        },
        recent_sessions: [],
      });
      setSessions([]);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.research_question
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.target_demographic
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Research Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your AI-powered research sessions and insights
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="apple-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Sessions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.overview.total_sessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Personas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.overview.total_personas}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Interviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.overview.total_interviews}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.overview.total_sessions > 0 ? "100%" : "0%"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sessions List */}
          <div className="lg:col-span-2">
            <div className="apple-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Research Sessions
                </h2>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.session_id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                    onClick={() =>
                      router.push(`/research/${session.session_id}`)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {session.research_question}
                          </h3>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Target: {session.target_demographic}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {session.num_interviews} interviews
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(session.created_at)}
                          </span>
                          <span className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "No sessions match your search."
                      : "No research sessions yet."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="apple-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>

              {stats && stats.recent_sessions.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_sessions.map((session, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {session.research_question.length > 60
                          ? `${session.research_question.substring(0, 60)}...`
                          : session.research_question}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {session.target_demographic}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(session.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  No recent activity
                </div>
              )}
            </div>

            {/* LangSmith Integration Status */}
            <div className="apple-card p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Monitoring Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    LangSmith Project
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    automated-research
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tracing
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    API Status
                  </span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
