import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'saju-strength',
  brand: {
    displayName: '간단한 강점 사주',
    primaryColor: '#3182F6',
    icon: 'https://static.toss.im/appsintoss/7363/6e61a6e9-ccd4-4082-b36e-1b1bc65fd7e6.png',
  },
  web: {
    port: 3000,
    commands: {
      dev: 'next dev',
      build: 'next build',
    },
  },
  outdir: './out',
  permissions: [],
  navigationBar: {
    withBackButton: true,
    withHomeButton: false,
  },
});
