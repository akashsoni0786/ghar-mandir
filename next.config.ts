import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_APP_END_POINT: process.env.NEXT_PUBLIC_APP_END_POINT,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_AUTH_KEY_ID: process.env.NEXT_PUBLIC_AUTH_KEY_ID,
    FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN,
    FB_PIXEL_ID: process.env.FB_PIXEL_ID,
    NEXT_PUBLIC_PAYPAL_SECRET_CLIENT_ID:
      process.env.NEXT_PUBLIC_PAYPAL_SECRET_CLIENT_ID,
  },
  appDir: true,
  clientComponents: ["src/**"],
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d28wmhrn813hkk.cloudfront.net",
      },
    ],
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        // Add other Node.js core modules if needed
      };
      config.module.rules.push({
        test: /\.(mp4|webm)$/,
        type: "asset/resource",
        generator: {
          filename: "static/videos/[hash][ext][query]",
        },
      });
    }
    return config;
  },
};

export default nextConfig;
