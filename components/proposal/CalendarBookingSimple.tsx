'use client';

import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, AlertCircle, ExternalLink } from 'lucide-react';

interface CalendarBookingSimpleProps {
  isOpen: boolean;
  onClose: () => void;
  proposalTitle?: string;
}

export function CalendarBookingSimple({ isOpen, onClose, proposalTitle = "Your AI Project" }: CalendarBookingSimpleProps) {
  const calendarUrl = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2D1BjhIsbIe41FjC29-jTg-YzHjDsWBj7a7dC_pJDZfBL6VgoYqZUx2IdpVfE3LLwzpYrLfU8K?gv=true';

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
            {/* Google Calendar Booking */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Choose Your Preferred Time</h3>
                  <p className="text-gray-600 mb-6">
                    Select from available slots in the next 2 weeks
                  </p>
                  
                  {/* Direct Link Button */}
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white bg-zto1-blue hover:bg-zto1-blue-dark rounded-md transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Book your Launch Call
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Note about the booking process */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Booking Process:</p>
                      <ol className="list-decimal list-inside space-y-1 text-blue-800">
                        <li>Click &quot;Book your Launch Call&quot; above</li>
                        <li>Choose your preferred time slot in the Google Calendar interface</li>
                        <li>Enter your contact details</li>
                        <li>You&apos;ll receive a calendar invite via email</li>
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