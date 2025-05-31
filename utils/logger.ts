/**
 * Simplified logger utility for voice conversation component
 * Based on the patterns from error-handling.md documentation
 */

interface LogContext {
  [key: string]: any;
}

interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

const formatLog = (level: string, message: string, context?: LogContext) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  };
  
  if (process.env.NODE_ENV === 'development') {
    // Pretty print in development
    // eslint-disable-next-line no-console -- Logger implementation; see docs/guidelines/error-handling.md#eslint-rule-for-console-usage
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, context || '');
  } else {
    // JSON output for production
    // eslint-disable-next-line no-console -- Logger implementation; see docs/guidelines/error-handling.md#eslint-rule-for-console-usage
    console.log(JSON.stringify(logEntry));
  }
};

export const logger: Logger = {
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG === 'true') {
      formatLog('debug', message, context);
    }
  },
  
  info: (message: string, context?: LogContext) => {
    formatLog('info', message, context);
  },
  
  warn: (message: string, context?: LogContext) => {
    formatLog('warn', message, context);
  },
  
  error: (message: string, context?: LogContext) => {
    formatLog('error', message, context);
  },
}; 