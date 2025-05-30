'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Monitor, 
  Wifi, 
  Headphones, 
  PlayCircle,
  Cloud,
  Users,
  Shield,
  AlertTriangle
} from 'lucide-react';

export function TechnicalSpecs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-zto1-blue mb-6">Technical Specifications</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* System Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-zto1-blue" />
              System Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Monitor className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Web-based Platform</p>
                <p className="text-sm text-gray-600">Accessible via any modern web browser</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wifi className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Internet Connection</p>
                <p className="text-sm text-gray-600">Reliable broadband connection required</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Headphones className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Audio Equipment</p>
                <p className="text-sm text-gray-600">Earbuds or headset recommended for optimal experience</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PlayCircle className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Session Completion</p>
                <p className="text-sm text-gray-600">Must be completed in one sitting (no pause/resume)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hosting & Infrastructure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-zto1-blue" />
              Hosting & Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Cloud className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Cloud-based Hosting</p>
                <p className="text-sm text-gray-600">Deployed on modern cloud infrastructure</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Scalability</p>
                <p className="text-sm text-gray-600">Designed for up to 30 concurrent users</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Security</p>
                <p className="text-sm text-gray-600">Modern security procedures implemented</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Limitations */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-amber-900">
            <AlertTriangle className="w-5 h-5" />
            System Limitations and Disclaimers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Technical Dependencies</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• System functionality depends on third-party AI services (ElevenLabs, Anthropic, OpenAI, etc.)</li>
              <li>• 99%+ uptime expected but cannot guarantee availability during vendor outages</li>
              <li>• Requires stable internet connection for all functionality</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2">Security and Compliance</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• System designed for specified metrics only; not suitable for large-scale enterprise deployment</li>
              <li>• Modern security practices implemented but system has not undergone penetration testing</li>
              <li>• <strong className="text-red-600">NOT HIPAA compliant</strong> - should not be used with actual patient data (HIPAA compliance available as an add-on)</li>
              <li>• All interactions are simulated; no real patient information should be entered</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2">Operational Constraints</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• 30-minute maximum per simulation due to technical constraints</li>
              <li>• Sessions must be completed without interruption</li>
              <li>• Maximum 30 concurrent users supported</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 