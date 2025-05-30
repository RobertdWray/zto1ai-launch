import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';
import { PasswordVerificationSchema } from '@/lib/schemas/auth';
import * as Sentry from '@sentry/nextjs';

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  // Clean up old entries
  if (rateLimitMap.size > 1000) {
    Array.from(rateLimitMap.entries()).forEach(([key, value]) => {
      if (value.resetAt < now) {
        rateLimitMap.delete(key);
      }
    });
  }
  
  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 minutes
    return true;
  }
  
  if (record.count >= 5) {
    return false; // Too many attempts
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const result = PasswordVerificationSchema.safeParse(body);
    
    if (!result.success) {
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
      // Log detailed error information to Sentry for troubleshooting
      const envKey = `PROPOSAL_PASSWORD_${proposalId.toUpperCase()}`;
      const expectedPassword = process.env[envKey];
      
      Sentry.captureException(new Error('Password verification failed'), {
        tags: {
          component: 'password-verification',
          proposalId: proposalId,
        },
        contexts: {
          verification: {
            proposalId,
            passwordLength: password.length,
            passwordHash: password.substring(0, 3) + '***', // Only log first 3 chars for security
            envKey,
            hasExpectedPassword: !!expectedPassword,
            expectedPasswordLength: expectedPassword?.length || 0,
            expectedPasswordHash: expectedPassword?.substring(0, 3) + '***' || 'none',
            environment: process.env.NODE_ENV,
            ip: ip,
          }
        }
      });
      
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create session
    await createSession(proposalId);
    
    // Return success with redirect URL
    return NextResponse.json({
      success: true,
      redirectUrl: returnUrl || `/proposal/${proposalId}`,
    });
    
  } catch (error) {
    console.error('Password verification error:', error);
    
    // Log the full error to Sentry
    Sentry.captureException(error, {
      tags: {
        component: 'password-verification-error',
      }
    });
    
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
} 