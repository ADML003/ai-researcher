"use client";

import React, { useState } from "react";
import { ChevronRight, Play } from "lucide-react";

interface ResearchFormProps {
  onSubmit?: (data: {
    research_question: string;
    target_demographic: string;
    num_personas?: number;
    num_questions?: number;
  }) => void;
  isLoading?: boolean;
}

export const ResearchForm: React.FC<ResearchFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [researchQuestion, setResearchQuestion] = useState("");
  const [targetDemographic, setTargetDemographic] = useState("");
  const [numPersonas, setNumPersonas] = useState(3);
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchQuestion.trim() || !targetDemographic.trim()) return;

    onSubmit?.({
      research_question: researchQuestion,
      target_demographic: targetDemographic,
      num_personas: numPersonas,
      num_questions: numQuestions,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto animate-scale-in">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          Start New Research
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure your research and let AI handle the interviews
        </p>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Research Question */}
          <div className="form-group">
            <label htmlFor="research-question" className="form-label text-sm">
              Research Question
            </label>
            <textarea
              id="research-question"
              className="apple-input-enhanced min-h-[80px] text-sm"
              placeholder="What would you like to research? (e.g., How do developers approach API documentation?)"
              value={researchQuestion}
              onChange={(e) => setResearchQuestion(e.target.value)}
              required
            />
            <p className="form-description text-xs">
              Be specific about what you want to learn
            </p>
          </div>

          {/* Target Demographic */}
          <div className="form-group">
            <label htmlFor="target-demographic" className="form-label text-sm">
              Target Demographic
            </label>
            <input
              id="target-demographic"
              type="text"
              className="apple-input-enhanced text-sm"
              placeholder="Who would you like to interview? (e.g., Software developers, Product managers)"
              value={targetDemographic}
              onChange={(e) => setTargetDemographic(e.target.value)}
              required
            />
            <p className="form-description text-xs">
              Describe your ideal interview participants
            </p>
          </div>

          {/* Advanced Options (Collapsible) */}
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer text-gray-700 dark:text-gray-300 font-medium py-2 text-sm">
              Advanced Options
              <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="mt-3 space-y-3 form-section">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="num-personas" className="form-label text-sm">
                    Number of Personas
                  </label>
                  <select
                    id="num-personas"
                    className="apple-input-enhanced text-sm"
                    value={numPersonas}
                    onChange={(e) => setNumPersonas(Number(e.target.value))}
                  >
                    <option value={3}>3 (Default)</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="num-questions" className="form-label text-sm">
                    Questions per Interview
                  </label>
                  <select
                    id="num-questions"
                    className="apple-input-enhanced text-sm"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                  >
                    <option value={5}>5 (Default)</option>
                    <option value={7}>7</option>
                    <option value={10}>10</option>
                  </select>
                </div>
              </div>
            </div>
          </details>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={
                isLoading ||
                !researchQuestion.trim() ||
                !targetDemographic.trim()
              }
              className="button-gradient w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none py-3 text-base font-medium"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                  Processing Research...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2 inline-block" />
                  Start Research
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResearchForm;
