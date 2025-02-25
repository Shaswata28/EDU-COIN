import { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';
import { FAQSection } from './FAQSection';
import { ContactSection } from './ContactSection';
import { GuideSection } from './GuideSection';
import { Chatbot } from './Chatbot';

const SECTIONS = ['FAQ', 'User Guide', 'Contact', 'Chat'] as const;
type Section = typeof SECTIONS[number];

export const HelpContent = () => {
  const [activeSection, setActiveSection] = useState<Section>('FAQ');

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="animate-fadeIn bg-white rounded-lg shadow-lg p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-[#2C3E50]" />
          <h2 className="text-xl md:text-2xl font-bold text-[#2C3E50]">Help Center</h2>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 stagger-animate">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors duration-300 hover-lift flex items-center gap-2
                ${activeSection === section
                  ? 'bg-[#2C3E50] text-white'
                  : 'text-[#2C3E50] hover:bg-gray-100'
                }`}
            >
              {section === 'Chat' && <MessageSquare className="h-4 w-4" />}
              <span className="text-sm md:text-base">{section}</span>
            </button>
          ))}
        </div>

        <div className="animate-slideInRight">
          {activeSection === 'FAQ' && <FAQSection />}
          {activeSection === 'User Guide' && <GuideSection />}
          {activeSection === 'Contact' && <ContactSection />}
          {activeSection === 'Chat' && <Chatbot />}
        </div>

        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 hover-lift">
              <Mail className="h-4 w-4" />
              <span>support@educoin.com</span>
            </div>
            <div className="flex items-center gap-2 hover-lift">
              <Phone className="h-4 w-4" />
              <span>+880 1234-567890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};