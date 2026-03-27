import type { Metadata } from "next";
import LayoutNav from "@/components/LayoutNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "English System",
  description: "English learning roadmap with AI-powered coaching",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <LayoutNav />
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
