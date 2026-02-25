'use client';

// IAP_DISABLED_START — 인앱광고 전환으로 IAP 비활성화 (2026-02-26)
// import { isTossEnvironment } from '@/lib/toss';
// import { apiUrl } from '@/lib/config';
//
// export type ProductId = 'premium_report' | 'couple_analysis';
//
// export interface Product {
//   id: ProductId;
//   name: string;
//   description: string;
//   price: number;
//   priceDisplay: string;
// }
//
// export const PRODUCTS: Record<ProductId, Product> = {
//   premium_report: {
//     id: 'premium_report',
//     name: '프리미엄 심층 리포트',
//     description: '10가지 페르소나 심층 분석 + 개인화 성장 로드맵 + 브랜딩 메시지',
//     price: 1900,
//     priceDisplay: '1,900원',
//   },
//   couple_analysis: {
//     id: 'couple_analysis',
//     name: '궁합 분석',
//     description: '두 사람의 사주×강점 교차 분석 + 관계 시너지 가이드',
//     price: 2900,
//     priceDisplay: '2,900원',
//   },
// };
//
// /** Purchase a product via Toss IAP */
// export async function purchaseProduct(productId: ProductId, sessionId: string): Promise<{
//   success: boolean;
//   purchaseId?: string;
//   error?: string;
// }> {
//   if (!isTossEnvironment()) {
//     return { success: false, error: '토스 앱에서만 결제할 수 있습니다.' };
//   }
//
//   try {
//     // 1. Call Toss IAP SDK
//     const { createOneTimePurchaseOrder } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
//     const orderResult = await createOneTimePurchaseOrder({ productId }) as Record<string, unknown> | null;
//
//     if (!orderResult) {
//       return { success: false, error: '결제가 취소되었습니다.' };
//     }
//
//     // 2. Verify purchase on server
//     const response = await fetch(apiUrl('/api/iap/verify'), {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         sessionId,
//         productId,
//         purchaseToken: orderResult.purchaseToken || orderResult.orderId || JSON.stringify(orderResult),
//       }),
//     });
//
//     if (!response.ok) {
//       return { success: false, error: '결제 검증에 실패했습니다.' };
//     }
//
//     const data = await response.json();
//     return { success: true, purchaseId: data.purchaseId };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : '결제 중 오류가 발생했습니다.',
//     };
//   }
// }
//
// /** Check if user has purchased a product */
// export async function checkPurchase(productId: ProductId, sessionId: string): Promise<boolean> {
//   try {
//     const response = await fetch(
//       apiUrl(`/api/iap/check?sessionId=${sessionId}&productId=${productId}`)
//     );
//     if (!response.ok) return false;
//     const data = await response.json();
//     return data.purchased === true;
//   } catch {
//     return false;
//   }
// }
// IAP_DISABLED_END

// Stub exports to maintain type compatibility
export type ProductId = 'premium_report' | 'couple_analysis';
export const PRODUCTS = {} as Record<string, unknown>;
export async function purchaseProduct(): Promise<{ success: false; error: string }> {
  return { success: false, error: 'IAP disabled' };
}
export async function checkPurchase(): Promise<boolean> {
  return false;
}
