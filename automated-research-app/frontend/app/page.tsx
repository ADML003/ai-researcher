"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import HeroSection from "@/components/ui/HeroSection";
import ResearchForm from "@/components/ui/ResearchForm";
import { Loader2 } from "lucide-react";

interface ResearchData {
  research_question: string;
  target_demographic: string;
  num_interviews: number;
  interview_questions: string[];
  personas: Array<{
    name: string;
    age: number;
    job: string;
    traits: string[];
    communication_style: string;
    background: string;
  }>;
  interviews: Array<{
    persona: {
      name: string;
      age: number;
      job: string;
      traits: string[];
    };
    responses: Array<{
      question: string;
      answer: string;
    }>;
  }>;
  detailed_qa?: Array<{
    interview_number: number;
    persona: {
      name: string;
      role: string;
      background: string;
      traits: string;
      communication_style: string;
    };
    qa_pairs: Array<{
      question: string;
      answer: string;
    }>;
  }>;
  synthesis: string;
  research_metadata?: {
    total_questions: number;
    total_personas: number;
    total_responses: number;
    analysis_depth: string;
    research_type: string;
  };
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [researchQuestion, setResearchQuestion] = useState("");
  const [targetDemographic, setTargetDemographic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (formData: {
    research_question: string;
    target_demographic: string;
    num_personas?: number;
    num_questions?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/research`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || "An error occurred during research");
      }
    } catch (err) {
      console.error("Research error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to conduct research"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: any) => {
    if (template.question) {
      setResearchQuestion(template.question);
    }
    if (template.demographic) {
      setTargetDemographic(template.demographic);
    }
  };

  const resetForm = () => {
    setResults(null);
    setError(null);
    setResearchQuestion("");
    setTargetDemographic("");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="ml-64 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {!results ? (
            /* Research Setup */
            <div className="max-w-4xl mx-auto">
              {/* Hero Section */}
              <HeroSection />

              {/* Research Form */}
              <ResearchForm onSubmit={handleSubmit} isLoading={isLoading} />

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Research Results */
            <div className="space-y-8">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Research Results
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {results.research_question}
                  </p>
                </div>
                <button onClick={resetForm} className="apple-button-secondary">
                  New Research
                </button>
              </div>

              {/* Research Overview */}
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Research Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="stat-card">
                    <div className="metric-label">Target Demographic</div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {results.target_demographic}
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="metric-label">Interviews Conducted</div>
                    <div className="metric-value">{results.num_interviews}</div>
                  </div>
                  <div className="stat-card">
                    <div className="metric-label">Questions Asked</div>
                    <div className="metric-value">
                      {results.interview_questions.length}
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="metric-label">Total Responses</div>
                    <div className="metric-value">
                      {results.research_metadata?.total_responses || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Synthesis */}
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  📊 Research Analysis
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap research-content"
                    dangerouslySetInnerHTML={{
                      __html: results.synthesis
                        .replace(/\n/g, "<br />")
                        .replace(
                          /#{1,6}\s/g,
                          (match) =>
                            `<h${
                              match.trim().length
                            } class="text-gray-900 dark:text-white font-medium text-base mt-4 mb-2">`
                        )
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          "<span class='text-gray-800 dark:text-gray-200 font-medium'>$1</span>"
                        )
                        .replace(
                          /- (.*?)(\n|$)/g,
                          "<li class='text-gray-700 dark:text-gray-300 ml-4'>$1</li>"
                        )
                        .replace(
                          /(\d+)\.\s(.*?)(\n|$)/g,
                          "<li class='text-gray-700 dark:text-gray-300 ml-4'><span class='font-medium'>$1.</span> $2</li>"
                        ),
                    }}
                  />
                </div>
              </div>

              {/* Personas */}
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  👥 Generated Personas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.personas.map((persona, index) => (
                    <div key={index} className="feature-card">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="persona-avatar">
                          {persona.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {persona.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {persona.age} years old, {persona.job}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {persona.background}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {persona.traits.map((trait, i) => (
                          <span key={i} className="insight-tag neutral text-xs">
                            {trait}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 italic">
                        Style: {persona.communication_style}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Q&A Section */}
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  💬 Detailed Interview Questions & Answers
                </h2>
                <div className="space-y-8">
                  {results.detailed_qa &&
                    results.detailed_qa.map((interview, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50"
                      >
                        {/* Interview Header */}
                        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-4">
                            <div className="persona-avatar bg-blue-500">
                              {interview.persona.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Interview #{interview.interview_number}:{" "}
                                {interview.persona.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {interview.persona.role} •{" "}
                                {interview.persona.traits}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Background: {interview.persona.background}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Q&A Pairs */}
                        <div className="space-y-4">
                          {interview.qa_pairs.map((qa, qaIndex) => (
                            <div key={qaIndex} className="space-y-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                                <p className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">
                                  Question {qaIndex + 1}:
                                </p>
                                <p className="text-gray-800 dark:text-gray-200">
                                  {qa.question}
                                </p>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                                <p className="font-medium text-green-900 dark:text-green-100 text-sm mb-1">
                                  {interview.persona.name}'s Answer:
                                </p>
                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                  {qa.answer}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Research Metadata */}
              {results.research_metadata && (
                <div className="apple-card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    📈 Research Metadata
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Analysis Depth:</span>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {results.research_metadata.analysis_depth}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Research Type:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {results.research_metadata.research_type
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Questions:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {results.research_metadata.total_questions}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Personas:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {results.research_metadata.total_personas}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
