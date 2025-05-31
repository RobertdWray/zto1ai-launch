import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';
import { PasswordVerificationSchema } from '@/lib/schemas/auth';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/utils/logger';

// Rate limiting configuration
const MAX_ATTEMPTS = 10;
const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes in milliseconds
const CLEANUP_THRESHOLD = 1000; // Clean up map when it exceeds this size

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  cooldownUntil?: number;
  hasTriggeredSentry?: boolean;
}

// Rate limiting map - stores attempts by IP
const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string): { allowed: boolean; attemptsRemaining: number; cooldownRemaining?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  // Periodic cleanup to prevent memory leaks
  if (rateLimitMap.size > CLEANUP_THRESHOLD) {
    logger.info('Cleaning up rate limit map', { 
      mapSize: rateLimitMap.size,
      threshold: CLEANUP_THRESHOLD 
    });
    
    Array.from(rateLimitMap.entries()).forEach(([key, value]) => {
      // Remove entries older than 1 hour or expired cooldowns
      if (now - value.firstAttemptAt > 60 * 60 * 1000 || 
          (value.cooldownUntil && value.cooldownUntil < now)) {
        rateLimitMap.delete(key);
      }
    });
  }
  
  // No record exists - this is the first attempt
  if (!record) {
    rateLimitMap.set(ip, { 
      attempts: 1, 
      firstAttemptAt: now 
    });
    return { 
      allowed: true, 
      attemptsRemaining: MAX_ATTEMPTS - 1 
    };
  }
  
  // Check if in cooldown period
  if (record.cooldownUntil && record.cooldownUntil > now) {
    const cooldownRemaining = Math.ceil((record.cooldownUntil - now) / 1000); // in seconds
    return { 
      allowed: false, 
      attemptsRemaining: 0,
      cooldownRemaining 
    };
  }
  
  // Reset if cooldown has expired
  if (record.cooldownUntil && record.cooldownUntil <= now) {
    rateLimitMap.set(ip, { 
      attempts: 1, 
      firstAttemptAt: now 
    });
    return { 
      allowed: true, 
      attemptsRemaining: MAX_ATTEMPTS - 1 
    };
  }
  
  // Check if max attempts reached
  if (record.attempts >= MAX_ATTEMPTS) {
    // Set cooldown period
    record.cooldownUntil = now + COOLDOWN_PERIOD;
    
    // Send to Sentry only once when rate limit is first triggered
    if (!record.hasTriggeredSentry) {
      record.hasTriggeredSentry = true;
      
      Sentry.captureMessage('Password rate limit triggered', {
        level: 'warning',
        tags: {
          component: 'password-verification',
          security: 'rate-limit',
        },
        contexts: {
          rateLimit: {
            ip,
            attempts: record.attempts,
            maxAttempts: MAX_ATTEMPTS,
            cooldownMinutes: COOLDOWN_PERIOD / 60000,
            firstAttemptAt: new Date(record.firstAttemptAt).toISOString(),
            cooldownUntil: new Date(record.cooldownUntil).toISOString(),
          }
        }
      });
      
      logger.warn('Rate limit triggered for password verification', {
        ip,
        attempts: record.attempts,
        cooldownMinutes: COOLDOWN_PERIOD / 60000,
      });
    }
    
    return { 
      allowed: false, 
      attemptsRemaining: 0,
      cooldownRemaining: Math.ceil(COOLDOWN_PERIOD / 1000) 
    };
  }
  
  // Increment attempts
  record.attempts++;
  return { 
    allowed: true, 
    attemptsRemaining: MAX_ATTEMPTS - record.attempts 
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || // Cloudflare
               'unknown';
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    
    if (!rateLimitResult.allowed) {
      const errorMessage = rateLimitResult.cooldownRemaining 
        ? `Too many password attempts. Please try again in ${Math.ceil(rateLimitResult.cooldownRemaining / 60)} minutes.`
        : 'Too many attempts. Please try again later.';
        
      logger.info('Password verification rate limited', {
        ip,
        cooldownRemaining: rateLimitResult.cooldownRemaining,
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          cooldownRemaining: rateLimitResult.cooldownRemaining,
        },
        { status: 429 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const result = PasswordVerificationSchema.safeParse(body);
    
    if (!result.success) {
      logger.debug('Invalid password verification request', {
        errors: result.error.format(),
        ip,
      });
      
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { password, returnUrl } = result.data;
    
    // Extract proposal ID from return URL
    let proposalId = 'adb'; // Default
    if (returnUrl && returnUrl.includes('/proposal/')) {
      const match = returnUrl.match(/\/proposal\/([^\/]+)/);
      if (match) {
        proposalId = match[1];
      }
    }
    
    // Verify password
    const isValid = await verifyPassword(proposalId, password);
    
    if (!isValid) {
      // Log failed attempt (but don't send to Sentry unless rate limited)
      logger.info('Failed password verification attempt', {
        proposalId,
        ip,
        attemptsRemaining: rateLimitResult.attemptsRemaining,
        attemptNumber: MAX_ATTEMPTS - rateLimitResult.attemptsRemaining,
      });
      
      // Only include attempts remaining info if getting close to limit
      const responseData: any = { 
        success: false, 
        error: 'Invalid password' 
      };
      
      if (rateLimitResult.attemptsRemaining <= 3) {
        responseData.attemptsRemaining = rateLimitResult.attemptsRemaining;
        responseData.message = `${rateLimitResult.attemptsRemaining} attempts remaining`;
      }
      
      return NextResponse.json(responseData, { status: 401 });
    }
    
    // Password is valid - clear rate limit record for this IP
    rateLimitMap.delete(ip);
    
    // Create session
    await createSession(proposalId);
    
    logger.info('Successful password verification', {
      proposalId,
      ip,
    });
    
    // Return success with redirect URL
    return NextResponse.json({
      success: true,
      redirectUrl: returnUrl || `/proposal/${proposalId}`,
    });
    
  } catch (error) {
    logger.error('Password verification error', {
      err: error,
      component: 'password-verification',
    });
    
    // Only log unexpected errors to Sentry
    Sentry.captureException(error, {
      tags: {
        component: 'password-verification-error',
        errorType: 'unexpected',
      }
    });
    
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
} 