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
        <div className="min-h-screen relative flex flex-col">
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `
            radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
            radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
            radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
            radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
          `,
            }}
          />
          <div className="relative z-10 flex-1 flex flex-col">
            <LayoutNav />
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
