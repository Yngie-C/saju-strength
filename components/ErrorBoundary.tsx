'use client';

import React from 'react';
import { IS_TOSS, designTokens } from '@/lib/design-tokens';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (IS_TOSS) {
      (import('@granite-js/plugin-sentry') as any).then((mod: any) => {
        if (typeof mod.captureException === 'function') {
          mod.captureException(error);
        }
      }).catch(() => {});
    }
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div
          className={`p-4 ${designTokens.cardBg} ${designTokens.cardRadius} flex flex-col items-center gap-3 text-center`}
        >
          <p className={`text-sm ${designTokens.textSecondary}`}>
            이 부분을 불러오지 못했어요
          </p>
          <button
            onClick={this.handleReset}
            className={`px-4 py-2 text-sm font-semibold ${designTokens.primaryButton}`}
          >
            다시 시도하기
          </button>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
