"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import HeroSection from "@/components/ui/HeroSection";
import ResearchForm from "@/components/ui/ResearchForm";
import TemplateGrid from "@/components/ui/TemplateGrid";
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
  synthesis: string;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [researchQuestion, setResearchQuestion] = useState("");
  const [targetDemographic, setTargetDemographic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchQuestion.trim() || !targetDemographic.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/research`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            research_question: researchQuestion,
            target_demographic: targetDemographic,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to conduct research");
      }

      if (data.success) {
        setResults(data.data);
      } else {
        throw new Error(data.error || "Research failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResearchQuestion("");
    setTargetDemographic("");
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-apple-blue rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Automated Research
              </h1>
            </div>
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!results ? (
          /* Research Form */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                AI-Powered User Research
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Generate user personas, conduct interviews, and synthesize
                insights in under 60 seconds
              </p>
            </div>

            <div className="apple-card p-8 animate-slide-up">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="research-question"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Research Question
                  </label>
                  <textarea
                    id="research-question"
                    value={researchQuestion}
                    onChange={(e) => setResearchQuestion(e.target.value)}
                    placeholder="What would you like to research? (e.g., How do developers approach API documentation?)"
                    className="apple-textarea"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="target-demographic"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Target Demographic
                  </label>
                  <input
                    id="target-demographic"
                    type="text"
                    value={targetDemographic}
                    onChange={(e) => setTargetDemographic(e.target.value)}
                    placeholder="Who would you like to interview? (e.g., Software developers, Product managers)"
                    className="apple-input"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-700 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !researchQuestion.trim() ||
                    !targetDemographic.trim()
                  }
                  className="w-full apple-button-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Conducting Research...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Start Research</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Results Display */
          <div className="space-y-8 animate-fade-in">
            {/* Header with Reset Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Research Results
              </h2>
              <button
                onClick={resetForm}
                className="apple-button-secondary flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>New Research</span>
              </button>
            </div>

            {/* Research Overview */}
            <div className="apple-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Research Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Question:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {results.research_question}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Demographic:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {results.target_demographic}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Interviews:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {results.num_interviews} participants
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Questions:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {results.interview_questions.length} per interview
                  </p>
                </div>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="apple-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Interview Questions
              </h3>
              <div className="space-y-2">
                {results.interview_questions.map((question, index) => (
                  <div key={index} className="flex space-x-3">
                    <span className="text-apple-blue font-medium">
                      Q{index + 1}:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {question}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personas */}
            <div className="apple-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Generated Personas</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.personas.map((persona, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {persona.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {persona.age} years old, {persona.job}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {persona.traits.map((trait, traitIndex) => (
                        <span
                          key={traitIndex}
                          className="px-2 py-1 bg-apple-blue/10 text-apple-blue text-xs rounded-lg"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {persona.background}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Synthesis */}
            <div className="apple-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Research Insights</span>
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {results.synthesis}
                </div>
              </div>
            </div>

            {/* Interview Details (Collapsible) */}
            <details className="apple-card p-6">
              <summary className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-apple-blue transition-colors">
                View Detailed Interviews ({results.interviews.length})
              </summary>
              <div className="mt-6 space-y-6">
                {results.interviews.map((interview, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-apple-blue pl-4"
                  >
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Interview {index + 1}: {interview.persona.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {interview.persona.age} years old,{" "}
                        {interview.persona.job}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {interview.responses.map((response, responseIndex) => (
                        <div
                          key={responseIndex}
                          className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                            Q: {response.question}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            A: {response.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}
