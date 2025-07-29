import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'lead',
      title: 'New lead inquiry received',
      description: 'John Smith is interested in 123 Oak Street property',
      timestamp: '5 minutes ago',
      priority: 'high',
      icon: 'UserPlus',
      color: 'success'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Upcoming property showing',
      description: 'Scheduled showing at 456 Pine Avenue at 2:00 PM today',
      timestamp: '30 minutes ago',
      priority: 'medium',
      icon: 'Calendar',
      color: 'warning'
    },
    {
      id: 3,
      type: 'offer',
      title: 'Offer submitted for review',
      description: 'Client offer of $485,000 for 789 Maple Drive needs approval',
      timestamp: '1 hour ago',
      priority: 'high',
      icon: 'FileText',
      color: 'accent'
    },
    {
      id: 4,
      type: 'message',
      title: 'Client message received',
      description: 'Sarah Johnson: "Can we reschedule tomorrow\'s meeting?"',
      timestamp: '2 hours ago',
      priority: 'low',
      icon: 'MessageSquare',
      color: 'primary'
    },
    {
      id: 5,
      type: 'task',
      title: 'Follow-up reminder',
      description: 'Contact Mike Davis about property inspection results',
      timestamp: '3 hours ago',
      priority: 'medium',
      icon: 'Bell',
      color: 'warning'
    }
  ];

  const priorityColors = {
    high: 'border-l-destructive bg-destructive/5',
    medium: 'border-l-warning bg-warning/5',
    low: 'border-l-muted-foreground bg-muted/5'
  };

  const iconColors = {
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    accent: 'bg-accent text-accent-foreground',
    primary: 'bg-primary text-primary-foreground'
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
          <button className="text-sm text-accent hover:text-accent/80 font-medium">
            View All
          </button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className={`p-4 border-l-4 hover:bg-muted/50 transition-colors duration-200 cursor-pointer ${priorityColors[activity.priority]}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[activity.color]}`}>
                <Icon name={activity.icon} size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-card-foreground mb-1">
                  {activity.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    activity.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                    activity.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                  }`}>
                    {activity.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;