# Password Rate Limiting Implementation

## Overview

The password verification system now includes a robust rate limiting mechanism to prevent brute force attacks while minimizing user frustration and Sentry noise.

## Configuration

- **Maximum Attempts**: 10 failed password attempts allowed
- **Cooldown Period**: 5 minutes after reaching the limit
- **Warning Threshold**: Shows remaining attempts when 3 or fewer remain
- **Sentry Alerts**: Only triggered when rate limit is hit (not on each failed attempt)

## Features

### Backend (`app/api/auth/verify-password/route.ts`)

1. **IP-based Tracking**: Uses client IP address to track attempts
   - Supports multiple headers: `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`
   - Handles proxied requests correctly

2. **Memory Management**: 
   - Automatic cleanup of old entries when map exceeds 1000 records
   - Removes entries older than 1 hour

3. **Smart Reset**:
   - Clears rate limit record on successful login
   - Resets counter after cooldown expires

4. **Logging**:
   - Info logs for failed attempts (not sent to Sentry)
   - Warning logs and Sentry alert only when rate limit triggered
   - Success logs for valid passwords

### Frontend (`components/auth/PasswordForm.tsx`)

1. **Visual Feedback**:
   - Shows attempts remaining when ≤3 attempts left
   - Displays countdown timer during cooldown period
   - Disables form during cooldown

2. **User Experience**:
   - Clear error messages
   - Visual countdown (MM:SS format)
   - Button state changes during cooldown

## Security Benefits

1. **Reduced Attack Surface**: Makes brute force attacks impractical
2. **Minimal Sentry Noise**: Only alerts on actual security events
3. **User-Friendly**: Gives legitimate users multiple chances
4. **Transparent**: Shows warnings before lockout

## Example Flow

1. User tries wrong password 1-7 times → Simple "Invalid password" error
2. User tries wrong password 8-10 times → Shows "X attempts remaining" warning
3. After 10th failed attempt → 5-minute cooldown with timer + Sentry alert
4. During cooldown → Form disabled, shows countdown
5. After cooldown → Can try again with fresh 10 attempts

## Monitoring

Rate limit events in Sentry include:
- IP address
- Number of attempts
- Cooldown duration
- Timestamp information

This helps identify potential attack patterns while reducing false positives from legitimate users who forgot their password. 