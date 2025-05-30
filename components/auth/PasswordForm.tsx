'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';

export function PasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      setError('Invalid password. Please try again.');
    }
  }, [urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
      } else {
        setError(data.error || 'Invalid password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password verification error:', err);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          className="w-full"
          autoFocus={!urlPassword}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !password}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
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