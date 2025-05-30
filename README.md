# Launch.zto1ai.com - Interactive Proposal Platform

A secure, password-protected proposal hosting platform for Zero to One AI that transforms static proposals into engaging web experiences.

## Overview

This Next.js 15 application provides an interactive platform for prospective clients to:
- Review AI consulting proposals in an engaging format
- Experience live demos of AI capabilities
- Sign contracts digitally with clickwrap functionality
- Schedule kickoff meetings via integrated calendar booking

## Tech Stack

- **Framework**: Next.js 15.1.8 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **PDF Generation**: pdf-lib
- **Email**: SendGrid
- **Monitoring**: Sentry
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18.18+ 
- npm or yarn
- SendGrid account
- Sentry account (optional for local dev)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd "launches zto1ai"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your actual values.

4. Generate a session secret:
   ```bash
   openssl rand -base64 32
   ```
   Add this to `SESSION_SECRET` in `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── proposal/          # Proposal pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Radix UI components
│   ├── auth/             # Authentication components
│   ├── proposal/         # Proposal display components
│   └── proposals/        # Individual proposal content
├── lib/                   # Utility functions
├── public/               # Static assets
└── docs/                 # Documentation
```

## Features

### Password Protection
- URL parameter support: `?pw=password`
- Session-based authentication with encrypted cookies
- Automatic redirect after successful authentication

### Proposal Display
- Responsive, sectioned layout
- Interactive timeline for project phases
- Embedded demos (ElevenLabs voice agents)
- Team showcase with member profiles
- Smooth scroll navigation

### Contract Signing
- Multi-field form with validation
- Real-time contract preview
- PDF generation with audit trail
- Email delivery via SendGrid

### Post-Contract
- Thank you page with next steps
- Google Calendar booking integration
- Contract download option

## Adding New Proposals

See `docs/launch-zto1ai-implementation-readme.md` for detailed instructions on adding new client proposals.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SESSION_SECRET` | Base64 encoded 32-byte key for session encryption | Yes |
| `PROPOSAL_PASSWORD_ADB` | Password for ADB proposal access | Yes |
| `SENDGRID_API_KEY` | SendGrid API key for email delivery | Yes |
| `SENDGRID_FROM_EMAIL` | Verified sender email address | Yes |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking | No |
| `NEXT_PUBLIC_APP_URL` | Full app URL (for production) | Yes |

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records
3. Set `NEXT_PUBLIC_APP_URL` to production URL

## Security

- Passwords stored as environment variables
- Sessions encrypted with AES-256-GCM
- HTTP-only cookies for session storage
- Rate limiting on password attempts
- All sensitive routes protected by middleware

## Monitoring

Sentry is integrated for:
- Error tracking
- Performance monitoring
- Session replay
- Custom error boundaries

## License

Proprietary - Zero to One AI

## Support

For issues or questions, contact the Zero to One AI development team. 