"use client";

import { useState, useEffect } from "react";
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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/research`,
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
              <ResearchForm 
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              )}

              {/* Template Grid */}
              <TemplateGrid onSelectTemplate={handleTemplateSelect} />
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
                <button
                  onClick={resetForm}
                  className="apple-button-secondary"
                >
                  New Research
                </button>
              </div>

              {/* Research Overview */}
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Research Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="metric-value">{results.interview_questions.length}</div>
                  </div>
                </div>
              </div>

              {/* Personas */}
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Generated Personas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.personas.map((persona, index) => (
                    <div key={index} className="feature-card">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="persona-avatar">
                          {persona.name.split(' ').map(n => n[0]).join('')}
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
                      <div className="flex flex-wrap gap-1">
                        {persona.traits.map((trait, i) => (
                          <span key={i} className="insight-tag neutral text-xs">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synthesis */}
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Research Insights
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div 
                    className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: results.synthesis.replace(/\n/g, '<br />') }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}