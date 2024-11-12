/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        // Matches the placeholder URL pattern
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "", // Default is empty, meaning any port
        pathname: "/**", // Allow all paths
      },
    ],
  },
};

export default nextConfig;
