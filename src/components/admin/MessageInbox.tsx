import { useState, useEffect } from 'react';
import { Mail, Trash2, RefreshCw, Search, Send, Users, Reply, ChevronRight } from 'lucide-react';
import { getMessages, deleteMessage, markAsRead, sendBroadcast, replyToMessage } from '../../services/messages';
import { Button } from '../common/Button';
import type { Message } from '../../types/message';
import '../../styles/MessageInbox.css'; // Import CSS file for animations

export const MessageInbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
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

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      {/* Left Pane: Message List */}
      <div className="w-1/3 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Inbox</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchMessages}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
              <Button
                onClick={() => setShowBroadcastForm(true)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Broadcast
              </Button>
            </div>
          </div>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 animate-fade-in ${
                  selectedMessage?._id === message._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{message.sender.email}</p>
                    <p className="text-sm text-gray-600">{message.subject}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{message.message}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message._id);
                    }}
                    className="p-1 hover:bg-red-50 rounded-full transition-colors text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
      </div>

      {/* Right Pane: Selected Message */}
      <div className="flex-1 ml-6 bg-white rounded-lg shadow-lg overflow-hidden">
        {selectedMessage ? (
          <div className="h-full p-6 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{selectedMessage.subject}</p>
                <p className="text-sm text-gray-600">{selectedMessage.sender.email}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="mt-4 text-gray-700">
              <p>{selectedMessage.message}</p>
            </div>
            <form onSubmit={handleReply} className="mt-6">
              <textarea
                value={replyData.message}
                onChange={(e) => setReplyData({ message: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Write a reply..."
              />
              <div className="mt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a message to view</p>
          </div>
        )}
      </div>

      {/* Broadcast Form Modal */}
      {showBroadcastForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full animate-fade-in">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </div>
  );
};