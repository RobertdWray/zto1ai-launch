'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Globe, Mail, Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  pronouns: string;
  bio: string[];
  image?: string;
  linkedin?: string;
  website?: string;
  email?: string;
}

export function TeamShowcase() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const team: TeamMember[] = [
    {
      name: 'Rob Wray',
      role: 'CO-FOUNDER',
      pronouns: 'he/him',
      bio: [
        'Robert is a serial entrepreneur, AI innovator, and healthcare technology pioneer with a track record of building transformative companies where no playbook exists. With over two decades at the intersection of emerging technology and business strategy, he has spearheaded industry-first solutions across healthcare, telematics, e-commerce, and AI.',
        'From launching one of the earliest mobile digital audio communities before the iPhone to pioneering IT solutions for medical practices before digital healthcare was mainstream, Robert has consistently been ahead of the curve. As the founder of Whitebox, he redefined e-commerce logistics and advertising. His teams secured $55M in venture capital and scaled to a 500-person team across multiple states.',
        "Robert's latest venture is an AI rapid prototyping lab developing groundbreaking applications, including a multi-system AI board of directors simulator already facilitating millions in business transactions. In healthcare, he collaborates with Hopkins Ventures and startups like CurieDx to advance smartphone-based diagnostics, driving the future of medical testing. A visionary strategist and builder, Robert continues to push the boundaries of what's possible in AI and emerging tech."
      ],
      image: '/media/rob.png',
    },
    {
      name: 'Ramy Nassar',
      role: 'CO-FOUNDER',
      pronouns: 'he/him',
      bio: [
        'Ramy is the founder of 1000 Days Out and author of the upcoming AI Product Design Handbook. With nearly 25 years experience in technology and as former Head of Innovation for Mattel, he leads presentations and workshops focused on disruption and strategic foresight with organizations around the world.',
        'Ramy has led strategic foresight & planning initiatives with organizations including TD Bank, Rio Tinto, Genome Canada, Interac, Apple, Air Canada, Facebook, New Balance, Telus, CIBC, and the Federal Government of Canada.',
        "Ramy teaches Design Thinking at McMaster University and in the Master's of Engineering, Innovation & Entrepreneurship program at Toronto Metropolitan University. Ramy is an award-winning speaker & facilitator at international events including World Usability Congress, IxDA, FITC, AI Everything, AI Business Summit, and World Mobile Congress. He is fluent in English, French, and German."
      ],
      image: '/media/ramy.png',
    },
    {
      name: 'Vanessa Alvarado',
      role: 'UX/UI DESIGNER',
      pronouns: 'she/her',
      bio: [
        'Vanessa is a creative force in UX/UI design, bringing concepts to life through stunning visual artifacts, interactive prototypes, and strategic design frameworks. With an exceptional ability to translate raw ideas - whether from post-it notes or impromptu brainstorming sessions - into tangible solutions, she plays a key role in shaping user-centered experiences.',
        'Vanessa has collaborated with organizations across various industries to craft intuitive digital products that resonate with users. She thrives in fast-paced environments, balancing creativity with research-driven decision-making. Whether refining wireframes or designing high-fidelity interfaces, Vanessa ensures that every detail serves both form and function.'
      ],
      image: '/media/vanessa.png',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-zto1-blue mb-6">Our Team</h2>
      
      <div className="space-y-6">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-[240px,1fr] gap-6">
                  {/* Photo Section */}
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 flex items-center justify-center">
                    {member.image ? (
                      <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg">
                        <Image
                          src={member.image}
                          alt={`${member.name} headshot`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 192px"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gradient-to-br from-zto1-blue to-zto1-blue-light rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-4xl font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {member.name}
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({member.pronouns})
                        </span>
                      </h3>
                      <p className="text-sm font-semibold text-zto1-blue uppercase tracking-wide">
                        {member.role}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {member.bio.map((paragraph, i) => (
                        <p key={i} className="text-sm text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex gap-3 mt-4">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-zto1-blue transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.website && (
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-zto1-blue transition-colors"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-gray-400 hover:text-zto1-blue transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Next Steps */}
      <Card className="mt-8 bg-gradient-to-r from-zto1-blue to-zto1-blue-light text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Begin Your AI Journey?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our team is excited to partner with the American Board of Dermatology 
            to revolutionize medical training through AI-powered simulations.
          </p>
          <button
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-zto1-blue px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            View Pricing & Next Steps
          </button>
        </CardContent>
      </Card>

      {/* Personal Message from Rob */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-zto1-blue to-zto1-blue-light text-white p-6">
              <h3 className="text-xl font-semibold mb-2">A Personal Message from Our Founder</h3>
              <p className="text-blue-100">
                Rob Wray shares his passion for helping doctors be better doctors
              </p>
            </div>
            
            {/* Video Container with Clean Frame */}
            <div className="p-6 bg-gray-50">
              <div className="max-w-2xl mx-auto">
                {/* Clean Video Container */}
                <div className="relative bg-black rounded-lg shadow-lg overflow-hidden">
                  {!videoLoaded && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zto1-blue mx-auto mb-3"></div>
                        <p className="text-sm text-gray-600">Loading video...</p>
                      </div>
                    </div>
                  )}
                  
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">
                          Video is currently unavailable, please try refreshing.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <video
                    controls
                    preload="metadata"
                    className="w-full aspect-video object-cover"
                    onLoadedData={() => setVideoLoaded(true)}
                    onError={() => setVideoError(true)}
                  >
                    <source src="/media/adbrob.mp4" type="video/mp4" />
                    <source src="/media/adbrob.mov" type="video/quicktime" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                {/* Video Caption */}
                <p className="text-sm text-gray-600 text-center mt-3">
                  Rob Wray, Co-founder • 25+ years in healthcare innovation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 