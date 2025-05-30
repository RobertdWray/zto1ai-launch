'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Users, MessageSquare, BarChart3 } from 'lucide-react';

export function SystemOverview() {
  const features = [
    {
      icon: Globe,
      title: 'Web-Based Platform',
      description: 'Accessible from any modern browser, no installation required',
    },
    {
      icon: MessageSquare,
      title: 'Voice Conversations',
      description: 'Natural voice interactions with AI-simulated patients',
    },
    {
      icon: Users,
      title: 'Realistic Personas',
      description: 'Detailed patient profiles with comprehensive medical histories',
    },
    {
      icon: BarChart3,
      title: 'Instant Feedback',
      description: 'AI-powered evaluation and improvement recommendations',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-zto1-blue mb-6">System Overview</h2>
      
      <div className="prose prose-lg max-w-none mb-8">
        <p>
          The Patient Simulation Training System is a web-based platform that allows 
          dermatologists to practice patient interactions through realistic voice 
          conversations with AI-simulated patients. Each simulated patient has a 
          detailed medical history, personality profile, and comprehensive knowledge 
          base about their condition, creating authentic and challenging training scenarios.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <feature.icon className="w-6 h-6 text-zto1-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 