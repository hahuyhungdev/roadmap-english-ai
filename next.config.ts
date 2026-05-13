import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function getLocalIPs(): string[] {
  try {
    return Object.values(os.networkInterfaces())
      .flat()
      .filter((iface) => iface && iface.family === "IPv4" && !iface.internal)
      .map((iface) => iface!.address);
  } catch {
    // Some CI/container environments can throw on networkInterfaces().
    return [];
  }
}

const localIPs = getLocalIPs();

const nextConfig: NextConfig = {
  // Content markdown files are in /content at project root
  reactCompiler: true,
  output: "standalone",
  allowedDevOrigins: localIPs,
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/phase/phase-2-the-strategic-psychological-engine/session/:path*",
        destination:
          "/phase/phase-3-the-strategic-psychological-engine/session/:path*",
        permanent: false,
      },
      {
        source: "/phase/phase-2-the-strategic-psychological-engine",
        destination: "/phase/phase-3-the-strategic-psychological-engine",
        permanent: false,
      },
      {
        source: "/phase/phase-3-practical-discussion/session/:path*",
        destination:
          "/phase/phase-3-the-strategic-psychological-engine/session/:path*",
        permanent: false,
      },
      {
        source: "/phase/phase-3-practical-discussion",
        destination: "/phase/phase-3-the-strategic-psychological-engine",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
