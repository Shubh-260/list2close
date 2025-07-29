import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import PerformanceChart from './components/PerformanceChart';
import UpcomingAppointments from './components/UpcomingAppointments';
import RecentCommunications from './components/RecentCommunications';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Simulate real-time notifications
    const notificationTimer = setInterval(() => {
      const mockNotifications = [
        'New lead inquiry received',
        'Appointment reminder in 30 minutes',
        'Client message waiting for response',
        'Property showing completed'
      ];
      
      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      setNotifications(prev => [...prev.slice(-4), {
        id: Date.now(),
        message: randomNotification,
        timestamp: new Date()
      }]);
    }, 30000); // New notification every 30 seconds

    return () => {
      clearInterval(timer);
      clearInterval(notificationTimer);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const metricsData = [
    {
      title: 'Active Leads',
      value: '127',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Upcoming Appointments',
      value: '8',
      change: '+2 today',
      changeType: 'positive',
      icon: 'Calendar',
      color: 'accent'
    },
    {
      title: 'Pending Offers',
      value: '5',
      change: '2 expiring soon',
      changeType: 'warning',
      icon: 'FileText',
      color: 'warning'
    },
    {
      title: 'Monthly Revenue',
      value: '$245K',
      change: '+18.2%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'success'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, Sarah! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <Button variant="outline" iconName="Search" iconPosition="left">
                Search
              </Button>
              <Button variant="default" iconName="Plus" iconPosition="left">
                Quick Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metricsData.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  changeType={metric.changeType}
                  icon={metric.icon}
                  color={metric.color}
                />
              ))}
            </div>

            {/* Performance Chart */}
            <PerformanceChart />

            {/* Activity Feed */}
            <ActivityFeed />

            {/* Mobile Quick Actions (visible on mobile only) */}
            <div className="lg:hidden">
              <QuickActions />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions (desktop only) */}
            <div className="hidden lg:block">
              <QuickActions />
            </div>

            {/* Upcoming Appointments */}
            <UpcomingAppointments />

            {/* Recent Communications */}
            <RecentCommunications />

            {/* Navigation Shortcuts */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                <Link
                  to="/lead-management"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors duration-200 text-card-foreground"
                >
                  <Icon name="Users" size={18} className="text-primary" />
                  <span className="text-sm font-medium">Lead Management</span>
                </Link>
                <Link
                  to="/property-listings"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors duration-200 text-card-foreground"
                >
                  <Icon name="Building2" size={18} className="text-accent" />
                  <span className="text-sm font-medium">Property Listings</span>
                </Link>
                <Link
                  to="/communications-hub"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors duration-200 text-card-foreground"
                >
                  <Icon name="MessageSquare" size={18} className="text-success" />
                  <span className="text-sm font-medium">Communications Hub</span>
                </Link>
                <Link
                  to="/calendar-scheduling"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors duration-200 text-card-foreground"
                >
                  <Icon name="Calendar" size={18} className="text-warning" />
                  <span className="text-sm font-medium">Calendar & Scheduling</span>
                </Link>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="HelpCircle" size={20} className="text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-card-foreground mb-2">
                    Need Help?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get started with our comprehensive guides and tutorials.
                  </p>
                  <Button variant="outline" size="sm" fullWidth>
                    View Help Center
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Notification Toast (if notifications exist) */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {notifications.slice(-3).map((notification) => (
            <div
              key={notification.id}
              className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm animate-in slide-in-from-right"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Bell" size={16} className="text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;