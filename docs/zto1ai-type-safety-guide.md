# Type Safety, Linting & Technical Debt Guidelines
## Zero to One AI Launch MVP (launch.zto1ai.com)

**Document Version**: 1.0  
**Last Updated**: May 30, 2025  
**Target Stack**: Next.js 15.1.8, Tailwind CSS v4, TypeScript 5.8+, Sentry v8

---

## 🎯 **Project Overview & Standards**

This document establishes type safety and code quality standards for the **launch.zto1ai.com** MVP - a password-protected proposal hosting platform. As a greenfield project showcasing Zero to One AI's technical capabilities, we maintain **zero tolerance for type safety violations** and follow modern best practices throughout.

### **Quality Standards**
- ✅ **100% TypeScript Coverage** - No `any` types in production code
- ✅ **Zero ESLint Errors** - All linting issues resolved before deployment
- ✅ **Runtime Type Safety** - Zod validation for all external data
- ✅ **Comprehensive Error Handling** - Sentry integration with full context
- ✅ **Modern Framework Compliance** - Next.js 15 + React 19 patterns

---

## 🔧 **Technology Stack Configuration**

### **Next.js 15.1.8 Breaking Changes & Setup**

#### **Async Request APIs (Critical)**
Next.js 15 made request APIs asynchronous. All the following must be awaited:

```typescript
// ❌ Old (Next.js 14 and below)
const headersList = headers();
const cookieStore = cookies();
const { id } = params;

// ✅ New (Next.js 15+)
const headersList = await headers();
const cookieStore = await cookies();
const { id } = await params;
```

#### **Updated Project Structure**
```typescript
// app/layout.tsx - Root layout with async patterns
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  // ... rest of component
}

// middleware.ts - Async request handling
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const requestHeaders = await request.headers;
  // ... middleware logic
}
```

#### **Route Handler Updates**
```typescript
// app/api/auth/verify-password/route.ts
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // ✅ Await request parsing
  const body = await request.json();
  const headersList = await request.headers;
  
  // ... validation and response
}
```

### **Tailwind CSS v4 Configuration**

#### **CSS-First Configuration**
Tailwind CSS v4 uses CSS-first configuration. No `tailwind.config.js` by default.

```css
/* app/globals.css */
@import "tailwindcss";

/* Custom theme configuration */
@theme {
  --font-family-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-family-mono: "JetBrains Mono Variable", ui-monospace, monospace;
  
  --color-brand-primary: oklch(0.57 0.22 262);
  --color-brand-secondary: oklch(0.89 0.12 262);
  --color-surface: oklch(0.98 0.01 262);
  --color-text-primary: oklch(0.09 0.01 262);
}

/* Custom utilities */
@plugin "@tailwindcss/typography";
```

#### **PostCSS Configuration**
```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### **TypeScript 5.8+ Configuration**

#### **tsconfig.json - Production Ready**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    },
    // Enhanced type checking
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "src/**/*"
  ],
  "exclude": ["node_modules"]
}
```

### **ESLint Configuration (Modern)**

#### **eslint.config.mjs - Next.js 15 Optimized**
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Type Safety - ZERO TOLERANCE
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      
      // Promise Handling
      "@typescript-eslint/no-floating-promises": ["error", {
        "ignoreVoid": true,
        "ignoreIIFE": true
      }],
      "@typescript-eslint/no-misused-promises": ["error", {
        "checksVoidReturn": {
          "attributes": false
        }
      }],
      "@typescript-eslint/require-await": "error",
      
      // Code Quality
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      
      // Next.js 15 Specific
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      
      // Import Organization
      "import/order": ["error", {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }]
    }
  },
  {
    // Relaxed rules for configuration files only
    files: ["*.config.{js,mjs,ts}", "tailwind.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }
];

export default eslintConfig;
```

---

## 📋 **Type Safety Patterns & Best Practices**

### **1. End-to-End TypeScript Implementation**

#### **Zod Schemas for All External Data**
```typescript
// lib/schemas/auth.ts
import { z } from "zod";

export const PasswordVerificationSchema = z.object({
  password: z.string().min(1, "Password is required"),
  proposalId: z.string().optional(),
});

export const ContractSubmissionSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email required"),
  companyName: z.string().min(1, "Company name is required"),
  signature: z.string().min(1, "Digital signature required"),
  agreementAccepted: z.literal(true, {
    errorMap: () => ({ message: "Agreement must be accepted" })
  }),
  timestamp: z.date().default(() => new Date()),
});

