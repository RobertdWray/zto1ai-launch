'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Sparkles, Clock } from 'lucide-react';

export function ExecutiveSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-zto1-blue mb-6">Executive Summary</h2>
      
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <CardContent className="p-8">
          <p className="text-lg leading-relaxed mb-6">
            We propose to develop an <strong>AI-powered patient simulation system</strong> designed 
            to help dermatologists improve their bedside manner and patient interaction skills 
            through realistic voice-based training scenarios.
          </p>
          
          <p className="text-lg leading-relaxed mb-8">
            The system will simulate challenging patient behaviors and provide immediate 
            AI-generated feedback based on established best practices.
          </p>

          {/* Key Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3"
            >
              <Target className="w-5 h-5 text-zto1-blue mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Realistic Simulations</h4>
                <p className="text-sm text-gray-600">
                  Two distinct patient personas with comprehensive medical histories
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3"
            >
              <Sparkles className="w-5 h-5 text-zto1-blue mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">AI-Powered Feedback</h4>
                <p className="text-sm text-gray-600">
                  Instant evaluation using multiple AI models and customizable rubrics
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-3"
            >
              <Clock className="w-5 h-5 text-zto1-blue mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">8-Week Delivery</h4>
                <p className="text-sm text-gray-600">
                  Complete system ready for deployment in just 8 weeks
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-zto1-blue hover:bg-zto1-blue-dark"
              onClick={() => {
                document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Experience the Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Pricing
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 