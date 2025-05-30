// This file configures the initialization of Sentry on the server side
// See https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set sample rate to 100% - log everything
  tracesSampleRate: 1.0,
  
  // Set environment
  environment: process.env.NODE_ENV,
  
  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",
  
  // Additional options
  ignoreErrors: [
    // Ignore common non-actionable errors
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
  ],
}); 