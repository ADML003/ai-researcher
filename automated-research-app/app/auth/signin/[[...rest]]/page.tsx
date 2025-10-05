"use client";

import { SignIn } from "@clerk/nextjs";
import { useAuth } from "../../../providers";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const { setGuestMode } = useAuth();
  const router = useRouter();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleGuestMode = () => {
    setIsGuestLoading(true);
    setGuestMode();
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Automated Research
          </h1>
          <p className="text-gray-600">
            Sign in to manage your research projects securely
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-xl">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none border-none bg-transparent",
                headerTitle: "text-lg font-semibold text-gray-900",
                headerSubtitle: "text-sm text-gray-600",
                socialButtonsBlockButton:
                  "border border-gray-300 hover:bg-gray-50 text-gray-700",
                formButtonPrimary:
                  "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
                formFieldInput:
                  "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                footerActionLink: "text-blue-600 hover:text-blue-800",
              },
            }}
            redirectUrl="/dashboard"
          />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">or</span>
            </div>
          </div>

          {/* Guest Mode Button */}
          <button
            onClick={handleGuestMode}
            disabled={isGuestLoading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGuestLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Starting Guest Mode...
              </>
            ) : (
              "Continue as Guest"
            )}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          Powered by Clerk • Secure authentication with Google & GitHub
        </div>
      </div>
    </div>
  );
}
