import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, Play, Loader2 } from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  start_time?: string;
  end_time?: string;
  duration_ms?: number;
  metadata: Record<string, any>;
  error_message?: string;
  substeps: WorkflowStep[];
}

interface WorkflowProgress {
  workflow_id: string;
  session_id: string;
  research_question: string;
  progress_percentage: number;
  total_steps: number;
  completed_steps: number;
  running_steps: number;
  failed_steps: number;
  current_step?: WorkflowStep;
  start_time: string;
  steps: WorkflowStep[];
}

interface WorkflowTrackerProps {
  sessionId: string;
  onComplete?: () => void;
}

const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  sessionId,
  onComplete,
}) => {
  const [progress, setProgress] = useState<WorkflowProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/workflow/${sessionId}`
        );
        const data = await response.json();

        if (data.success) {
          setProgress(data.data);

          // Check if workflow is complete
          if (data.data.progress_percentage === 100) {
            onComplete?.();
          }
        } else {
          setError("Failed to fetch workflow progress");
        }
      } catch (err) {
        setError("Connection error");
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchProgress();

    // Poll for updates every 2 seconds while research is running
    const interval = setInterval(fetchProgress, 2000);

    return () => clearInterval(interval);
  }, [sessionId, onComplete]);

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return "";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "running":
        return "bg-blue-50 border-blue-200";
      case "failed":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-lg">Initializing research workflow...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <span className="ml-2 text-red-700 font-medium">Workflow Error</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center p-8 text-gray-500">
        No workflow data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Research Workflow
        </h2>
        <p className="text-gray-600 mb-4">{progress.research_question}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.progress_percentage}%` }}
          />
        </div>

        {/* Progress Stats */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>{progress.progress_percentage.toFixed(1)}% Complete</span>
          <span>
            {progress.completed_steps} of {progress.total_steps} steps
          </span>
        </div>
      </div>

      {/* Current Step Highlight */}
      {progress.current_step && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            <div className="ml-3">
              <h3 className="font-medium text-blue-900">
                {progress.current_step.name}
              </h3>
              <p className="text-blue-700 text-sm">
                {progress.current_step.description}
              </p>
              {progress.current_step.metadata &&
                Object.keys(progress.current_step.metadata).length > 0 && (
                  <div className="mt-2 text-xs text-blue-600">
                    {Object.entries(progress.current_step.metadata).map(
                      ([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}:{" "}
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-4">
        {progress.steps.map((step, index) => (
          <div
            key={step.id}
            className={`border rounded-lg p-4 ${getStepStatusColor(
              step.status
            )}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step.status)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{step.name}</h3>
                  {step.duration_ms && (
                    <span className="text-sm text-gray-500">
                      {formatDuration(step.duration_ms)}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{step.description}</p>

                {/* Error Message */}
                {step.error_message && (
                  <div className="mt-2 text-red-600 text-sm bg-red-100 rounded p-2">
                    {step.error_message}
                  </div>
                )}

                {/* Metadata */}
                {step.metadata && Object.keys(step.metadata).length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {Object.entries(step.metadata).map(([key, value]) => (
                      <span key={key} className="mr-3">
                        {key}:{" "}
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Substeps */}
                {step.substeps && step.substeps.length > 0 && (
                  <div className="mt-3 ml-4 space-y-2">
                    {step.substeps.map((substep) => (
                      <div
                        key={substep.id}
                        className="flex items-center text-sm"
                      >
                        <div className="flex-shrink-0">
                          {getStepIcon(substep.status)}
                        </div>
                        <span className="ml-2 text-gray-700">
                          {substep.name}
                        </span>
                        {substep.duration_ms && (
                          <span className="ml-auto text-gray-500">
                            {formatDuration(substep.duration_ms)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {progress.progress_percentage === 100 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div className="ml-3">
              <h3 className="font-medium text-green-900">Research Complete!</h3>
              <p className="text-green-700 text-sm">
                Your research analysis is ready for review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowTracker;
