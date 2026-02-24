import { defineConfig } from '@apps-in-toss/web-framework';

export default defineConfig({
  appId: 'saju-strength',
  appName: '사주강점',
  brand: {
    name: '사주강점',
    color: '#3182F6',
  },
  web: {
    entryPoint: './out/index.html',
    outdir: './out',
  },
  permissions: [],
  auth: {
    required: true,
    scope: ['user_id', 'profile'],
  },
  iap: {
    products: [
      { id: 'premium_report', type: 'consumable', price: 1900 },
      { id: 'couple_analysis', type: 'consumable', price: 2900 },
    ],
  },
  navigationBar: {
    title: '사주강점',
    leftButton: 'back',
    rightButton: { icon: 'share', action: 'share' },
  },
});
