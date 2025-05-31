import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/utils/logger';

// Bot patterns to detect automated traffic
const BOT_PATTERNS = [
  // Web scrapers and crawlers
  /bot|crawl|spider|scrape|puppeteer|playwright|selenium|headless/i,
  // HTTP libraries often used for scraping
  /python-requests|python-urllib|go-http-client|java\/|perl|ruby|wget|curl|libwww|lwp|damnit|httpclient|asynchttpclient/i,
  // Known bad bots
  /ahrefsbot|semrushbot|dotbot|mj12bot|blexbot|yandexbot|bingbot|slurp|duckduckbot|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers\.google\.com\/\+\/web\/snippet/i,
  // Security scanners
  /nmap|nikto|sqlmap|openvas|nessus|acunetix|netsparker|paros|owaspzap|joomscan|wpscan/i,
  // Other automated tools
  /phantomjs|slimerjs|toscrape|casperjs|ghost|mechanize|httperf|apache-httpclient/i,
];

// Whitelist patterns for legitimate bots we want to allow
const ALLOWED_BOTS = [
  /googlebot|google-structured-data-testing-tool|google-inspectiontool|google page speed/i,
  /facebookexternalhit|facebot/i, // For social media previews
  /slackbot|discord|telegram/i, // For link previews in chat apps
  /uptimerobot|pingdom|statuscake|healthchecks/i, // Monitoring services
];

// Suspicious patterns in paths that might indicate scanning
const SUSPICIOUS_PATHS = [
  /\.(php|asp|aspx|jsp|cgi|pl|py|rb|sh|bash|ps1|exe|dll|bat|cmd)/i,
  /\/(admin|manager|phpmyadmin|wp-admin|wp-login|xmlrpc|config|backup|\.git|\.env|\.htaccess)/i,
  /\/(shell|c99|r57|b374k|webshell|backdoor)/i,
];

function isBot(userAgent: string): boolean {
  // Check if it's an allowed bot first
  if (ALLOWED_BOTS.some(pattern => pattern.test(userAgent))) {
    return false;
  }
  
  // Check against bot patterns
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

function isSuspiciousPath(pathname: string): boolean {
  return SUSPICIOUS_PATHS.some(pattern => pattern.test(pathname));
}

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') ||
             'unknown';
  return `rate-limit:${ip}`;
}

// Simple in-memory rate limiting for bot detection
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 60; // Reasonable for human browsing

function checkRateLimit(request: NextRequest): boolean {
  const key = getRateLimitKey(request);
  const now = Date.now();
  const record = requestCounts.get(key);
  
  // Cleanup old entries periodically
  if (requestCounts.size > 1000) {
    Array.from(requestCounts.entries()).forEach(([k, v]) => {
      if (v.resetAt < now) {
        requestCounts.delete(k);
      }
    });
  }
  
  if (!record || record.resetAt < now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Skip bot protection for static files and API routes we control
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }
  
  // Check for suspicious paths (potential security scanning)
  if (isSuspiciousPath(pathname)) {
    logger.warn('Suspicious path access blocked', {
      pathname,
      userAgent,
      ip: getRateLimitKey(request),
      component: 'middleware-bot-protection',
    });
    
    return new NextResponse('Not Found', { 
      status: 404,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      }
    });
  }
  
  // Check if it's a bot
  if (isBot(userAgent)) {
    logger.info('Bot detected and blocked', {
      userAgent,
      pathname,
      ip: getRateLimitKey(request),
      component: 'middleware-bot-protection',
    });
    
    // Return a minimal response for bots
    return new NextResponse('Access Denied', { 
      status: 403,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      }
    });
  }
  
  // Check rate limiting (helps catch bots that fake user agents)
  if (!checkRateLimit(request)) {
    logger.warn('Rate limit exceeded', {
      userAgent,
      pathname,
      ip: getRateLimitKey(request),
      component: 'middleware-rate-limit',
    });
    
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': MAX_REQUESTS_PER_MINUTE.toString(),
        'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
      }
    });
  }
  
  // If user agent is suspiciously short or missing, flag it
  if (!userAgent || userAgent.length < 10) {
    logger.info('Suspicious user agent', {
      userAgent: userAgent || 'empty',
      pathname,
      ip: getRateLimitKey(request),
      component: 'middleware-bot-protection',
    });
  }
  
  // Add security headers for all responses
  const response = NextResponse.next();
  
  // Security headers to make scraping harder
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Existing proposal protection logic
  if (pathname.startsWith('/proposal')) {
    // Extract proposal ID from URL
    const pathParts = pathname.split('/');
    const proposalId = pathParts[2]; // /proposal/[proposalId]/...

    if (!proposalId) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check for password in URL parameters
    const urlPassword = request.nextUrl.searchParams.get('pw');
    
    if (urlPassword) {
      // If password is in URL, redirect to verify it via the landing page
      // This ensures proper session creation
      const returnUrl = pathname;
      return NextResponse.redirect(
        new URL(`/?pw=${urlPassword}&return=${encodeURIComponent(returnUrl)}`, request.url)
      );
    }
  }

  return response;
}

export const config = {
  // Apply middleware to all routes except static files and API internals
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api routes that are internal (_next/*, etc)
     * - static files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}; 