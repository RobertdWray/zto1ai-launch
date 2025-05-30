import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const algorithm = 'aes-256-gcm';
const SESSION_COOKIE_NAME = 'auth-session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

// Get encryption key from environment variable
function getKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  
  // Derive a 32-byte key from the secret
  return scryptSync(secret, 'salt', 32);
}

export interface SessionData {
  proposalId: string;
  authenticated: boolean;
  timestamp: number;
}

export function encryptSession(data: SessionData): string {
  const key = getKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), 'utf8'),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag();
  
  // Combine iv, authTag, and encrypted data
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptSession(encryptedData: string): SessionData | null {
  try {
    const key = getKey();
    const data = Buffer.from(encryptedData, 'base64');
    
    // Extract components
    const iv = data.subarray(0, 16);
    const authTag = data.subarray(16, 32);
    const encrypted = data.subarray(32);
    
    const decipher = createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}

export async function verifyPassword(proposalId: string, password: string): Promise<boolean> {
  // Get the password for this proposal from environment variables
  const envKey = `PROPOSAL_PASSWORD_${proposalId.toUpperCase()}`;
  const correctPassword = process.env[envKey];
  
  // Console log for immediate debugging
  console.log('Password verification attempt:', {
    proposalId,
    envKey,
    hasExpectedPassword: !!correctPassword,
    inputLength: password.length,
    expectedLength: correctPassword?.length || 0,
    inputFirst5: password.substring(0, 5),
    expectedFirst5: correctPassword?.substring(0, 5) || 'none',
  });
  
  if (!correctPassword) {
    console.error(`No password configured for proposal: ${proposalId}`);
    
    // Log to Sentry when no password is configured
    Sentry.captureMessage(`No password configured for proposal: ${proposalId}`, {
      level: 'error',
      tags: {
        component: 'auth-verify-password',
        proposalId: proposalId,
        issue: 'missing-env-var'
      },
      contexts: {
        environment: {
          envKey,
          availableEnvVars: Object.keys(process.env).filter(key => key.startsWith('PROPOSAL_PASSWORD_')),
          nodeEnv: process.env.NODE_ENV,
        }
      }
    });
    
    return false;
  }
  
  const isMatch = password === correctPassword;
  
  // Log password verification attempts to Sentry for debugging
  if (!isMatch) {
    console.log('Password mismatch details:', {
      inputLength: password.length,
      expectedLength: correctPassword.length,
      inputTrimmed: password.trim(),
      expectedTrimmed: correctPassword.trim(),
      inputHasNewlines: password.includes('\n'),
      expectedHasNewlines: correctPassword.includes('\n'),
    });
    
    // Use non-password field names to avoid Sentry filtering
    const inputLen = password.length;
    const expectedLen = correctPassword.length;
    const inputTrimmedLen = password.trim().length;
    const expectedTrimmedLen = correctPassword.trim().length;
    
    Sentry.captureMessage('Password verification mismatch detected', {
      level: 'warning',
      tags: {
        component: 'auth-verify-password',
        proposalId: proposalId,
        issue: 'mismatch-analysis'
      },
      contexts: {
        debug: {
          envKeyName: envKey,
          inputLength: inputLen,
          expectedLength: expectedLen,
          inputTrimmedLength: inputTrimmedLen,
          expectedTrimmedLength: expectedTrimmedLen,
          lengthsMatch: inputLen === expectedLen,
          trimmedLengthsMatch: inputTrimmedLen === expectedTrimmedLen,
          inputStartsWith: password.substring(0, 5),
          expectedStartsWith: correctPassword.substring(0, 5),
          inputEndsWith: password.substring(-3),
          expectedEndsWith: correctPassword.substring(-3),
          inputHasNewlines: password.includes('\n'),
          expectedHasNewlines: correctPassword.includes('\n'),
          inputHasCarriageReturn: password.includes('\r'),
          expectedHasCarriageReturn: correctPassword.includes('\r'),
          strictEquality: password === correctPassword,
          looseEquality: password == correctPassword,
        }
      }
    });
  }
  
  return isMatch;
}

export async function createSession(proposalId: string) {
  const cookieStore = await cookies();
  const sessionData: SessionData = {
    proposalId,
    authenticated: true,
    timestamp: Date.now(),
  };
  
  const encrypted = encryptSession(sessionData);
  
  cookieStore.set(SESSION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }
  
  const session = decryptSession(sessionCookie.value);
  
  if (!session) {
    return null;
  }
  
  // Check if session is expired (24 hours)
  if (Date.now() - session.timestamp > SESSION_MAX_AGE * 1000) {
    return null;
  }
  
  return session;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(proposalId: string): Promise<boolean> {
  const session = await getSession();
  return session !== null && session.authenticated && session.proposalId === proposalId;
} 