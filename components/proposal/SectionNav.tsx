'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
}

interface SectionNavProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function SectionNav({ sections, activeSection, onSectionChange }: SectionNavProps) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for fixed header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          onSectionChange(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, onSectionChange]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Account for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = section.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="sticky top-16 z-40 bg-white border-b border-gray-200">
      <div className="container-custom section-padding">
        <div className="flex overflow-x-auto scrollbar-hide py-4 gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "whitespace-nowrap text-sm font-medium transition-colors pb-2 border-b-2",
                activeSection === section.id
                  ? "text-zto1-blue border-zto1-blue"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              )}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
} 