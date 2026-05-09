/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 允许即使有 TypeScript 错误也完成编译
    ignoreBuildErrors: true,
  },
  eslint: {
    // 允许即使有 ESLint 错误也完成编译
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
