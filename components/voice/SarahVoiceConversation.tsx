'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/utils/logger';
import { TrayVerifyError, ErrorType } from '@/lib/errors';
import { useErrorHandling } from '@/lib/hooks/useErrorHandling';
import { addBreadcrumb, LogCategory, startTransaction } from '@/lib/sentry';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MicIcon, PhoneOffIcon, UserIcon, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

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
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationTransaction = useRef<any>(null);
  
  const { withErrorHandling } = useErrorHandling();

  const conversation = useConversation({
    onConnect: () => {
      const connectTime = new Date();
      setStartTime(connectTime);
      
      // Add breadcrumb for successful connection
      addBreadcrumb({
        category: LogCategory.VOICE,
        message: 'Voice conversation connected successfully',
        data: {
          conversationId,
          attempts: connectionAttempts,
          connectTime: connectTime.toISOString(),
        },
        level: 'info'
      });
      
      logger.info('Connected to Sarah Chen voice conversation', {
        conversationId,
        connectionAttempts,
        connectTime: connectTime.toISOString(),
        component: 'SarahVoiceConversation'
      });
      
             // Start performance monitoring transaction
       conversationTransaction.current = startTransaction({
         name: 'Voice Conversation Session',
         op: 'voice.conversation',
         tags: {
           conversationId: conversationId || 'unknown',
           feature: 'sarah-chen-demo'
         }
       });
      
      toast.success('Connected to Sarah Chen');
    },
    
    onDisconnect: async () => {
      addBreadcrumb({
        category: LogCategory.VOICE,
        message: 'Voice conversation disconnected',
        data: {
          conversationId,
          transcriptLength: transcription.length,
          duration: startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0,
        },
        level: 'info'
      });
      
      logger.info('Voice conversation disconnected', {
        conversationId,
        transcriptLength: transcription.length,
        component: 'SarahVoiceConversation'
      });
      
      // End performance transaction
      if (conversationTransaction.current) {
        conversationTransaction.current.setTag('messages_exchanged', transcription.length);
        conversationTransaction.current.finish();
        conversationTransaction.current = null;
      }
      
      if (conversationId && transcription.length > 0) {
        await handleEndCall();
      }
    },
    
    onMessage: (message: ConversationMessage) => {
      setTranscription(prev => [...prev, message]);
      
      addBreadcrumb({
        category: LogCategory.VOICE,
        message: `Voice message received from ${message.source}`,
        data: {
          source: message.source,
          messageLength: message.message.length,
          conversationId,
          totalMessages: transcription.length + 1,
        },
        level: 'info'
      });
      
      logger.debug('Voice message received', {
        source: message.source,
        messageLength: message.message.length,
        conversationId,
        totalMessages: transcription.length + 1,
        component: 'SarahVoiceConversation'
      });
    },
    
    onError: (message: string) => {
      const error = new TrayVerifyError(
        `Voice conversation error: ${message}`,
        ErrorType.AI_PROCESSING,
        {
          conversationId,
          conversationStatus: conversation.status,
          transcriptionLength: transcription.length,
          connectionAttempts,
          errorMessage: message,
        }
      );
      
      addBreadcrumb({
        category: LogCategory.VOICE,
        message: 'Voice conversation error occurred',
        data: {
          errorMessage: message,
          conversationStatus: conversation.status,
          conversationId,
          connectionAttempts,
        },
        level: 'error'
      });
      
      logger.error('Voice conversation error occurred', {
        err: error,
        conversationId,
        conversationStatus: conversation.status,
        connectionAttempts,
        component: 'SarahVoiceConversation'
      });
      
      Sentry.captureException(error, {
        tags: {
          component: 'SarahVoiceConversation',
          feature: 'voice-conversation',
          error_type: 'conversation_error',
          conversation_status: conversation.status,
        },
        extra: {
          errorMessage: message,
          conversationId,
          transcriptionLength: transcription.length,
          connectionAttempts,
        }
      });
      
      // Determine user-friendly error message
      let userMessage = 'Voice service error occurred. Please try again.';
      let shouldRetry = false;
      
      if (message.includes('addAudioBase64Chunk')) {
        userMessage = 'Voice service compatibility issue detected. Please refresh the page and try again.';
      } else if (message.includes('WebSocket') || message.includes('connection')) {
        userMessage = 'Connection to voice service lost. Please check your internet connection and try again.';
        shouldRetry = connectionAttempts < 3;
      } else if (message.includes('Permission denied') || message.includes('NotAllowedError')) {
        userMessage = 'Microphone access denied. Please check your browser permissions and try again.';
      } else if (message.includes('NotFoundError') || message.includes('DevicesNotFoundError')) {
        userMessage = 'No microphone found. Please check your audio devices and try again.';
      }
      
      toast.error(userMessage);
      
      // Offer retry for transient errors
      if (shouldRetry) {
        setTimeout(() => {
          toast.info('Attempting to reconnect...');
          setConnectionAttempts(prev => prev + 1);
        }, 2000);
      }
    },
  });

  const getSignedUrl = withErrorHandling(
    async (): Promise<string> => {
      const response = await fetch('/api/elevenlabs/signed-url');
      if (!response.ok) {
        throw new TrayVerifyError(
          `Failed to get signed URL: ${response.status} ${response.statusText}`,
          ErrorType.API_ERROR,
          {
            status: response.status,
            statusText: response.statusText,
            conversationId,
          }
        );
      }
      
      const data = await response.json();
      
      if (!data.signedUrl) {
        throw new TrayVerifyError(
          'Invalid response from signed URL endpoint',
          ErrorType.API_ERROR,
          { response: data, conversationId }
        );
      }
      
      return data.signedUrl;
    },
    {
      operation: 'getSignedUrl',
      context: { conversationId },
      showToast: false, // We'll handle toast in the calling function
    }
  );

  const startConversation = useCallback(async () => {
    const operation = 'startVoiceConversation';
    
    addBreadcrumb({
      category: LogCategory.UI,
      message: 'User initiated voice conversation',
      level: 'info'
    });
    
    logger.info('Starting voice conversation', {
      operation,
      connectionAttempts,
      component: 'SarahVoiceConversation'
    });

    try {
      // Request microphone permission with detailed error handling
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        addBreadcrumb({
          category: LogCategory.VOICE,
          message: 'Microphone permission granted',
          data: {
            audioTracks: mediaStream.getAudioTracks().length,
          },
          level: 'info'
        });
        
        logger.debug('Microphone permission granted', {
          audioTracks: mediaStream.getAudioTracks().length,
          operation,
          component: 'SarahVoiceConversation'
        });
      } catch (permissionError) {
        throw new TrayVerifyError(
          'Microphone access denied or unavailable',
          ErrorType.UNAUTHORIZED,
          {
            originalError: permissionError instanceof Error ? permissionError.message : String(permissionError),
            userAgent: navigator.userAgent,
          }
        );
      }
      
      // Get signed URL
      const signedUrl = await getSignedUrl();
      
      addBreadcrumb({
        category: LogCategory.VOICE,
        message: 'Starting voice session with signed URL',
        level: 'info'
      });
      
      // Start conversation session
      const id = await conversation.startSession({ signedUrl });
      
      setConversationId(id);
      setStartTime(new Date());
      setConnectionAttempts(prev => prev + 1);
      
      logger.info('Voice conversation started successfully', {
        conversationId: id,
        operation,
        connectionAttempts: connectionAttempts + 1,
        component: 'SarahVoiceConversation'
      });
      
    } catch (error) {
      const appError = error instanceof TrayVerifyError 
        ? error 
        : new TrayVerifyError(
            `Failed to start voice conversation: ${error instanceof Error ? error.message : String(error)}`,
            ErrorType.AI_PROCESSING,
            {
              originalError: error instanceof Error ? error.message : String(error),
              conversationStatus: conversation.status,
              connectionAttempts,
            }
          );
      
      addBreadcrumb({
        category: LogCategory.VOICE,
        message: 'Failed to start voice conversation',
        data: {
          errorType: appError.errorType,
          connectionAttempts,
        },
        level: 'error'
      });
      
      logger.error('Failed to start voice conversation', {
        err: appError,
        operation,
        connectionAttempts,
        component: 'SarahVoiceConversation'
      });
      
      Sentry.captureException(appError, {
        tags: {
          component: 'SarahVoiceConversation',
          action: 'startConversation',
          feature: 'voice-conversation',
          error_type: appError.errorType,
        },
        extra: {
          conversationStatus: conversation.status,
          connectionAttempts,
        }
      });
      
      // User-friendly error messages
      if (appError.errorType === ErrorType.UNAUTHORIZED) {
        toast.error('Microphone access is required. Please check your browser permissions and try again.');
      } else if (appError.errorType === ErrorType.API_ERROR) {
        toast.error('Voice service temporarily unavailable. Please try again later.');
      } else {
        toast.error('Failed to start conversation. Please try again.');
      }
    }
  }, [conversation, getSignedUrl, connectionAttempts]);

  const handleEndCall = withErrorHandling(
    async () => {
      if (!conversationId || !startTime) return;

      setIsProcessing(true);
      
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

      addBreadcrumb({
        category: LogCategory.VOICE,
        message: 'Processing conversation end',
        data: {
          conversationId,
          duration,
          messageCount: transcription.length,
        },
        level: 'info'
      });

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

      logger.info('Voice conversation ended successfully', {
        conversationId,
        duration,
        messageCount: transcription.length,
        transcriptLength: fullTranscript.length,
        component: 'SarahVoiceConversation'
      });

      // Call completion callbacks
      onTranscriptComplete?.(fullTranscript);
      onConversationEnd?.(conversationData);
      
      toast.success(`Conversation completed (${duration}s)`);
    },
    {
      operation: 'handleEndCall',
      context: { conversationId, transcriptionLength: transcription.length },
      onError: () => {
        toast.error('Failed to process conversation. Please try again.');
      },
      finally: () => {
        setIsProcessing(false);
      }
    }
  );

  const stopConversation = withErrorHandling(
    async () => {
      addBreadcrumb({
        category: LogCategory.UI,
        message: 'User stopped voice conversation',
        data: { conversationId },
        level: 'info'
      });
      
      await conversation.endSession();
      await handleEndCall();
    },
    {
      operation: 'stopConversation',
      context: { conversationId },
      showToast: false, // handleEndCall will show success toast
    }
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcription]);

  // Cleanup transaction on unmount
  useEffect(() => {
    return () => {
      if (conversationTransaction.current) {
        conversationTransaction.current.finish();
      }
    };
  }, []);

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
              {connectionAttempts > 0 && (
                <Badge variant="outline" className="border-gray-200 text-gray-600 text-xs">
                  Attempt {connectionAttempts}
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
                    {connectionAttempts > 0 && (
                      <p className="text-sm text-gray-500">
                        Previous attempts: {connectionAttempts}
                      </p>
                    )}
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
                  <Badge variant="outline" className="ml-auto text-xs">
                    {transcription.length} messages
                  </Badge>
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
              {conversationId && (
                <span className="block text-xs mt-1">
                  ID: {conversationId.slice(0, 8)}...
                </span>
              )}
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