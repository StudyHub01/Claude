import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clientflow — Client Portal for Freelancers",
  description: "Share work, get approvals, collect payments. Your clients deserve better than email.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  );
}
