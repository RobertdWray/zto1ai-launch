'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong!
            </h2>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. We&apos;ve been notified and are working to fix it.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => reset()}
                className="px-6 py-3 bg-zto1-blue text-white rounded-md hover:bg-zto1-blue-dark transition-colors"
              >
                Try again
              </button>
              <p className="text-sm text-gray-500">
                Error ID: {error.digest || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 