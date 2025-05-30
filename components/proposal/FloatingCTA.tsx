'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Calendar, Rocket } from 'lucide-react';

interface FloatingCTAProps {
  onBookCall: () => void;
  onLaunchProject: () => void;
  show?: boolean;
}

export function FloatingCTA({ onBookCall, onLaunchProject, show = true }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      
      // Show CTA after user has scrolled 30% through the page
      if (progress > 0.3 && !isDismissed && show) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed, show]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 relative">
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={onLaunchProject}
                size="sm"
                className="bg-zto1-blue hover:bg-zto1-blue-dark text-white"
              >
                <Rocket className="w-4 h-4 mr-1" />
                Launch Project
              </Button>
              
              <Button
                onClick={onBookCall}
                size="sm"
                variant="outline"
                className="border-zto1-blue text-zto1-blue hover:bg-zto1-blue hover:text-white"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Book Call
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 