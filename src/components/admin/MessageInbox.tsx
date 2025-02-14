import { useState, useEffect } from 'react';
import { Mail, Trash2, RefreshCw, Search, Send, Users, Reply } from 'lucide-react';
import { getMessages, deleteMessage, markAsRead, sendBroadcast, replyToMessage } from '../../services/messages';
import { Button } from '../common/Button';
import type { Message } from '../../types/message';

export const MessageInbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [broadcastData, setBroadcastData] = useState({
    subject: '',
    message: ''
  });
  const [replyData, setReplyData] = useState({
    message: ''
  });

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getMessages();
      // Group messages by thread
      const threaded = data.reduce((acc: Message[], message: Message) => {
        if (!message.replyTo) {
          // Find all replies to this message
          const replies = data.filter(m => m.replyTo === message._id);
          message.replies = replies;
          acc.push(message);
        }
        return acc;
      }, []);
      setMessages(threaded);
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

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendBroadcast(broadcastData);
      setShowBroadcastForm(false);
      setBroadcastData({ subject: '', message: '' });
      fetchMessages(); // Refresh messages to show the new broadcast
    } catch (error) {
      console.error('Failed to send broadcast:', error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;

    try {
      await replyToMessage(selectedMessage._id, replyData.message);
      setShowReplyForm(false);
      setReplyData({ message: '' });
      fetchMessages(); // Refresh messages to show the new reply
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MessageThread = ({ message, isReply = false }: { message: Message; isReply?: boolean }) => (
    <div className={`border-l-2 ${isReply ? 'ml-6 pl-6 border-gray-200' : 'border-transparent'}`}>
      <div 
        className={`p-4 rounded-lg transition-colors cursor-pointer ${
          selectedMessage?._id === message._id ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
        onClick={() => handleMessageClick(message)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {isReply ? (
              <Reply className="h-5 w-5 text-gray-400 mt-1" />
            ) : (
              <Mail className={`h-5 w-5 ${!message.read ? 'text-blue-500' : 'text-gray-400'} mt-1`} />
            )}
            <div>
              <p className="text-sm font-medium">{message.sender.email}</p>
              <p className="text-sm text-gray-600">{message.subject}</p>
              <p className="mt-2 text-gray-700">{message.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                handleDelete(message._id);
              }}
              className="p-1 hover:bg-red-50 rounded-full transition-colors text-red-500"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {message.replies?.map((reply) => (
        <MessageThread key={reply._id} message={reply} isReply={true} />
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-[#2C3E50]">Messages</h2>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowBroadcastForm(true)}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Broadcast Message
          </Button>
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

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50]"></div>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <MessageThread key={message._id} message={message} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Mail className="h-12 w-12 mb-2" />
            <p>No messages found</p>
          </div>
        )}
      </div>

      {/* Broadcast Form Modal */}
      {showBroadcastForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Send Broadcast Message</h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={broadcastData.subject}
                  onChange={(e) => setBroadcastData(prev => ({
                    ...prev,
                    subject: e.target.value
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                  placeholder="Enter broadcast subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData(prev => ({
                    ...prev,
                    message: e.target.value
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                  rows={6}
                  placeholder="Enter broadcast message"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowBroadcastForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Broadcast
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Form Modal */}
      {showReplyForm && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Reply to Message</h3>
            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={replyData.message}
                  onChange={(e) => setReplyData({ message: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                  rows={6}
                  placeholder="Enter your reply"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Reply
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Button */}
      {selectedMessage && !showReplyForm && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowReplyForm(true)}
            className="flex items-center gap-2"
          >
            <Reply className="h-4 w-4" />
            Reply
          </Button>
        </div>
      )}
    </div>
  );
};