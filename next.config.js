/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
    ],
  },
  // 添加调试日志
  onDemandEntries: {
    // 保持页面缓存时间较短，方便调试
    maxInactiveAge: 25 * 1000,
  },
}

console.log('加载 Next.js 配置:', nextConfig);

module.exports = nextConfig 