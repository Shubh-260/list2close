import React from 'react';
import Icon from '../../../components/AppIcon';

const TimelineView = ({ transactions, onTransactionSelect }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-muted',
      under_contract: 'bg-warning',
      inspection: 'bg-accent',
      appraisal: 'bg-primary',
      financing: 'bg-secondary',
      final_walkthrough: 'bg-success',
      closing: 'bg-success',
      closed: 'bg-success',
      cancelled: 'bg-destructive'
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

  // Sort transactions by closing date
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.closingDate) - new Date(b.closingDate)
  );

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-8">
        {sortedTransactions.map((transaction, index) => (
          <div key={transaction.id} className="relative flex items-start gap-6">
            {/* Timeline Dot */}
            <div className={`w-4 h-4 rounded-full ${getStatusColor(transaction.status)} border-4 border-background relative z-10`} />

            {/* Transaction Card */}
            <div 
              className="flex-1 bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onTransactionSelect(transaction)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{transaction.id}</h3>
                  <p className="text-sm text-muted-foreground">{transaction.property.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatPrice(transaction.property.price)}</p>
                  <p className="text-sm text-muted-foreground capitalize">{transaction.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-xs text-muted-foreground">Client</span>
                  <p className="text-sm font-medium text-foreground">{transaction.client.name}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Agent</span>
                  <p className="text-sm font-medium text-foreground">{transaction.agent}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Closing Date</span>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(transaction.closingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs text-muted-foreground">{transaction.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(transaction.status)}`}
                    style={{ width: `${transaction.progress}%` }}
                  />
                </div>
              </div>

              {/* Current Step */}
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Current: {transaction.timeline.find(step => step.current)?.step || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <Icon name="GitBranch" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">No transactions in timeline</h3>
          <p className="text-muted-foreground">
            Transactions will appear here as they progress through different stages.
          </p>
        </div>
      )}
    </div>
  );
};

export default TimelineView;