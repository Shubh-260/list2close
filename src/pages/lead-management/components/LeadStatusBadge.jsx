import React from 'react';
import Icon from '../../../components/AppIcon';

const LeadStatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      new: {
        label: 'New',
        color: 'bg-accent text-accent-foreground',
        icon: 'Plus',
        description: 'Recently added lead'
      },
      contacted: {
        label: 'Contacted',
        color: 'bg-warning text-warning-foreground',
        icon: 'Phone',
        description: 'Initial contact made'
      },
      qualified: {
        label: 'Qualified',
        color: 'bg-success text-success-foreground',
        icon: 'CheckCircle',
        description: 'Meets qualification criteria'
      },
      nurturing: {
        label: 'Nurturing',
        color: 'bg-secondary text-secondary-foreground',
        icon: 'Heart',
        description: 'In nurture campaign'
      },
      converted: {
        label: 'Converted',
        color: 'bg-primary text-primary-foreground',
        icon: 'Trophy',
        description: 'Successfully converted to client'
      },
      lost: {
        label: 'Lost',
        color: 'bg-muted text-muted-foreground',
        icon: 'X',
        description: 'Lead is no longer viable'
      }
    };

    return configs[status] || configs.new;
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const iconSizes = {
    sm: 10,
    default: 12,
    lg: 14
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}
      title={config.description}
    >
      <Icon name={config.icon} size={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
};

export default LeadStatusBadge;