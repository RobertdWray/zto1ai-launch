# Sentry Deployment Guide for TrayVerify

## Overview

This guide documents the comprehensive Sentry deployment in TrayVerify, showcasing a production-ready implementation that provides full observability across all runtime environments (Node.js, Edge, and Browser). This setup complements our [Error Handling Guidelines](./guidelines/error-handling.md) by providing the infrastructure for error tracking, performance monitoring, and user session replay.

## Architecture

TrayVerify implements a sophisticated runtime-aware Sentry configuration that adapts to Next.js's multiple runtime environments:

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Node.js       │  │     Edge        │  │   Browser   │ │
│  │   Runtime       │  │    Runtime      │  │   Runtime   │ │
│  │                 │  │                 │  │             │ │
│  │ sentry.server.  │  │  sentry.edge.   │  │instrumentation│
│  │   config.ts     │  │   config.ts     │  │ -client.ts  │ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘ │
│           │                     │                   │        │
│           └─────────────┬───────┘                   │        │
│                         │                            │        │
│                 instrumentation.ts            register()     │
│                 (Server Runtime)              (Client)       │
└─────────────────────────┴────────────────────────┴──────────┘
                          │                        │
                          ▼                        ▼
                    Sentry Cloud              Session Replay
                  Error Tracking            User Feedback Widget
                Performance Monitoring
```

## Installation and Dependencies

### Core Dependencies

```json
{
  "@sentry/nextjs": "^9.21.0",
  "@sentry/node": "^9.21.0",
  "@sentry/profiling-node": "^9.21.0"
}
```

The `@sentry/nextjs` package includes everything needed for browser, edge, and node environments. Additional packages provide specialized functionality:
- `@sentry/node`: Enhanced Node.js specific features
- `@sentry/profiling-node`: CPU profiling capabilities for server-side performance analysis

## Configuration Structure

### 1. Next.js Configuration (`next.config.ts`)

The main configuration uses `withSentryConfig` to wrap the Next.js config with Sentry's build-time optimizations:

```typescript
import { withSentryConfig } from "@sentry/nextjs";

const sentryOptions = {
  // Organization and project settings
  org: "med3ai",
  project: "trayverify",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,

  // Source map handling
  widenClientFileUpload: true,
  hideSourceMaps: true,

  // Ad-blocker circumvention
  tunnelRoute: "/monitoring-tunnel",

  // React component tracking
  reactComponentAnnotation: {
    enabled: true,
  },

  // Bundle optimization
  disableLogger: true,

  // Vercel integration
  automaticVercelMonitors: true,
};

export default withSentryConfig(nextConfig, sentryOptions);
```

### 2. Runtime-Aware Initialization (`instrumentation.ts`)

The instrumentation file detects the runtime environment and loads the appropriate configuration:

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    const { initializeEdgeSentry } = await import('./sentry.edge.config');
    initializeEdgeSentry();
  } else if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeNodeSentry } = await import('./sentry.server.config');
    initializeNodeSentry();

    // Setup global error handlers for unhandled exceptions
    const { setupGlobalErrorHandlers } = await import('@/server/utils/globalErrorHandlers');
    setupGlobalErrorHandlers();
  }
}
```

### 3. Server Configuration (`sentry.server.config.ts`)

Node.js runtime configuration with Prisma integration:

```typescript
export function initializeNodeSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    sendDefaultPii: true, // Authorized by user releases
    tracesSampleRate: 1.0, // 100% sampling for complete visibility
    profilesSampleRate: process.env.SENTRY_ENABLE_SERVER_PROFILING === 'true' ? 1.0 : 0,
    debug: process.env.NODE_ENV === 'development',
    release: process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA || "local-dev",
    integrations: [
      Sentry.prismaIntegration(), // Database query tracking
    ],
  });
}
```

### 4. Edge Configuration (`sentry.edge.config.ts`)

Simplified configuration for Edge runtime (Cloudflare Workers compatible):

```typescript
export function initializeEdgeSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    debug: process.env.NODE_ENV === 'development',
    release: process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA || "local-dev",
  });
}
```

### 5. Client Configuration (`instrumentation-client.ts`)

Browser configuration with session replay and user feedback:

