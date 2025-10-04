"use client";

import {
  ClerkProvider,
  useUser as useClerkUser,
  useAuth as useClerkAuth,
} from "@clerk/nextjs";
import { createContext, useContext, useState, useEffect } from "react";

// Extended User interface for our app (compatible with Clerk)
interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider?: "google" | "github" | "email";
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  setGuestMode: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context.user;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom auth provider that works with Clerk
function InternalAuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const { signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clerkLoaded) {
      if (clerkUser) {
        // Convert Clerk user to our User interface
        const ourUser: User = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: clerkUser.fullName || clerkUser.firstName || "User",
          avatar: clerkUser.imageUrl,
          provider: getProviderFromClerk(clerkUser),
          isGuest: false,
        };
        setUser(ourUser);
      } else {
        // Check for guest mode in localStorage
        const guestMode = localStorage.getItem("guestMode");
        if (guestMode === "true") {
          const savedGuestUser = localStorage.getItem("guestUser");
          if (savedGuestUser) {
            setUser(JSON.parse(savedGuestUser));
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    }
  }, [clerkUser, clerkLoaded]);

  const getProviderFromClerk = (
    clerkUser: any
  ): "google" | "github" | "email" => {
    const externalAccounts = clerkUser.externalAccounts || [];
    if (
      externalAccounts.some((account: any) => account.provider === "google")
    ) {
      return "google";
    }
    if (
      externalAccounts.some((account: any) => account.provider === "github")
    ) {
      return "github";
    }
    return "email";
  };

  const login = (email: string, name?: string) => {
    // For email login, we'll redirect to Clerk's sign-in
    // This is a fallback for custom email handling
    console.log("Email login should use Clerk SignIn component");
  };

  const logout = async () => {
    if (clerkUser) {
      await signOut();
    }

    setUser(null);
    localStorage.removeItem("guestMode");
    localStorage.removeItem("guestUser");

    // Clear user-specific research data
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("research_") || key.startsWith("reports_")) {
        localStorage.removeItem(key);
      }
    });
  };

  const setGuestMode = () => {
    const guestUser: User = {
      id: "guest-" + Date.now(),
      isGuest: true,
      name: "Guest User",
    };
    setUser(guestUser);
    localStorage.setItem("guestMode", "true");
    localStorage.setItem("guestUser", JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, setGuestMode, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Main providers wrapper
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <InternalAuthProvider>{children}</InternalAuthProvider>
    </ClerkProvider>
  );
}
