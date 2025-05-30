'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface ProposalLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function ProposalLayout({ title, subtitle, children }: ProposalLayoutProps) {
  const params = useParams();
  const proposalId = params?.proposalId as string;
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-zto1-blue to-zto1-blue-light text-white">
        <div className="container-custom section-padding py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Logos Section */}
            <div className="mb-8 flex justify-center items-center gap-6">
              {/* Zero to One AI Logo */}
              <Image
                src="/media/logo.png"
                alt="Zero to One AI"
                width={180}
                height={60}
                className="h-12 w-auto brightness-0 invert"
                priority
              />
              
              {/* Client Logo for ADB */}
              {proposalId === 'adb' && (
                <>
                  <span className="text-white/60 text-2xl">×</span>
                  <Image
                    src="/media/adbmed.png"
                    alt="American Board of Dermatology"
                    width={180}
                    height={60}
                    className="h-12 w-auto brightness-0 invert"
                    priority
                  />
                </>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl md:text-2xl opacity-90">{subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      {children}
    </>
  );
} 