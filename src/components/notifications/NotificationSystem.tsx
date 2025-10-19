import { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, Package2, Plane, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'delivery_request' | 'pickup_ready' | 'in_transit' | 'delivered' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  data?: any;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'delivery_request',
    title: 'New Delivery Request',
    message: 'Marie Dubois wants to send a passport copy to Casablanca for €25',
    timestamp: '2024-01-14T10:30:00Z',
    read: false,
    actionable: true,
    data: { requestId: 'DR8H3K7M', price: 25 }
  },
  {
    id: '2',
    type: 'pickup_ready',
    title: 'Document Ready for Pickup',
    message: 'Your document is ready for collection at Relay Point Châtelet',
    timestamp: '2024-01-14T09:15:00Z',
    read: false,
    actionable: true,
    data: { pickupCode: 'DR8H3K7M', location: 'Relay Point Châtelet' }
  },
  {
    id: '3',
    type: 'in_transit',
    title: 'Document in Transit',
    message: 'Ahmed Benali has collected your document and is traveling to Casablanca',
    timestamp: '2024-01-14T08:45:00Z',
    read: true,
    actionable: false,
    data: { travelerName: 'Ahmed Benali', destination: 'Casablanca' }
  },
  {
    id: '4',
    type: 'delivered',
    title: 'Document Delivered!',
    message: 'Your passport copy has been successfully delivered in Casablanca',
    timestamp: '2024-01-13T16:20:00Z',
    read: true,
    actionable: false,
    data: { deliveredAt: 'Casablanca', confirmationCode: 'DL9K3M7X' }
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Received',
    message: 'You earned €25 for delivering Marie\'s document to Casablanca',
    timestamp: '2024-01-13T16:25:00Z',
    read: true,
    actionable: false,
    data: { amount: 25, currency: 'EUR' }
  }
];

export const NotificationSystem = ({ userType = 'sender' }: { userType: 'sender' | 'traveler' }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      // Mock new notification every 30 seconds (for demo)
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'system',
          title: 'System Update',
          message: 'Your app has been updated with new features!',
          timestamp: new Date().toISOString(),
          read: false,
          actionable: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
    });
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'delivery_request': return Package2;
      case 'pickup_ready': return MapPin;
      case 'in_transit': return Plane;
      case 'delivered': return Check;
      case 'payment': return Check;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'delivery_request': return 'text-blue-600 bg-blue-100';
      case 'pickup_ready': return 'text-green-600 bg-green-100';
      case 'in_transit': return 'text-yellow-600 bg-yellow-100';
      case 'delivered': return 'text-success bg-success/10';
      case 'payment': return 'text-success bg-success/10';
      case 'system': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);
                
                return (
                  <div key={notification.id} className="group">
                    <div 
                      className={`p-4 hover:bg-muted/30 cursor-pointer transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          
                          {notification.actionable && (
                            <div className="flex space-x-2 mt-2">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                              {notification.type === 'delivery_request' && (
                                <Button size="sm">
                                  Accept
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};