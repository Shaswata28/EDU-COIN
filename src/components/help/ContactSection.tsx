import { Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../common/Button';
import { sendMessage } from '../../services/messages';
import { SuccessModal } from '../common/SuccessModal';
import { ErrorModal } from '../common/ErrorModal';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      await sendMessage(formData);
      setShowSuccess(true);
      setFormData({ subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg text-center">
          <Mail className="h-8 w-8 mx-auto mb-4 text-[#2C3E50]" />
          <h3 className="font-semibold mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">24/7 email support</p>
          <a
            href="mailto:support@educoin.com"
            className="text-[#2C3E50] hover:underline"
          >
            support@educoin.com
          </a>
        </div>

        <div className="p-6 border rounded-lg text-center">
          <Phone className="h-8 w-8 mx-auto mb-4 text-[#2C3E50]" />
          <h3 className="font-semibold mb-2">Phone Support</h3>
          <p className="text-gray-600 mb-4">Available 9 AM - 5 PM</p>
          <a
            href="tel:+8801234567890"
            className="text-[#2C3E50] hover:underline"
          >
            +880 1234-567890
          </a>
        </div>
      </div>

      <div className="p-6 border rounded-lg">
        <h3 className="font-semibold mb-4">Send us a message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
              placeholder="Describe your issue..."
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>

      <SuccessModal
        show={showSuccess}
        message="Message sent successfully! We'll get back to you soon."
        onClose={() => setShowSuccess(false)}
      />

      <ErrorModal
        show={showError}
        message={error}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};