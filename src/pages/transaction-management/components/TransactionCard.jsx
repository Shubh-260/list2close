import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionCard = ({ transaction, onSelect, onUpdate }) => {
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

  const getTypeIcon = (type) => {
    const icons = {
      purchase: 'ShoppingCart',
      sale: 'DollarSign',
      lease: 'Key',
      refinance: 'RefreshCw'
    };
    return icons[type] || 'FileText';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDaysUntilClosing = () => {
    const today = new Date();
    const closingDate = new Date(transaction.closingDate);
    const diffTime = closingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCurrentStep = () => {
    return transaction.timeline.find(step => step.current) || 
           transaction.timeline.find(step => !step.completed);
  };

  const daysUntilClosing = getDaysUntilClosing();
  const currentStep = getCurrentStep();

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={getTypeIcon(transaction.type)} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{transaction.id}</h3>
              <p className="text-sm text-muted-foreground capitalize">{transaction.type}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
            {transaction.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="MapPin" size={14} className="text-muted-foreground" />
            <span className="text-foreground truncate">{transaction.property.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="DollarSign" size={14} className="text-muted-foreground" />
            <span className="font-medium text-foreground">{formatPrice(transaction.property.price)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="User" size={14} className="text-muted-foreground" />
            <span className="text-foreground">{transaction.client.name}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{transaction.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${transaction.progress}%` }}
          />
        </div>
        {currentStep && (
          <p className="text-xs text-muted-foreground mt-2">
            Current: {currentStep.step}
          </p>
        )}
      </div>

      {/* Timeline Info */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Contract Date</span>
            <p className="font-medium text-foreground">
              {new Date(transaction.contractDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Closing Date</span>
            <p className="font-medium text-foreground">
              {new Date(transaction.closingDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Icon 
            name="Clock" 
            size={14} 
            className={daysUntilClosing <= 7 ? 'text-warning' : 'text-muted-foreground'} 
          />
          <span className={`text-sm ${daysUntilClosing <= 7 ? 'text-warning font-medium' : 'text-muted-foreground'}`}>
            {daysUntilClosing > 0 ? `${daysUntilClosing} days until closing` : 'Closing overdue'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelect}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            onClick={() => console.log('Open documents')}
          />
          <Button
            variant="outline"
            size="sm"
            iconName="MessageSquare"
            onClick={() => console.log('Send message')}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;