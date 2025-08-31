import React, { useState, useEffect } from 'react';
import { 
  Bell, X, ExternalLink, Clock
} from 'lucide-react';
import { notificationService } from '../services/notificationService';

const NotificationPanel = ({ isOpen, onClose, userInfo, selectedLanguage, onTabChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, userInfo]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const userNotifications = notificationService.getUserNotifications(userInfo?.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    notificationService.handleNotificationAction(notification, onTabChange);
    loadNotifications(); // Refresh to show read status
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead(userInfo?.id);
    loadNotifications();
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'अभी';
    if (diffInMinutes < 60) return `${diffInMinutes} मिनट पहले`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} घंटे पहले`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} दिन पहले`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6" />
              <h2 className="text-xl font-bold">
                {selectedLanguage === 'hi' && 'सूचनाएं'}
                {selectedLanguage === 'en' && 'Notifications'}
                {selectedLanguage === 'ur' && 'اطلاعات'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-blue-100 text-sm">
                {notifications.filter(n => !n.isRead).length} नई सूचनाएं
              </span>
              <button
                onClick={markAllAsRead}
                className="text-blue-100 hover:text-white text-sm underline"
              >
                सभी पढ़ा गया चिह्नित करें
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">सूचनाएं लोड हो रही हैं...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-8">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">कोई सूचना नहीं</p>
              <p className="text-gray-400 text-sm mt-2">
                नई सूचनाएं यहाँ दिखाई जाएंगी
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notificationService.getNotificationColor(notification.type)
                      }`}>
                        <span className="text-lg">
                          {notificationService.getNotificationIcon(notification.type)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        !notification.isRead ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{getTimeAgo(notification.createdAt)}</span>
                        </span>
                        
                        {notification.action && (
                          <span className="text-xs text-blue-600 flex items-center space-x-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>देखें</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-center text-xs text-gray-500">
            जन सहायक - डिजिटल इंडिया पहल
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;