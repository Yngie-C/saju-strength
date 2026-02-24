/** @type {import('next').NextConfig} */
const isTossBuild = process.env.BUILD_TARGET === 'toss';

const nextConfig = {
  transpilePackages: ['@fullstackfamily/manseryeok'],
  // Explicitly define NEXT_PUBLIC_BUILD_TARGET so webpack can dead-code-eliminate
  // toss-only branches (e.g. @toss/tds-mobile imports) from the web bundle.
  env: {
    NEXT_PUBLIC_BUILD_TARGET: isTossBuild ? 'toss' : 'web',
  },
  // On web builds, replace @toss packages with empty modules.
  // @toss/tds-mobile-ait statically imports @toss/tds-mobile, which causes ~989KB
  // to be bundled even though these packages are only used in toss WebView builds.
  // Note: webpack externals can't handle @scoped packages (generates invalid JS).
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
