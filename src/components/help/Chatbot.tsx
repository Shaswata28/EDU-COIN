import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { Button } from '../common/Button';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
}

const predefinedResponses = {
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    response: "Hello! 👋 I'm your EDU COIN assistant. How can I help you today? You can ask me about:\n- Making payments\n- Wallet top-up\n- PIN security\n- Transactions\n- General security"
  },
  payment: {
    keywords: ['payment', 'pay', 'purchase', 'buy'],
    response: "To make a payment:\n1. Click on 'Make Payment' in the sidebar\n2. Select the payment category\n3. Enter the amount and description\n4. Verify with your PIN"
  },
  wallet: {
    keywords: ['wallet', 'balance', 'top up', 'topup', 'add money'],
    response: "To top up your wallet:\n1. Click on 'Wallet Top Up' in the sidebar\n2. Enter the amount (minimum 100 Taka)\n3. Choose your payment method (Bank/Card)"
  },
  pin: {
    keywords: ['pin', 'forgot pin', 'reset pin', 'change pin'],
    response: "For PIN-related issues:\n1. If you forgot your PIN, contact support\n2. Never share your PIN with anyone\n3. PINs must be exactly 5 digits"
  },
  security: {
    keywords: ['security', 'secure', 'safety', 'protect'],
    response: "Security tips:\n1. Never share your PIN or password\n2. Regularly check your transaction history\n3. Use a strong password\n4. Log out when using shared devices"
  },
  transaction: {
    keywords: ['transaction', 'history', 'record', 'payment history'],
    response: "To view your transactions:\n1. Click 'Transaction History' in the sidebar\n2. You'll see all your past payments and top-ups\n3. Use filters to find specific transactions"
  }
};

const findResponse = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();
  
  for (const category of Object.values(predefinedResponses)) {
    if (category.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return category.response;
    }
  }
  
  return "I'm not sure about that. Please try asking about payments, wallet top-up, PIN, security, or transaction history. You can also contact support for more specific help.";
};

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue.trim()
    };

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      text: findResponse(inputValue)
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[400px] md:h-[600px] flex flex-col w-full max-w-full md:max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-[#2C3E50] text-white p-3 md:p-4 flex items-center gap-2">
        <Bot className="h-4 w-4 md:h-5 md:w-5" />
        <span className="font-medium text-sm md:text-base">EDU COIN Assistant</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 p-2 md:p-3 rounded-lg rounded-bl-none max-w-[85%] md:max-w-[80%]">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="h-4 w-4" />
              <span className="text-xs md:text-sm font-medium">Assistant</span>
            </div>
            <p className="text-sm md:text-base">Hello! How can I help you today? You can ask me about payments, wallet top-up, security, or any other EDU COIN related questions.</p>
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-[#2C3E50] text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.type === 'bot' ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="text-xs md:text-sm font-medium">
                  {message.type === 'user' ? 'You' : 'Assistant'}
                </span>
              </div>
              <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex items-center gap-2 px-3 md:px-4 py-2"
          >
            <Send className="h-4 w-4" />
            <span className="hidden md:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};