'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, AlertCircle, Loader2 } from 'lucide-react';

interface CalendarBookingProps {
  isOpen: boolean;
  onClose: () => void;
  proposalTitle?: string;
}

export function CalendarBooking({ isOpen, onClose, proposalTitle = "Your AI Project" }: CalendarBookingProps) {
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    if (isOpen && calendarContainerRef.current) {
      setIsLoading(true);
      setScriptError(false);
      // Clear any existing content
      calendarContainerRef.current.innerHTML = '';
      
      // Add the Google Calendar styles
      const linkElement = document.createElement('link');
      linkElement.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);

      // Create a target div for the calendar button
      const targetDiv = document.createElement('div');
      targetDiv.className = 'google-calendar-container';
      calendarContainerRef.current.appendChild(targetDiv);

      // Load the Google Calendar script
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
      scriptElement.async = true;
      
      scriptElement.onload = () => {
        console.log('Google Calendar script loaded');
        // Add a small delay to ensure the script is fully initialized
        setTimeout(() => {
          // Initialize the calendar button after script loads
          if (window.calendar && window.calendar.schedulingButton) {
            console.log('Initializing calendar button');
            window.calendar.schedulingButton.load({
              url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2D1BjhIsbIe41FjC29-jTg-YzHjDsWBj7a7dC_pJDZfBL6VgoYqZUx2IdpVfE3LLwzpYrLfU8K?gv=true',
              color: '#039BE5',
              label: 'Book your Launch Call',
              target: targetDiv,
            });
            setIsLoading(false);
          } else {
            console.error('Google Calendar API not available');
            setIsLoading(false);
            setScriptError(true);
          }
        }, 100);
      };
      
      scriptElement.onerror = () => {
        console.error('Failed to load Google Calendar script');
        setIsLoading(false);
        setScriptError(true);
      };

      document.body.appendChild(scriptElement);

      // Cleanup function
      return () => {
        // Remove the script when component unmounts or dialog closes
        if (scriptElement.parentNode) {
          scriptElement.parentNode.removeChild(scriptElement);
        }
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-zto1-blue to-zto1-blue-light text-white p-6 pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Book Your Strategy Call
            </DialogTitle>
            <p className="text-blue-100 mt-2">
              Let&apos;s discuss {proposalTitle} and answer any questions you have
            </p>
          </DialogHeader>

          <div className="p-6">
            {/* Google Calendar Embed */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="font-semibold mb-2">Choose Your Preferred Time</h3>
                  <p className="text-gray-600 mb-6">
                    Select from available slots in the next 2 weeks
                  </p>
                </div>
                
                {/* Google Calendar Widget Container */}
                <div className="relative min-h-[100px]">
                  {isLoading && !scriptError && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <Loader2 className="w-8 h-8 text-zto1-blue animate-spin" />
                    </div>
                  )}
                  {scriptError ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Unable to load the booking widget. Please click the link below to schedule your call:
                      </p>
                      <a
                        href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2D1BjhIsbIe41FjC29-jTg-YzHjDsWBj7a7dC_pJDZfBL6VgoYqZUx2IdpVfE3LLwzpYrLfU8K?gv=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 text-white bg-zto1-blue hover:bg-zto1-blue-dark rounded-md transition-colors"
                      >
                        Book your Launch Call
                      </a>
                    </div>
                  ) : (
                    <div 
                      ref={calendarContainerRef}
                      className="flex justify-center items-center min-h-[100px]"
                    >
                      {/* Google Calendar button will be injected here */}
                    </div>
                  )}
                </div>

                {/* Note about the booking process */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Booking Process:</p>
                      <ol className="list-decimal list-inside space-y-1 text-blue-800">
                        <li>Click "Book your Launch Call" above</li>
                        <li>Choose your preferred time slot</li>
                        <li>Enter your contact details</li>
                        <li>You'll receive a calendar invite via email</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Elements */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                🔒 This call is completely confidential and obligation-free
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                <span>✓ HIPAA Compliant</span>
                <span>✓ No Sales Pressure</span>
                <span>✓ Expert Guidance</span>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Add TypeScript declaration for the Google Calendar API
declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
} 