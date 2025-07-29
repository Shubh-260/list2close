import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionDetails = ({ transaction, isOpen, onClose, onUpdate, onOpenDocuments }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  if (!isOpen || !transaction) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'timeline', label: 'Timeline', icon: 'GitBranch' },
    { id: 'documents', label: 'Documents', icon: 'Folder' },
    { id: 'communications', label: 'Communications', icon: 'MessageSquare' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-muted text-muted-foreground',
      under_contract: 'bg-warning text-warning-foreground',
      inspection: 'bg-accent text-accent-foreground',
      appraisal: 'bg-primary text-primary-foreground',
      financing: 'bg-secondary text-secondary-foreground',
      final_walkthrough: 'bg-success text-success-foreground',
      closing: 'bg-success text-success-foreground',
      closed: 'bg-success text-success-foreground',
      cancelled: 'bg-destructive text-destructive-foreground'
    };
    return colors[status] || colors.pending;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Property Information */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Property Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Address</label>
            <p className="font-medium text-foreground">{transaction.property.address}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Price</label>
            <p className="font-medium text-foreground">{formatPrice(transaction.property.price)}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Property Type</label>
            <p className="font-medium text-foreground">{transaction.property.type}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Transaction Type</label>
            <p className="font-medium text-foreground capitalize">{transaction.type}</p>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <p className="font-medium text-foreground">{transaction.client.name}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="font-medium text-foreground">{transaction.client.email}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Phone</label>
            <p className="font-medium text-foreground">{transaction.client.phone}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Agent</label>
            <p className="font-medium text-foreground">{transaction.agent}</p>
          </div>
        </div>
      </div>

      {/* Transaction Dates */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Important Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Contract Date</label>
            <p className="font-medium text-foreground">
              {new Date(transaction.contractDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Closing Date</label>
            <p className="font-medium text-foreground">
              {new Date(transaction.closingDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-4">
      {transaction.timeline.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            step.completed ? 'bg-success text-success-foreground' :
            step.current ? 'bg-primary text-primary-foreground' :
            'bg-muted text-muted-foreground'
          }`}>
            {step.completed ? (
              <Icon name="Check" size={16} />
            ) : (
              <span className="text-xs font-medium">{index + 1}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className={`font-medium ${step.completed ? 'text-foreground' : step.current ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.step}
              </h4>
              <span className="text-sm text-muted-foreground">
                {new Date(step.date).toLocaleDateString()}
              </span>
            </div>
            {step.current && (
              <p className="text-sm text-muted-foreground mt-1">
                Current step - in progress
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Transaction Documents</h3>
        <Button variant="outline" size="sm" iconName="Upload">
          Upload Document
        </Button>
      </div>
      
      <div className="space-y-3">
        {transaction.documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{doc.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {doc.type} • {doc.status} • {doc.uploadDate || 'Not uploaded'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" iconName="Download" />
              <Button variant="ghost" size="sm" iconName="Eye" />
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="outline" fullWidth onClick={onOpenDocuments}>
        Open Document Manager
      </Button>
    </div>
  );

  const renderCommunications = () => (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-foreground mb-2">Communication History</h3>
        <p className="text-muted-foreground mb-4">
          All communications related to this transaction will appear here.
        </p>
        <Button variant="outline" iconName="Plus">
          Add Communication
        </Button>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Icon name="CheckSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-foreground mb-2">Transaction Tasks</h3>
        <p className="text-muted-foreground mb-4">
          AI-generated tasks and reminders for this transaction.
        </p>
        <Button variant="outline" iconName="Plus">
          Add Task
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{transaction.id}</h2>
              <p className="text-sm text-muted-foreground">{transaction.property.address}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
              {transaction.status.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'timeline' && renderTimeline()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'communications' && renderCommunications()}
          {activeTab === 'tasks' && renderTasks()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" iconName="Edit">
            Edit Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;