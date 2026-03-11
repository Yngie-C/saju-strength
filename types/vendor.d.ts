// Type declarations for vendor packages not yet installed

declare module 'node-fetch' {
  import { Agent } from 'https';
  function fetch(
    url: string,
    init?: Record<string, unknown> & { agent?: Agent }
  ): Promise<import('stream').Readable & { ok: boolean; status: number; json(): Promise<unknown>; text(): Promise<string> }>;
  export default fetch;
}

declare module '@apps-in-toss/web-framework' {
  export interface AppLoginResult {
    authorizationCode: string;
    referrer: 'DEFAULT' | 'SANDBOX';
  }

  export function appLogin(): Promise<AppLoginResult>;

  export function getTossShareLink(path: string): Promise<string>;

  export function share(options: { message: string }): Promise<void>;

  export interface GraniteEventListener {
    onEvent: () => void;
    onError?: (error: unknown) => void;
  }

  export const graniteEvent: {
    addEventListener(
      eventName: string,
      listener: GraniteEventListener
    ): () => void;
  };

  // TossAds
  export const TossAds: {
    initialize: ((options?: { callbacks?: { onInitialized?: () => void; onInitializationFailed?: (error: Error) => void } }) => void) & { isSupported: () => boolean };
    attachBanner: ((adGroupId: string, target: string | HTMLElement, options?: { theme?: 'auto' | 'light' | 'dark'; variant?: 'card' | 'expanded' }) => { destroy: () => void }) & { isSupported: () => boolean };
    destroy: ((slotId: string) => void) & { isSupported: () => boolean };
    destroyAll: (() => void) & { isSupported: () => boolean };
  };

  // Full screen ads
  export const loadFullScreenAd: ((args: {
    onEvent: (data: unknown) => void;
    onError: (error: Error) => void;
    options?: { adGroupId: string };
  }) => () => void) & { isSupported: () => boolean };

  export const showFullScreenAd: ((args: {
    onEvent: (data: { type: string; data?: { unitType: string; unitAmount: number } }) => void;
    onError: (error: Error) => void;
    options?: { adGroupId: string };
  }) => () => void) & { isSupported: () => boolean };

  // IAP namespace
  export const IAP: {
    createOneTimePurchaseOrder: (params: unknown) => () => void;
    getProductItemList: () => Promise<{ products: unknown[] }>;
  };
}
