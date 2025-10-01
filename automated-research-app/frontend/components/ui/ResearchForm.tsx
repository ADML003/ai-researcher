"use client";

import React, { useState } from "react";
import { ChevronRight, Play, Eye } from "lucide-react";

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
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto animate-scale-in">
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Research Question */}
          <div className="form-group">
            <label htmlFor="research-question" className="form-label">
              Research Question
            </label>
            <textarea
              id="research-question"
              className="apple-input-enhanced min-h-[120px]"
              placeholder="What would you like to research? (e.g., How do developers approach API documentation?)"
              value={researchQuestion}
              onChange={(e) => setResearchQuestion(e.target.value)}
              required
            />
            <p className="form-description">
              Be specific about what you want to learn. Good questions lead to
              better insights.
            </p>
          </div>

          {/* Target Demographic */}
          <div className="form-group">
            <label htmlFor="target-demographic" className="form-label">
              Target Demographic
            </label>
            <input
              id="target-demographic"
              type="text"
              className="apple-input-enhanced"
              placeholder="Who would you like to interview? (e.g., Software developers, Product managers)"
              value={targetDemographic}
              onChange={(e) => setTargetDemographic(e.target.value)}
              required
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
                  <label htmlFor="num-personas" className="form-label">
                    Number of Personas
                  </label>
                  <select
                    id="num-personas"
                    className="apple-input-enhanced"
                    value={numPersonas}
                    onChange={(e) => setNumPersonas(Number(e.target.value))}
                  >
                    <option value={3}>3 (Default)</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="num-questions" className="form-label">
                    Questions per Interview
                  </label>
                  <select
                    id="num-questions"
                    className="apple-input-enhanced"
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

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={
                isLoading ||
                !researchQuestion.trim() ||
                !targetDemographic.trim()
              }
              className="button-gradient flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Research
                </>
              )}
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
};

export default ResearchForm;
