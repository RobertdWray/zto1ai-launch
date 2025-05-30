# ElevenLabs Voice Integration Guide

A comprehensive guide for implementing ElevenLabs voice conversation functionality with React/Next.js, including UI components and transcript extraction for email.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Dependencies](#dependencies)
4. [Environment Variables](#environment-variables)
5. [API Routes](#api-routes)
6. [Core Components](#core-components)
7. [Integration Patterns](#integration-patterns)
8. [Transcript Extraction](#transcript-extraction)
9. [Error Handling](#error-handling)
10. [UI/UX Considerations](#uiux-considerations)
11. [Deployment Notes](#deployment-notes)

## Overview

This implementation provides a complete voice conversation system using ElevenLabs' ConvAI API with:
- Real-time voice conversations
- Automatic transcription
- Modern React UI components
- Transcript processing for email
- Comprehensive error handling
- Mobile-responsive design

## Prerequisites

- ElevenLabs account with ConvAI access
- Next.js 15+ application
- React 19+ with hooks support
- TypeScript configuration

## Dependencies

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@11labs/react": "^0.0.6",
    "@radix-ui/react-dialog": "^1.1.5",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-separator": "^1.1.1",
    "lucide-react": "^0.475.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1"
  }
}
```

Install dependencies:
```bash
npm install @11labs/react @radix-ui/react-dialog @radix-ui/react-scroll-area @radix-ui/react-separator lucide-react class-variance-authority clsx
```

## Environment Variables

Create or update your `.env` file:

```bash
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_AGENT_ID=your_agent_id_here

# Optional: For transcript processing
ANTHROPIC_API_KEY=your_anthropic_key_for_transcript_processing
SENDGRID_API_KEY=your_sendgrid_key_for_emails
SENDGRID_FROM_EMAIL=your_email@domain.com
```

## API Routes

### 1. Signed URL Route

Create `src/app/api/elevenlabs/signed-url/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
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
      throw new Error('Failed to get signed URL');
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}
```

### 2. Optional: Conversation Storage Route

Create `src/app/api/conversation/route.ts` for storing conversations:

```typescript
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { conversationId, transcript, duration, startTime, endTime } = await req.json();

    // Store conversation in your database or memory
    // This is optional - you can handle storage in memory for simple use cases
    
    const conversationData = {
      id: conversationId,
      transcript,
      duration,
      startTime,
      endTime,
      createdAt: new Date().toISOString()
    };

    // For simple in-memory storage, you could use a global Map or array
    // For production, use your preferred database

    return NextResponse.json({ 
      success: true, 
      data: conversationData 
    });
  } catch (error) {
    console.error('Error storing conversation:', error);
    return NextResponse.json(
      { error: 'Failed to store conversation' },
      { status: 500 }
    );
  }
}
```

## Core Components

### 1. Voice Conversation Component

Create `src/components/voice/VoiceConversation.tsx`:

```typescript
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MicIcon, PhoneOffIcon } from 'lucide-react';

interface ConversationMessage {
  source: 'user' | 'ai';
  message: string;
}

interface VoiceConversationProps {
  onTranscriptComplete?: (transcript: string) => void;
  onConversationEnd?: (conversationData: ConversationData) => void;
}

interface ConversationData {
  id: string;
  transcript: string;
  messages: ConversationMessage[];
  duration: number;
  startTime: Date;
  endTime: Date;
}

export function VoiceConversation({ 
  onTranscriptComplete, 
  onConversationEnd 
}: VoiceConversationProps) {
  const [transcription, setTranscription] = useState<ConversationMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to voice conversation');
      setStartTime(new Date());
    },
    onDisconnect: async () => {
      if (conversationId && transcription.length > 0) {
        await handleEndCall();
      }
    },
    onMessage: (message: ConversationMessage) => {
      setTranscription(prev => [...prev, message]);
      console.log('New message:', message);
    },
    onError: (error: Error) => {
      console.error('Voice conversation error:', error);
      alert('Failed to connect to voice service. Please try again.');
    },
  });

  const getSignedUrl = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('/api/elevenlabs/signed-url');
      if (!response.ok) throw new Error('Failed to get signed URL');
      
      const data = await response.json();
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  }, []);

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get signed URL and start conversation
      const signedUrl = await getSignedUrl();
      const id = await conversation.startSession({ signedUrl });
      
      setConversationId(id);
      setStartTime(new Date());
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please check microphone permissions.');
    }
  }, [conversation, getSignedUrl]);

  const handleEndCall = useCallback(async () => {
    if (!conversationId || !startTime) return;

    setIsProcessing(true);
    try {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

      // Format transcript
      const fullTranscript = transcription.map(msg => 
        `${msg.source === 'user' ? 'User' : 'AI'}: ${msg.message}`
      ).join('\n');

      const conversationData: ConversationData = {
        id: conversationId,
        transcript: fullTranscript,
        messages: transcription,
        duration,
        startTime,
        endTime
      };

      // Optional: Store conversation
      try {
        await fetch('/api/conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            transcript: fullTranscript,
            duration,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
          })
        });
      } catch (error) {
        console.warn('Failed to store conversation:', error);
      }

      // Call completion callbacks
      onTranscriptComplete?.(fullTranscript);
      onConversationEnd?.(conversationData);

    } catch (error) {
      console.error('Error ending conversation:', error);
      alert('Failed to process conversation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [conversationId, startTime, transcription, onTranscriptComplete, onConversationEnd]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      await handleEndCall();
    } catch (error) {
      console.error('Error stopping conversation:', error);
    }
  }, [conversation, handleEndCall]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcription]);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-6">
          {/* Status Badges */}
          <div className="flex justify-center gap-2">
            <Badge 
              variant={conversation.status === 'connected' ? 'default' : 'secondary'}
            >
              {conversation.status === 'connected' ? 'Connected' : 'Disconnected'}
            </Badge>
            {conversation.status === 'connected' && (
              <Badge variant="outline">
                {conversation.isSpeaking ? 'AI Speaking' : 'AI Listening'}
              </Badge>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={startConversation}
              disabled={conversation.status === 'connected'}
              variant={conversation.status === 'connected' ? 'outline' : 'default'}
              size="lg"
            >
              <MicIcon className="mr-2 h-5 w-5" />
              Start Conversation
            </Button>
            <Button
              onClick={stopConversation}
              disabled={conversation.status !== 'connected'}
              variant="destructive"
              size="lg"
            >
              <PhoneOffIcon className="mr-2 h-5 w-5" />
              End Conversation
            </Button>
          </div>

          {/* Instructions */}
          {!transcription.length && (
            <div className="text-center text-muted-foreground">
              {conversation.status === 'connected' 
                ? "Start speaking when ready. The AI will respond to you."
                : 'Click "Start Conversation" to begin.'}
            </div>
          )}

          {/* Conversation Transcript */}
          {transcription.length > 0 && (
            <>
              <Separator />
              <ScrollArea className="h-96 rounded-lg border p-4">
                <div className="space-y-4">
                  {transcription.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-2 ${
                        msg.source === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.source === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>

      {/* Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processing Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center">
              Please wait while we process your conversation...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### 2. Integration with Existing Forms

Here's how to integrate the voice component with your existing UI:

```typescript
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PhoneIcon } from 'lucide-react';
import { VoiceConversation } from './VoiceConversation';

interface VoiceIntegrationProps {
  onTranscriptReceived: (transcript: string) => void;
}

export function VoiceIntegration({ onTranscriptReceived }: VoiceIntegrationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTranscriptComplete = (transcript: string) => {
    if (transcript) {
      onTranscriptReceived(transcript);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PhoneIcon className="mr-2 h-4 w-4" />
          Add Voice Input
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Voice Assistant</DialogTitle>
        </DialogHeader>
        <VoiceConversation onTranscriptComplete={handleTranscriptComplete} />
      </DialogContent>
    </Dialog>
  );
}
```

## Integration Patterns

### Basic Integration in a Form

```typescript
'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { VoiceIntegration } from '@/components/voice/VoiceIntegration';

export function MyForm() {
  const [content, setContent] = useState('');

  const handleVoiceTranscript = (transcript: string) => {
    // Append to existing content or replace
    const newContent = content ? `${content}\n\n${transcript}` : transcript;
    setContent(newContent);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your content or use voice input..."
        className="min-h-[200px]"
      />
      
      <VoiceIntegration onTranscriptReceived={handleVoiceTranscript} />
    </div>
  );
}
```

## Transcript Extraction

### 1. Simple In-Memory Storage

For basic transcript extraction without database dependencies:

```typescript
// Simple in-memory conversation store
class ConversationStore {
  private conversations = new Map<string, ConversationData>();

  store(conversationId: string, data: ConversationData) {
    this.conversations.set(conversationId, data);
  }

  get(conversationId: string): ConversationData | undefined {
    return this.conversations.get(conversationId);
  }

  getAll(): ConversationData[] {
    return Array.from(this.conversations.values());
  }

  getTranscript(conversationId: string): string | undefined {
    return this.conversations.get(conversationId)?.transcript;
  }
}

export const conversationStore = new ConversationStore();
```

### 2. Email Integration with SendGrid

Create `src/lib/email.ts`:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface EmailTranscriptData {
  to: string;
  transcript: string;
  conversationId: string;
  duration: number;
  date: Date;
}

export async function sendTranscriptEmail({
  to,
  transcript,
  conversationId,
  duration,
  date
}: EmailTranscriptData) {
  const subject = `Voice Conversation Transcript - ${date.toLocaleDateString()}`;
  
  const html = `
    <h2>Voice Conversation Transcript</h2>
    <p><strong>Date:</strong> ${date.toLocaleString()}</p>
    <p><strong>Duration:</strong> ${Math.round(duration / 60)} minutes</p>
    <p><strong>Conversation ID:</strong> ${conversationId}</p>
    
    <h3>Transcript:</h3>
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-family: monospace;">
${transcript}
    </div>
  `;

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Transcript email sent successfully');
  } catch (error) {
    console.error('Error sending transcript email:', error);
    throw error;
  }
}
```

### 3. API Route for Email Sending

Create `src/app/api/send-transcript/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { sendTranscriptEmail } from '@/lib/email';
import { conversationStore } from '@/lib/conversationStore';

export async function POST(req: Request) {
  try {
    const { conversationId, email } = await req.json();

    if (!conversationId || !email) {
      return NextResponse.json(
        { error: 'Missing conversationId or email' },
        { status: 400 }
      );
    }

    // Get conversation data
    const conversationData = conversationStore.get(conversationId);
    if (!conversationData) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Send email
    await sendTranscriptEmail({
      to: email,
      transcript: conversationData.transcript,
      conversationId,
      duration: conversationData.duration,
      date: conversationData.endTime
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending transcript email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

### 4. Usage Example

```typescript
const handleConversationEnd = async (conversationData: ConversationData) => {
  // Store conversation
  conversationStore.store(conversationData.id, conversationData);

  // Send email with transcript
  try {
    await fetch('/api/send-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: conversationData.id,
        email: 'user@example.com'
      })
    });
    console.log('Transcript email sent');
  } catch (error) {
    console.error('Failed to send transcript email:', error);
  }
};
```

## Error Handling

### Custom Hook for API Calls

Create `src/hooks/useApi.ts`:

```typescript
import { useCallback } from 'react';

export function useApi() {
  const fetchWithErrorHandling = useCallback(async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<{ data: T }> => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, []);

  return { fetchWithErrorHandling };
}
```

## UI/UX Considerations

### 1. Mobile Responsiveness

```css
/* Add to your global CSS or Tailwind config */
@media (max-width: 768px) {
  .voice-conversation-card {
    @apply max-w-full mx-2 p-4;
  }
  
  .voice-conversation-buttons {
    @apply flex-col space-y-2;
  }
  
  .voice-conversation-transcript {
    @apply h-64; /* Smaller height on mobile */
  }
}
```

### 2. Loading States

```typescript
const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'disconnecting'>('idle');

// Update states in conversation hooks
onConnect: () => {
  setConnectionState('connected');
},
onDisconnect: () => {
  setConnectionState('idle');
}
```

### 3. Accessibility

```typescript
// Add ARIA labels and descriptions
<Button
  onClick={startConversation}
  aria-label="Start voice conversation"
  aria-describedby="voice-instructions"
>
  <MicIcon className="mr-2 h-5 w-5" />
  Start Conversation
</Button>

<div id="voice-instructions" className="sr-only">
  Click to start a voice conversation with the AI assistant. 
  You will need to grant microphone permissions.
</div>
```

## Deployment Notes

### 1. Environment Variables in Production

Ensure these environment variables are set in your production environment:

```bash
ELEVENLABS_API_KEY=your_production_key
NEXT_PUBLIC_AGENT_ID=your_production_agent_id
SENDGRID_API_KEY=your_sendgrid_key (if using email)
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

### 2. HTTPS Requirements

ElevenLabs voice requires HTTPS in production. Ensure your deployment supports:
- SSL certificates
- Secure WebSocket connections
- Microphone permissions (requires HTTPS)

### 3. CORS Configuration

If deploying to a different domain, update your Next.js configuration:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/elevenlabs/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

### 4. Rate Limiting

Consider implementing rate limiting for the ElevenLabs API:

```typescript
// Simple rate limiting example
const rateLimiter = new Map();

export async function checkRateLimit(userId: string) {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  
  // Remove requests older than 1 hour
  const validRequests = userRequests.filter((time: number) => now - time < 3600000);
  
  if (validRequests.length >= 10) { // 10 requests per hour
    throw new Error('Rate limit exceeded');
  }
  
  validRequests.push(now);
  rateLimiter.set(userId, validRequests);
}
```

## Testing

### Local Development

1. Set up a development agent in ElevenLabs
2. Use localhost with HTTPS (use ngrok or similar)
3. Test microphone permissions
4. Verify transcript generation

### Testing Script

```typescript
// src/scripts/test-voice.ts
async function testVoiceIntegration() {
  try {
    // Test signed URL generation
    const response = await fetch('/api/elevenlabs/signed-url');
    const { signedUrl } = await response.json();
    console.log('✅ Signed URL generated:', signedUrl);

    // Test conversation storage
    const testConversation = {
      conversationId: 'test-123',
      transcript: 'Test transcript',
      duration: 60,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    };

    const storeResponse = await fetch('/api/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConversation)
    });

    if (storeResponse.ok) {
      console.log('✅ Conversation storage working');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}
```

This guide provides a complete implementation for ElevenLabs voice integration with transcript extraction capabilities. The components are modular and can be easily integrated into existing React/Next.js applications. 