/**
 * 앱인토스 WebView 설정 (placeholder)
 *
 * 실제 구현 시 @apps-in-toss/web-framework 패키지 설치 후 활성화
 * npm install @apps-in-toss/web-framework
 *
 * import { defineConfig } from '@apps-in-toss/web-framework';
 */

const graniteConfig = {
  appId: 'saju-strength',
  appName: '사주강점',
  version: '1.0.0',

  webview: {
    entryPoint: './out/index.html',
    navigationBar: {
      title: '사주강점',
      leftButton: 'back',
      rightButton: {
        icon: 'share',
        action: 'share',
      },
    },
  },

  auth: {
    required: true,
    scope: ['user_id', 'profile'],
  },

  iap: {
    products: [
      {
        id: 'premium_report',
        type: 'consumable',
        price: 1900,
      },
      {
        id: 'couple_analysis',
        type: 'consumable',
        price: 2900,
      },
    ],
  },
};

export default graniteConfig;
