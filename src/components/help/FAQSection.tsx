import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I top up my wallet?",
    answer: "You can top up your wallet using bank transfer, credit/debit card, or mobile banking. Go to the 'Wallet Top Up' page and follow the instructions."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept payments through bank transfer, credit/debit cards, and mobile banking (coming soon). All transactions are secure and processed instantly."
  },
  {
    question: "How do I view my transaction history?",
    answer: "You can view your transaction history by clicking on the 'Transaction History' option in the sidebar menu. This shows all your past transactions including payments and top-ups."
  },
  {
    question: "What should I do if a payment fails?",
    answer: "If a payment fails, first check your wallet balance and internet connection. If the issue persists, contact our support team with your transaction ID (if available)."
  },
  {
    question: "How secure is my PIN?",
    answer: "Your PIN is encrypted and stored securely. Never share your PIN with anyone. Our system requires PIN verification for all transactions to ensure security."
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
          >
            <span className="font-medium text-[#2C3E50]">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {openIndex === index && (
            <div className="p-4 bg-gray-50 border-t">
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};