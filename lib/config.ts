const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const WEB_ORIGIN =
  process.env.NEXT_PUBLIC_WEB_ORIGIN || 'https://saju-strength-zifl.vercel.app';

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
