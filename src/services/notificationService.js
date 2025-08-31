class NotificationService {
  constructor() {
    this.notifications = this.loadNotifications();
  }

  // Load notifications from localStorage
  loadNotifications() {
    try {
      const notifications = localStorage.getItem('janSahayakNotifications');
      return notifications ? JSON.parse(notifications) : this.getDefaultNotifications();
    } catch (error) {
      console.error('Error loading notifications:', error);
      return this.getDefaultNotifications();
    }
  }

  // Save notifications to localStorage
  saveNotifications() {
    try {
      localStorage.setItem('janSahayakNotifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  // Get default notifications
  getDefaultNotifications() {
    return [
      {
        id: 'welcome',
        title: 'जन सहायक में आपका स्वागत है!',
        message: 'सरकारी सेवाओं का लाभ उठाने के लिए अपनी प्रोफाइल पूरी करें',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
        action: 'complete_profile'
      },
      {
        id: 'schemes_update',
        title: 'नई सरकारी योजनाएं',
        message: 'आपके लिए 3 नई योजनाएं उपलब्ध हैं। अभी देखें!',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        action: 'view_schemes'
      },
      {
        id: 'weather_alert',
        title: 'मौसम चेतावनी',
        message: 'अगले 24 घंटों में भारी बारिश की संभावना। सावधान रहें!',
        type: 'warning',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        action: 'view_weather'
      }
    ];
  }

  // Get notifications for user
  getUserNotifications(userId) {
    // Filter notifications based on user or return general notifications
    return this.notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10); // Limit to 10 notifications
  }

  // Get unread notification count
  getUnreadCount(userId) {
    const userNotifications = this.getUserNotifications(userId);
    return userNotifications.filter(n => !n.isRead).length;
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
    }
  }

  // Mark all notifications as read
  markAllAsRead(userId) {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.saveNotifications();
  }

  // Add new notification
  addNotification(notification) {
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    return newNotification;
  }

  // Add complaint status notification
  addComplaintNotification(complaintId, status, message) {
    return this.addNotification({
      title: 'शिकायत अपडेट',
      message: `शिकायत #${complaintId}: ${message}`,
      type: status === 'resolved' ? 'success' : 'info',
      action: 'view_complaints',
      relatedId: complaintId
    });
  }

  // Add scheme notification
  addSchemeNotification(schemeName, message) {
    return this.addNotification({
      title: 'योजना अपडेट',
      message: `${schemeName}: ${message}`,
      type: 'info',
      action: 'view_schemes'
    });
  }

  // Add weather notification
  addWeatherNotification(message, type = 'info') {
    return this.addNotification({
      title: 'मौसम अपडेट',
      message: message,
      type: type,
      action: 'view_weather'
    });
  }

  // Get notification icon
  getNotificationIcon(type) {
    const icons = {
      info: '📢',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || '📢';
  }

  // Get notification color
  getNotificationColor(type) {
    const colors = {
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[type] || colors.info;
  }

  // Handle notification action
  handleNotificationAction(notification, onTabChange) {
    this.markAsRead(notification.id);
    
    switch (notification.action) {
      case 'complete_profile':
        // Navigate to profile completion
        break;
      case 'view_schemes':
        onTabChange && onTabChange('rights');
        break;
      case 'view_complaints':
        onTabChange && onTabChange('complaints');
        break;
      case 'view_weather':
        onTabChange && onTabChange('gramvaani');
        break;
      default:
        break;
    }
  }

  // Simulate real-time notifications (for demo)
  simulateRealTimeNotifications() {
    // Add random notifications periodically
    const messages = [
      { title: 'नई योजना', message: 'आपके क्षेत्र में नई कृषि योजना शुरू हुई है', type: 'success' },
      { title: 'मौसम अपडेट', message: 'कल बारिश की संभावना है', type: 'info' },
      { title: 'शिकायत अपडेट', message: 'आपकी शिकायत की जांच शुरू हो गई है', type: 'info' }
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    this.addNotification(randomMessage);
  }
}

export const notificationService = new NotificationService();