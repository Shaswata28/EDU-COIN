import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "../common/Button";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
}

const predefinedResponses = {
  greeting: {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
    response: "Hey there! 👋 I'm your friendly EDU COIN assistant. Need help with anything today? I can guide you through:\n• Making payments\n• Topping up your wallet\n• Managing your PIN\n• Checking transactions\n• Staying secure",
  },
  payment: {
    keywords: ["payment", "pay", "purchase", "buy"],
    response: "Ready to make a payment? 💸 Here's how you do it:\n1. Click on 'Make Payment' from the sidebar\n2. Pick what you're paying for\n3. Enter the amount and a short note\n4. Confirm it with your PIN – and you're done!",
  },
  wallet: {
    keywords: ["wallet", "balance", "top up", "topup", "add money"],
    response: "Need to add funds to your wallet? 💰 Super easy!\n1. Head over to 'Wallet Top Up'\n2. Enter the amount (minimum 100 Taka)\n3. Choose how you want to pay (Bank/Card)\nAnd just like that, your balance will be updated!",
  },
  pin: {
    keywords: ["pin", "forgot pin", "reset pin", "change pin"],
    response: "Need help with your PIN? 🔐 Here's what you can do:\n1. Forgot it? Contact support – they'll get you sorted.\n2. Always keep your PIN secret\n3. Remember, your PIN must be exactly 5 digits",
  },
  security: {
    keywords: ["security", "secure", "safety", "protect"],
    response: "Let's keep things safe! 🛡️ Here are some quick security tips:\n1. Never share your PIN or password\n2. Check your transaction history regularly\n3. Use a strong password you don't reuse\n4. Always log out on shared/public devices",
  },
  transaction: {
    keywords: ["transaction", "history", "record", "payment history"],
    response: "Want to review your past activity? 🧾 Here's how to check your transactions:\n1. Click on 'Transaction History' from the sidebar\n2. You'll see a full list of your payments and top-ups\n3. Use filters to narrow it down if needed!",
  },
};

const findResponse = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();
  for (const category of Object.values(predefinedResponses)) {
    if (category.keywords.some((keyword) => lowercaseMessage.includes(keyword))) {
      return category.response;
    }
  }
  return "Hmm, I didn't quite catch that. 🤔 You can ask me about things like payments, wallet top-up, PIN, transaction history, or security tips. Or just say 'hi' to get started!";
};

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue.trim(),
    };

    const userText = inputValue.trim();
    setInputValue("");

    const typingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: typingId, type: "bot", text: "Typing..." },
    ]);

    setTimeout(() => {
      const botMessage: Message = {
        id: typingId,
        type: "bot",
        text: findResponse(userText),
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === typingId ? botMessage : msg))
      );
    }, 900);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-3 sm:p-4 bg-[#2C3E50] text-white rounded-full shadow-lg hover:bg-[#1A2533] transition-all duration-300 z-50"
        aria-label="Open chat assistant"
      >
        <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        isMobile 
          ? "bottom-0 right-0 left-0 rounded-t-lg w-full h-[70vh]" 
          : "bottom-6 right-6 w-80 sm:w-96 rounded-lg h-[600px]"
      } bg-white shadow-xl overflow-hidden z-50
      ${isMinimized ? "h-14" : ""} transition-all duration-300`}
    >
      {/* Header */}
      <div className="bg-[#2C3E50] text-white p-3 sm:p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium text-sm sm:text-base">EDU COIN Assistant</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {!isMobile && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-[#1A2533] rounded"
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </button>
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              setMessages([]);
            }}
            className="p-1 hover:bg-[#1A2533] rounded"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="relative h-[calc(100%-56px)]">
          {/* Messages */}
          <div className="h-[calc(100%-64px)] sm:h-[calc(100%-80px)] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-4 text-gray-500">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-[#2C3E50]" />
                  <p>Ask me anything about EDU COIN!</p>
                  <p className="text-xs mt-2">Try: "How do I make a payment?"</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-2 sm:p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-[#2C3E50] text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      {message.type === "bot" ? (
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      <span className="text-xs sm:text-sm font-medium">
                        {message.type === "user" ? "You" : "Assistant"}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-xs sm:text-sm">
                      {message.text === "Typing..." ? (
                        <span className="animate-pulse">Typing...</span>
                      ) : (
                        message.text
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:px-4 text-sm"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
