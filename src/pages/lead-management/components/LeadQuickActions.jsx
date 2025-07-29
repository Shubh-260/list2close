import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const LeadQuickActions = ({ lead, onAction }) => {
  const [showMore, setShowMore] = useState(false);

  const primaryActions = [
    {
      id: 'call',
      label: 'Call',
      icon: 'Phone',
      variant: 'outline',
      color: 'text-success'
    },
    {
      id: 'email',
      label: 'Email',
      icon: 'Mail',
      variant: 'outline',
      color: 'text-accent'
    },
    {
      id: 'note',
      label: 'Note',
      icon: 'FileText',
      variant: 'outline',
      color: 'text-warning'
    }
  ];

  const secondaryActions = [
    {
      id: 'sms',
      label: 'Send SMS',
      icon: 'MessageSquare',
      variant: 'ghost'
    },
    {
      id: 'schedule',
      label: 'Schedule Meeting',
      icon: 'Calendar',
      variant: 'ghost'
    },
    {
      id: 'assign',
      label: 'Reassign',
      icon: 'UserCheck',
      variant: 'ghost'
    },
    {
      id: 'tag',
      label: 'Add Tags',
      icon: 'Tag',
      variant: 'ghost'
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: 'Archive',
      variant: 'ghost'
    }
  ];

  const handleAction = (actionId) => {
    onAction(actionId, lead);
    setShowMore(false);
  };

  return (
    <div className="relative flex items-center gap-1">
      {/* Primary Actions */}
      <div className="flex items-center gap-1">
        {primaryActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`p-2 hover:bg-muted rounded-md transition-colors duration-200 ${action.color || 'text-text-secondary'}`}
            title={action.label}
          >
            <Icon name={action.icon} size={16} />
          </button>
        ))}
      </div>

      {/* More Actions Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowMore(!showMore)}
          className="p-2 hover:bg-muted rounded-md transition-colors duration-200 text-text-secondary"
          title="More actions"
        >
          <Icon name="MoreHorizontal" size={16} />
        </button>

        {showMore && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowMore(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-20">
              <div className="py-1">
                {secondaryActions.map((action, index) => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name={action.icon} size={16} className="text-text-secondary" />
                    <span>{action.label}</span>
                  </button>
                ))}
                
                <hr className="my-1 border-border" />
                
                <button
                  onClick={() => handleAction('delete')}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200"
                >
                  <Icon name="Trash2" size={16} />
                  <span>Delete Lead</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadQuickActions;