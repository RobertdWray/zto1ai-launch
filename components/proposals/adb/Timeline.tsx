'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle, FileText, Code, Rocket, GraduationCap, Clock, type LucideIcon } from 'lucide-react';

interface TimelinePhase {
  id: number;
  title: string;
  duration: string;
  icon: LucideIcon;
  description: string;
  deliverables: string[];
  isABDResponsibility?: boolean;
}

export function Timeline() {
  const [activePhase, setActivePhase] = useState(0);

  const phases: TimelinePhase[] = [
    {
      id: 0,
      title: 'Contract Execution',
      duration: 'Day 1',
      icon: FileText,
      description: 'Proposal acceptance and contract signing to initiate the project.',
      deliverables: [
        'Signed contract',
        'Initial payment received',
        'Project kickoff scheduled',
      ],
    },
    {
      id: 1,
      title: 'Materials Collection',
      duration: 'Week 1',
      icon: FileText,
      description: 'ABD provides scoring rubrics and evaluation criteria.',
      deliverables: [
        'Scoring rubric development',
        'Evaluation criteria documentation',
        'Best practice guidelines',
      ],
      isABDResponsibility: true,
    },
    {
      id: 2,
      title: 'Development Phase',
      duration: 'Weeks 2-9',
      icon: Code,
      description: '8-week development period begins after materials receipt.',
      deliverables: [
        'Patient persona development',
        'AI simulation engine creation',
        'Administrative dashboard build',
        'Integration and testing',
      ],
    },
    {
      id: 3,
      title: 'Testing & Deployment',
      duration: 'Week 10',
      icon: Rocket,
      description: 'System testing and live deployment.',
      deliverables: [
        'Complete system testing',
        'Bug fixes and optimization',
        'Production deployment',
        'Performance verification',
      ],
    },
    {
      id: 4,
      title: 'Training Delivery',
      duration: 'Week 11',
      icon: GraduationCap,
      description: 'Live training session and documentation handover.',
      deliverables: [
        'Live administrator training',
        'User training session',
        'Documentation delivery',
        'Recording of training sessions',
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-zto1-blue mb-6">Delivery Timeline</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Timeline Track */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
          
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start mb-8 cursor-pointer group"
              onClick={() => setActivePhase(index)}
            >
              <div className="relative z-10 flex-shrink-0">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center bg-white
                  transition-all duration-200 group-hover:scale-110
                  ${index <= activePhase 
                    ? 'ring-4 ring-blue-600 ring-offset-2' 
                    : 'ring-2 ring-gray-300'
                  }
                `}>
                  {index < activePhase ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : index === activePhase ? (
                    <phase.icon className="w-6 h-6 text-zto1-blue" />
                  ) : (
                    <Circle className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="ml-6">
                <h3 className={`font-bold text-lg ${
                  index <= activePhase ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {phase.title}
                  {phase.isABDResponsibility && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      ABD Responsibility
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3" />
                  {phase.duration}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Phase Details */}
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {React.createElement(phases[activePhase].icon, {
                    className: "w-6 h-6 text-zto1-blue"
                  })}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{phases[activePhase].title}</h3>
                  <p className="text-sm text-gray-600">{phases[activePhase].duration}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{phases[activePhase].description}</p>
              
              <div>
                <h4 className="font-semibold mb-3">Deliverables:</h4>
                <ul className="space-y-2">
                  {phases[activePhase].deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {phases[activePhase].isABDResponsibility && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    <strong>Note:</strong> This phase requires action from ABD. 
                    Development timeline begins after materials are received.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Success Metrics */}
      <Card className="mt-8 bg-gradient-to-r from-green-50 to-white border-green-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 text-green-900">Success Metrics</h3>
          <p className="text-gray-700 mb-4">
            The system will be considered successful when it delivers:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'Two fully functional patient simulation scenarios',
              'Reliable voice interaction capabilities',
              'Accurate transcript generation',
              'AI-powered evaluation and feedback',
              'Administrative dashboard functionality',
              'User training completion',
              '1,000 hours of included simulation capacity',
              'Complete documentation and support',
            ].map((metric, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{metric}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 