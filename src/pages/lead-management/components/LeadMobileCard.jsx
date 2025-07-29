import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

import { Checkbox } from '../../../components/ui/Checkbox';
import LeadScoreBadge from './LeadScoreBadge';
import LeadStatusBadge from './LeadStatusBadge';

const LeadMobileCard = ({ lead, isSelected, onSelect, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatLastActivity = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return activityDate.toLocaleDateString();
  };

  const getSourceIcon = (source) => {
    const sourceIcons = {
      website: 'Globe',
      referral: 'Users',
      social_media: 'Share2',
      cold_call: 'Phone',
      open_house: 'Home',
      zillow: 'Building',
      realtor_com: 'Building2'
    };
    return sourceIcons[source] || 'HelpCircle';
  };

  const quickActions = [
    { id: 'call', label: 'Call', icon: 'Phone', color: 'text-success' },
    { id: 'email', label: 'Email', icon: 'Mail', color: 'text-accent' },
    { id: 'sms', label: 'SMS', icon: 'MessageSquare', color: 'text-warning' },
    { id: 'note', label: 'Note', icon: 'FileText', color: 'text-secondary' }
  ];

  return (
    <div className={`bg-surface border border-border rounded-lg shadow-sm transition-all duration-200 ${
      isSelected ? 'ring-2 ring-accent ring-opacity-50' : ''
    }`}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isSelected}
              onChange={(e) => onSelect(lead.id, e.target.checked)}
            />
            
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {lead.avatar ? (
                <Image
                  src={lead.avatar}
                  alt={lead.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                  <Icon name="User" size={20} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary truncate">
                {lead.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {lead.email}
              </p>
              <p className="text-sm text-text-secondary">
                {lead.phone}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-text-secondary" 
            />
          </button>
        </div>

        {/* Status and Score Row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <LeadStatusBadge status={lead.status} size="sm" />
            <LeadScoreBadge score={lead.qualificationScore} showTooltip={false} />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name={getSourceIcon(lead.source)} size={14} />
            <span className="capitalize">{lead.source.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Last Activity */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">Last Activity</span>
            </div>
            <div className="ml-6">
              <div className="text-sm text-text-primary">{lead.lastActivity.type}</div>
              <div className="text-xs text-text-secondary">
                {formatLastActivity(lead.lastActivity.date)}
              </div>
            </div>
          </div>

          {/* Assigned Agent */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="UserCheck" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">Assigned To</span>
            </div>
            <div className="ml-6 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                {lead.assignedTo.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm text-text-primary">{lead.assignedTo}</span>
            </div>
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Tag" size={16} className="text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">Tags</span>
              </div>
              <div className="ml-6 flex flex-wrap gap-1">
                {lead.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2 border-t border-border">
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onAction(action.id, lead)}
                  className={`flex flex-col items-center gap-1 p-3 hover:bg-muted rounded-lg transition-colors ${action.color}`}
                >
                  <Icon name={action.icon} size={20} />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadMobileCard;