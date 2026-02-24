interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: unknown) => void;
}

/**
 * Retry a function with exponential backoff.
 *
 * Usage:
 * const result = await withRetry(
 *   () => fetch(apiUrl('/api/saju/calculate'), { ... }),
 *   { maxAttempts: 3, delayMs: 1000 }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        onRetry?.(attempt, error);
        const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Retry a fetch call, also retrying on non-OK responses.
 */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, init);
    if (!response.ok && response.status >= 500) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  }, options);
}
