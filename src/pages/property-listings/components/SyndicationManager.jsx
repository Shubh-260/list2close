import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SyndicationManager = ({ property, isOpen, onClose, onUpdateSyndication }) => {
  const [syndicationSettings, setSyndicationSettings] = useState({
    mls: { enabled: true, status: 'Active', lastSync: '2 hours ago' },
    zillow: { enabled: true, status: 'Active', lastSync: '1 hour ago' },
    realtor: { enabled: true, status: 'Active', lastSync: '3 hours ago' },
    trulia: { enabled: false, status: 'Inactive', lastSync: 'Never' },
    redfin: { enabled: false, status: 'Inactive', lastSync: 'Never' },
    homescom: { enabled: false, status: 'Inactive', lastSync: 'Never' }
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const platforms = [
    {
      id: 'mls',
      name: 'MLS',
      description: 'Multiple Listing Service - Primary real estate database',
      icon: 'Database',
      required: true,
      features: ['Professional Network', 'Agent Collaboration', 'Market Data']
    },
    {
      id: 'zillow',
      name: 'Zillow',
      description: 'Leading online real estate marketplace',
      icon: 'Home',
      required: false,
      features: ['High Traffic', 'Zestimate Integration', 'Lead Generation']
    },
    {
      id: 'realtor',
      name: 'Realtor.com',
      description: 'Official site of the National Association of Realtors',
      icon: 'Building',
      required: false,
      features: ['NAR Official', 'Professional Credibility', 'Market Insights']
    },
    {
      id: 'trulia',
      name: 'Trulia',
      description: 'Neighborhood-focused real estate platform',
      icon: 'MapPin',
      required: false,
      features: ['Neighborhood Data', 'School Information', 'Local Insights']
    },
    {
      id: 'redfin',
      name: 'Redfin',
      description: 'Technology-powered real estate brokerage',
      icon: 'TrendingUp',
      required: false,
      features: ['Market Analytics', 'Tour Scheduling', 'Price Estimates']
    },
    {
      id: 'homescom',
      name: 'Homes.com',
      description: 'Comprehensive real estate search platform',
      icon: 'Search',
      required: false,
      features: ['Advanced Search', 'Market Reports', 'Agent Directory']
    }
  ];

  const handlePlatformToggle = (platformId, enabled) => {
    setSyndicationSettings(prev => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        enabled,
        status: enabled ? 'Pending' : 'Inactive'
      }
    }));
  };

  const handleSyncAll = async () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedSettings = { ...syndicationSettings };
      Object.keys(updatedSettings).forEach(key => {
        if (updatedSettings[key].enabled) {
          updatedSettings[key].status = 'Active';
          updatedSettings[key].lastSync = 'Just now';
        }
      });
      setSyndicationSettings(updatedSettings);
      setIsUpdating(false);
    }, 2000);
  };

  const handleSave = () => {
    onUpdateSyndication(syndicationSettings);
    onClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-success text-success-foreground',
      'Pending': 'bg-warning text-warning-foreground',
      'Inactive': 'bg-muted text-muted-foreground',
      'Error': 'bg-destructive text-destructive-foreground'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Active': 'CheckCircle',
      'Pending': 'Clock',
      'Inactive': 'XCircle',
      'Error': 'AlertCircle'
    };
    return icons[status] || 'XCircle';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Syndication Manager</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage where your property is listed across platforms
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
          {/* Property Info */}
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Home" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {property?.address || '123 Main Street, Anytown, ST 12345'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {property?.type || 'Single Family'} • ${property?.price?.toLocaleString() || '500,000'}
                </p>
              </div>
            </div>
          </div>

          {/* Sync Actions */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Platform Settings</h3>
              <p className="text-sm text-muted-foreground">
                Choose where to syndicate your property listing
              </p>
            </div>
            <Button
              variant="outline"
              iconName="RefreshCw"
              iconPosition="left"
              loading={isUpdating}
              onClick={handleSyncAll}
            >
              Sync All
            </Button>
          </div>

          {/* Platform List */}
          <div className="space-y-4">
            {platforms.map((platform) => {
              const settings = syndicationSettings[platform.id];
              return (
                <div key={platform.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Platform Icon */}
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={platform.icon} size={24} className="text-muted-foreground" />
                    </div>

                    {/* Platform Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-foreground">{platform.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(settings.status)}`}>
                          <Icon name={getStatusIcon(settings.status)} size={12} />
                          {settings.status}
                        </span>
                        {platform.required && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {platform.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {platform.features.map((feature, index) => (
                          <span key={index} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Last Sync */}
                      <p className="text-xs text-muted-foreground">
                        Last synced: {settings.lastSync}
                      </p>
                    </div>

                    {/* Toggle */}
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={settings.enabled}
                        onChange={(e) => handlePlatformToggle(platform.id, e.target.checked)}
                        disabled={platform.required}
                      />
                    </div>
                  </div>

                  {/* Platform-specific Settings */}
                  {settings.enabled && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Views:</span>
                          <span className="ml-2 font-medium text-foreground">
                            {Math.floor(Math.random() * 100) + 20}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Inquiries:</span>
                          <span className="ml-2 font-medium text-foreground">
                            {Math.floor(Math.random() * 10) + 1}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Leads:</span>
                          <span className="ml-2 font-medium text-foreground">
                            {Math.floor(Math.random() * 5) + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Syndication Summary */}
          <div className="mt-6 p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span className="font-medium text-foreground">Syndication Summary</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your property will be syndicated to{' '}
              <span className="font-medium text-foreground">
                {Object.values(syndicationSettings).filter(s => s.enabled).length}
              </span>{' '}
              platforms. Changes may take up to 24 hours to appear on all platforms.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SyndicationManager;