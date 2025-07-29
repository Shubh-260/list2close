import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const OfferCard = ({ offer, isSelected, onSelect, onView, onUpdate }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning text-warning-foreground',
      reviewed: 'bg-accent text-accent-foreground',
      countered: 'bg-secondary text-secondary-foreground',
      accepted: 'bg-success text-success-foreground',
      rejected: 'bg-destructive text-destructive-foreground',
      expired: 'bg-muted text-muted-foreground',
      withdrawn: 'bg-muted text-muted-foreground'
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

  const calculateNetToSeller = () => {
    // Simplified calculation - in reality this would be more complex
    const commissionRate = 0.06; // 6%
    const commission = offer.offerPrice * commissionRate;
    const estimatedClosingCosts = offer.offerPrice * 0.02; // 2%
    return offer.offerPrice - commission - estimatedClosingCosts;
  };

  const getDaysUntilExpiration = () => {
    const today = new Date();
    const expirationDate = new Date(offer.expirationDate);
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFinancingIcon = (financing) => {
    const icons = {
      'Cash': 'DollarSign',
      'Conventional': 'CreditCard',
      'FHA': 'Home',
      'VA': 'Shield',
      'USDA': 'Leaf'
    };
    return icons[financing] || 'CreditCard';
  };

  const daysUntilExpiration = getDaysUntilExpiration();
  const netToSeller = calculateNetToSeller();
  const offerPercentage = ((offer.offerPrice / offer.property.listPrice) * 100).toFixed(1);

  return (
    <div className={`bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
      isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
            />
            <div>
              <h3 className="font-medium text-foreground">{offer.id}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(offer.submittedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offer.status)}`}>
            {offer.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="MapPin" size={14} className="text-muted-foreground" />
            <span className="text-foreground truncate">{offer.property.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="User" size={14} className="text-muted-foreground" />
            <span className="text-foreground">{offer.buyer.name}</span>
          </div>
        </div>
      </div>

      {/* Offer Details */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-muted-foreground">List Price</span>
            <p className="font-medium text-foreground">{formatPrice(offer.property.listPrice)}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Offer Price</span>
            <p className="font-medium text-foreground">{formatPrice(offer.offerPrice)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Offer Strength</span>
          <span className={`text-sm font-medium ${
            parseFloat(offerPercentage) >= 100 ? 'text-success' :
            parseFloat(offerPercentage) >= 95 ? 'text-warning' : 'text-destructive'
          }`}>
            {offerPercentage}% of list
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Earnest Money</span>
            <p className="font-medium text-foreground">{formatPrice(offer.earnestMoney)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Down Payment</span>
            <p className="font-medium text-foreground">{formatPrice(offer.downPayment)}</p>
          </div>
        </div>
      </div>

      {/* Financing & Terms */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Icon name={getFinancingIcon(offer.financing)} size={16} className="text-primary" />
          <span className="font-medium text-foreground">{offer.financing}</span>
          {offer.financing === 'Cash' && (
            <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full">
              No Financing Risk
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Contingencies</span>
            <span className="text-foreground">{offer.contingencies.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Closing Date</span>
            <span className="text-foreground">
              {new Date(offer.closingDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Net to Seller</span>
            <span className="font-medium text-foreground">{formatPrice(netToSeller)}</span>
          </div>
        </div>
      </div>

      {/* Expiration Warning */}
      {daysUntilExpiration <= 2 && daysUntilExpiration > 0 && (
        <div className="p-3 bg-warning/10 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={14} className="text-warning" />
            <span className="text-sm text-warning font-medium">
              Expires in {daysUntilExpiration} day{daysUntilExpiration !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="MessageSquare"
            onClick={() => console.log('Contact buyer')}
          />
          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            onClick={() => console.log('View documents')}
          />
        </div>
      </div>
    </div>
  );
};

export default OfferCard;