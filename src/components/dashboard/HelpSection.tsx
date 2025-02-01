import { HelpCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const helpTopics = [
  'How to make a payment?',
  'Top up your wallet',
  'Transaction security',
  'Contact support',
];

export const HelpSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#2C3E50]" />
          <h3 className="text-lg font-semibold text-[#2C3E50]">Quick Help</h3>
        </div>
        <button
          onClick={() => navigate('/help')}
          className="text-sm text-[#2C3E50] hover:underline flex items-center gap-1"
        >
          Help Center <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        {helpTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => navigate('/help')}
            className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-[#2C3E50] transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};