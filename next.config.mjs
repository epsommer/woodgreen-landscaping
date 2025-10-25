/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'non'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ]
  },
  // Transpile troika packages to fix worker module issues
  transpilePackages: ['troika-three-text', 'troika-worker-utils', 'troika-three-utils', 'bidi-js', 'opentype.js'],
  webpack: (config, { isServer }) => {
    // Fix for troika-three-text worker module loading issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        module: false,
      };

      // Add aliases to prevent worker issues
      config.resolve.alias = {
        ...config.resolve.alias,
        'troika-worker-utils': 'troika-worker-utils/dist/troika-worker-utils.esm.js',
      };
    }

    return config;
  },
};

export default nextConfig;
