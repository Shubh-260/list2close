import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PropertyAnalytics = ({ property, isOpen, onClose }) => {
  const analyticsData = {
    views: {
      total: property?.views || 245,
      thisWeek: 42,
      change: '+18%'
    },
    inquiries: {
      total: property?.inquiries || 18,
      thisWeek: 5,
      change: '+25%'
    },
    showings: {
      total: property?.showings || 12,
      thisWeek: 3,
      change: '+50%'
    },
    favorites: {
      total: 34,
      thisWeek: 8,
      change: '+12%'
    }
  };

  const platformPerformance = [
    { name: 'MLS', views: 89, inquiries: 8, showings: 5, status: 'Active' },
    { name: 'Zillow', views: 76, inquiries: 4, showings: 3, status: 'Active' },
    { name: 'Realtor.com', views: 52, inquiries: 3, showings: 2, status: 'Active' },
    { name: 'Trulia', views: 28, inquiries: 3, showings: 2, status: 'Active' }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'inquiry',
      message: 'New inquiry from John Smith',
      time: '2 hours ago',
      icon: 'MessageSquare'
    },
    {
      id: 2,
      type: 'showing',
      message: 'Showing scheduled for tomorrow at 2:00 PM',
      time: '4 hours ago',
      icon: 'Calendar'
    },
    {
      id: 3,
      type: 'view',
      message: '15 new views from Zillow',
      time: '6 hours ago',
      icon: 'Eye'
    },
    {
      id: 4,
      type: 'favorite',
      message: 'Property added to favorites by 3 users',
      time: '1 day ago',
      icon: 'Heart'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Property Analytics</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {property?.address || 'Property Performance Overview'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Eye" size={20} className="text-accent" />
                <span className="text-xs text-success font-medium">
                  {analyticsData.views.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {analyticsData.views.total}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
              <div className="text-xs text-muted-foreground mt-1">
                {analyticsData.views.thisWeek} this week
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon name="MessageSquare" size={20} className="text-primary" />
                <span className="text-xs text-success font-medium">
                  {analyticsData.inquiries.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {analyticsData.inquiries.total}
              </div>
              <div className="text-sm text-muted-foreground">Inquiries</div>
              <div className="text-xs text-muted-foreground mt-1">
                {analyticsData.inquiries.thisWeek} this week
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Calendar" size={20} className="text-warning" />
                <span className="text-xs text-success font-medium">
                  {analyticsData.showings.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {analyticsData.showings.total}
              </div>
              <div className="text-sm text-muted-foreground">Showings</div>
              <div className="text-xs text-muted-foreground mt-1">
                {analyticsData.showings.thisWeek} this week
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Heart" size={20} className="text-destructive" />
                <span className="text-xs text-success font-medium">
                  {analyticsData.favorites.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {analyticsData.favorites.total}
              </div>
              <div className="text-sm text-muted-foreground">Favorites</div>
              <div className="text-xs text-muted-foreground mt-1">
                {analyticsData.favorites.thisWeek} this week
              </div>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Platform Performance
            </h3>
            <div className="bg-muted/30 rounded-lg overflow-hidden">
              <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                <div>Platform</div>
                <div>Views</div>
                <div>Inquiries</div>
                <div>Showings</div>
                <div>Status</div>
              </div>
              {platformPerformance.map((platform, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Icon name="Globe" size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{platform.name}</span>
                  </div>
                  <div className="text-foreground">{platform.views}</div>
                  <div className="text-foreground">{platform.inquiries}</div>
                  <div className="text-foreground">{platform.showings}</div>
                  <div>
                    <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
                      {platform.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={activity.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" iconName="Download" iconPosition="left">
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics;