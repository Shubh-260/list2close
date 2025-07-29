import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Leads', path: '/lead-management', icon: 'Users' },
    { label: 'Properties', path: '/property-listings', icon: 'Building2' },
    { label: 'Communications', path: '/communications-hub', icon: 'MessageSquare' },
    { label: 'Calendar', path: '/calendar-scheduling', icon: 'Calendar' }
  ];

  const notifications = [
    {
      id: 1,
      type: 'lead',
      title: 'New lead inquiry',
      message: 'John Smith is interested in 123 Oak Street',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Upcoming showing',
      message: 'Property showing at 456 Pine Ave in 30 minutes',
      time: '25 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'message',
      title: 'Client message',
      message: 'Sarah Johnson sent you a message',
      time: '1 hour ago',
      unread: false
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNotificationClick = (notification) => {
    console.log('Navigate to notification:', notification);
    setIsNotificationOpen(false);
  };

  const handleProfileAction = (action) => {
    switch (action) {
      case 'profile': console.log('Navigate to profile');
        break;
      case 'settings': console.log('Navigate to settings');
        break;
      case 'help': console.log('Open help center');
        break;
      case 'logout': console.log('Sign out user');
        break;
      default:
        break;
    }
    setIsProfileOpen(false);
  };

  const NotificationItem = ({ notification }) => {
    const iconMap = {
      lead: 'UserPlus',
      appointment: 'Calendar',
      message: 'MessageSquare'
    };

    return (
      <button
        onClick={() => handleNotificationClick(notification)}
        className={`w-full text-left p-4 hover:bg-muted transition-colors duration-200 border-b border-border last:border-b-0 ${
          notification.unread ? 'bg-accent/5' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            notification.unread ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name={iconMap[notification.type]} size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                {notification.title}
              </h4>
              {notification.unread && (
                <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {notification.time}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-100 bg-surface border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Building2" size={20} className="text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">RealtyFlow AI</h1>
          </div>
        </Link>

        {/* Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems.map((item, index) => {
            const isActive = isActiveRoute(item.path);
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
              Add Lead
            </Button>
            <Button variant="default" size="sm" iconName="Calendar" iconPosition="left">
              Schedule
            </Button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200"
            >
              <Icon name="Bell" size={20} />
              {notifications.some(n => n.unread) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-200">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-popover-foreground">Notifications</h3>
                    <Button variant="ghost" size="sm">
                      Mark all read
                    </Button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth>
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 hover:bg-muted rounded-md transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary-foreground" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-foreground">Sarah Johnson</div>
                <div className="text-xs text-muted-foreground">Premium Agent</div>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-200">
                <div className="p-2">
                  <button
                    onClick={() => handleProfileAction('profile')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => handleProfileAction('settings')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => handleProfileAction('help')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={() => handleProfileAction('logout')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;