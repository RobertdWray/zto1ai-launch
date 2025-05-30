import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { cookies } from 'next/headers';

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
  
  if (!correctPassword) {
    console.error(`No password configured for proposal: ${proposalId}`);
    return false;
  }
  
  return password === correctPassword;
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