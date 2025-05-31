'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExecutiveSummary } from './ExecutiveSummary';
import { SystemOverview } from './SystemOverview';
import { CoreFeatures } from './CoreFeatures';
import { TechnicalSpecs } from './TechnicalSpecs';
import { Pricing } from './Pricing';
import { TeamShowcase } from './TeamShowcase';
import { SarahChenDemo } from './SarahChenDemo';
import { Timeline } from './Timeline';
import { SectionNav } from '@/components/proposal/SectionNav';
import { ProposalLayout } from '@/components/proposal/ProposalLayout';
import { FloatingCTA } from '@/components/proposal/FloatingCTA';
import { CalendarBookingSimple } from '@/components/proposal/CalendarBookingSimple';

const sections = [
  { id: 'summary', title: 'Executive Summary' },
  { id: 'overview', title: 'System Overview' },
  { id: 'features', title: 'Core Features' },
  { id: 'technical', title: 'Technical Specifications' },
  { id: 'demo', title: 'Experience Sarah Chen' },
  { id: 'pricing', title: 'Pricing & Terms' },
  { id: 'timeline', title: 'Delivery Timeline' },
  { id: 'team', title: 'Our Team' },
];

export default function ADBProposal() {
  const [activeSection, setActiveSection] = useState('summary');
  const [showCalendarBooking, setShowCalendarBooking] = useState(false);
  const router = useRouter();

  const handleBookCall = () => {
    setShowCalendarBooking(true);
  };

  const handleLaunchProject = () => {
    // Navigate to contract/agreement page
    router.push('/proposal/adb/contract');
  };

  const handleCloseCalendar = () => {
    setShowCalendarBooking(false);
  };

  return (
    <ProposalLayout
      title="American Board of Dermatology"
      subtitle="Patient Simulation Training System Proposal"
    >
      {/* Section Navigation */}
      <SectionNav 
        sections={sections} 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Proposal Content */}
      <div className="container-custom section-padding py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Executive Summary */}
          <section id="summary">
            <ExecutiveSummary />
          </section>

          {/* System Overview */}
          <section id="overview">
            <SystemOverview />
          </section>

          {/* Core Features */}
          <section id="features">
            <CoreFeatures />
          </section>

          {/* Technical Specifications */}
          <section id="technical">
            <TechnicalSpecs />
          </section>

          {/* Sarah Chen Demo */}
          <section id="demo">
            <SarahChenDemo />
          </section>

          {/* Pricing & Terms */}
          <section id="pricing">
            <Pricing />
          </section>

          {/* Delivery Timeline */}
          <section id="timeline">
            <Timeline />
          </section>

          {/* Our Team */}
          <section id="team">
            <TeamShowcase />
          </section>
        </div>
      </div>

      {/* Floating Call-to-Action */}
      <FloatingCTA
        onBookCall={handleBookCall}
        onLaunchProject={handleLaunchProject}
      />

      {/* Calendar Booking Modal */}
      <CalendarBookingSimple
        isOpen={showCalendarBooking}
        onClose={handleCloseCalendar}
        proposalTitle="AI Patient Simulation System"
      />
    </ProposalLayout>
  );
} 