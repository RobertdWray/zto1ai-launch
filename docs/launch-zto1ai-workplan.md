# Workplan: Launch.zto1ai.com - MVP Proposal Hosting System

**Purpose of this Workplan:** This document provides a complete blueprint for building a password-protected proposal hosting platform for Zero to One AI. The goal is to create an interactive, branded experience for potential clients to review proposals, sign contracts, and book kickoff meetings - all within a secure, professional environment that showcases our AI consulting capabilities.

---

## NEW FEATURE: Interactive Proposal Hosting Platform

**Status**: ⬜️ (Not Yet Started)

**Target Route(s)**: 
- `/` - Password entry landing page
- `/proposal/[proposalId]` - Individual proposal pages (starting with `/proposal/adb`)
- `/api/auth/verify-password` - Password verification endpoint
- `/api/contract/submit` - Contract submission endpoint

**Target Users**: `PROSPECTIVE_CLIENT` (Password-protected access only)

**Purpose & Why**:

### Summary of Work & Impact
We are building a secure, interactive proposal hosting platform that transforms static PDF proposals into engaging web experiences. This MVP will host the American Board of Dermatology (ADB) proposal as our first implementation, demonstrating how we can present complex AI solutions in an accessible, professional manner that drives client engagement and accelerates the sales process.

### What Happens if Our Work is High Quality?
- **Increased Conversion**: Interactive proposals with embedded demos, clickwrap contracts, and instant booking will significantly increase proposal-to-contract conversion rates
- **Brand Differentiation**: We'll stand out from competitors still sending static PDFs, positioning Zero to One AI as innovative from first contact
- **Faster Sales Cycle**: Clients can review, sign, and schedule kickoff meetings in one seamless flow, reducing days or weeks of back-and-forth
- **Scalable Foundation**: This MVP proves the concept for a future proposal management system that could handle hundreds of custom proposals

### Why Are We Doing This Workplan?
- **Immediate Business Need**: We have an active proposal for ADB that needs professional presentation
- **Competitive Advantage**: Interactive proposals showcase our technical capabilities before we even start working with clients
- **Process Innovation**: This transforms our sales process from document-based to experience-based
- **Future Platform**: This MVP validates the approach before investing in a full database-driven system

### Impact on Users
- **For Prospective Clients**: Professional, engaging experience that makes complex AI solutions tangible and accessible
- **For Zero to One AI Team**: Streamlined proposal delivery and tracking of client engagement
- **For Sales Process**: Clear path from interest to signed contract with minimal friction

### What Happens if We Cut Corners?
- **Security Vulnerabilities**: Poor password implementation could expose confidential pricing and strategy
- **Lost Credibility**: Buggy or unprofessional interface undermines our AI expertise claims  
- **Abandoned Proposals**: Poor UX leads to clients giving up before signing
- **Technical Debt**: Rushed implementation makes future expansion difficult
- **Brand Damage**: Inconsistent styling or poor mobile experience reflects badly on our capabilities

**Architecture & Implementation Notes**:

### Technology Stack
- **Framework**: Next.js 15.1.8 with App Router (consistent with example stack)
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 + custom components following StyleGuide.md
- **UI Components**: Radix UI primitives (already in use per StyleGuide)
- **PDF Generation**: pdf-lib (from clickwrap template)
- **Email**: SendGrid for contract delivery
- **Monitoring**: Sentry with comprehensive error tracking and replay
- **Hosting**: Vercel with environment-based configuration

### Code Reuse & Adaptation
- **From StyleGuide.md**: 
  - All typography, color palette, and layout systems
  - Existing UI components (buttons, cards, scroll areas)
  - Motion design patterns for scroll-triggered animations
  - Brand assets and metadata configuration
  
- **From Clickwrap Template**:
  - Complete contract signing flow and validation
  - PDF generation with audit trail
  - SendGrid email integration
  - Form components and error handling patterns

- **From Sentry Guide**:
  - Full monitoring setup with runtime-aware configuration
  - Request ID tracking and user context
  - Error boundaries and global error handlers

### New Components/Modules to Create

1. **Password Protection System**:
   - Middleware for route protection
   - Session-based authentication (using cookies)
   - URL parameter parsing for password links
   - Password verification API endpoint

2. **Proposal Display Engine**:
   - Dynamic proposal content renderer
   - Section-based navigation component
   - Interactive timeline for project phases
   - Embedded demo integration (Sarah Chen voice agent)

3. **Proposal-Specific Components**:
   - ADB proposal layout with all content sections
   - Team member cards with bios
   - Pricing display component
   - Feature comparison tables

4. **Thank You/Next Steps Page**:
   - Success confirmation after contract signing
   - Google Calendar booking widget integration
   - Next steps checklist component

### Data Flow & State Management
- **No Database**: All proposal content hardcoded in React components
- **Session Storage**: Password verification stored in encrypted cookies
- **Local State**: Form data managed with React hooks
- **Contract Data**: Passed directly to PDF generation and email