// Type inference for use throughout app
export type PasswordVerification = z.infer<typeof PasswordVerificationSchema>;
export type ContractSubmission = z.infer<typeof ContractSubmissionSchema>;
```

#### **API Route Type Safety (Next.js 15)**
```typescript
// app/api/auth/verify-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PasswordVerificationSchema } from '@/lib/schemas/auth';

export async function POST(request: NextRequest) {
  try {
    // ✅ Parse and validate request body
    const body = await request.json();
    const result = PasswordVerificationSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { password, proposalId } = result.data;
    
    // ✅ Environment variable validation
    const expectedPassword = process.env[`PROPOSAL_PASSWORD_${proposalId?.toUpperCase() ?? 'DEFAULT'}`];
    
    if (!expectedPassword) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }
    
    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }
    
    // ✅ Type-safe response
    return NextResponse.json({ success: true, proposalId });
    
  } catch (error) {
    // ✅ Proper error handling with Sentry
    console.error("Password verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### **Component Props with Strict Types**
```typescript
// components/ProposalSection.tsx
interface ProposalSectionProps {
  readonly title: string;
  readonly content: React.ReactNode;
  readonly id: string;
  readonly className?: string;
  readonly isVisible?: boolean;
  readonly onVisibilityChange?: (isVisible: boolean) => void;
}

export function ProposalSection({
  title,
  content,
  id,
  className = "",
  isVisible = false,
  onVisibilityChange
}: ProposalSectionProps) {
  // ✅ Implementation with type safety
}
```

### **2. React Hook Form + Zod Integration**

#### **Type-Safe Form Implementation**
```typescript
// components/ContractSigningForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractSubmissionSchema, ContractSubmission } from "@/lib/schemas/auth";

export function ContractSigningForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<ContractSubmission>({
    resolver: zodResolver(ContractSubmissionSchema),
    defaultValues: {
      agreementAccepted: false,
    }
  });

  const onSubmit = async (data: ContractSubmission) => {
    try {
      // ✅ Data is guaranteed to match schema
      const response = await fetch('/api/contract/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      // ✅ Handle success
    } catch (error) {
      // ✅ Error handling
      console.error('Contract submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="clientName">Full Name</label>
        <input
          {...register("clientName")}
          id="clientName"
          type="text"
          className="input"
        />
        {errors.clientName && (
          <p className="text-red-600 text-sm mt-1">
            {errors.clientName.message}
          </p>
        )}
      </div>
      
      {/* Additional form fields... */}
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? "Submitting..." : "Sign Contract"}
      </button>
    </form>
  );
}
```

### **3. Server Actions with Type Safety (Next.js 15)**

#### **Type-Safe Server Actions**
```typescript
// lib/actions/contract.ts
'use server';

import { redirect } from 'next/navigation';
import { ContractSubmissionSchema } from '@/lib/schemas/auth';
import { generateContractPDF } from '@/lib/pdf';
import { sendContractEmail } from '@/lib/email';

export async function submitContract(formData: FormData) {
  // ✅ Parse and validate form data
  const result = ContractSubmissionSchema.safeParse({
    clientName: formData.get('clientName'),
    clientEmail: formData.get('clientEmail'),
    companyName: formData.get('companyName'),
    signature: formData.get('signature'),
    agreementAccepted: formData.get('agreementAccepted') === 'true',
  });

  if (!result.success) {
    return {
      error: "Validation failed",
      details: result.error.format()
    };
  }

  try {
    const contractData = result.data;
    
    // ✅ Generate PDF with type safety
    const pdfBuffer = await generateContractPDF(contractData);
    
    // ✅ Send email with contract
    await sendContractEmail({
      to: contractData.clientEmail,
      clientName: contractData.clientName,
      pdfBuffer,
    });
    
    // ✅ Success - redirect to thank you page
    redirect('/thank-you');
    
  } catch (error) {
    console.error('Contract submission error:', error);
    return {
      error: "Failed to process contract"
    };
  }
}
```

### **4. Middleware with Type Safety**

#### **Password Protection Middleware**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface SessionPayload {
  authenticated: boolean;
  proposalId?: string;
  expiresAt: number;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ✅ Skip middleware for public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/' ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  try {
    // ✅ Check authentication
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // ✅ Verify JWT token
    const { payload } = await jwtVerify(sessionCookie.value, secret) as {
      payload: SessionPayload
    };

    if (!payload.authenticated || payload.expiresAt < Date.now()) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
    
  } catch (error) {
    console.error('Middleware auth error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/proposal/:path*', '/contract/:path*', '/thank-you']
};
```

---

## 🚨 **Error Handling & Monitoring**

### **Sentry v8 Integration (Next.js 15)**

#### **Instrumentation Setup**
```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./lib/sentry.edge.config');
  }
}
```

#### **Sentry Configuration**
```typescript
// lib/sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Environment-based configuration
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay for debugging
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Enhanced error context
  beforeSend(event, hint) {
    // ✅ Add request ID for tracing
    if (event.request?.headers?.['x-request-id']) {
      event.tags = {
        ...event.tags,
        requestId: event.request.headers['x-request-id']
      };
    }
    
    return event;
  },
  
  // ✅ Filter sensitive data
  beforeSendTransaction(event) {
    // Remove sensitive URL parameters
    if (event.request?.url) {
      event.request.url = event.request.url.replace(/[?&]pw=[^&]*/g, '');
    }
    return event;
  }
});
```

#### **Error Boundaries**
```typescript
// components/ErrorBoundary.tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // ✅ Report error to Sentry with context
    Sentry.captureException(error, {
      tags: {
        component: 'ErrorBoundary',
        errorDigest: error.digest
      },
      contexts: {
        react: {
          componentStack: error.stack || 'No stack trace available'
        }
      }
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We've been notified and are working to fix this issue.
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

### **API Error Handling Patterns**

#### **Standardized Error Responses**
```typescript
// lib/api/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): Response {
  if (error instanceof APIError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ✅ Log unexpected errors
  console.error('Unexpected API error:', error);
  
  return new Response(
    JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
```

---

## 🔒 **Security & Validation Patterns**

### **Environment Variable Validation**
```typescript
// lib/config/env.ts
import { z } from 'zod';

const EnvSchema = z.object({
  // Database & Auth
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
  
  // Third-party services
  SENDGRID_API_KEY: z.string().startsWith('SG.', "Invalid SendGrid API key format"),
  SENTRY_DSN: z.string().url("Invalid Sentry DSN URL"),
  
  // Proposal passwords
  PROPOSAL_PASSWORD_ADB: z.string().min(8, "Proposal password too short"),
  
  // Feature flags
  NODE_ENV: z.enum(['development', 'test', 'production']),
  
  // Optional configurations
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);

// ✅ Type-safe environment access throughout app
export type Environment = z.infer<typeof EnvSchema>;
```

### **Input Sanitization**
```typescript
// lib/utils/sanitization.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

export function validateProposalId(proposalId: string): boolean {
  return /^[a-z0-9-]{2,20}$/.test(proposalId);
}
```

### **Rate Limiting Implementation**
```typescript
// lib/utils/rate-limit.ts
interface RateLimitConfig {
  requests: number;
  windowMs: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit({ requests, windowMs }: RateLimitConfig) {
  return async (identifier: string): Promise<boolean> => {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (record.count >= requests) {
      return false;
    }

    record.count++;
    return true;
  };
}

// Usage in API routes
export const passwordAttemptLimiter = rateLimit({
  requests: 5,
  windowMs: 15 * 60 * 1000 // 15 minutes
});
```

---

## 📊 **Performance & Optimization**

### **Component Optimization Patterns**
```typescript
// components/ProposalViewer.tsx
import { memo, useMemo, useCallback } from 'react';
import { type ProposalSection } from '@/types/proposal';

interface ProposalViewerProps {
  readonly sections: readonly ProposalSection[];
  readonly currentSection: string;
  readonly onSectionChange: (sectionId: string) => void;
}

export const ProposalViewer = memo(function ProposalViewer({
  sections,
  currentSection,
  onSectionChange
}: ProposalViewerProps) {
  // ✅ Memoize expensive calculations
  const tableOfContents = useMemo(() => 
    sections.map(section => ({
      id: section.id,
      title: section.title,
      level: section.level
    })), [sections]
  );

  // ✅ Memoize event handlers
  const handleSectionClick = useCallback((sectionId: string) => {
    onSectionChange(sectionId);
  }, [onSectionChange]);

  return (
    <div className="proposal-viewer">
      {/* Component implementation */}
    </div>
  );
});
```

### **Data Fetching Patterns (Next.js 15)**
```typescript
// app/proposal/[proposalId]/page.tsx
import { notFound } from 'next/navigation';
import { ProposalViewer } from '@/components/ProposalViewer';
import { getProposalData } from '@/lib/data/proposals';

interface ProposalPageProps {
  params: Promise<{ proposalId: string }>;
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { proposalId } = await params;
  
  // ✅ Validate proposal ID
  if (!validateProposalId(proposalId)) {
    notFound();
  }

  // ✅ Type-safe data fetching
  const proposalData = await getProposalData(proposalId);
  
  if (!proposalData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProposalViewer {...proposalData} />
    </div>
  );
}

// ✅ Generate static params for known proposals
export async function generateStaticParams() {
  return [
    { proposalId: 'adb' },
    // Add more proposal IDs as they're created
  ];
}
```

---

## ✅ **Code Quality Checklist**

### **Pre-Deployment Checklist**
- [ ] **All TypeScript errors resolved** (`npm run type-check`)
- [ ] **Zero ESLint errors** (`npm run lint`)
- [ ] **All tests passing** (`npm run test`)
- [ ] **Bundle size analyzed** (`npm run analyze`)
- [ ] **Environment variables validated**
- [ ] **Sentry error tracking configured**
- [ ] **Security headers implemented**
- [ ] **Performance metrics verified**

### **Type Safety Verification**
```bash
# Run comprehensive type checking
npm run type-check

# Verify no `any` types in codebase
grep -r "any" src/ --include="*.ts" --include="*.tsx" | grep -v "// eslint-disable"

# Check for potential type issues
npm run lint -- --max-warnings 0
```

### **Performance Verification**
```bash
# Bundle analysis
npm run build && npm run analyze

# Lighthouse CI (if configured)
npm run lighthouse

# Check for unused dependencies
npx depcheck
```

---

## 🚀 **Deployment Standards**

### **Vercel Configuration**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### **Environment Variables Setup**
```bash
# Production environment variables
NEXT_PUBLIC_SENTRY_DSN="https://a679b1eaeb2303abaeeac2689d968fbf@o4508092137865216.ingest.us.sentry.io/4509411881844736"
JWT_SECRET="[32+ character random string]"
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY_HERE"
SENDGRID_FROM_EMAIL="team@zto1ai.com"
PROPOSAL_PASSWORD_ADB="[secure-password-for-adb]"
NODE_ENV="production"
```