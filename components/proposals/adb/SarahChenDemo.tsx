'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Headphones, Wifi, AlertTriangle, Play, FileText } from 'lucide-react';
import { SarahVoiceConversation } from '@/components/voice/SarahVoiceConversation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      }, HTMLElement>;
    }
  }
}

export function SarahChenDemo() {
  const [showWarning, setShowWarning] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [conversationTranscript, setConversationTranscript] = useState<string>('');
  
  const handleStartDemo = () => {
    setShowWarning(false);
    setDemoStarted(true);
  };
  
  const handleTranscriptComplete = (transcript: string) => {
    setConversationTranscript(transcript);
    console.log('Conversation completed with transcript:', transcript);
  };
  
  const handleConversationEnd = (conversationData: any) => {
    console.log('Conversation ended:', conversationData);
    // Here you could send the conversation data to your API for analysis
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-zto1-blue mb-6">AI Patient Simulation Demo</h2>
      
      <Card className="overflow-hidden border-2 border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
          <CardTitle className="flex items-center gap-3">
            <Play className="w-5 h-5 text-orange-600" />
            Live Demonstration: Doctor-AI Patient Interaction
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-base mb-2 text-amber-900">
                What You&apos;ll Experience
              </h4>
              <p className="text-sm text-amber-800 mb-3">
                This is a live demonstration of how dermatologists will interact with AI-powered patient simulations 
                in the training system. You&apos;ll play the role of a doctor speaking with Sarah Chen, 
                an AI patient with moderate to severe plaque psoriasis.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Mic className="w-4 h-4 text-zto1-blue" />
                About Sarah Chen (AI Patient)
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 32-year-old marketing manager with psoriasis concerns</li>
                <li>• High-achieving perfectionist who often deflects health concerns</li>
                <li>• Inconsistent medication adherence and skepticism about treatments</li>
                <li>• Responds naturally to your questions and bedside manner</li>
              </ul>
            </div>
          </div>
          
          {/* Demo Container */}
          {!demoStarted ? (
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-zto1-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Headphones className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Try the Demo?</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Click below to start interacting with Sarah Chen and experience 
                    how our AI patient simulations work.
                  </p>
                </div>
                <Button
                  onClick={() => setShowWarning(true)}
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Start Demo Experience
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <SarahVoiceConversation 
                onTranscriptComplete={handleTranscriptComplete}
                onConversationEnd={handleConversationEnd}
              />
            </div>
          )}
          
          {demoStarted && (
            <div className="mt-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Speak naturally as you would with a real patient. The AI will respond based on 
                Sarah&apos;s personality and medical history.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Conversation Starters */}
      {demoStarted && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Doctor Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Try these conversation starters to see how Sarah responds:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Opening Question:</p>
                <p className="text-sm text-gray-700 italic">
                  &quot;Hi Sarah, how have you been doing with the treatments we discussed last time?&quot;
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Explore Concerns:</p>
                <p className="text-sm text-gray-700 italic">
                  &quot;What are your biggest concerns about starting a biologic medication?&quot;
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Address Adherence:</p>
                <p className="text-sm text-gray-700 italic">
                  &quot;I noticed you mentioned having trouble with the daily creams. Can you tell me more?&quot;
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Discuss Lifestyle:</p>
                <p className="text-sm text-gray-700 italic">
                  &quot;How is your psoriasis affecting your work and daily activities?&quot;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation Transcript Display */}
      {conversationTranscript && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Session Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {conversationTranscript}
              </pre>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This transcript would typically be analyzed by AI to provide feedback on communication effectiveness.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Warning Dialog */}
      <AlertDialog open={showWarning && !demoStarted} onOpenChange={setShowWarning}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-gray-900">
              <Headphones className="w-5 h-5 text-orange-600" />
              Demo Requirements
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          {/* Custom description div instead of AlertDialogDescription to avoid p tag issues */}
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-3 text-gray-800">For the best experience, please ensure you have:</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-blue-50 rounded">
                    <Headphones className="w-4 h-4 text-zto1-blue flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Headphones or earbuds</span>
                    <span className="text-gray-600 block text-sm mt-0.5">Required for clear audio and to prevent echo</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-blue-50 rounded">
                    <Wifi className="w-4 h-4 text-zto1-blue flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Stable internet connection</span>
                    <span className="text-gray-600 block text-sm mt-0.5">For real-time AI responses</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-blue-50 rounded">
                    <Mic className="w-4 h-4 text-zto1-blue flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Microphone access</span>
                    <span className="text-gray-600 block text-sm mt-0.5">You&apos;ll need to allow microphone permissions</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                This demo simulates a real doctor-patient interaction. 
                Speak naturally as you would in a clinical setting.
              </p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStartDemo}
              className="bg-orange-600 hover:bg-orange-700 text-white border-0"
            >
              I&apos;m Ready - Start Demo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
} 