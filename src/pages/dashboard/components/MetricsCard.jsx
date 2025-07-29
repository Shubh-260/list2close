import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    accent: 'bg-accent text-accent-foreground'
  };

  const changeColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <Icon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={16} 
                className={changeColors[changeType]}
              />
              <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;