```typescript
export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    release: process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA || 'local-dev',
    sendDefaultPii: true,

    integrations: [
      // Session replay with full visibility
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
      // User feedback widget
      Sentry.feedbackIntegration({
        colorScheme: "system",
      }),
    ],

    // Sampling rates
    tracesSampleRate: 1,
    profilesSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENABLE_CLIENT_PROFILING === 'true' ? 1.0 : 0,
    replaysSessionSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENABLE_REPLAY === 'true' ? 1.0 : 0,
    replaysOnErrorSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENABLE_REPLAY === 'true' ? 1.0 : 0,

    debug: process.env.NODE_ENV === 'development',
    tracePropagationTargets: ['localhost', /^\//],
  });
}
```

## Environment Variables

### Required Variables

```bash
# Public DSN (available in browser)
NEXT_PUBLIC_SENTRY_DSN="https://[key]@[org].ingest.us.sentry.io/[project]"

# Server-only DSN (optional, falls back to public)
SENTRY_DSN="https://[key]@[org].ingest.us.sentry.io/[project]"

# Authentication for source map uploads
SENTRY_AUTH_TOKEN="sntrys_[token]"

# Organization and project identifiers
SENTRY_ORG="med3ai"
SENTRY_PROJECT="trayverify"
```

### Optional Feature Flags

```bash
# Enable server-side CPU profiling
SENTRY_ENABLE_SERVER_PROFILING="true"

# Enable client-side profiling
NEXT_PUBLIC_SENTRY_ENABLE_CLIENT_PROFILING="true"

# Enable session replay
NEXT_PUBLIC_SENTRY_ENABLE_REPLAY="true"

# Override environment detection
SENTRY_ENVIRONMENT="production"

# Override release version
SENTRY_RELEASE="v1.0.0"
```

## Key Features

### 1. Ad-blocker Circumvention

The `/monitoring-tunnel` route proxies Sentry requests through your domain, preventing ad-blockers from interfering with error tracking:

```typescript
// Configured in next.config.ts
tunnelRoute: "/monitoring-tunnel"
```

This creates a reverse proxy that:
- Receives Sentry events at `https://yourdomain.com/monitoring-tunnel`
- Forwards them to Sentry's ingestion servers
- Bypasses common ad-blocker rules that block Sentry domains

### 2. Request ID Tracking

Every request receives a unique ID for correlation across logs and Sentry events:

```typescript
// In middleware.ts
const incomingRequestId = req.headers.get('x-request-id') || req.headers.get('x-vercel-id') || nanoid();
const newHeaders = new Headers(req.headers);
newHeaders.set('x-request-id', incomingRequestId);
```

This ID is:
- Added to all log entries via structured logging
- Set as a Sentry tag for error correlation
- Propagated through the entire request lifecycle

### 3. User Context

Authenticated users are automatically tracked in Sentry:

```typescript
// Set after authentication
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name
});
Sentry.setTag("user_role", user.role);
```

### 4. Unified Error Handling

The `onRequestError` hook captures all unhandled errors:

```typescript
export async function onRequestError(
  error: Error & { digest?: string },
  request: NextRequest,
  context?: RequestContext
) {
  const logger = await getLogger();
  logger.error("Global onRequestError caught:", { 
    error: error.message,
    requestPath: request.url,
    routeType: context?.routeType,
    errorDigest: error.digest,
  });

  // Set contextual tags
  if (error.digest) {
    Sentry.setTag('react_digest', error.digest);
  }
  Sentry.setTag('route_type', context?.routeType || 'unknown');
  
  const requestId = request.headers.get('x-request-id');
  if (requestId) {
    Sentry.setTag('request_id', requestId);
  }

  Sentry.captureException(error);

  // Ensure events are sent in serverless environments
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.VERCEL_ENV) {
    await Sentry.flush(2000);
  }
}
```

### 5. Performance Monitoring

With 100% trace sampling, every transaction is monitored:
- Page load performance
- API route execution time
- Database query performance (via Prisma integration)
- External API calls
- React component render times

### 6. Session Replay

When enabled, Sentry captures:
- Full DOM recordings of user sessions
- Console logs and network requests
- User interactions (clicks, inputs, navigation)
- Errors with visual context

