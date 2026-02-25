import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'saju-strength',
  brand: {
    displayName: '사주강점',
    primaryColor: '#3182F6',
    icon: './public/icon.png',
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
