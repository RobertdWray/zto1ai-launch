'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Clock } from 'lucide-react';

interface ErrorState {
  message: string;
  attemptsRemaining?: number;
  cooldownRemaining?: number;
}

export function PasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [cooldownTimer, setCooldownTimer] = useState<number>(0);

  const returnUrl = searchParams.get('return') || '/proposal/adb';
  const urlError = searchParams.get('error');
  const urlPassword = searchParams.get('pw');

  // Auto-submit if password is in URL
  useEffect(() => {
    if (urlPassword && !isLoading) {
      setPassword(urlPassword);
      // Auto-submit after a brief delay
      setTimeout(() => {
        const form = document.getElementById('password-form') as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPassword]);

  // Show error from URL if present
  useEffect(() => {
    if (urlError === 'invalid') {
      setError({ message: 'Invalid password. Please try again.' });
    }
  }, [urlError]);

  // Handle cooldown timer
  useEffect(() => {
    if (cooldownTimer > 0) {
      const interval = setInterval(() => {
        setCooldownTimer((prev) => {
          if (prev <= 1) {
            setError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if in cooldown
    if (cooldownTimer > 0) {
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          returnUrl,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to the proposal
        router.push(data.redirectUrl || returnUrl);
      } else if (response.status === 429) {
        // Rate limited
        const cooldownSeconds = data.cooldownRemaining || 300; // Default to 5 minutes
        setCooldownTimer(cooldownSeconds);
        setError({
          message: data.error || 'Too many attempts. Please try again later.',
          cooldownRemaining: cooldownSeconds,
        });
      } else {
        // Regular error
        const errorState: ErrorState = {
          message: data.error || 'Invalid password. Please try again.',
        };
        
        // Add attempts remaining info if provided
        if (data.attemptsRemaining !== undefined) {
          errorState.attemptsRemaining = data.attemptsRemaining;
        }
        
        setError(errorState);
      }
    } catch (err) {
      setError({ message: 'An error occurred. Please try again.' });
      console.error('Password verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCooldownTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <form id="password-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your access password"
          required
          disabled={isLoading || cooldownTimer > 0}
          className="w-full"
          autoFocus={!urlPassword}
        />
      </div>

      {error && (
        <Alert variant={cooldownTimer > 0 ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <div>{error.message}</div>
            
            {/* Show attempts remaining warning */}
            {error.attemptsRemaining !== undefined && error.attemptsRemaining <= 3 && (
              <div className="text-sm font-medium">
                Warning: {error.attemptsRemaining} attempt{error.attemptsRemaining !== 1 ? 's' : ''} remaining
              </div>
            )}
            
            {/* Show cooldown timer */}
            {cooldownTimer > 0 && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span>Please wait: {formatCooldownTime(cooldownTimer)}</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isLoading || !password || cooldownTimer > 0}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : cooldownTimer > 0 ? (
          <>
            <Clock className="mr-2 h-4 w-4" />
            Locked ({formatCooldownTime(cooldownTimer)})
          </>
        ) : (
          'Access Proposal'
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Your password was provided by your Zero to One AI representative
      </p>
    </form>
  );
} 