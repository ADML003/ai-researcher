"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  Target,
  Download,
} from "lucide-react";
import Link from "next/link";

interface Persona {
  name: string;
  role: string;
  background: string;
  motivations: string[];
  pain_points: string[];
}

interface Interview {
  persona_name: string;
  questions_and_answers: Array<{
    question: string;
    answer: string;
  }>;
}

interface ResearchSession {
  id: number;
  session_id: string;
  research_question: string;
  target_demographic: string;
  num_interviews: number;
  created_at: string;
  synthesis: string;
  status: string;
  personas: Persona[];
  interviews: Interview[];
}

export default function ResearchDetailPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [research, setResearch] = useState<ResearchSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "personas" | "interviews" | "synthesis"
  >("overview");

  // Export functionality
  const exportToTxt = () => {
    if (!research) return;

    const content = `RESEARCH REPORT
=================\n\nResearch Question: ${
      research.research_question
    }\nTarget Demographic: ${
      research.target_demographic
    }\nNumber of Interviews: ${research.num_interviews}\nSession ID: ${
      research.session_id
    }\nCreated: ${formatDate(research.created_at)}\nStatus: ${
      research.status
    }\n\nPERSONAS\n========\n${
      research.personas
        ?.map(
          (persona, index) =>
            `\n${index + 1}. ${persona.name}\n   Role: ${
              persona.role
            }\n   Background: ${
              persona.background
            }\n   Motivations: ${persona.motivations?.join(
              ", "
            )}\n   Pain Points: ${persona.pain_points?.join(", ")}`
        )
        .join("\n") || "No personas available"
    }\n\nINTERVIEWS\n==========\n${
      research.interviews
        ?.map(
          (interview, index) =>
            `\n${index + 1}. Interview with ${interview.persona_name}\n${
              interview.questions_and_answers
                ?.map(
                  (qa, qaIndex) =>
                    `\n   Q${qaIndex + 1}: ${qa.question}\n   A${
                      qaIndex + 1
                    }: ${qa.answer}`
                )
                .join("\n") || "No questions available"
            }`
        )
        .join("\n\n") || "No interviews available"
    }\n\nSYNTHESIS\n=========\n${
      research.synthesis || "No synthesis available"
    }`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-${research.session_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPdf = async () => {
    if (!research) return;

    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(16);
    pdf.setFont(undefined, "bold");
    pdf.text("RESEARCH REPORT", 20, 20);

    // Basic info
    pdf.setFontSize(12);
    pdf.setFont(undefined, "normal");
    let yPos = 35;

    const addText = (label: string, value: string, maxWidth = 170) => {
      pdf.setFont(undefined, "bold");
      pdf.text(label, 20, yPos);
      pdf.setFont(undefined, "normal");
      const lines = pdf.splitTextToSize(value, maxWidth);
      pdf.text(lines, 20, yPos + 5);
      yPos += 5 + lines.length * 5 + 5;
    };

    addText("Research Question:", research.research_question);
    addText("Target Demographic:", research.target_demographic);
    addText("Number of Interviews:", research.num_interviews.toString());
    addText("Session ID:", research.session_id);
    addText("Created:", formatDate(research.created_at));
    addText("Status:", research.status);

    // Personas section
    yPos += 10;
    pdf.setFontSize(14);
    pdf.setFont(undefined, "bold");
    pdf.text("PERSONAS", 20, yPos);
    yPos += 10;

    research.personas?.forEach((persona, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(12);
      addText(`${index + 1}. ${persona.name}`, "");
      addText("   Role:", persona.role);
      addText("   Background:", persona.background);
      addText("   Motivations:", persona.motivations?.join(", ") || "None");
      addText("   Pain Points:", persona.pain_points?.join(", ") || "None");
      yPos += 5;
    });

    // Interviews section
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(14);
    pdf.setFont(undefined, "bold");
    pdf.text("INTERVIEWS", 20, yPos);
    yPos += 10;

    research.interviews?.forEach((interview, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(12);
      addText(`${index + 1}. Interview with ${interview.persona_name}`, "");

      interview.questions_and_answers?.forEach((qa, qaIndex) => {
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        addText(`   Q${qaIndex + 1}:`, qa.question);
        addText(`   A${qaIndex + 1}:`, qa.answer);
      });
      yPos += 5;
    });

    // Synthesis section
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(14);
    pdf.setFont(undefined, "bold");
    pdf.text("SYNTHESIS", 20, yPos);
    yPos += 10;

    pdf.setFontSize(11);
    pdf.setFont(undefined, "normal");
    const synthesisLines = pdf.splitTextToSize(
      research.synthesis || "No synthesis available",
      170
    );
    synthesisLines.forEach((line: string) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, 20, yPos);
      yPos += 5;
    });

    pdf.save(`research-${research.session_id}.pdf`);
  };

  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/dashboard/session/${sessionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch research details");
        }
        const data = await response.json();

        // Transform personas data to match expected format
        const transformedPersonas =
          data.personas?.map((persona: any) => ({
            name: persona.name,
            role: persona.job || "Role not specified",
            background: persona.background || "Background not specified",
            motivations: persona.traits?.slice(0, 3) || [],
            pain_points: persona.traits?.slice(3) || [],
          })) || [];

        // Transform interviews data from object to array format
        const transformedInterviews = data.interviews
          ? Object.entries(data.interviews).map(
              ([personaName, questionAnswers]: [string, any]) => ({
                persona_name: personaName,
                questions_and_answers: questionAnswers.map((qa: any) => ({
                  question: qa.question,
                  answer: qa.answer,
                })),
              })
            )
          : [];

        const transformedData = {
          ...data,
          personas: transformedPersonas,
          interviews: transformedInterviews,
        };

        setResearch(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load research details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResearchDetails();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !research) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Research
            </h2>
            <p className="text-red-600 dark:text-red-400">
              {error || "Research session not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {research.research_question}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {research.target_demographic}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {research.num_interviews} interviews
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(research.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportToTxt}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Download className="w-4 h-4" />
                    Export TXT
                  </button>
                  <button
                    onClick={exportToPdf}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    research.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}
                >
                  {research.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: FileText },
              { id: "personas", label: "Personas", icon: User },
              { id: "interviews", label: "Interviews", icon: MessageSquare },
              { id: "synthesis", label: "Synthesis", icon: Target },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Research Summary
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Question:
                    </span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {research.research_question}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Target Demographic:
                    </span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {research.target_demographic}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Session ID:
                    </span>
                    <p className="text-gray-900 dark:text-white mt-1 font-mono text-sm">
                      {research.session_id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Research Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {research.personas?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Personas
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {research.num_interviews}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Interviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Personas Tab */}
          {activeTab === "personas" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {research.personas?.map((persona, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {persona.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {persona.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Background
                      </h4>
                      <p className="text-gray-900 dark:text-white text-sm">
                        {persona.background}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Motivations
                      </h4>
                      <ul className="space-y-1">
                        {persona.motivations?.map((motivation, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-900 dark:text-white flex items-start gap-2"
                          >
                            <span className="text-green-500 mt-1">•</span>
                            {motivation}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Pain Points
                      </h4>
                      <ul className="space-y-1">
                        {persona.pain_points?.map((painPoint, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-900 dark:text-white flex items-start gap-2"
                          >
                            <span className="text-red-500 mt-1">•</span>
                            {painPoint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interviews Tab */}
          {activeTab === "interviews" && (
            <div className="space-y-6">
              {research.interviews?.map((interview, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Interview with {interview.persona_name}
                  </h3>

                  <div className="space-y-4">
                    {interview.questions_and_answers?.map((qa, qaIndex) => (
                      <div
                        key={qaIndex}
                        className="border-l-4 border-blue-200 dark:border-blue-800 pl-4"
                      >
                        <div className="mb-2">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Question:
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Synthesis Tab */}
          {activeTab === "synthesis" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Research Synthesis
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportToTxt}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Download className="w-4 h-4" />
                    TXT
                  </button>
                  <button
                    onClick={exportToPdf}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap text-sm leading-relaxed">
                  {research.synthesis || "No synthesis available"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
