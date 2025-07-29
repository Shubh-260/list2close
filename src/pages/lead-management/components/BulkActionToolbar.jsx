import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionToolbar = ({ selectedLeads, onBulkAction, totalLeads, qualifyingLeads = new Set() }) => {
  const [showActions, setShowActions] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [assignAgent, setAssignAgent] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [enrollCampaign, setEnrollCampaign] = useState('');

  const agentOptions = [
    { value: '', label: 'Select Agent' },
    { value: 'sarah_johnson', label: 'Sarah Johnson' },
    { value: 'mike_chen', label: 'Mike Chen' },
    { value: 'lisa_rodriguez', label: 'Lisa Rodriguez' },
    { value: 'david_kim', label: 'David Kim' }
  ];

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'nurturing', label: 'Nurturing' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' }
  ];

  const campaignOptions = [
    { value: '', label: 'Select Campaign' },
    { value: 'first_time_buyer', label: 'First Time Buyer Nurture' },
    { value: 'luxury_homes', label: 'Luxury Homes Campaign' },
    { value: 'investor_series', label: 'Investor Education Series' },
    { value: 'market_update', label: 'Monthly Market Updates' }
  ];

  const bulkActions = [
    { 
      label: 'AI Qualify Selected', 
      value: 'ai_qualify', 
      icon: 'Brain',
      description: 'Use AI to automatically qualify and score selected leads'
    },
    { 
      label: 'Assign to Agent', 
      value: 'assign', 
      icon: 'UserPlus',
      description: 'Assign selected leads to a team member'
    },
    { 
      label: 'Update Status', 
      value: 'status', 
      icon: 'CheckSquare',
      description: 'Update the status of selected leads'
    },
    { 
      label: 'Enroll in Campaign', 
      value: 'campaign', 
      icon: 'PlusCircle',
      description: 'Enroll selected leads in a campaign'
    },
    { 
      label: 'Delete', 
      value: 'delete', 
      icon: 'Trash2',
      description: 'Delete selected leads'
    }
  ];

  const handleBulkAction = (action, value = null) => {
    onBulkAction(action, selectedLeads, value);
    
    // Reset form values after action
    if (action === 'assign') setAssignAgent('');
    if (action === 'status') setUpdateStatus('');
    if (action === 'campaign') setEnrollCampaign('');
  };

  const selectedCount = selectedLeads.length;

  if (selectedCount === 0) {
    return (
      <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-center gap-3">
          <Icon name="Users" size={20} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">
            {totalLeads} total leads
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
            Add Lead
          </Button>
          <Button variant="outline" size="sm" iconName="Upload" iconPosition="left">
            Import
          </Button>
          <Button variant="default" size="sm" iconName="Download" iconPosition="left">
            Export
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {selectedLeads.length > 0 ? (
              <>
                <span className="font-medium text-foreground">{selectedLeads.length}</span> of {totalLeads} leads selected
                {qualifyingLeads.size > 0 && (
                  <span className="ml-2 text-orange-600">
                    ({qualifyingLeads.size} being qualified by AI)
                  </span>
                )}
              </>
            ) : (
              `${totalLeads} total leads`
            )}
          </div>
          
          {selectedLeads.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('clear')}
              iconName="X"
              iconPosition="left"
            >
              Clear Selection
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('delete')}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkAction('clear')}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {showActions && (
        <div className="mt-4 pt-4 border-t border-accent/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Assign Agent */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select
                  label="Assign to Agent"
                  options={agentOptions}
                  value={assignAgent}
                  onChange={setAssignAgent}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!assignAgent}
                onClick={() => handleBulkAction('assign', assignAgent)}
              >
                Assign
              </Button>
            </div>

            {/* Update Status */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select
                  label="Update Status"
                  options={statusOptions}
                  value={updateStatus}
                  onChange={setUpdateStatus}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!updateStatus}
                onClick={() => handleBulkAction('status', updateStatus)}
              >
                Update
              </Button>
            </div>

            {/* Enroll in Campaign */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select
                  label="Enroll in Campaign"
                  options={campaignOptions}
                  value={enrollCampaign}
                  onChange={setEnrollCampaign}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!enrollCampaign}
                onClick={() => handleBulkAction('campaign', enrollCampaign)}
              >
                Enroll
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionToolbar;