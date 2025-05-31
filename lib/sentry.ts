/**
 * Sentry utility functions for breadcrumbs and logging
 * Based on the patterns from sentry-deployment-guide.md documentation
 */

import * as Sentry from '@sentry/nextjs';

export const LogCategory = {
  UI: 'ui',
  API: 'api',
  IMAGE: 'image',
  AI: 'ai',
  VERIFICATION: 'verification',
  DATABASE: 'database',
  VOICE: 'voice',
  AUDIO: 'audio',
} as const;

export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

export function logUIInteraction(action: string, data: Record<string, any> = {}) {
  addBreadcrumb({
    category: LogCategory.UI,
    message: action,
    data,
    level: 'info'
  });
}

export function logVoiceEvent(event: string, data: Record<string, any> = {}) {
  addBreadcrumb({
    category: LogCategory.VOICE,
    message: event,
    data,
    level: 'info'
  });
}

export function captureException(
  error: Error, 
  context?: {
    tags?: Record<string, string>,
    extra?: Record<string, any>
  }
) {
  Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra
  });
}

export function setUser(user: Sentry.User) {
  Sentry.setUser(user);
}

export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

export function setContext(key: string, context: Record<string, any>) {
  Sentry.setContext(key, context);
}

// Note: startTransaction is available in @sentry/tracing but not in @sentry/nextjs
// For now, we'll create a simplified version or use the performance API
export function startTransaction(options: {
  name: string;
  op: string;
  tags?: Record<string, string>;
}) {
  // In a full implementation, this would use Sentry.startTransaction
  // For now, return a simple transaction-like object
  const startTime = Date.now();
  
  return {
    setTag: (key: string, value: string) => {
      Sentry.setTag(key, value);
    },
    finish: () => {
      const duration = Date.now() - startTime;
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Transaction ${options.name} completed`,
        data: {
          op: options.op,
          duration,
          ...options.tags,
        },
        level: 'info'
      });
    }
  };
} 