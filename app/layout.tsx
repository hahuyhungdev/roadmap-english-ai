import type { Metadata } from "next";
import LayoutNav from "@/components/LayoutNav";
import { MantineProviderClient } from "@/components/MantineProviderClient";
import "@mantine/core/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "English System",
  description: "English learning roadmap with AI-powered coaching",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProviderClient>
          <div className="min-h-screen relative flex flex-col">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #f59e0b 100%)
      `,
                backgroundSize: "100% 100%",
              }}
            />
            <div className="relative z-10 flex-1 flex flex-col">
              <LayoutNav />
              <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
                {children}
              </main>
            </div>
          </div>
        </MantineProviderClient>
      </body>
    </html>
  );
}
