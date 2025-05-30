#!/bin/bash

# This script sets up all production environment variables in Vercel
# Run this after linking your project with 'vercel link'

echo "Setting up Vercel production environment variables..."

# Authentication
echo "ZU5EfQIyVkk19wEZSkVsQbxRTIqNIxec/9Sg4LsIACk=" | vercel env add SESSION_SECRET production --force
echo "ADB2024LaunchAI" | vercel env add PROPOSAL_PASSWORD_ADB production --force

# SendGrid
echo "YOUR_SENDGRID_API_KEY_HERE" | vercel env add SENDGRID_API_KEY production --force
echo "team@zto1ai.com" | vercel env add SENDGRID_FROM_EMAIL production --force

# Sentry
echo "https://a679b1eaeb2303abaeeac2689d968fbf@o4508092137865216.ingest.us.sentry.io/4509411881844736" | vercel env add NEXT_PUBLIC_SENTRY_DSN production --force
echo "zero-to-one-ai" | vercel env add SENTRY_ORG production --force
echo "launch-zto1ai" | vercel env add SENTRY_PROJECT production --force

# App URLs
echo "https://launch.zto1ai.com" | vercel env add NEXT_PUBLIC_APP_URL production --force

echo "✅ All environment variables have been set up successfully!"
echo ""
echo "Note: You'll need to manually add SENTRY_AUTH_TOKEN if needed for source map uploads"
echo ""
echo "To deploy to production, run: vercel --prod" 