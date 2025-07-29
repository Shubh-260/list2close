import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const LeadScoreBadge = ({ score, showTooltip = true }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreConfig = (score) => {
    if (score >= 90) {
      return {
        label: 'Hot',
        color: 'bg-error text-error-foreground',
        icon: 'Flame',
        description: 'High-priority lead with strong buying signals'
      };
    } else if (score >= 70) {
      return {
        label: 'Warm',
        color: 'bg-warning text-warning-foreground',
        icon: 'TrendingUp',
        description: 'Qualified lead showing moderate interest'
      };
    } else if (score >= 50) {
      return {
        label: 'Cold',
        color: 'bg-accent text-accent-foreground',
        icon: 'Snowflake',
        description: 'Lead requires nurturing and engagement'
      };
    } else {
      return {
        label: 'Unqualified',
        color: 'bg-muted text-muted-foreground',
        icon: 'Minus',
        description: 'Lead does not meet qualification criteria'
      };
    }
  };

  const config = getScoreConfig(score);

  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} cursor-pointer`}
        onMouseEnter={() => showTooltip && setShowDetails(true)}
        onMouseLeave={() => showTooltip && setShowDetails(false)}
      >
        <Icon name={config.icon} size={12} />
        <span>{score}</span>
        <span className="hidden sm:inline">({config.label})</span>
      </div>

      {showDetails && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-popover border border-border rounded-lg shadow-lg p-3 min-w-64">
            <div className="flex items-center gap-2 mb-2">
              <Icon name={config.icon} size={16} className="text-accent" />
              <span className="font-medium text-popover-foreground">
                Score: {score}/100 ({config.label})
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {config.description}
            </p>
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                <strong>Scoring Factors:</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Engagement:</span>
                  <span className="font-medium">{Math.floor(score * 0.3)}/30</span>
                </div>
                <div className="flex justify-between">
                  <span>Demographics:</span>
                  <span className="font-medium">{Math.floor(score * 0.25)}/25</span>
                </div>
                <div className="flex justify-between">
                  <span>Behavior:</span>
                  <span className="font-medium">{Math.floor(score * 0.25)}/25</span>
                </div>
                <div className="flex justify-between">
                  <span>Intent:</span>
                  <span className="font-medium">{Math.floor(score * 0.2)}/20</span>
                </div>
              </div>
            </div>

            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover -mt-1"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadScoreBadge;