import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      badge: null
    },
    {
      label: 'Lead Management',
      path: '/lead-management',
      icon: 'Users',
      badge: { count: 12, priority: 'high' }
    },
    {
      label: 'Property Listings',
      path: '/property-listings',
      icon: 'Building2',
      badge: null
    },
    {
      label: 'Communications Hub',
      path: '/communications-hub',
      icon: 'MessageSquare',
      badge: { count: 5, priority: 'medium' }
    },
    {
      label: 'Calendar & Scheduling',
      path: '/calendar-scheduling',
      icon: 'Calendar',
      badge: { count: 3, priority: 'low' }
    },
    {
      label: 'Transaction Management',
      path: '/transaction-management',
      icon: 'FileText',
      badge: { count: 2, priority: 'high' }
    },
    {
      label: 'Offer Management',
      path: '/offer-management',
      icon: 'DollarSign',
      badge: { count: 4, priority: 'medium' }
    }
  ];

  const userMenuItems = [
    { label: 'Profile Settings', icon: 'User', action: 'profile' },
    { label: 'Account Preferences', icon: 'Settings', action: 'settings' },
    { label: 'Help & Support', icon: 'HelpCircle', action: 'help' },
    { label: 'Sign Out', icon: 'LogOut', action: 'logout' }
  ];

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleUserMenuAction = (action) => {
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
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const NotificationBadge = ({ badge }) => {
    if (!badge) return null;
    
    const badgeColors = {
      high: 'bg-error text-error-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-accent text-accent-foreground'
    };

    return (
      <span className={`notification-badge inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${badgeColors[badge.priority]}`}>
        {badge.count}
      </span>
    );
  };

  const NavigationItem = ({ item }) => {
    const isActive = isActiveRoute(item.path);
    
    return (
      <Link
        to={item.path}
        className={`nav-item-hover flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-text-primary hover:bg-muted hover:text-foreground'
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        <Icon 
          name={item.icon} 
          size={20} 
          className={`flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-text-secondary'}`}
        />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            <NotificationBadge badge={item.badge} />
          </>
        )}
      </Link>
    );
  };

  const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-text-primary hover:bg-muted rounded-md transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={16} className="text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 text-left">
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-xs text-text-secondary">Premium Agent</div>
              </div>
              <Icon 
                name={isOpen ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-text-secondary"
              />
            </>
          )}
        </button>

        {isOpen && !isCollapsed && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-md shadow-lg z-200">
            {userMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  handleUserMenuAction(item.action);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 first:rounded-t-md last:rounded-b-md"
              >
                <Icon name={item.icon} size={16} className="text-text-secondary" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-nav-overlay fixed inset-0 z-300 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-300 lg:hidden bg-primary text-primary-foreground p-2 rounded-md shadow-lg"
      >
        <Icon name="Menu" size={20} />
      </button>

      {/* Sidebar */}
      <aside 
        className={`sidebar-transition fixed left-0 top-0 z-100 h-full bg-surface border-r border-border shadow-sm ${
          isCollapsed ? 'w-16' : 'w-240'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-4 py-6 border-b border-border">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Building2" size={20} className="text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-text-primary">RealtyFlow AI</h1>
                <p className="text-xs text-text-secondary">Smart Real Estate</p>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigationItems.map((item, index) => (
              <NavigationItem key={index} item={item} />
            ))}
          </nav>

          {/* User Menu */}
          <div className="px-3 py-4 border-t border-border">
            <UserMenu />
          </div>

          {/* Collapse Toggle (Desktop Only) */}
          <div className="hidden lg:block px-3 py-2 border-t border-border">
            <button
              onClick={toggleCollapsed}
              className="flex items-center justify-center w-full p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-md transition-colors duration-200"
            >
              <Icon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={16} 
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Content Spacer */}
      <div className={`hidden lg:block ${isCollapsed ? 'w-16' : 'w-240'} flex-shrink-0`} />
    </>
  );
};

export default Sidebar;