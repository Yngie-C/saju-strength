/** @type {import('next').NextConfig} */
const isTossBuild = process.env.BUILD_TARGET === 'toss';

const nextConfig = {
  transpilePackages: ['@fullstackfamily/manseryeok'],
  ...(isTossBuild ? {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

module.exports = nextConfig;
