/**
 * Custom error types for the application
 * Based on the patterns from error-handling.md documentation
 */

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
  
  // Voice/Audio
  VOICE_ERROR = 'voice_error',
  AUDIO_ERROR = 'audio_error',
  
  // General
  UNEXPECTED = 'unexpected'
}

export class TrayVerifyError extends Error {
  public readonly errorType: ErrorType;
  public readonly context: Record<string, any>;
  public readonly statusCode?: number;
  
  constructor(
    message: string, 
    errorType: ErrorType, 
    context: Record<string, any> = {}, 
    statusCode?: number
  ) {
    super(message);
    this.name = 'TrayVerifyError';
    this.errorType = errorType;
    this.context = context;
    this.statusCode = statusCode;
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, TrayVerifyError.prototype);
  }
} 