Configuration allows full visibility:
```typescript
maskAllText: false,    // Show all text content
blockAllMedia: false,  // Show all images/videos
```

## Integration with Error Handling

### Using with the Logger Facade

The logger automatically includes context for Sentry:

```typescript
import { logger } from '@/utils/logger';

// Errors logged are also sent to Sentry
logger.error('Operation failed', { 
  err: error,
  userId: user.id,
  operation: 'createVerification'
});
```

### Using with TrayVerifyError

Application errors are automatically categorized:

```typescript
import { TrayVerifyError, ErrorType } from '@/lib/errors';
import { captureException } from '@/lib/sentry';

try {
  // Your code
} catch (error) {
  const appError = new TrayVerifyError(
    'AI processing failed',
    ErrorType.AI_PROCESSING,
    { modelId, prompt }
  );
  
  captureException(appError, {
    tags: { 
      errorType: appError.errorType,
      operation: 'processImage'
    }
  });
}
```

### API Route Protection

All API routes use centralized error handling:

```typescript
import { withErrorHandling } from '@/server/utils/apiErrorHandler';

export default withErrorHandling(async function handler(req, res) {
  // Errors are automatically caught, logged, and sent to Sentry
  // Request ID is preserved throughout
});
```

## Best Practices

### 1. Use Structured Context

Always provide meaningful context with errors:

```typescript
captureException(error, {
  tags: {
    feature: 'image-upload',
    fileType: 'jpeg',
    fileSize: '2.5MB'
  },
  extra: {
    userId: user.id,
    locationId: location.id,
    attemptNumber: 3
  }
});
```

### 2. Leverage Breadcrumbs

Track user journey before errors:

```typescript
import { addBreadcrumb } from '@/lib/sentry';

addBreadcrumb({
  category: 'ui',
  message: 'User clicked verify button',
  data: { verificationId },
  level: 'info'
});
```

### 3. Monitor Performance

Use transactions for critical operations:

```typescript
import * as Sentry from '@sentry/nextjs';

const transaction = Sentry.startTransaction({
  name: 'processVerification',
  op: 'ai.process'
});

try {
  // Your operation
} finally {
  transaction.finish();
}
```

### 4. Handle Sensitive Data

While we have user consent for PII, still be mindful:
- Don't log passwords or auth tokens
- Sanitize file paths that might contain sensitive info
- Use Sentry's data scrubbing for additional safety

## Debugging and Monitoring

### Local Development

1. Enable debug mode in development:
   ```bash
   NODE_ENV=development
   ```

2. Check console for Sentry initialization:
   ```
   [Sentry] Node Sentry initialized. Environment: development
   [Sentry] Edge Sentry initialized. Environment: development
   ```

3. Verify events are being sent:
   - Check Network tab for requests to `/monitoring-tunnel`
   - Look for Sentry debug logs in console

### Production Monitoring

1. **Vercel Integration**: Automatic deployment tracking and release association
2. **Release Tracking**: Git commit SHA used for version tracking
3. **Environment Segmentation**: Separate dev/staging/production environments

### Common Issues

1. **Events not appearing**: Check SENTRY_AUTH_TOKEN is set for source map uploads
2. **Missing user context**: Ensure middleware is setting user context before errors
3. **No session replays**: Verify NEXT_PUBLIC_SENTRY_ENABLE_REPLAY is set
4. **Performance issues**: Consider reducing sampling rates if needed

## Security Considerations

1. **DSN Exposure**: The public DSN is safe to expose (rate-limited by Sentry)
2. **Auth Token**: Keep SENTRY_AUTH_TOKEN secret (only for build process)
3. **PII Handling**: We have consent, but follow data minimization principles
4. **Tunnel Route**: The monitoring tunnel is rate-limited by Sentry

## Conclusion

This Sentry deployment provides comprehensive observability for TrayVerify:
- **Complete Error Tracking**: Every error is captured with full context
- **Performance Monitoring**: Identify bottlenecks and optimize user experience  
- **User Journey Replay**: Understand exactly what led to issues
- **Proactive Monitoring**: Catch issues before users report them

Combined with our structured logging and error handling patterns, this creates a robust foundation for maintaining application reliability and debugging production issues effectively. 