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
        '@granite-js/plugin-sentry': false,
      };
      return config;
    },
  } : {}),
  ...(isTossBuild ? {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    webpack: (config) => {
      // @granite-js/plugin-sentry는 빌드타임 플러그인(Node.js fs 의존)이므로
      // 클라이언트 번들에서 제외. sentry.ts의 try/catch가 graceful fallback 처리.
      // 런타임 Sentry는 @sentry/browser로 별도 연동 예정.
      config.resolve.alias = {
        ...config.resolve.alias,
        '@granite-js/plugin-sentry': false,
      };
      return config;
    },
  } : {}),
};

module.exports = nextConfig;
