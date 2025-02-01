import { useState, useEffect } from 'react';
import { Mail, Star, Trash2, RefreshCw, Search } from 'lucide-react';
import { getMessages, deleteMessage, markAsRead } from '../../services/messages';
import type { Message } from '../../types/message';

export const MessageInbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      try {
        await markAsRead(message._id);
        setMessages(messages.map(msg => 
          msg._id === message._id ? { ...msg, read: true } : msg
        ));
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setMessages(messages.filter(msg => msg._id !== messageId));
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-[#2C3E50]">Messages</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={fetchMessages}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-15rem)]">
        {/* Message List */}
        <div className="w-1/3 border-r overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50]"></div>
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message._id}
                onClick={() => handleMessageClick(message)}
                className={`p-4 border-b cursor-pointer transition-colors
                  ${selectedMessage?._id === message._id ? 'bg-gray-100' : 'hover:bg-gray-50'}
                  ${!message.read ? 'font-semibold' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className={`h-5 w-5 ${!message.read ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm">{message.sender.email}</p>
                      <p className="text-sm text-gray-600">{message.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Mail className="h-12 w-12 mb-2" />
              <p>No messages found</p>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedMessage ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedMessage.subject}</h3>
                  <p className="text-sm text-gray-600">
                    From: {selectedMessage.sender.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Mail className="h-12 w-12 mb-2" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};