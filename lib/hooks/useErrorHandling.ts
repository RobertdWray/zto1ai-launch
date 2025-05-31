/**
 * Error handling hook for consistent error management
 * Based on the patterns from error-handling.md documentation
 */

import { useCallback } from 'react';
import * as Sentry from '@sentry/nextjs';
import { toast } from 'sonner';
import { ErrorType, TrayVerifyError } from '@/lib/errors';
import { logger } from '@/utils/logger';

interface ErrorHandlingOptions<T> {
  operation: string;
  context?: Record<string, any>;
  fallback?: T;
  showToast?: boolean;
  retry?: boolean;
  retryCount?: number;
  onError?: (error: Error) => void;
  finally?: () => void;
}

export function useErrorHandling() {
  const withErrorHandling = <T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
    options: ErrorHandlingOptions<T>
  ) => {
    return useCallback(async (...args: Args): Promise<T> => {
      const { 
        operation, 
        context = {}, 
        fallback, 
        showToast = true,
        retry = false,
        retryCount = 3,
        onError,
        finally: finallyCallback
      } = options;
      
      try {
        const result = await fn(...args);
        return result;
      } catch (error) {
        const errorInstance = error instanceof Error 
          ? error 
          : new Error(String(error));
          
        const isVerifyError = error instanceof TrayVerifyError;
        
        // Log the error
        logger.error(`Error in ${operation}`, {
          err: errorInstance,
          operation,
          context,
          args: JSON.stringify(args),
        });
        
        // Capture in Sentry
        Sentry.captureException(errorInstance, {
          tags: {
            operation,
            errorType: isVerifyError ? (error as TrayVerifyError).errorType : 'unknown'
          },
          extra: {
            ...context,
            args: JSON.stringify(args)
          }
        });
        
        // Show user-friendly toast
        if (showToast) {
          toast.error(getErrorMessage(errorInstance));
        }
        
        // Call custom error handler
        if (onError) {
          onError(errorInstance);
        }
        
        // TODO: Implement retry logic if needed
        if (retry && retryCount > 0) {
          // Retry logic would go here
        }
        
        // Return fallback if provided
        if (fallback !== undefined) {
          return fallback;
        }
        
        // Re-throw the error
        throw errorInstance;
      } finally {
        if (finallyCallback) {
          finallyCallback();
        }
      }
    }, [fn, options]);
  };

  return { withErrorHandling };
}

function getErrorMessage(error: Error): string {
  if (error instanceof TrayVerifyError) {
    switch (error.errorType) {
      case ErrorType.AI_PROCESSING:
        return 'AI processing error. Please try again.';
      case ErrorType.API_ERROR:
        return 'Service temporarily unavailable. Please try again later.';
      case ErrorType.UNAUTHORIZED:
        return 'Permission denied. Please check your access rights.';
      case ErrorType.NETWORK_ERROR:
        return 'Network error. Please check your connection.';
      case ErrorType.VOICE_ERROR:
      case ErrorType.AUDIO_ERROR:
        return 'Voice service error. Please try again.';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
  
  return error.message || 'An unexpected error occurred';
} 