// This file configures the initialization of Sentry on the client side
// See https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set sample rates to 100% - log everything
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  
  // Enable Replay
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  // Set environment
  environment: process.env.NODE_ENV,
  
  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",
  
  // Additional options
  ignoreErrors: [
    // Browser extensions
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    // Network errors
    "Network request failed",
    "NetworkError",
    "Failed to fetch",
  ],
}); 