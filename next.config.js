/** @type {import('next').NextConfig} */
const isTossBuild = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

const nextConfig = {
  transpilePackages: ['@fullstackfamily/manseryeok'],
  ...(!isTossBuild ? {
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@toss/tds-mobile': false,
        '@toss/tds-mobile-ait': false,
      };
      return config;
    },
  } : {}),
  ...(isTossBuild ? {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

module.exports = nextConfig;