### Security Considerations
- **Password Storage**: Passwords stored as environment variables (PROPOSAL_PASSWORD_ADB)
- **URL Parameters**: Sanitized and validated before use
- **Session Management**: HTTP-only cookies with secure flags
- **Rate Limiting**: Implement basic rate limiting on password attempts
- **Content Protection**: Middleware ensures all proposal routes check authentication

### Third-Party Integrations
1. **SendGrid**: Email delivery (API key required)
2. **Google Calendar**: Embedded booking widget (provided code)
3. **ElevenLabs**: Sarah Chen demo embed (provided in ADB proposal)
4. **Sentry**: Error tracking and monitoring (DSN provided)

### UI/UX Patterns
- Follow Zero to One AI brand guidelines exactly
- Mobile-first responsive design
- Scroll-triggered animations for proposal sections
- Progress indicators for long content
- Smooth section transitions
- Interactive elements to maintain engagement

**Core Features & Requirements**:

1. **Password Protection System**
   - Accept password via form input on landing page
   - Support URL parameter access (e.g., ?pw=clientpassword)
   - Store authentication state in secure session
   - Redirect authenticated users directly to their proposal
   - Show friendly error for incorrect passwords
   - Clear session on browser close (session cookies)

2. **Landing Page (`/`)**
   - Branded Zero to One AI design with launch theme
   - Password input form with validation
   - Error messaging for failed attempts
   - Loading state during verification
   - Auto-redirect if already authenticated
   - Mobile-responsive layout

3. **ADB Proposal Page (`/proposal/adb`)**
   - Full proposal content from ADB proposal.md
   - Sectioned layout with smooth scrolling
   - Embedded Sarah Chen voice demo (ElevenLabs)
   - Team member showcase with bios
   - Pricing and terms clearly displayed
   - Interactive timeline visualization
   - "Ready to Launch" CTA button

4. **Getting Started/Contract Page**
   - Clickwrap contract implementation from template
   - Pre-populated with ADB information
   - Real-time contract preview as user types
   - Comprehensive form validation
   - Success confirmation after signing
   - PDF generation and email delivery

5. **Thank You/Booking Page**
   - Confirmation message with next steps
   - Google Calendar booking widget embedded
   - Quick links to important resources
   - Contact information display
   - Option to download signed contract

6. **Comprehensive Error Handling**
   - Sentry integration on all pages
   - User-friendly error messages
   - Fallback UI for failed components
   - Request ID tracking throughout
   - Network error recovery

7. **Security Features**
   - Password-protected routes via middleware
   - No sensitive data in client-side code
   - HTTPS-only in production
   - Secure session management
   - Rate limiting on password attempts

8. **Analytics & Monitoring**
   - Full Sentry integration with replay
   - Page view tracking
   - Conversion funnel monitoring
   - Error tracking with context
   - Performance monitoring

**Development Tasks Checklist**:

