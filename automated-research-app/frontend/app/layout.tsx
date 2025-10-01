import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Automated Research",
  description: "AI-powered user research system with multi-agent workflow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sf-pro">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
