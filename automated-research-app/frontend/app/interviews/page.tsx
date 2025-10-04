"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  MessageSquare,
  Search,
  Filter,
  Calendar,
  User,
  Target,
  ExternalLink,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Interview {
  session_id: string;
  research_question: string;
  target_demographic: string;
  created_at: string;
  persona_name: string;
  question: string;
  answer: string;
  question_order: number;
}

interface GroupedInterview {
  session_id: string;
  research_question: string;
  target_demographic: string;
  created_at: string;
  personas: {
    [persona_name: string]: {
      questions_and_answers: Array<{
        question: string;
        answer: string;
        order: number;
      }>;
    };
  };
}

export default function InterviewsPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [interviews, setInterviews] = useState<GroupedInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );
  const [expandedPersonas, setExpandedPersonas] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      // Get authentication token
      const token = await getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Use the optimized interviews endpoint instead of multiple API calls
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/interviews`,
        {
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Interviews loaded:", data.total_count); // Debug log

        // Transform the optimized response into the expected format
        const transformedInterviews: GroupedInterview[] = data.data.map(
          (session: any) => ({
            session_id: session.session_id,
            research_question: session.research_question,
            target_demographic: session.target_demographic,
            created_at: session.created_at,
            personas: {}, // Simplified structure for faster loading
          })
        );

        setInterviews(transformedInterviews);
      } else {
        console.error("Failed to fetch interviews:", response.status);
        setInterviews([]);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleSessionExpansion = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const togglePersonaExpansion = (key: string) => {
    const newExpanded = new Set(expandedPersonas);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedPersonas(newExpanded);
  };

  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.research_question
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      interview.target_demographic
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      Object.keys(interview.personas).some((personaName) =>
        personaName.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      Object.values(interview.personas).some((persona) =>
        persona.questions_and_answers.some(
          (qa) =>
            qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            qa.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                Interview Data
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Explore detailed interview responses from all research sessions
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search interviews, questions, answers, or personas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Interviews */}
        <div className="space-y-6">
          {filteredInterviews.map((interview) => {
            const isSessionExpanded = expandedSessions.has(
              interview.session_id
            );
            const personaCount = Object.keys(interview.personas).length;
            const totalQuestions = Object.values(interview.personas).reduce(
              (sum, persona) => sum + persona.questions_and_answers.length,
              0
            );

            return (
              <div
                key={interview.session_id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Session Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => toggleSessionExpansion(interview.session_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isSessionExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {interview.research_question}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ml-6">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {interview.target_demographic}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {personaCount} personas
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {totalQuestions} questions
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(interview.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/research/${interview.session_id}`);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Full Research
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isSessionExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {Object.entries(interview.personas).map(
                      ([personaName, personaData]) => {
                        const personaKey = `${interview.session_id}-${personaName}`;
                        const isPersonaExpanded =
                          expandedPersonas.has(personaKey);

                        return (
                          <div
                            key={personaName}
                            className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            {/* Persona Header */}
                            <div
                              className="p-4 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => togglePersonaExpansion(personaKey)}
                            >
                              <div className="flex items-center gap-2">
                                {isPersonaExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {personaName}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  ({personaData.questions_and_answers.length}{" "}
                                  questions)
                                </span>
                              </div>
                            </div>

                            {/* Questions and Answers */}
                            {isPersonaExpanded && (
                              <div className="p-4 space-y-4">
                                {personaData.questions_and_answers.map(
                                  (qa, index) => (
                                    <div
                                      key={index}
                                      className="border-l-4 border-blue-200 dark:border-blue-800 pl-4"
                                    >
                                      <div className="mb-2">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                          Q{qa.order + 1}:
                                        </span>
                                        <p className="text-gray-900 dark:text-white mt-1">
                                          {qa.question}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                          Answer:
                                        </span>
                                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                                          {qa.answer}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredInterviews.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No interviews found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "No interview data available yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
