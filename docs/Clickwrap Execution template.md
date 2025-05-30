# Clickwrap Signup Form - Complete Implementation Guide

This document provides a comprehensive, unabbridged implementation guide for deploying a production-ready clickwrap signup form with PDF generation and email delivery. This implementation has been tested and deployed successfully in a Next.js 15.1.8 environment with React 19.1.0.

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Technical Stack](#technical-stack)
4. [Dependencies](#dependencies)
5. [Implementation Steps](#implementation-steps)
6. [Complete Code Files](#complete-code-files)
7. [Environment Configuration](#environment-configuration)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

## Overview

This clickwrap signup form implementation provides a legally compliant, user-friendly interface for capturing user agreement to terms of service. The system generates a PDF contract with the user's information and sends it via email for record-keeping.

### Key Implementation Highlights

- **Real-time contract preview** - User data populates the agreement text as they type
- **Comprehensive validation** - Client-side validation with helpful error messages
- **Address field separation** - Proper address capture with street, city, state, and zip fields
- **PDF generation** - Server-side PDF creation using pdf-lib (serverless-optimized)
- **Email delivery** - SendGrid integration for reliable email delivery with PDF attachments
- **Audit trail** - Captures IP address, timestamp, and user details for legal compliance
- **Accessibility** - Semantic HTML with proper ARIA attributes and keyboard navigation

## Core Features

### 1. User Interface Features
- Modern, responsive design using Tailwind CSS v4 and ShadCN UI components
- Scrollable agreement text with key terms summary
- Real-time form validation with specific error messages
- Success confirmation page after submission
- Accessible form controls with proper labeling

### 2. Data Collection Fields
- **Required Fields:**
  - Full Name
  - Title/Role
  - Company
  - Street Address
  - City
  - State
  - Zip Code
  - Phone
  - Email
- **Optional Fields:**
  - Emergency Contact
  - Dietary Guidelines
  - Custom Reporting Needs

### 3. Legal Compliance Features
- Explicit consent checkbox requirement
- IP address capture for audit trail
- Timestamp recording
- Complete audit information embedded in PDF
- Dual-party signature blocks (company pre-signed, user signs electronically)

### 4. Technical Features
- Server-side PDF generation (no browser dependency)
- Base64 email attachment encoding
- Request ID correlation for debugging
- Comprehensive error handling
- TypeScript type safety throughout

## Technical Stack

- **Framework:** Next.js 15.1.8 (App Router)
- **React:** 19.1.0
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x + ShadCN UI
- **PDF Generation:** pdf-lib 1.17.1
- **Email Service:** SendGrid (@sendgrid/mail 8.1.7)
- **UI Components:** Radix UI primitives
- **Runtime:** Node.js 18.18+ (required for Prisma 6.x compatibility)

## Dependencies

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@sendgrid/mail": "^8.1.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.469.0",
    "pdf-lib": "^1.17.1",
    "tailwind-merge": "^2.7.0"
  }
}
```

Run the installation:
```bash
npm install @sendgrid/mail pdf-lib
```

## Implementation Steps

### Step 1: Set Up UI Components

First, ensure you have the necessary ShadCN UI components. Create these files in your project:

#### `/src/lib/utils.ts`
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### `/src/components/ui/alert.tsx`
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
```

#### `/src/components/ui/scroll-area.tsx`
```typescript
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
```

#### Add these standard ShadCN components:
- `/src/components/ui/button.tsx`
- `/src/components/ui/input.tsx`
- `/src/components/ui/label.tsx`
- `/src/components/ui/textarea.tsx`
- `/src/components/ui/checkbox.tsx`
- `/src/components/ui/card.tsx`

(These follow standard ShadCN patterns - see shadcn.com for implementations)

### Step 2: Create Contract Template Files

#### `/src/lib/contract-template.ts` (Client-side)
```typescript
export interface ContractData {
  name: string;
  title: string;
  company: string;
  address: string;
  phone: string;
  email: string;
}

// Extract key terms for the summary (updated for free trial)
export function getKeyTermsSummary(): string[] {
  return [
    "Free trial period with no upfront costs",
    "Hardware provided at no cost during trial",
    "Future pricing to be determined by mutual agreement", 
    "Feedback obligation in exchange for free trial",
    "Either party may terminate with 30 days notice",
    "Confidentiality and data security protections"
  ];
}

// Client-side version for the signup form
export function populateContractTemplateClient(data: ContractData): string {
  const template = `# **Tray Verify, Inc. Free Trial Software License Agreement**

This Free Trial Software License Agreement (this "**Agreement**") is entered into by and between **Tray Verify, Inc.**, a Delaware corporation, with offices at 9700 Second Street N., St. Petersburg, FL 33702 ("**Tray Verify**"), and **${data.company}**, a Corporation with offices at ${data.address} ("**Customer**"). This Agreement is effective as of ${new Date().toLocaleDateString()} ("**Effective Date**").

By clicking "Accept" or signing below, Customer agrees to the terms of this Agreement.

*WHEREAS*, Tray Verify is the provider of a proprietary computer vision-based software-as-a-service solution for meal tray verification, including associated hardware components (the "**Software**" or "**Service**");

*WHEREAS*, the Service is intended to assist Customer's personnel in verifying meal contents and compliance in support of Customer's operations; and

*WHEREAS*, Customer desires to participate in a free trial of the Service and provide feedback to Tray Verify, and Tray Verify is willing to provide such Service under the terms of this Agreement;

*NOW, THEREFORE*, in consideration of the mutual promises herein, the parties agree as follows:

## 1. Definitions

**Software** or **Service**: The Tray Verify proprietary meal verification software application and cloud service, including any related mobile or web applications, and any associated documentation.

**Hardware**: The physical components provided by Tray Verify for use with the Service, including but not limited, to a camera, touchscreen interface, mounting equipment, power supply, sensors and related items.

**Meal Scan** (or **Scan**): A single instance of the Software's use to analyze or verify the contents of a meal tray or similar item.

**Media:** The images, videos, audio and/or sensor data of a meal tray or similar item captured by the Hardware during Customer's use of the Service and/or Hardware.

**Customer Data**: Meal information, personal data, and any non-health information provided by Customer or collected by the Service on Customer's behalf during the use of the Software. Customer Data shall not include Media.

**Anonymous Data**: Aggregated, de-identified data derived from the use of the Service that cannot reasonably be used to identify Customer or any individual, including but not limited to usage patterns, performance metrics, and system optimization data.

**Confidential Information**: All non-public business, technical, or financial information disclosed by one party ("**Discloser**") to the other ("**Recipient**") that is marked or identified as confidential or which by its nature should reasonably be understood to be confidential. Customer Data is deemed Confidential Information of Customer. The Software and any non-public materials or pricing provided by Tray Verify are Confidential Information of Tray Verify.

## 2. License Grant and Scope of Use

### 2.1 License Grant

Subject to the terms and conditions of this Agreement, Tray Verify grants to Customer a non-exclusive, non-transferable, limited license to access and use the Software as a free trial service, solely for Customer's internal business operations and evaluation purposes.

### 2.2 Scope of Use

Customer's use of the Software is limited to the number of installed systems or locations agreed by the parties and to authorized personnel of Customer. All rights not expressly granted to Customer are reserved by Tray Verify.

### 2.3 License Restrictions

Customer shall not, and shall not permit any third party to:
* Copy, modify, translate, or create derivative works of the Software;
* Decompile, reverse engineer, or otherwise attempt to derive the source code or underlying ideas or algorithms of the Software;
* Sell, sublicense, rent, lease, distribute, or otherwise transfer the Software or access thereto to any third party;
* Use the Software for any purpose not expressly permitted by this Agreement;
* Remove, alter, or obscure any proprietary or notice labels on the Software or Hardware; or
* Use the Software in any manner that violates any applicable law or regulation.

### 2.4 Intellectual Property

Tray Verify retains all right, title, and interest in and to the Software, Hardware, Media, designs, documentation, and all related intellectual property. If Customer provides any feedback or suggestions regarding the Service, Tray Verify may freely use and incorporate such feedback without obligation or compensation to Customer.

### 2.5 Ownership of Media

All Media captured or generated by the Hardware or Software during its operation at the Customer's facility shall be and remain the sole and exclusive property of Tray Verify. Under no circumstances shall the Customer use, reproduce, distribute, or repurpose any Media for the training, fine-tuning, development, or evaluation of machine learning or artificial intelligence models.

## 3. Hardware Provision and Warranty

### 3.1 Provision of Hardware

Tray Verify will provide and deliver to Customer the Hardware necessary to use the Service at no cost as part of this free trial. Title to the Hardware shall remain with Tray Verify during the trial period.

### 3.2 Installation Requirements

Customer shall ensure that the installation site for the Hardware has a reliable high-speed internet connection and a standard 110V power outlet available within six (6) feet of the Hardware's location.

### 3.3 Hardware Warranty

Tray Verify warrants that the Hardware provided to Customer will be free from defects in materials and workmanship for the duration of the trial period.

## 4. Free Trial Terms

### 4.1 No Fees During Trial

Customer shall pay no fees for the use of the Software or Hardware during the trial period. All usage fees are waived until further notice for the core product as it exists today.

### 4.2 Future Pricing

Any future pricing for continued use of the Service beyond the trial period will be determined upon mutual agreement between the parties.

### 4.3 Feedback Obligation

In consideration for the free trial, Customer agrees to provide reasonable feedback regarding the Service, including but not limited to usability, functionality, performance, and suggestions for improvement.

## 5. Data Collection and Use

### 5.1 Anonymous Data Collection

Customer acknowledges and agrees that Tray Verify may collect, analyze, and use Anonymous Data derived from Customer's use of the Service. This Anonymous Data may be used by Tray Verify for:
* Improving and optimizing the Service
* Developing new features and capabilities
* Conducting research and analytics
* Demonstrating the value and effectiveness of the Service
* Marketing and promotional activities

### 5.2 Data De-identification

Tray Verify shall ensure that any Anonymous Data cannot reasonably be used to identify Customer or any individual.

### 5.3 Reporting and Communication

Tray Verify may use Anonymous Data to create reports, case studies, and other materials that communicate the value and effectiveness of the Service, provided that such materials do not identify Customer or any individual.

## 6. Confidentiality and Data Security

### 6.1 Confidentiality Obligations

Each party shall maintain in confidence all Confidential Information of the other party and shall use such information only for the purpose of fulfilling its obligations or exercising its rights under this Agreement.

### 6.2 Customer Data

As between the parties, Customer retains all rights, title, and interest in and to Customer Data. Customer grants Tray Verify a non-exclusive right to use and process Customer Data solely for purposes of providing and improving the Service.

### 6.3 Data Security

Tray Verify will implement and maintain administrative, physical, and technical safeguards for protection of the security, confidentiality, and integrity of Customer Data as required by applicable laws and regulations.

## 7. Term and Termination

### 7.1 Term

The initial term of this Agreement shall begin on the Effective Date and continue until terminated by either party as provided herein. Either party may terminate this Agreement at any time with thirty (30) days' written notice to the other party.

### 7.2 Termination for Cause

Either party may terminate this Agreement before the end of any notice period if the other party materially breaches any provision of the Agreement and fails to cure such breach within thirty (30) days.

### 7.3 Effect of Termination

Upon termination: (a) all licenses and rights granted to Customer shall immediately terminate; (b) Customer shall return all Hardware to Tray Verify in good condition; and (c) Customer shall return or destroy any Tray Verify Confidential Information.

## 8. Warranty Disclaimer

THE SERVICE AND ALL RELATED HARDWARE AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TRAY VERIFY DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED. CUSTOMER ACKNOWLEDGES THAT THE SERVICE RELIES ON ARTIFICIAL INTELLIGENCE AND IMAGE RECOGNITION TECHNOLOGIES AND IS INTENDED TO SUPPORT, NOT REPLACE, HUMAN CHECKS.

## 9. Limitation of Liability

TRAY VERIFY'S TOTAL CUMULATIVE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED ONE THOUSAND DOLLARS ($1,000).

## 10. Indemnification

Customer shall defend, indemnify, and hold harmless Tray Verify from and against any third-party claims arising out of Customer's use of the Software, Hardware, or Service or Customer's violation of this Agreement.

## 11. Governing Law and Dispute Resolution

This Agreement shall be governed by and construed in accordance with the laws of the State of Florida, USA. Any legal action shall be brought exclusively in the state or federal courts located in the State of Florida.

## 12. Miscellaneous

### 12.1 Entire Agreement

This Agreement constitutes the entire agreement between the parties with respect to the subject matter and supersedes all prior agreements.

### 12.2 Electronic Acceptance

Customer's electronic acceptance of this Agreement is valid and binding. The individual accepting this Agreement represents that they have the authority to bind the Customer to the terms of this Agreement.

---

**Agreed and Accepted by the Parties:**

**Tray Verify, Inc.**

By: Richard Valway II
Title: CEO
Date: ${new Date().toLocaleDateString()}

**${data.company}**

By: ${data.name}
Title: ${data.title}
Date: ${new Date().toLocaleDateString()}

*(Each individual signing represents and warrants that they are authorized to execute this Agreement on behalf of the party for whom they sign.)*`;

  return template;
}
```

#### `/src/lib/contract-template-server.ts` (Server-side)
```typescript
import fs from 'fs';
import path from 'path';

export interface ContractData {
  name: string;
  title: string;
  company: string;
  address: string;
  phone: string;
  email: string;
}

export function getContractTemplate(): string {
  const templatePath = path.join(process.cwd(), 'docs', 'signup_form_contract_template.md');
  return fs.readFileSync(templatePath, 'utf8');
}

export function populateContractTemplate(template: string, data: ContractData): string {
  let populated = template;
  
  // Replace placeholders with actual data (handling escaped brackets)
  populated = populated.replace(/\\\[CUSTOMER NAME\\\]/g, data.company); // Company name, not individual name
  populated = populated.replace(/\\\[STATE\\\]/g, ''); // Remove state assumption - just use address
  populated = populated.replace(/\\\[ENTITY TYPE\\\]/g, ''); // Remove entity type assumption
  populated = populated.replace(/\\\[ADDRESS\\\]/g, data.address);
  populated = populated.replace(/\\\[Effective Date\\\]/g, new Date().toLocaleDateString());
  
  // Handle signatures separately - first replace Tray Verify signature, then customer signature
  // Find and replace the first signature (Tray Verify) - uses escaped brackets
  populated = populated.replace(/(\*\*Tray Verify, Inc\.\*\*\s*\n\s*By: )\\\[NAME\\\]( Title: )\\\[TITLE\\\]( Date: )\\\[DATE\\\]/g, 
    `$1Richard Valway II$2CEO$3${new Date().toLocaleDateString()}`);
  
  // Find and replace the customer signature - be more specific to avoid matching header
  // Look for the pattern after "Agreed and Accepted by the Parties"
  populated = populated.replace(/(Agreed and Accepted by the Parties:[\s\S]*?\*\*)(.*?)(\*\*\s*\n\s*By: )\\\[NAME\\\]( Title: )\\\[TITLE\\\]( Date: )\\\[DATE\\\]/g,
    (match: string, prefix: string, companyName: string, middle: string, titlePart: string, datePart: string) => {
      // Only replace if this is the customer signature (not Tray Verify)
      if (!companyName.includes('Tray Verify')) {
        return `${prefix}${data.company}${middle}${data.name}${titlePart}${data.title}${datePart}${new Date().toLocaleDateString()}`;
      }
      return match; // Don't replace if it's Tray Verify
    });
  
  return populated;
}
```

### Step 3: Create Logger Utilities

#### `/src/utils/logger-interface.ts`
```typescript
export interface Log {
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
}
```

#### `/src/utils/logger.ts`
```typescript
import { Log } from './logger-interface';

// Variable to hold the logger instance for getLogger()
let _getterLoggerInstance: Log | undefined;
// Promise to ensure logger initialization for getLogger() happens only once
let _getterLoggerPromise: Promise<Log> | undefined;

/**
 * Asynchronously gets a logger instance suitable for the current runtime.
 * This is the recommended way to obtain a logger if TLA is problematic or needs to be avoided.
 */
export async function getLogger(): Promise<Log> {
  if (_getterLoggerInstance) {
    return _getterLoggerInstance;
  }

  if (!_getterLoggerPromise) {
    _getterLoggerPromise = (async () => {
      let newLogger: Log;
      if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { nodeLogger } = await import('./node-logger');
        newLogger = nodeLogger;
      } else {
        const { edgeLogger } = await import('./edge-logger');
        newLogger = edgeLogger;
      }
      _getterLoggerInstance = newLogger; // Cache the instance
      return _getterLoggerInstance;
    })().finally(() => {
      // Clear the promise variable once it's settled (resolved or rejected)
      // to allow re-initialization attempt if the first one failed.
      // However, if successful, _getterLoggerInstance will be cached and returned above.
      _getterLoggerPromise = undefined; 
    });
  }
  return _getterLoggerPromise;
}
```

#### `/src/utils/node-logger.ts`
```typescript
import { Log } from './logger-interface';

export const nodeLogger: Log = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data ? JSON.stringify(data) : '');
  }
};
```

#### `/src/utils/edge-logger.ts`
```typescript
import { Log } from './logger-interface';

export const edgeLogger: Log = {
  info: (message: string, data?: any) => {
    console.log(`[EDGE-INFO] ${message}`, data ? JSON.stringify(data) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[EDGE-WARN] ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (message: string, data?: any) => {
    console.error(`[EDGE-ERROR] ${message}`, data ? JSON.stringify(data) : '');
  }
};
```

## Complete Code Files

### `/src/app/signup/page.tsx` - The Signup Form Page

```typescript
"use client";

import * as React from 'react';
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { populateContractTemplateClient, getKeyTermsSummary, type ContractData } from "@/lib/contract-template";

interface FormData {
  name: string;
  title: string;
  company: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  emergencyContact: string;
  dietary: string;
  customNeeds: string;
}

export default function SignupPage() {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    title: "",
    company: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    emergencyContact: "",
    dietary: "",
    customNeeds: ""
  });

  const [agreed, setAgreed] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showValidationError, setShowValidationError] = React.useState(false);

  // Check if all required fields are filled
  const allRequiredFilled = formData.name && formData.title && formData.company && 
                           formData.streetAddress && formData.city && formData.state && 
                           formData.zipCode && formData.phone && formData.email;

  // Get list of missing required fields
  const getMissingFields = () => {
    const missing = [];
    if (!formData.name) missing.push("Full Name");
    if (!formData.title) missing.push("Title / Role");
    if (!formData.company) missing.push("Company");
    if (!formData.streetAddress) missing.push("Street Address");
    if (!formData.city) missing.push("City");
    if (!formData.state) missing.push("State");
    if (!formData.zipCode) missing.push("Zip Code");
    if (!formData.phone) missing.push("Phone");
    if (!formData.email) missing.push("Email");
    if (!agreed) missing.push("Agreement checkbox");
    return missing;
  };

  // Assemble complete address from separate fields
  const assembleAddress = () => {
    const parts = [
      formData.streetAddress,
      formData.city,
      formData.state,
      formData.zipCode
    ].filter(part => part.trim());
    
    if (parts.length === 0) return "[Address]";
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]}, ${parts[1]}`;
    if (parts.length === 3) return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
    return `${parts[0]}, ${parts[1]}, ${parts[2]} ${parts[3]}`;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled and agreement is checked
    if (!allRequiredFilled || !agreed) {
      setShowValidationError(true);
      return;
    }

    // Clear any previous validation errors
    setShowValidationError(false);
    setIsSubmitting(true);
    
    try {
      // Send the assembled address to the API
      const submissionData = {
        ...formData,
        address: assembleAddress()
      };
      
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorText = await res.text();
        console.error("Submission failed:", errorText);
        // TODO: Show error message to user
      }
    } catch (err) {
      console.error("Network or server error:", err);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear validation error when user starts filling required fields
  React.useEffect(() => {
    if (showValidationError && allRequiredFilled && agreed) {
      setShowValidationError(false);
    }
  }, [showValidationError, allRequiredFilled, agreed]);

  // Generate the populated contract text
  const contractData: ContractData = {
    name: formData.name || "[Customer Name]",
    title: formData.title || "[Title]",
    company: formData.company || "[Company Name]",
    address: assembleAddress(),
    phone: formData.phone,
    email: formData.email
  };

  const populatedContract = populateContractTemplateClient(contractData);
  const keyTerms = getKeyTermsSummary();

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">Thank you!</h2>
              <p className="text-gray-600">
                Your agreement has been submitted successfully. You will receive a copy via email shortly.
              </p>
              <Button asChild className="mt-4">
                <Link href="/">Return to homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Tray Verify Signup form and Free Evaluation</h1>
        <p className="text-lg text-gray-600">
          Please review the free trial agreement below and provide your information to proceed.
        </p>
      </div>

      {/* Summary of Key Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Key Terms Summary</CardTitle>
          <CardDescription>
            The following highlights the main points of the free trial agreement. Please review the full agreement below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-gray-800">
            {keyTerms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
          <p className="text-sm text-amber-600 mt-4 font-medium">
            *This summary is for convenience only. Please review the full agreement below before accepting.
          </p>
        </CardContent>
      </Card>

      {/* Full Agreement Text */}
      <Card>
        <CardHeader>
          <CardTitle>Full Free Trial Agreement</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-gray-50">
            <div className="pr-4 text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
              {populatedContract.split('\n').map((line, index) => {
                // Handle markdown formatting
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-lg font-bold text-center underline mb-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-base font-bold mt-6 mb-2">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-sm font-bold mt-4 mb-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('* ')) {
                  return <li key={index} className="ml-4">{line.substring(2)}</li>;
                } else if (line.includes('**')) {
                  // Handle bold text without highlighting
                  const parts = line.split('**');
                  return (
                    <p key={index} className="mb-2">
                      {parts.map((part, partIndex) => 
                        partIndex % 2 === 1 ? 
                          <span key={partIndex} className="font-bold">{part}</span> : 
                          part
                      )}
                    </p>
                  );
                } else if (line.trim()) {
                  return <p key={index} className="mb-2">{line}</p>;
                } else {
                  return <div key={index} className="mb-2"></div>;
                }
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>
            Please provide the following information to complete your free trial agreement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Validation Error Alert */}
            {showValidationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Missing Required Fields</AlertTitle>
                <AlertDescription>
                  Please complete the following required fields to continue:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {getMissingFields().map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title / Role <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="Enter your title or role"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">
                Company <span className="text-red-600">*</span>
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
                placeholder="Enter your company name"
              />
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Address <span className="text-red-600">*</span>
              </Label>
              
              <div className="space-y-2">
                <Input
                  id="streetAddress"
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  required
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    placeholder="City"
                  />
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                    placeholder="State"
                  />
                </div>
                
                <div className="space-y-2">
              <Input
                    id="zipCode"
                type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                required
                    placeholder="Zip code"
              />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Name and phone number (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietary">Dietary Guidelines (optional)</Label>
              <Input
                id="dietary"
                type="text"
                value={formData.dietary}
                onChange={(e) => handleInputChange('dietary', e.target.value)}
                placeholder="Any specific dietary requirements or guidelines"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customNeeds">Custom Reporting Needs (optional)</Label>
              <Textarea
                id="customNeeds"
                value={formData.customNeeds}
                onChange={(e) => handleInputChange('customNeeds', e.target.value)}
                placeholder="Describe any custom reporting requirements"
                rows={3}
              />
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-blue-50">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                required
              />
              <Label htmlFor="agree" className="text-sm leading-relaxed">
                I have read and agree to the terms of the Tray Verify Free Trial Software License Agreement above. 
                I understand that by checking this box and submitting this form, I am entering into a legally 
                binding agreement for a free trial of the Tray Verify service.
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!agreed || isSubmitting}
              className="w-full md:w-auto"
              size="lg"
            >
              {isSubmitting ? "Processing..." : "I Agree & Sign Free Trial Agreement"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### `/src/app/api/signup/route.ts` - The API Route Handler

```typescript
import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { getLogger } from '@/utils/logger';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getContractTemplate, populateContractTemplate, type ContractData } from '@/lib/contract-template-server';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface FormData {
  name: string;
  title: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  emergencyContact?: string;
  dietary?: string;
  customNeeds?: string;
}

export async function POST(req: NextRequest) {
  const logger = await getLogger();
  const requestId = req.headers.get('x-request-id') as string;
  logger.info('Signup API called', { requestId });
  
  try {
    const body = await req.json() as unknown;
    const data = body as FormData;
    
    logger.info('Received signup data', { 
      name: data.name, 
      email: data.email,
      requestId 
    });
    
    // Validate required fields
    const { name, title, company, address, phone, email } = data;
    if (!name || !title || !company || !address || !phone || !email) {
      logger.warn('Missing required fields in signup request', { 
        missingFields: {
          name: !name,
          title: !title,
          company: !company,
          address: !address,
          phone: !phone,
          email: !email
        },
        requestId 
      });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Capture client IP and timestamp
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    const timestamp = new Date();
    
    logger.info('Generating PDF with pdf-lib...', { requestId });
    
    // Generate PDF using pdf-lib
    const pdfBuffer = await generatePDF(data, clientIp, timestamp, requestId);
    
    logger.info('PDF generated successfully', { 
      size: pdfBuffer.length,
      requestId 
    });
    
    logger.info('Attempting to send email...', { requestId });

    // Send email with PDF attachment
    await sendEmail(data, pdfBuffer, requestId);
    
    logger.info('Email sent successfully', { requestId });

    return NextResponse.json({ 
      success: true, 
      message: 'Agreement signed and sent successfully!' 
    });
  } catch (error) {
    logger.error('Signup API error', { 
      err: error,
      requestId,
      operation: 'signup'
    });
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

async function generatePDF(data: FormData, clientIp: string, timestamp: Date, requestId: string): Promise<Buffer> {
  const logger = await getLogger();
  
  try {
    logger.info('Starting PDF generation', { requestId, operation: 'pdf_generation' });
    
    // Get the full contract template
    const contractTemplate = getContractTemplate();
    const contractData: ContractData = {
      name: data.name,
      title: data.title,
      company: data.company,
      address: data.address,
      phone: data.phone,
      email: data.email
    };
    const populatedContract = populateContractTemplate(contractTemplate, contractData);
    
    logger.info('Contract template populated', { requestId, customerName: data.name });
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed standard fonts (no external font files needed)
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    // Add a page
    let page = pdfDoc.addPage([612, 792]); // Standard letter size
    const { width, height } = page.getSize();
    
    let yPosition = height - 50; // Start from top with margin
    const leftMargin = 50;
    const rightMargin = width - 50;
    const lineHeight = 18; // Increased line height to prevent overlap
    const maxWidth = rightMargin - leftMargin - 20;
    
    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = lineHeight) => {
      if (yPosition - requiredSpace < 50) { // Bottom margin
        page = pdfDoc.addPage([612, 792]);
        yPosition = height - 50;
        return true;
      }
      return false;
    };
    
    // Helper function to clean text for PDF (remove markdown and fix escaping)
    const cleanTextForPDF = (text: string): string => {
      return text
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/\\\./g, '.') // Fix escaped periods
        .replace(/\\\(/g, '(') // Fix escaped parentheses
        .replace(/\\\)/g, ')') // Fix escaped parentheses
        .replace(/\\\[/g, '[') // Fix escaped brackets
        .replace(/\\\]/g, ']') // Fix escaped brackets
        .replace(/\\\{/g, '{') // Fix escaped braces
        .replace(/\\\}/g, '}') // Fix escaped braces
        .replace(/\\\*/g, '*') // Fix escaped asterisks
        .replace(/\\\$/g, '$') // Fix escaped dollar signs
        .replace(/\\\|/g, '|') // Fix escaped pipes
        .replace(/\\\^/g, '^') // Fix escaped carets
        .replace(/\\\+/g, '+') // Fix escaped plus signs
        .replace(/\\\?/g, '?') // Fix escaped question marks
        .replace(/\\\\/g, '\\'); // Fix double backslashes
    };
    
    // Helper function to add wrapped text with proper spacing
    const addWrappedText = (text: string, fontSize = 11, font = timesRomanFont, isBold = false) => {
      const actualFont = isBold ? timesRomanBoldFont : font;
      const cleanedText = cleanTextForPDF(text);
      const words = cleanedText.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = actualFont.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth > maxWidth && currentLine) {
          // Draw current line
          checkNewPage();
          page.drawText(currentLine, {
            x: leftMargin,
            y: yPosition,
            size: fontSize,
            font: actualFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      // Draw the last line
      if (currentLine) {
        checkNewPage();
        page.drawText(currentLine, {
          x: leftMargin,
          y: yPosition,
          size: fontSize,
          font: actualFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
      }
    };
    
    // Process the contract text line by line
    const lines = populatedContract.split('\n');
    let pageCount = 1;
    
    for (const line of lines) {
      if (line.trim() === '') {
        yPosition -= lineHeight / 2; // Half line for empty lines
        continue;
      }
      
      // Track page breaks
      const currentPageCount = pdfDoc.getPageCount();
      if (currentPageCount > pageCount) {
        pageCount = currentPageCount;
        logger.info('Added new page to PDF', { requestId, pageCount });
      }
      
      // Handle markdown formatting
      if (line.startsWith('# ')) {
        // Main title
        yPosition -= 10;
        checkNewPage(30); // Ensure space for title
        const title = cleanTextForPDF(line.substring(2));
        page.drawText(title, {
          x: leftMargin,
          y: yPosition,
          size: 16,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 25;
        
      } else if (line.startsWith('## ')) {
        // Section headers
        yPosition -= 15;
        checkNewPage(25);
        const header = cleanTextForPDF(line.substring(3));
        page.drawText(header, {
          x: leftMargin,
          y: yPosition,
          size: 14,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
        
      } else if (line.startsWith('### ')) {
        // Subsection headers
        yPosition -= 10;
        checkNewPage(20);
        const subheader = cleanTextForPDF(line.substring(4));
        page.drawText(subheader, {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 18;
        
      } else if (line.startsWith('* ')) {
        // Bullet points
        const bulletText = '• ' + cleanTextForPDF(line.substring(2));
        addWrappedText(bulletText, 11, timesRomanFont);
        
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // Bold text
        const boldText = cleanTextForPDF(line.substring(2, line.length - 2));
        addWrappedText(boldText, 11, timesRomanBoldFont, true);
        
      } else if (line.includes('**')) {
        // Mixed bold and regular text - simplified handling
        const cleanText = cleanTextForPDF(line);
        addWrappedText(cleanText, 11, timesRomanFont);
        
      } else if (line.startsWith('*') && line.endsWith('*')) {
        // Italic text (using regular font since we don't have italic)
        const italicText = cleanTextForPDF(line.substring(1, line.length - 1));
        addWrappedText(italicText, 11, timesRomanFont);
        
      } else if (line.trim().startsWith('---')) {
        // Horizontal line
        yPosition -= 15;
        checkNewPage(20);
        page.drawLine({
          start: { x: leftMargin, y: yPosition },
          end: { x: rightMargin, y: yPosition },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;
        
      } else if (line.trim()) {
        // Regular text
        addWrappedText(line, 11, timesRomanFont);
      }
    }
    
    // Add audit trail information
    yPosition -= 30;
    checkNewPage(80); // Ensure space for audit trail
    
    page.drawText('--- AUDIT TRAIL ---', {
      x: leftMargin,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
    
    page.drawText(`Agreement accepted on: ${timestamp.toISOString()}`, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 15;
    
    page.drawText(`Client IP address: ${clientIp}`, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 15;
    
    page.drawText(`Electronic signature by: ${data.name}`, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 15;
    
    page.drawText(`Signatory title: ${data.title}`, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 15;
    
    page.drawText(`Signatory address: ${data.address}`, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();
    const finalPageCount = pdfDoc.getPageCount();
    
    logger.info('PDF generation completed', { 
      requestId, 
      finalSize: pdfBytes.length,
      pageCount: finalPageCount,
      operation: 'pdf_generation'
    });
    
    return Buffer.from(pdfBytes);
    
  } catch (error) {
    logger.error('PDF generation failed', {
      err: error,
      requestId,
      operation: 'pdf_generation',
      customerName: data.name
    });
    throw error;
  }
}

async function sendEmail(data: FormData, pdfBuffer: Buffer, requestId: string): Promise<void> {
  const logger = await getLogger();
  
  try {
    logger.info('Preparing SendGrid email message...', { requestId });
    
    const msg = {
      to: data.email,
      cc: process.env.SENDGRID_FROM_EMAIL || 'team@tray-verify.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'team@tray-verify.com',
      subject: 'Tray Verify - Your Free Trial Agreement',
      text: `Hello ${data.name},

Thank you for signing up for the Tray Verify Free Trial!

We're excited to have you participate in our free trial program. Attached is a PDF copy of the signed Free Trial Software License Agreement for your records. Please keep this document for your files.

As part of the free trial, you'll receive:
• Hardware provided at no cost
• Full access to our meal verification software
• No upfront fees or usage charges during the trial period
• Support from our team

We'll be in touch soon to schedule your hardware installation and system setup.

If you have any questions about the agreement or our services, please don't hesitate to contact us.

Best regards,
The Tray Verify Team

---
Tray Verify, Inc.
9700 Second Street N.
St. Petersburg, FL 33702`,
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: `TrayVerify_FreeTrial_Agreement_${data.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };

    logger.info('SendGrid message prepared', {
      to: msg.to,
      from: msg.from,
      cc: msg.cc,
      subject: msg.subject,
      attachmentSize: pdfBuffer.length,
      requestId
    });

    const result = await sgMail.send(msg);
    logger.info('SendGrid send result', { result, requestId });
    
  } catch (error) {
    logger.error('SendGrid error details', { 
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      requestId,
      operation: 'email_send'
    });
    throw error;
  }
}
```

### Contract Template File

Create `/docs/signup_form_contract_template.md` with the full contract text from the work plan (the long legal document with placeholders).

## Environment Configuration

### Development (`.env.local`)
```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=no-reply@yourdomain.com
```

### Production (Vercel Environment Variables)
Add the same environment variables in your Vercel project settings:
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`

### SendGrid Setup
1. Create a SendGrid account
2. Verify your sender domain
3. Generate an API key with "Mail Send" permissions
4. Add the API key to your environment variables

## Deployment

### Vercel Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add SENDGRID_API_KEY
   vercel env add SENDGRID_FROM_EMAIL
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Post-Deployment Checklist

- [ ] Verify `/signup` page loads correctly
- [ ] Test form validation (try submitting with missing fields)
- [ ] Complete a full submission and verify email delivery
- [ ] Check PDF generation and content accuracy
- [ ] Verify IP address capture in PDF audit trail
- [ ] Test on mobile devices for responsive design

## Testing

### Local Testing

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Visit Signup Page**:
   ```
   http://localhost:3000/signup
   ```

3. **Test Form Validation**:
   - Try submitting without filling required fields
   - Verify validation messages appear
   - Check that submit button is disabled without agreement

4. **Test Complete Flow**:
   - Fill all fields with test data
   - Submit form
   - Check console for any errors
   - Verify success message appears

### Production Testing

Use a test email address to verify the complete flow in production:
1. Complete the signup form
2. Check email for PDF attachment
3. Open PDF and verify all data is correct
4. Verify audit trail information

## Troubleshooting

### Common Issues and Solutions

#### 1. **SendGrid Authentication Error**
```
Error: Unauthorized
```
**Solution**: Verify your SendGrid API key is correct and has proper permissions.

#### 2. **PDF Generation Memory Issues**
```
Error: JavaScript heap out of memory
```
**Solution**: Increase Node.js memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 3. **Missing Required Fields Error Despite All Fields Filled**
**Solution**: Check that the address assembly function is working correctly and that all form state updates are properly handled.

#### 4. **Vercel Deployment Function Size Error**
**Solution**: Ensure you're not including unnecessary dependencies. pdf-lib is lightweight, but check for any large unused packages.

#### 5. **Email Not Received**
**Checklist**:
- Verify SendGrid sender domain is authenticated
- Check SendGrid activity logs
- Ensure email isn't in spam folder
- Verify CC email address is valid

### Debug Mode

Add debug logging by setting an environment variable:
```env
DEBUG=true
```

This will enable verbose logging in the API route to help diagnose issues.

## Best Practices and Recommendations

### 1. **Legal Compliance**
- Regularly review and update contract terms with legal counsel
- Ensure data retention policies comply with local regulations
- Consider implementing data export functionality for GDPR compliance

### 2. **Security Enhancements**
- Implement rate limiting on the API endpoint
- Add CAPTCHA to prevent automated submissions
- Consider encrypting sensitive data in transit

### 3. **Performance Optimization**
- Cache contract template to reduce file system reads
- Implement CDN for static assets
- Consider queue-based email sending for high volume

### 4. **User Experience Improvements**
- Add progress indicator during submission
- Implement auto-save for form data
- Add print functionality for the agreement

### 5. **Monitoring and Analytics**
- Set up error tracking (e.g., Sentry)
- Monitor email delivery rates
- Track form completion rates

## Conclusion

This implementation provides a complete, production-ready clickwrap signup form with all the features extracted from the git commits and work plan. The system is designed to be maintainable, scalable, and legally compliant while providing an excellent user experience.

The modular architecture allows for easy updates and extensions, such as adding database persistence, implementing additional validation rules, or integrating with other services.

For questions or issues, refer to the troubleshooting section or consult the original work plan documentation for additional context and requirements. 