'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, CheckCircle, Clock, Shield, Database, ArrowRight } from 'lucide-react';

export function Pricing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-zto1-blue mb-6">Pricing & Terms</h2>
      
      {/* Main Pricing Card */}
      <Card className="border-2 border-zto1-blue mb-8">
        <CardHeader className="bg-gradient-to-r from-zto1-blue to-zto1-blue-light text-white">
          <CardTitle className="text-2xl flex items-center justify-between">
            <span>Complete System Investment</span>
            <span className="text-3xl font-bold">$50,000</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* What's Included */}
            <div>
              <h3 className="font-semibold text-lg mb-3">What&apos;s Included:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Two fully developed patient simulation scenarios',
                  '1,000 hours of voice simulation usage',
                  'AI-powered evaluation system',
                  'Administrative dashboard',
                  'User management for up to 30 concurrent users',
                  'Live training session',
                  'Complete documentation',
                  'First year technical support',
                  'Email report generation',
                  'Session transcript storage',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Usage */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-zto1-blue" />
                Additional Usage
              </h4>
              <p className="text-sm text-gray-700">
                After the included 1,000 hours: <strong>$0.10 per minute</strong>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                (Average session: 15-20 minutes)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HIPAA Compliance Notice */}
      <Card className="border-amber-300 bg-amber-50 mb-8">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Important: HIPAA Compliance Notice</h3>
              <p className="text-sm text-amber-800">
                <strong>NOT HIPAA compliant</strong> - The base system should not be used with actual patient data. 
                HIPAA compliance is available as an add-on option (see Optional Features below).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Warranty & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-zto1-blue" />
              Warranty & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-sm">System Guarantee</p>
              <p className="text-sm text-gray-600">
                Guaranteed to function as specified for 1 year from delivery
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Ongoing Maintenance</p>
              <p className="text-sm text-gray-600">
                After year one, system will likely require ongoing maintenance (separate agreement)
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Technical Support</p>
              <p className="text-sm text-gray-600">
                Included for first year to ensure proper system operation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Database className="w-5 h-5 text-zto1-blue" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-sm">Flexible Policy</p>
              <p className="text-sm text-gray-600">
                Data retention periods to be defined by ABD requirements
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Administrative Control</p>
              <p className="text-sm text-gray-600">
                ABD maintains control over data retention settings
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Secure Storage</p>
              <p className="text-sm text-gray-600">
                All data stored securely in cloud infrastructure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optional Features */}
      <Card className="border-gray-200 bg-gray-50 mb-8">
        <CardHeader>
          <CardTitle className="text-gray-900">Optional Features (Additional Cost)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">HIPAA Compliance Package</h4>
            <p className="text-sm text-gray-700">
              Full HIPAA compliance implementation including Business Associate Agreement (BAA), encrypted data storage, audit logs, and compliance reporting for handling protected health information (PHI)
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Session Recording Playback</h4>
            <p className="text-sm text-gray-700">
              Allow doctors to review their voice interactions alongside transcripts for enhanced learning through self-reflection
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Peer Comparison Analytics</h4>
            <p className="text-sm text-gray-700">
              Anonymous benchmarking against other participants&apos; performance with aggregate insights
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button
          size="lg"
          className="bg-zto1-blue hover:bg-zto1-blue-dark"
          onClick={() => {
            window.location.href = '/proposal/adb/contract';
          }}
        >
          Ready to Launch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-sm text-gray-600 mt-4">
          Click above to review and sign the contract
        </p>
      </div>
    </motion.div>
  );
} 