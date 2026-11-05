import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["next-mdx-remote"],
  devIndicators: false,
  experimental: {
    // Rewrite barrel imports to deep imports so a single icon doesn't pull the
    // whole package into the module graph. Next already optimizes lucide-react,
    // @tabler/icons-react, date-fns and lodash-es by default; these are the
    // heavy icon packages this app uses that are NOT on that default list.
    optimizePackageImports: [
      "@hugeicons/react",
      "@hugeicons/core-free-icons",
      "@phosphor-icons/react",
      "@remixicon/react",
    ],
    agentUpgrade: "latest",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ],
    qualities: [75, 100],
  },
  compiler:
    process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error"],
          },
        }
      : undefined,
  async redirects() {
    return [
      /**
       * Agents probing the conventional URL land on the index instead of a 404.
       */
      {
        source: "/llms-full.txt",
        destination: "/llms.txt",
        permanent: true,
      },
      {
        source: "/blog/:slug.mdx",
        destination: "/blog/:slug.md",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      // beforeFiles so these run before prerendered pages are served;
      // afterFiles rewrites never fire for SSG pages on Vercel, which
      // silently breaks Accept-based markdown negotiation in production
      beforeFiles: [
        {
          source: "/blog/:slug.md",
          destination: "/doc.md/:slug",
        },
        {
          source: "/blog/:slug",
          destination: "/doc.md/:slug",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(?<accept>.*text/markdown.*)",
            },
          ],
        },
        {
          source: "/index.md",
          destination: "/llms.txt",
        },
        {
          source: "/",
          destination: "/llms.txt",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(?<accept>.*text/markdown.*)",
            },
          ],
        },
      ],
      afterFiles: [
        {
          source: "/rss",
          destination: "/blog/rss",
        },
      ],
    }
  },
}

export default nextConfig
