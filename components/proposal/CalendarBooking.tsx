'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Video, X, CheckCircle } from 'lucide-react';

interface CalendarBookingProps {
  isOpen: boolean;
  onClose: () => void;
  proposalTitle?: string;
}

export function CalendarBooking({ isOpen, onClose, proposalTitle = "Your AI Project" }: CalendarBookingProps) {
  const [isBooked, setIsBooked] = useState(false);

  const handleBookCall = () => {
    // In production, this would integrate with actual calendar API
    setIsBooked(true);
    
    // Auto-close after showing success
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <AnimatePresence mode="wait">
          {!isBooked ? (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                {/* Call Details */}
                <Card className="mb-6 border-zto1-blue/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-3 text-zto1-blue">What to Expect</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-zto1-blue mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">30-Minute Deep Dive</p>
                          <p className="text-sm text-gray-600">Comprehensive review of your project requirements and timeline</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Video className="w-5 h-5 text-zto1-blue mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Video Consultation</p>
                          <p className="text-sm text-gray-600">Interactive session with our technical team and project lead</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-zto1-blue mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Custom Recommendations</p>
                          <p className="text-sm text-gray-600">Tailored insights and next steps specific to your organization</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Calendar Embed Placeholder */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-zto1-blue mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Choose Your Preferred Time</h3>
                      <p className="text-gray-600 mb-6">
                        Select from available slots in the next 2 weeks
                      </p>
                      
                      {/* Simulated Calendar Widget */}
                      <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-200">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['Tomorrow 2:00 PM', 'Wed 10:00 AM', 'Wed 3:00 PM', 'Thu 11:00 AM', 'Fri 9:00 AM', 'Fri 2:00 PM'].map((time, index) => (
                              <Button
                                key={time}
                                variant="outline"
                                className="text-sm hover:bg-zto1-blue hover:text-white"
                                onClick={handleBookCall}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-4">
                            Times shown in your local timezone
                          </p>
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
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="text-center p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Call Scheduled!</h3>
              <p className="text-gray-600 mb-4">
                You&apos;ll receive a calendar invitation and Zoom link within 5 minutes.
              </p>
              <p className="text-sm text-gray-500">
                We&apos;re excited to discuss how AI can transform your organization.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 