# Error Handling, Logging, and Monitoring

## Introduction

This guide outlines best practices for error handling, logging, and monitoring in the TrayVerify application using Sentry and our structured logging system. Since all users have signed releases for 100% logging and replay tracking, we aim to capture comprehensive data to improve application reliability and user experience.

## Logging System

TrayVerify implements a unified, runtime-aware logging system that works across Node.js and Edge runtimes.

### Logger Facade

```typescript
// Import the logger in any file that needs logging
import { logger } from '@/utils/logger';

// Usage examples
logger.debug('Detailed debug information', { context: 'someFunction' });
logger.info('Important information', { userId: 123 });
logger.warn('Warning condition', { component: 'ImageUpload' });
logger.error('Error condition', { err: errorObject, operation: 'verifyTray' });
```

The logger automatically adapts to the runtime environment:
- In Node.js: Uses Pino for structured JSON logging with appropriate log levels
- In Edge/Browser: Uses console with debug/info logs controlled by NEXT_PUBLIC_DEBUG flag

### Request ID Propagation

All requests receive a unique request ID, which is consistently included in logs and Sentry events for correlation:

```typescript
// The middleware automatically sets x-request-id for all requests
// In API handlers, the requestId is available from headers:
const requestId = req.headers['x-request-id'] as string;
logger.info('Processing verification request', { requestId, verificationId });
```

When viewing logs or Sentry events, you can trace all related operations using this ID.

## Centralized Error Handling

### API Error Handler

All API routes use a centralized error handling wrapper:

```typescript
// API routes should use the withErrorHandling wrapper
import { withErrorHandling } from '@/server/utils/apiErrorHandler';

// For Pages Router API routes
export default withErrorHandling(async function handler(req, res) {
  // Your API logic here
  // Any thrown errors will be caught, logged, and properly formatted
});

// For App Router API handlers
export const GET = withErrorHandlingRoute(async (req) => {
  // Your handler logic here
});
```

This ensures consistent error responses, logging, and Sentry reporting across all API endpoints.

## Sentry Setup

We use the official `@sentry/nextjs` SDK with runtime-aware initialization in `instrumentation.ts`:

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    const { initializeEdgeSentry } = await import('./sentry.edge.config');
    initializeEdgeSentry();
  } else if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeNodeSentry } = await import('./sentry.node.config');
    initializeNodeSentry();
  }
}
```

### Configuration

Sentry is configured in our consolidated `next.config.ts`:

```typescript
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentrySDKOptions);
```

Key settings include:
- 100% trace, replay, and profile sampling
- Source map uploads for improved stack traces
- Ad-blocker circumvention via `/monitoring-tunnel` route
- Automatic React component annotation
- Vercel integration for deployment monitoring

### Error Types and Architecture

Define application-specific error types to categorize issues:

```typescript
// lib/errors.ts
export class TrayVerifyError extends Error {
  public readonly errorType: ErrorType;
  public readonly context: Record<string, any>;
  public readonly statusCode?: number;
  
  constructor(message: string, errorType: ErrorType, context: Record<string, any> = {}, statusCode?: number) {
    super(message);
    this.name = 'TrayVerifyError';
    this.errorType = errorType;
    this.context = context;
    this.statusCode = statusCode;
  }
}

export enum ErrorType {
  // Authentication/Authorization
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  
  // Data Validation
  VALIDATION = 'validation',
  
  // Image Processing
  IMAGE_UPLOAD = 'image_upload',
  IMAGE_PROCESSING = 'image_processing',
  
  // AI Processing
  AI_PROCESSING = 'ai_processing',
  AI_TIMEOUT = 'ai_timeout',
  MODEL_ERROR = 'model_error',
  PROMPT_ERROR = 'prompt_error',
  
  // Database
  DATABASE_ERROR = 'database_error',
  RECORD_NOT_FOUND = 'record_not_found',
  
  // Network
  NETWORK_ERROR = 'network_error',
  API_ERROR = 'api_error',
  
  // General
  UNEXPECTED = 'unexpected'
}
```

## Error Handling Hooks

Create a custom hook for consistent error handling in UI components:

```typescript
// lib/hooks/useErrorHandling.ts
import { captureException } from '@/lib/sentry';
import { toast } from 'sonner';
import { ErrorType, TrayVerifyError } from '@/lib/errors';

interface ErrorHandlingOptions<T> {
  operation: string;
  context?: Record<string, any>;
  fallback?: T;
  showToast?: boolean;
  retry?: boolean;
  retryCount?: number;
  onError?: (error: Error) => void;
}

export function useErrorHandling() {
  const withErrorHandling = <T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
    options: ErrorHandlingOptions<T>
  ) => {
    return async (...args: Args): Promise<T> => {
      const { 
        operation, 
        context = {}, 
        fallback, 
        showToast = true,
        retry = false,
        retryCount = 3,
        onError
      } = options;
      
      try {
        return await fn(...args);
      } catch (error) {
        const errorInstance = error instanceof Error 
          ? error 
          : new Error(String(error));
          
        const isVerifyError = error instanceof TrayVerifyError;
        
        captureException(errorInstance, {
          tags: {
            operation,
            errorType: isVerifyError ? (error as TrayVerifyError).errorType : 'unknown'
          },
          extra: {
            ...context,
            args: JSON.stringify(args)
          }
        });
        
        if (showToast) {
          toast.error(getErrorMessage(errorInstance));
        }
        
        if (onError) {
          onError(errorInstance);
        }
        
        if (retry && retryCount > 0) {
          // Implement retry logic here
          // ...
        }
        
        if (fallback !== undefined) {
          return fallback;
        }
        
        throw errorInstance;
      }
    };
  };

  return { withErrorHandling };
}

