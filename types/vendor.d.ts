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
    referrer: string;
  }

  export function appLogin(): Promise<AppLoginResult>;

  export const AppsInToss: {
    registerApp(options: { appName: string }): void;
  };

  export function getTossShareLink(
    deepLink: string,
    ogImageUrl?: string
  ): Promise<string>;

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

  export function getProductItemList(): Promise<unknown[]>;

  export function createOneTimePurchaseOrder(options: {
    productId: string;
  }): Promise<unknown>;
}