### Initial Setup & Configuration
- [ ] Initialize Next.js project with TypeScript
- [ ] Install required dependencies from example tech stack (only what's needed)
- [ ] Configure Tailwind CSS v4 with custom theme from StyleGuide
- [ ] Set up Sentry following deployment guide
- [ ] Configure environment variables structure
- [ ] Set up Vercel project and deployment pipeline
- [ ] Initialize Git repository with proper .gitignore

### Authentication System
- [ ] Create password verification API endpoint (`/api/auth/verify-password`)
- [ ] Implement session management with encrypted cookies
- [ ] Build authentication middleware for protected routes
- [ ] Add URL parameter parsing for password links
- [ ] Create password form component with validation
- [ ] Implement rate limiting for password attempts
- [ ] Add session expiry handling

### Landing Page Development
- [ ] Create landing page layout following StyleGuide
- [ ] Build password entry form component
- [ ] Add Zero to One AI branding and launch theme
- [ ] Implement error states and messaging
- [ ] Add loading states during verification
- [ ] Ensure mobile responsiveness
- [ ] Add motion animations per StyleGuide

### Proposal Display System
- [ ] Create proposal layout component
- [ ] Build section navigation component
- [ ] Implement smooth scrolling between sections
- [ ] Add progress indicator for long content
- [ ] Create responsive grid system for content
- [ ] Build interactive timeline component
- [ ] Add scroll-triggered animations

### ADB Proposal Implementation
- [ ] Convert ADB proposal.md content to React components
- [ ] Create Executive Summary section
- [ ] Build System Overview with features
- [ ] Implement Technical Specifications display
- [ ] Create Pricing section with clear CTAs
- [ ] Build Team showcase with member cards
- [ ] Integrate Sarah Chen voice demo embed
- [ ] Add interactive timeline for project phases
- [ ] Create appendices with expandable content

### Contract Signing Flow
- [ ] Adapt clickwrap template to proposal context
- [ ] Create contract preview component
- [ ] Build multi-field form with validation
- [ ] Implement real-time contract population
- [ ] Add agreement checkbox and submit
- [ ] Create contract submission API endpoint
- [ ] Integrate PDF generation from template
- [ ] Set up SendGrid email delivery
- [ ] Add success confirmation page

### Thank You Page & Booking
- [ ] Create thank you page layout
- [ ] Integrate Google Calendar booking widget
- [ ] Add next steps checklist
- [ ] Include contact information
- [ ] Add contract download option
- [ ] Ensure consistent branding

### Error Handling & Monitoring
- [ ] Implement global error boundary
- [ ] Add try-catch blocks in all async operations
- [ ] Configure Sentry error tracking
- [ ] Set up session replay
- [ ] Add request ID propagation
- [ ] Create user-friendly error pages
- [ ] Test error scenarios

### Testing & Quality Assurance
- [ ] Test password protection flow
- [ ] Verify mobile responsiveness
- [ ] Test form validation and submission
- [ ] Validate PDF generation
- [ ] Test email delivery
- [ ] Check all external integrations
- [ ] Performance testing and optimization
- [ ] Cross-browser compatibility testing

### Documentation
- [ ] Create comprehensive README.md
- [ ] Document environment variables
- [ ] Add deployment instructions
- [ ] Include troubleshooting guide
- [ ] Document how to add new proposals
- [ ] Create maintenance guidelines

### Deployment & Launch
- [ ] Set up Vercel environment variables
- [ ] Configure custom domain (launch.zto1ai.com)
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring alerts
- [ ] Deploy to production
- [ ] Verify all features in production
- [ ] Share password with ADB contact

---

## Dependencies for Launch.zto1ai.com MVP

**1. Environment Setup (`⬜️`)**
- [ ] Vercel account with custom domain configured
- [ ] SendGrid account with verified sender domain
- [ ] Sentry project created with DSN
- [ ] Environment variables documented and set

**2. Design Assets (`⬜️`)**
- [ ] Zero to One AI logos in all formats (from StyleGuide)
- [ ] Team member photos for ADB proposal
- [ ] Any additional imagery needed

**3. External Services (`⬜️`)**
- [ ] SendGrid API key with send permissions
- [ ] Google Calendar booking widget code (provided)
- [ ] ElevenLabs embed code for Sarah Chen (provided)

**4. Content Preparation (`⬜️`)**
- [ ] ADB proposal content reviewed and finalized
- [ ] Contract template adapted for ADB
- [ ] Password(s) determined for ADB access

**5. Technical Prerequisites (`⬜️`)**
- [ ] Node.js 18.18+ installed (for Next.js 15)
- [ ] Git repository initialized
- [ ] Development environment ready

---

## Success Metrics

The MVP will be considered successful when:
1. ADB representatives can access their proposal via password
2. The proposal displays professionally on all devices
3. Contract signing flow works end-to-end with PDF delivery
4. Booking widget allows scheduling kickoff calls
5. All interactions are tracked in Sentry
6. Page load times are under 3 seconds
7. Zero critical bugs in production

## Timeline Estimate

Based on the scope and reusable components:
- **Week 1**: Setup, authentication, and landing page
- **Week 2**: ADB proposal implementation and styling
- **Week 3**: Contract flow and integrations
- **Week 4**: Testing, documentation, and deployment

Total: 4 weeks to production-ready MVP

## Future Enhancements (Post-MVP)

1. Database-driven proposal management
2. Admin dashboard for proposal creation
3. Analytics dashboard for engagement tracking  
4. Multiple proposal templates
5. A/B testing capabilities
6. CRM integration
7. Proposal versioning
8. Collaborative review features 

Other secrets needed
Sendgrid API Key ASG.81kPYkPgQkqeVRZC4ZrgaA.Hey97lJnjDhAGLsy3FZWmqYCL7-N1TG0ZHBbBcD5_yw
Sendgrid from: team@zto1ai.com

Use git CLI to create a new Repo for this.  Let's call it zto1ai-launch Ask me if you need auth. 
use Vercel CLI to create a new project for hosting. Let's call it zto1ai-launch  Ask me if you need auth. 

Sentry 
In general, please try to follow this docs/sentry-deployment-guide.md
DSN: 
https://a679b1eaeb2303abaeeac2689d968fbf@o4508092137865216.ingest.us.sentry.io/4509411881844736


# **Latest Information to Be Aware Of**

## **Next.js v15.1.8**

* **Breaking Changes:** Next.js 15 introduces **asynchronous request APIs** – functions like `cookies()`, `headers()`, and route `params` must now be awaited (previously they were synchronous)[nextjs.org](https://nextjs.org/blog/next-15#:~:text=Therefore%2C%20we%20are%20transitioning%20APIs,%E2%80%94to%20be%20asynchronous)[nextjs.org](https://nextjs.org/blog/next-15#:~:text=This%20is%20a%20breaking%20change,and%20affects%20the%20following%20APIs). Defaults for **caching** have changed: in Next 15, route handlers for `GET` and the client-side router **no longer cache by default** (you must opt in with static configs)[medium.com](https://medium.com/@dmostoller/next-js-15-new-features-breaking-changes-and-improvements-you-need-to-know-ac98fa6f0c2d#:~:text=3,by%20Default). The minimum Node.js version was raised (Node 18.18+ required)[nextjs.org](https://nextjs.org/blog/next-15#:~:text=,0%20%28PR), and legacy features were pruned (for example, the old `@next/font` package is no longer supported – use the built-in `next/font` instead)[nextjs.org](https://nextjs.org/blog/next-15#:~:text=%2A%20%5BBreaking%5D%20Middleware%3A%20Apply%20%60react,package%20%28PR).

* **New Features & Updates:** Next.js 15 aligns with **React 19** (the App Router runs on React 19, while the older Pages Router can still use React 18\)[medium.com](https://medium.com/@dmostoller/next-js-15-new-features-breaking-changes-and-improvements-you-need-to-know-ac98fa6f0c2d#:~:text=4,Compatibility). Development tooling improved with **Turbopack** now stable for dev builds (faster HMR and startup) and better error overlays. There are new experimental APIs like `unstable_after` for background tasks after response, an enhanced `<Form>` component for client-side navigation, and support for writing config in TypeScript (`next.config.ts`)[medium.com](https://medium.com/@dmostoller/next-js-15-new-features-breaking-changes-and-improvements-you-need-to-know-ac98fa6f0c2d#:~:text=7.%20Experimental%20,Blocking%20Server%20Tasks)[medium.com](https://medium.com/@dmostoller/next-js-15-new-features-breaking-changes-and-improvements-you-need-to-know-ac98fa6f0c2d#:~:text=9). Next 15 also brought **improved caching control** (e.g. a `staleTimes` config for fine-tuning revalidation) and **hydration error fixes**, aiming to smooth out App Router performance and developer experience.

## **Tailwind CSS v4**

* **Breaking Changes:** Tailwind CSS 4.0 was a ground-up rewrite for speed and modern CSS. **Configuration is now “CSS-first”** – the typical `tailwind.config.js` is no longer generated by default, as Tailwind 4 lets you configure everything in your CSS files (using directives like `@import "tailwindcss"` and the new `@theme` or `@plugin` directives)[wimdeblauwe.com](https://www.wimdeblauwe.com/blog/2025/01/29/thymeleaf-and-tailwindcss-4.0-updates/#:~:text=The%20,now%20configures%20everything%20in%20CSS). You’ll need to update build setups: install the new PostCSS plugin (`@tailwindcss/postcss`) and possibly remove older config files. This version uses a new **Rust-powered engine (Oxide)** and Lightning CSS parser, which requires modern browser support (older browsers lacking @layer support may not render styles without polyfills)[devclass.com](https://devclass.com/2025/01/24/tailwind-css-4-0-released-with-ground-up-rewrite-for-faster-rust-powered-build/#:~:text=Tailwind%20CSS%204,up)[devclass.com](https://devclass.com/2025/01/24/tailwind-css-4-0-released-with-ground-up-rewrite-for-faster-rust-powered-build/#:~:text=New%20CSS%20features%20in%20the,Tailwind%20internally%20making%20maintenance%20easier).

* **New Features & Improvements:** Tailwind 4.0 focuses heavily on performance – builds are **up to 5× faster** (and 100× faster for incremental builds) thanks to the Oxide engine[krodox.com](https://krodox.com/blog/tailwindcss-4-released#:~:text=1,up%20to%20100%20times%20faster). It natively supports **modern CSS features** like cascade layers and container queries out of the box[krodox.com](https://krodox.com/blog/tailwindcss-4-released#:~:text=4,size%20rather%20than%20viewport%20size). The **default design system was updated** (e.g. color palette now uses the OKLCH color model for more consistent colors)[krodox.com](https://krodox.com/blog/tailwindcss-4-released#:~:text=responsive%20designs%20based%20on%20container,size%20rather%20than%20viewport%20size). New utility classes were added (such as inset shadows and rings) and **composable variants** for more flexible styling combos[krodox.com](https://krodox.com/blog/tailwindcss-4-released#:~:text=5,vibrant%20colors%20across%20different%20screens). Tooling is simplified: autoprefixer and other PostCSS steps are integrated by default[krodox.com](https://krodox.com/blog/tailwindcss-4-released#:~:text=2,the%20need%20for%20separate%20installations), and content source detection can be zero-config (Tailwind can auto-discover templates in many cases). Overall, Tailwind 4 brings major speed, some new syntax (e.g. replacing `@tailwind base/components/utilities` with a single import), and quality-of-life improvements for modern CSS workflows.

## **TypeScript (Project Usage)**

* **Breaking Changes / Major Updates:** TypeScript has seen multiple releases in the past 8 months (v5.3 through v5.8). Most changes are backwards-compatible, but some **type-checking refinements** may surface new errors or require code tweaks. For example, TypeScript 5.4 made conditional types and intersection types more accurate/strict – certain assignments that previously passed may now fail due to improved inference[medium.com](https://medium.com/@onix_react/what-to-expect-from-typescript-5-4-2085e355ca46#:~:text=type%20IsArray,%3F%20true%20%3A%20false)[medium.com](https://medium.com/@onix_react/what-to-expect-from-typescript-5-4-2085e355ca46#:~:text=let%20first%3A%20true%20%3D%20x%3B,Error%2C%20but%20previously%20wasn%27t). There are new warnings for probable mistakes (like assigning to a variable inside an `if` condition now gives a warning). TypeScript 5.7 introduced a check for **never-initialized variables** and added path rewriting for relative module imports, which could affect projects relying on older module resolution. Also note that the official TypeScript compiler is being ported to a new engine: a **native Go-based compiler** is planned for TypeScript 7.0 in late 2025, promising \~10× faster type-checking[en.wikipedia.org](https://en.wikipedia.org/wiki/TypeScript#:~:text=On%20March%2011%2C%202025%20Anders,expected%20to%20feature%20a%2010x) (something to watch for future upgrades, though not impacting current code).

* **New Features & Notable Changes:** Recent TypeScript versions brought many quality-of-life improvements:

  * **Improved type inference and narrowing** – e.g. TS 5.4 preserves type narrowing inside closures and introduced `NoInfer<T>` to prevent undesired inference, and TS 5.5 can narrow the types of filtered arrays more precisely, reducing need for type casts[medium.com](https://medium.com/@onix_react/what-to-expect-from-typescript-5-4-2085e355ca46#:~:text=,Upcoming%205.5%20Deprecations)[blog.webdevsimplified.com](https://blog.webdevsimplified.com/2024-07/ts-5.5-changes/#:~:text=4%20New%20TypeScript%205,Checking%20%C2%B7%20New%20Set).

  * **New language features** – support for ECMAScript import attributes (importing JSON and other module types easily)[infoworld.com](https://www.infoworld.com/article/2335018/typescript-53-arrives-with-support-for-import-attributes.html#:~:text=TypeScript%205,environments%2C%20starting%20with%20JSON%20modules), new built-in utility types (`Awaited` became built-in earlier, and 5.4 added `uniqueSymbol` improvements, etc.), and support for upcoming ES2024 methods like `Set.prototype.intersection` and `.difference` (available as of TS 5.5)[dev.to](https://dev.to/enodi/typescript-55-new-features-27ef#:~:text=TypeScript%205,methods%2C%20and%20better%20regular).

  * **Compiler options and tooling** – TS 5.6 added a `--noCheck` compiler option to skip type-checking (useful for build performance in certain cases), and implemented **iterator helpers** (support for upcoming `Iterator.prototype.map`, etc.)[effectivetypescript.com](https://effectivetypescript.com/2024/09/30/ts-56/#:~:text=Notes%20on%20TypeScript%205,package%2C%20this%20will%20be%20familiar). TS 5.8 improved Node ESM/CommonJS interop, so it can now handle hybrid packages more gracefully[infoworld.com](https://www.infoworld.com/article/3836957/typescript-5-8-reaches-general-availability.html#:~:text=Microsoft%20introduces%20more%20granular%20checks,checking%20against%20conditional%20types). There have also been performance optimizations reducing compile times in 5.8[visualstudiomagazine.com](https://visualstudiomagazine.com/Articles/2025/03/04/TypeScript-5-8-Improves-Type-Checking-Conditional-Feature-Delayed-to-5-9.aspx#:~:text=,resulting%20in%20a%20smoother). Keep TypeScript updated to take advantage of these features, but review the changelogs for any tweaks needed (especially if upgrading from much older TS versions).

## **Radix UI Primitives**

* **Breaking Changes / Updates:** Radix Primitives has remained mostly stable; no major breaking API changes have been introduced in the last few months. The library is at v1.x with React 18+ support. One minor breaking tweak: as of Sept 2023 the Select component added a way to reset to placeholder by using an empty string value, which is only breaking if your app used `value=""` for an option[radix-ui.com](https://www.radix-ui.com/primitives/docs/overview/releases#:~:text=Select). Internally, Radix updated its peer deps to suppress React 18/19 warnings (so you should update to the latest Radix versions when using React 19\)[radix-ui.com](https://www.radix-ui.com/primitives/docs/overview/releases#:~:text=February%205%2C%202025).

* **New Features:** In early 2025 Radix introduced a convenient **all-in-one package**: you can now import components from the umbrella `radix-ui` package, which re-exports all primitives in a tree-shakable way[radix-ui.com](https://www.radix-ui.com/primitives/docs/overview/releases#:~:text=January%2022%2C%202025). This can simplify imports and version management. Radix also continues to expand its library: recently added primitives (in preview) include a **PasswordToggleField** component for password visibility toggle and a **OneTimePasswordField (OTP)** input for verification codes[radix-ui.com](https://www.radix-ui.com/primitives/docs/overview/releases#:~:text=April%2017%2C%202025)[radix-ui.com](https://www.radix-ui.com/primitives/docs/overview/releases#:~:text=May%205%2C%202025). These are experimental but can be tried out. Radix Themes (if used) saw a major 3.0 update with new components and a custom color palette generator, but if you’re only using Primitives, just keep an eye on patch updates for small fixes. Overall, Radix is ready for React Server Components usage with no issues reported, and the team is actively releasing minor improvements.

## **pdf-lib (PDF generation)**

* **Breaking Changes:** **No breaking changes** – pdf-lib has not seen a new major release in over 3 years, and the current version (v1.17.1) remains the latest[npmjs.com](https://www.npmjs.com/package/pdf-lib/v/1.0.0?activeTab=versions#:~:text=pdf,in%20your%20project%20by). The API and behavior you’re using in the MVP should remain consistent. There have been no recent updates that deprecate or change functionality, so upgrading isn’t an issue (there haven’t been significant releases to upgrade to).

* **New Features / Advisories:** Because pdf-lib hasn’t been updated in some time, no new features have been added in the last 8 months. All the capabilities for creating and editing PDFs (forms, embedding fonts, etc.) are the same as before. This stability means it’s a reliable choice, but also note that no new optimizations or PDF specification updates have been introduced. Keep an eye on the repository in case a v2 is announced, but as of now the focus should be on using the existing API efficiently. One consideration: ensure memory management when generating very large PDFs (there are known memory usage issues when creating extremely large documents[github.com](https://github.com/Hopding/pdf-lib/issues/197#:~:text=GitHub%20github,save%28%29%20is%20saved), unchanged in recent years). Otherwise, pdf-lib’s functionality for contract generation should continue to work as expected with no surprises.

## **SendGrid (Email Service)**

* **Breaking Changes / Updates:** Twilio SendGrid released **Node.js library v8.0** in Dec 2024, which introduced some breaking changes. Notably, they **upgraded their HTTP client to Axios v1** and raised the minimum supported Node version (dropping support for Node 6/8/12)[github.com](https://github.com/sendgrid/sendgrid-nodejs/releases#:~:text=Release%20Notes). If you update to sendgrid-nodejs 8.x, ensure your runtime is Node 18+ and review the upgrade guide – for example, initialization and method signatures remain mostly the same, but older callback patterns or deprecated helpers may be removed. Additionally, in v8 the client supports new features like specifying **EU data residency**. Version 8.1.0 added the ability to choose the region (US or EU) for email processing[github.com](https://github.com/sendgrid/sendgrid-nodejs/releases#:~:text=Library%20), which is useful if you need to keep data within Europe for compliance. There are no changes to the core email-sending API calls aside from these improvements and the required Node version.

* **New Features & Notices:** A **critical service update:** SendGrid’s **Free Tier is being retired**. Starting **May 27, 2025**, the free Email API and Marketing Campaigns plans will no longer be available[twilio.com](https://www.twilio.com/en-us/changelog/sendgrid-free-plan#:~:text=Twilio%20SendGrid%20will%20be%20retiring,to%20continue%20sending%20email%20and). After a short grace period, any project on the free plan must upgrade to a paid plan to continue sending emails. This is important for launch planning – verify that your SendGrid account is on an appropriate plan to avoid interruption. As for features, SendGrid continues to offer the same email API v3. Recent enhancements include improved suppression management and additional event webhook fields, but no major API version change. Security-wise, ensure you’re using API keys (basic auth is long deprecated) and follow SendGrid’s guidance on verified sender domains. In summary, update the Node SDK if needed, budget for the end of the free tier, and otherwise the service should function as it has, with no new breaking API changes.

## **Sentry (Next.js/JavaScript SDK)**

* **Breaking Changes:** Sentry released a **major update v8** of its Next.js SDK. In Sentry Next.js 8.x, the server-side integration was overhauled to use OpenTelemetry under the hood[docs.sentry.io](https://docs.sentry.io/platforms/javascript/guides/nextjs/migration/v7-to-v8/#:~:text=With%208.x%2C%20,will%20pick%20up%20everything%20automatically). This means if you upgrade from 7.x, you’ll need to adjust your setup: the `withSentryConfig` utility now takes only two arguments (Sentry webpack plugin options and SDK options combined) – the old third argument for Next.js config is removed[docs.sentry.io](https://docs.sentry.io/platforms/javascript/guides/nextjs/migration/v7-to-v8/#:~:text=%2Bmodule.exports%20%3D%20withSentryConfig%28nextConfig%2C%20,). Any `sentry` section you had in `next.config.js` should be migrated into the `withSentryConfig` call. Additionally, Next.js 13+ projects must include a special `instrumentation.ts` file for Sentry to initialize in the App Router environment (Next 15 has this hook built-in, but on Next 13/14 you enable it via an experimental flag)[docs.sentry.io](https://docs.sentry.io/platforms/javascript/guides/nextjs/migration/v7-to-v8/#:~:text=With%20,native%20API%20called%20instrumentation%20hook)[docs.sentry.io](https://docs.sentry.io/platforms/javascript/guides/nextjs/migration/v7-to-v8/#:~:text=module.exports%20%3D%20). These changes are documented in Sentry’s migration guide. Be aware that older Sentry SDK versions (7.26.0 through 7.76.0) had a **security vulnerability** when using the `tunnelRoute` option – a bug that could allow SSRF if an attacker crafted requests to the Sentry proxy endpoint[blog.sentry.io](https://blog.sentry.io/next-js-sdk-security-advisory-cve-2023-46729/#:~:text=We%20released%20a%20critical%20security,SSRF). This was fixed in Sentry 7.77.0[blog.sentry.io](https://blog.sentry.io/next-js-sdk-security-advisory-cve-2023-46729/#:~:text=Versions%207,responses%20back%20to%20a%20user), so make sure you’re on the latest 7.x or have moved to 8.x to include the patch.

* **New Features & Improvements:** With the move to v8, Sentry’s Next.js SDK now **auto-instruments more** out of the box. It leverages OpenTelemetry, so it automatically captures Node.js HTTP/HTTPS calls, `fetch` calls, and even GraphQL resolver performance without manual work[docs.sentry.io](https://docs.sentry.io/platforms/javascript/guides/nextjs/migration/v7-to-v8/#:~:text=With%208.x%2C%20,will%20pick%20up%20everything%20automatically). This provides richer performance data (e.g. tracing external API calls or database queries). Sentry 8 also supports Next.js App Router routing and middleware better – custom API route handlers no longer need wrapping in `withSentry` (the SDK hooks them globally)[github.com](https://github.com/getsentry/sentry-javascript/issues/12865#:~:text=Using%20wrapApiHandlerWithSentry%20after%20upgrading%20to,The%20commit%20we). The new instrumentation file means errors in Server Components or during rendering are properly captured. In terms of features, Sentry has rolled out **Session Replay** and other frontend monitoring enhancements in the last year (these can be integrated by updating the SDK and enabling replay if needed). The SDK also improved how source maps are uploaded in Next.js (make sure to use the latest `@sentry/cli` or Gradle plugin if applicable). Summarily, upgrade to Sentry Next.js 8+ to gain better insight into Next.js 13/14/15 apps – just follow the migration steps (update config usage, add `instrumentation.ts`) and enjoy more automatic error and performance capturing. And of course, keep your SDK up to date for security patches and new features.

## **ElevenLabs (Voice API & Embedding)**

* **Breaking Changes / Updates:** ElevenLabs made some changes to their voice offerings and API in the past months. In July 2024 they updated the set of **default voices** and models. The premade voices were fine-tuned on new models (Turbo v2, Multilingual v2), so some default voices may sound slightly different after that update[reddit.com](https://www.reddit.com/r/ElevenLabs/comments/1e00gbo/important_elevenlabs_default_voices_update_on/#:~:text=The%20existing%20premade%20voices%20will,before%20the%20update%20if%20possible). They also reclassified the voice list: only a core set of voices are shown by default now (Alice, Liam, etc., plus a few new ones), while many older voices were moved to a **“Legacy Voices”** category[reddit.com](https://www.reddit.com/r/ElevenLabs/comments/1e00gbo/important_elevenlabs_default_voices_update_on/#:~:text=ElevenLabs%20will%20now%20start%20referring,the%20following%20voices%20by%20default). Those legacy voices are hidden in the API response unless you explicitly request them – if your code calls the `GET /v1/voices` endpoint, you must now include a parameter (`"show_legacy": true`) to retrieve the full list[reddit.com](https://www.reddit.com/r/ElevenLabs/comments/1e00gbo/important_elevenlabs_default_voices_update_on/#:~:text=Look%20for%20a%20,be%20listed%20in%20the%20response). Importantly, this doesn’t remove any voices; if you were using a specific voice ID, it will still work, but it might not appear in listings by default. No major breaking changes were made to the TTS **synthesis API endpoints** themselves (the HTTP endpoints for generating audio remain the same), but be aware of **rate limits** and required API key scopes if you’re using newer features (ElevenLabs now has distinct tiers for personal vs. enterprise usage with different quotas).

* **New Features & Capabilities:** ElevenLabs has expanded its feature set significantly:

  * **New Voice Models:** They rolled out improved TTS models – e.g. *Eleven Multilingual v2.5*, *Turbo v2.5*, etc. Turbo v2.5 offers high-quality voice generation at lower latency and cost than before[elevenlabs.io](https://elevenlabs.io/docs/models#:~:text=Eleven%20Multilingual%20v2%20Our%20most,lower%20price%20per%20character)[elevenlabs.io](https://elevenlabs.io/docs/models#:~:text=Rich%20emotional%20expression%20Eleven%20Flash,price%20per%20character%20%2034). These models support more languages (30+ languages) and higher character limits per request. You can select models via the API’s `model_id` to balance quality vs. speed.

  * **Voice Design (Beta):** A completely new feature allows you to **generate custom voices from a text prompt**. The **Voice Design** tool (in beta as of Oct 2024\) lets you describe a voice in natural language and have ElevenLabs create a unique voice profile[elevenlabs.io](https://elevenlabs.io/docs/changelog/2024/10/20#:~:text=Product). This could be useful if the project needs a specific style of voice without sourcing a real voice sample. It’s currently available through the website and certain endpoints.

  * **Text Normalization:** The API added an `apply_text_normalization` parameter to automatically normalize input text (e.g. expand abbreviations, correct inconsistencies) before synthesis[elevenlabs.io](https://elevenlabs.io/docs/changelog/2024/10/20#:~:text=API). This can improve pronunciation and is available on most models (except the very fastest ones).

  * **Audio Quality Settings:** A new `quality` parameter was introduced for voice settings, allowing you to control the output quality vs. speed tradeoff in generation[elevenlabs.io](https://elevenlabs.io/docs/changelog#:~:text=Text%20to%20Speech). The API’s voice settings response now indicates if a voice supports adjustable quality (`can_use_quality`). This means you could request lower quality for quicker, cheaper generation or max quality when needed.

  * **Streaming & Integration Features:** ElevenLabs enhanced their **WebSocket API for real-time TTS**. As of Oct 2024, the WebSocket can stream audio with lower latency and a new “auto” mode that flushes audio faster by skipping some buffering (though using partial sentences in this mode can reduce quality)[elevenlabs.io](https://elevenlabs.io/docs/changelog/2024/10/27#:~:text=%2A%20u,latency%20consistency%20for%20all%20models). They also added support for μ-law encoded audio output to integrate with telephony (Twilio) systems[elevenlabs.io](https://elevenlabs.io/docs/changelog/2024/10/27#:~:text=API). If your MVP ever needs to play TTS audio in realtime or phone calls, these updates are beneficial.

  * **SDKs:** ElevenLabs released **official SDKs (v2)** for JavaScript and Python in May 2025[elevenlabs.io](https://elevenlabs.io/docs/changelog#:~:text=SDKs). Instead of manual HTTP calls, you can use their JS SDK which wraps the API – possibly simplifying features like audio streaming and authentication.

* Finally, note that ElevenLabs has been refining their **voice cloning and security policies** – voice cloning now requires opting into certain agreements to prevent misuse, and there are content moderation filters on the API. If your application allows user-generated prompts, ensure you handle cases where ElevenLabs might refuse content or require the `safe_mode` (they have a live moderation system). No specific new limitations were imposed recently beyond these standard content safeguards. In summary, you should update your voice list fetching to include legacy voices if needed, and you can explore new options like custom voice design, improved models, and streaming capabilities to enhance the voice features of the product.

## **Google Calendar Embed (Widget)**

* **Changes in Embed Behavior:** Google rolled out a **new embedded calendar widget** (Material Design update) in late 2024[sites.google.com](https://sites.google.com/site/horstwebdesign/workspace/google-calendar/embed-calendar#:~:text=Compare%20old%20and%20new%20Google,a%20website%20regardless%20of%20responsiveness). If your site embeds a Google Calendar, you’ll notice an updated look and feel: it’s more modern, mobile-responsive, and accessible. However, some features of the old embed are now optional in the new version. In particular, the **calendar list (selection of sub-calendars)** and the scroll buttons may not appear by default. When generating a new embed code from Google Calendar settings, be sure to enable the **“Show calendar list”** option (if you use multiple calendars) and navigation controls as needed. The new embed supports Month, Week, and Agenda views as before, but you should double-check any custom sizing or CSS – the refreshed widget is responsive, which means you might want to remove fixed height/width attributes so it can auto-fit its container[sites.google.com](https://sites.google.com/site/horstwebdesign/workspace/google-calendar/embed-calendar#:~:text=,or%20an%20iframe%20code%20snippet). Some users initially saw issues with embedded calendars losing styling or not scrolling; Google has largely resolved these in updates, but the key is to **re-generate your embed code** from the Google Calendar interface so that you get the latest iframe snippet with all desired options.

* **API Limitations:** There haven’t been new API limitations introduced for calendar embedding – the same requirement holds that the calendar must be **publicly shared** to embed without authentication. One subtle change: the new embed only loads events a few months out by default (for performance). If you have an unusually large number of events, the embed might not show events beyond a certain horizon until the user navigates forward. This is generally not an issue for typical use. Google’s Calendar API (for server-to-server interactions) has not changed in breaking ways recently either, but note that usage of the API requires OAuth now (no simple API keys for private data). For the **embedded widget**, no API key is needed – it’s an iframe – and that continues to work as before. Just ensure your calendar is set to public and use the updated embed snippet. In summary, expect a nicer-looking calendar on your site after the update, verify that all needed controls (date picker, nav buttons, list of calendars) are visible via the embed settings, and enjoy the improved responsiveness on different screen sizes[sites.google.com](https://sites.google.com/site/horstwebdesign/workspace/google-calendar/embed-calendar#:~:text=Google%20Calendars%20Get%20a%20Beautiful,Material%20Design%20Update). No new restrictions have been added, so your existing integration (beyond the visual tweaks) should continue to function smoothly.
