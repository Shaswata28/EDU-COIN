import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, X, CreditCard, DollarSign, Award, Mail, AlertCircle, Speaker, Megaphone, Trash2 } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from '../../services/notifications';
import type { Notification } from '../../types/notification';

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Notification | null>(null);
  const [clearingNotifications, setClearingNotifications] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount and every 60 seconds
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        console.log('Fetched notifications:', data); // Debugging
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close the notification center when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark a notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(notif =>
        notif._id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Clear all notifications
  const handleClearNotifications = async () => {
    try {
      const reversedNotifications = [...notifications].reverse();
      for (let i = 0; i < reversedNotifications.length; i++) {
        setClearingNotifications(prev => [...prev, reversedNotifications[i]._id]);
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between each
      }
      
      await clearNotifications();
      
      setTimeout(() => {
        setNotifications([]);
        setClearingNotifications([]);
      }, 300);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      setClearingNotifications([]);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    console.log('Clicked notification:', notification);
    if (notification.type === 'broadcast') { // Ensure this matches the backend
      console.log('Setting selectedBroadcast:', notification);
      setSelectedBroadcast(notification);
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-6 w-6 text-blue-500" />;
      case 'topup':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      case 'achievement':
        return <Award className="h-6 w-6 text-purple-500" />;
      case 'message':
        return <Mail className="h-6 w-6 text-yellow-500" />;
      case 'budget':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'broadcast': // Ensure this case exists
        return <Megaphone className="h-6 w-6 text-indigo-500" />;
      default:
        return <Speaker className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get notification background color based on type
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'payment':
        return 'bg-blue-50 border-blue-100';
      case 'topup':
        return 'bg-green-50 border-green-100';
      case 'achievement':
        return 'bg-purple-50 border-purple-100';
      case 'message':
        return 'bg-yellow-50 border-yellow-100';
      case 'budget':
        return 'bg-red-50 border-red-100';
      case 'broadcast': // Ensure this case exists
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[#3D5166] rounded-lg transition-colors group"
      >
        <Bell className={`h-6 w-6 text-white transition-transform duration-300 ${unreadCount > 0 ? 'animate-bounce' : 'group-hover:scale-110'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-hidden animate-slideInDown">
          <div className="p-4 border-b bg-gradient-to-r from-[#1A2533] to-[#2C3E50]">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2 text-white"> {/* Fix text color */}
                <Bell className="h-5 w-5" />
                Notifications
              </h3>
              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm flex items-center gap-1 hover:text-gray-300 transition-colors text-white" /* Fix text color */
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="text-sm flex items-center gap-1 hover:text-gray-300 transition-colors text-white" /* Fix text color */
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[calc(80vh-4rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2C3E50]"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-all duration-300 border-l-4 cursor-pointer
                      ${clearingNotifications.includes(notification._id) 
                        ? 'animate-slideOutRight opacity-0' 
                        : 'animate-slideInRight'} 
                      ${!notification.read ? getNotificationColor(notification.type) : 'border-transparent'}`}
                    style={{ 
                      animationDelay: clearingNotifications.length ? `${index * 100}ms` : `${index * 50}ms`,
                      transform: clearingNotifications.includes(notification._id) ? 'translateX(100%)' : 'none'
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="transform transition-transform hover:scale-110">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#2C3E50]">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                            >
                              <Check className="h-4 w-4" />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                No notifications
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcast Message Popup */}
      {selectedBroadcast && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000] animate-fadeIn"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            setSelectedBroadcast(null);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full transform transition-all duration-300 animate-scaleIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Megaphone className="h-8 w-8 text-indigo-500" />
                <h3 className="text-xl font-semibold text-[#2C3E50]">
                  Announcement
                </h3>
              </div>
              <button
                onClick={() => setSelectedBroadcast(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-lg mb-2">{selectedBroadcast.title}</h4>
              <p className="text-gray-600">{selectedBroadcast.message}</p> {/* Display the full message */}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(selectedBroadcast.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};