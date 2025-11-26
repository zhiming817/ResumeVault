import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Handle React Native packages for MetaMask SDK
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    
    return config;
  },
};

export default nextConfig;
