import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      const errorMsg = 'Missing required environment variables for ElevenLabs';
      
      // Capture configuration error in Sentry
      Sentry.captureMessage(errorMsg, {
        level: 'error',
        tags: {
          api: 'elevenlabs-signed-url',
          issue: 'missing-env-vars',
        },
        contexts: {
          environment: {
            hasAgentId: !!agentId,
            hasApiKey: !!apiKey,
            nodeEnv: process.env.NODE_ENV,
          }
        }
      });
      
      console.error(errorMsg, { hasAgentId: !!agentId, hasApiKey: !!apiKey });
      
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: {
          'xi-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorMsg = `ElevenLabs API returned ${response.status}: ${response.statusText}`;
      
      // Capture API error in Sentry
      Sentry.captureMessage(errorMsg, {
        level: 'error',
        tags: {
          api: 'elevenlabs-signed-url',
          issue: 'api-error',
        },
        contexts: {
          response: {
            status: response.status,
            statusText: response.statusText,
            agentId: agentId,
          }
        }
      });
      
      throw new Error('Failed to get signed URL from ElevenLabs');
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    
    // Capture unexpected errors in Sentry
    Sentry.captureException(error, {
      tags: {
        api: 'elevenlabs-signed-url',
        issue: 'unexpected-error',
      }
    });
    
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}