'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MicIcon, PhoneOffIcon, UserIcon, Stethoscope } from 'lucide-react';

interface ConversationMessage {
  source: 'user' | 'ai';
  message: string;
}

interface SarahVoiceConversationProps {
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

export function SarahVoiceConversation({ 
  onTranscriptComplete, 
  onConversationEnd 
}: SarahVoiceConversationProps) {
  const [transcription, setTranscription] = useState<ConversationMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to Sarah Chen voice conversation');
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
    onError: (message: string) => {
      console.error('Voice conversation error:', message);
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
        `${msg.source === 'user' ? 'Doctor' : 'Sarah Chen'}: ${msg.message}`
      ).join('\n');

      const conversationData: ConversationData = {
        id: conversationId,
        transcript: fullTranscript,
        messages: transcription,
        duration,
        startTime,
        endTime
      };

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
      <Card className="w-full border-2 border-blue-200 shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Status Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sarah Chen</h3>
                <p className="text-sm text-gray-600">AI Patient Simulation</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge 
                variant={conversation.status === 'connected' ? 'default' : 'secondary'}
                className="bg-green-100 text-green-800 border-green-200"
              >
                {conversation.status === 'connected' ? 'Active Session' : 'Not Connected'}
              </Badge>
              {conversation.status === 'connected' && (
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  {conversation.isSpeaking ? 'Sarah Speaking' : 'Listening'}
                </Badge>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={startConversation}
              disabled={conversation.status === 'connected'}
              variant={conversation.status === 'connected' ? 'outline' : 'default'}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Stethoscope className="mr-2 h-5 w-5" />
              Begin Patient Consultation
            </Button>
            <Button
              onClick={stopConversation}
              disabled={conversation.status !== 'connected'}
              variant="destructive"
              size="lg"
            >
              <PhoneOffIcon className="mr-2 h-5 w-5" />
              End Session
            </Button>
          </div>

          {/* Instructions */}
          {!transcription.length && (
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
              {conversation.status === 'connected' 
                ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900">Session Active</h4>
                    <p className="text-blue-700">
                      Start speaking to Sarah as you would with a real patient. 
                      She will respond naturally based on her medical history and personality.
                    </p>
                  </div>
                )
                : (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Ready to Start</h4>
                    <p className="text-gray-600">
                      Click &quot;Begin Patient Consultation&quot; to start your conversation with Sarah Chen.
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* Conversation Transcript */}
          {transcription.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MicIcon className="w-4 h-4" />
                  Live Conversation Transcript
                </h4>
                <ScrollArea className="h-96 rounded-lg border border-gray-200 p-4 bg-white">
                  <div className="space-y-4">
                    {transcription.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          msg.source === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.source === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {msg.source === 'user' ? (
                              <Stethoscope className="w-3 h-3" />
                            ) : (
                              <UserIcon className="w-3 h-3" />
                            )}
                            <span className="text-xs font-medium">
                              {msg.source === 'user' ? 'Doctor' : 'Sarah Chen'}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
            </>
          )}

          {/* Session Info */}
          {conversation.status === 'connected' && startTime && (
            <div className="text-center text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
              Session started at {startTime.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processing Consultation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center">
              Please wait while we process your consultation with Sarah Chen...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 