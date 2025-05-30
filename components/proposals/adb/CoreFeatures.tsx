'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Users, 
  Shield, 
  BarChart, 
  Mail, 
  Settings,
  Clock,
  FileText,
  UserCheck,
  Monitor,
  MessageSquare
} from 'lucide-react';

export function CoreFeatures() {
  const featureCategories = [
    {
      title: 'Patient Simulation Engine',
      icon: Brain,
      features: [
        { icon: Users, text: 'Two Distinct Patient Personas with unique medical histories' },
        { icon: FileText, text: 'Comprehensive Knowledge Bases for authentic interactions' },
        { icon: MessageSquare, text: 'Real-time Voice Interaction using advanced AI' },
        { icon: Clock, text: 'Up to 30 minutes per simulation session' },
        { icon: FileText, text: 'Immediate Transcript Generation for review' },
      ],
    },
    {
      title: 'AI-Powered Evaluation System',
      icon: BarChart,
      features: [
        { icon: Brain, text: 'Multiple AI Model Support (Anthropic, Google, OpenAI, etc.)' },
        { icon: Settings, text: 'Customizable Scoring Prompts by administrators' },
        { icon: FileText, text: 'Instant Feedback Reports based on transcripts' },
        { icon: UserCheck, text: 'Best Practice Recommendations for improvement' },
      ],
    },
    {
      title: 'User Management System',
      icon: Shield,
      features: [
        { icon: UserCheck, text: 'Role-Based Access (Administrator and test-taker roles)' },
        { icon: Users, text: 'Up to 30 Concurrent Users supported' },
        { icon: Shield, text: 'Secure Authentication with username/password' },
        { icon: FileText, text: 'Complete Session Logging and usage tracking' },
      ],
    },
    {
      title: 'Administrative Dashboard',
      icon: Monitor,
      features: [
        { icon: Users, text: 'User Management - add, remove, and manage accounts' },
        { icon: BarChart, text: 'View and analyze all completed sessions' },
        { icon: Settings, text: 'AI Model Selection and configuration' },
        { icon: FileText, text: 'Custom Evaluation Criteria setup' },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-zto1-blue mb-6">Core Features</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {featureCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-zto1-blue" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <feature.icon className="w-4 h-4 text-zto1-blue mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-orange-50 to-white border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-zto1-orange" />
              Reporting and Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zto1-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Automated email delivery of session results to participants and administrators
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-zto1-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Complete conversation records with timestamps
                </span>
              </li>
              <li className="flex items-start gap-3">
                <BarChart className="w-4 h-4 text-zto1-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Basic metrics on completion rates and scores
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 