function getErrorMessage(error: Error): string {
  if (error instanceof TrayVerifyError) {
    switch (error.errorType) {
      case ErrorType.IMAGE_UPLOAD:
        return 'Failed to upload tray image. Please try again.';
      case ErrorType.AI_PROCESSING:
        return 'AI processing error. Please try verifying again.';
      case ErrorType.DATABASE_ERROR:
        return 'Data storage error. Please try again.';
      // Add more specific error messages
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
  
  return error.message || 'An unexpected error occurred';
}
```

## Logging Strategy

### Application Flow Logging

Track key operations through the verification workflow, using the structured logger:

```typescript
// Use structured logger for all application logging
import { logger } from '@/utils/logger';

// Key points to log:
logger.info('Processing verification started', { 
  verificationId,
  locationId,
  requestId: req.headers['x-request-id']
});

// For errors:
logger.error('Image processing failed', {
  err: error,
  verificationId,
  imageUrl,
  requestId: req.headers['x-request-id']
});
```

### Sentry Breadcrumbs and Transactions

For more detailed trace information in Sentry:

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

export const LogCategory = {
  UI: 'ui',
  API: 'api',
  IMAGE: 'image',
  AI: 'ai',
  VERIFICATION: 'verification',
  DATABASE: 'database'
};

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

export function startVerificationTransaction(verificationId: number) {
  const transaction = Sentry.startTransaction({
    name: `Verification ${verificationId}`,
    op: 'verification'
  });
  
  Sentry.getCurrentHub().configureScope(scope => {
    scope.setSpan(transaction);
    scope.setTag('verificationId', verificationId.toString());
  });
  
  return transaction;
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
```

### ESLint Rule for Console Usage

To enforce the use of the centralized logger facade (`@/utils/logger`) and discourage direct `console.*` calls in application code, an ESLint rule is configured in `eslint.config.mjs`:

```json
"no-console": ["error", { "allow": ["warn", "error"] }]
```

This rule will flag `console.log()`, `console.debug()`, `console.info()`, etc., as errors, guiding developers to use `logger.info()`, `logger.debug()`, etc.

**Allowed `console` Methods:**

*   `console.warn()`
*   `console.error()`

These are allowed by the configuration because they might be used by third-party libraries or for specific low-level debugging scenarios where the application logger isn't suitable. However, for application-specific warnings and errors, `logger.warn()` and `logger.error()` should be preferred.

**Bypassing the Rule:**

In rare cases where direct `console` use is necessary (e.g., within the logger implementation itself like `src/utils/edge-logger.ts`), the rule can be bypassed for a specific line:

```typescript
// eslint-disable-next-line no-console -- Brief explanation; see docs/guidelines/error-handling.md#eslint-rule-for-console-usage
console.log('This is an intentional console log.');
```

Always provide a comment explaining why the rule is being bypassed and reference this section of the error handling guidelines.

## Error Boundaries for UI Components

Implement React error boundaries for UI isolation:

```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { captureException } from '@/lib/sentry';
import { logger } from '@/utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  module: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to structured logger
    logger.error('React component error', { 
      err: error, 
      componentStack: errorInfo.componentStack,
      module: this.props.module
    });
    
    // Report to Sentry
    captureException(error, {
      tags: { module: this.props.module },
      extra: { componentStack: errorInfo.componentStack }
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function' && this.state.error) {
        return this.props.fallback(this.state.error);
      }
      
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-medium text-red-800">An error occurred</h3>
          <p className="mt-2 text-sm text-red-700">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Environment Configuration

### Development Environment

For local development:
- Set `NEXT_PUBLIC_DEBUG=true` in `.env.local` to see debug logs in browser console
- The logger automatically uses pretty-printed output in development
- Sentry will capture errors but uses a higher sampling rate

### Production Environment

For production deployment:
- Set `NEXT_PUBLIC_DEBUG=false` in Vercel environment variables
- The Node.js logger outputs JSON for better log aggregation
- Debug/Info logs are suppressed in the browser console
- Sentry captures 100% of sessions, errors, and performance data
- Request IDs correlate logs and Sentry events

## Global Error Handling

Beyond API routes, we've implemented global error handlers for unhandled exceptions and rejections:

```typescript
// In server initialization (server global error handlers)
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  Sentry.captureException(reason instanceof Error ? reason : new Error(`Unhandled Rejection: ${reason}`));
});

process.on('uncaughtException', (error, origin) => {
  logger.error('Uncaught Exception thrown', { error, origin });
  Sentry.captureException(error);
});
```

This ensures that even errors outside the request lifecycle are captured and reported.

## Performance Monitoring

Sentry Performance Monitoring is enabled with 100% trace sampling rate, allowing us to track:
- Page load times
- Slow API responses
- Database queries
- External API calls
- React renders

Performance data is correlated with errors through Sentry transactions.

## User Context

When a user logs in, we set their context in Sentry:

```typescript
// After user login
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name
});
```

This helps identify which users experienced specific errors.

## Error Monitoring Guidelines

### Critical Error Alerts

Configure alerts for mission-critical issues:

- AI model failures
- Image processing errors with high frequency
- Low assessment scores (indicating potential safety issues)
- Database connection failures
- Authentication failures

### Error Patterns to Track

Pay special attention to:

- Verification failures with specific assessment scores
- Patterns in missing/unexpected items
- Correlation between image quality and AI processing success
- User behavior patterns before errors

## Benefits of Sentry Integration

By integrating Sentry from the start:
- You gain real-time visibility into errors
- Faster debugging and resolution
- More stable app over time
- Acts as a safety net during rapid development
- Professional monitoring for team handoff

In addition to Sentry, consider other analytics tools like Vercel Analytics for web vitals or Google Analytics for user behavior if needed, but avoid overloading the app with too many scripts. 