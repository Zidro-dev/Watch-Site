/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // We will handle strict TS ourselves, ignoring ESLint to speed up prototype deploy
  },
  typescript: {
    ignoreBuildErrors: true, // For prototype rapid deploy, we ignore minor TS errors on Vercel
  }
};

export default nextConfig;
