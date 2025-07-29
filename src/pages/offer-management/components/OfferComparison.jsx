import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OfferComparison = ({ offers, isOpen, onClose }) => {
  if (!isOpen || offers.length < 2) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateNetToSeller = (offer) => {
    const commissionRate = 0.06;
    const commission = offer.offerPrice * commissionRate;
    const estimatedClosingCosts = offer.offerPrice * 0.02;
    return offer.offerPrice - commission - estimatedClosingCosts;
  };

  const getFinancingRisk = (financing) => {
    const riskLevels = {
      'Cash': { level: 'Low', color: 'text-success' },
      'Conventional': { level: 'Low', color: 'text-success' },
      'FHA': { level: 'Medium', color: 'text-warning' },
      'VA': { level: 'Medium', color: 'text-warning' },
      'USDA': { level: 'Medium', color: 'text-warning' }
    };
    return riskLevels[financing] || { level: 'High', color: 'text-destructive' };
  };

  const getBestOffer = () => {
    return offers.reduce((best, current) => {
      const bestNet = calculateNetToSeller(best);
      const currentNet = calculateNetToSeller(current);
      return currentNet > bestNet ? current : best;
    });
  };

  const bestOffer = getBestOffer();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Offer Comparison</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Comparing {offers.length} offers for {offers[0]?.property.address}
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* AI Recommendation */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Brain" size={20} className="text-primary" />
              <h3 className="font-medium text-foreground">AI Recommendation</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Based on price, terms, and risk analysis, <strong>{bestOffer.id}</strong> from{' '}
              <strong>{bestOffer.buyer.name}</strong> appears to be the strongest offer.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span>Highest net to seller: {formatPrice(calculateNetToSeller(bestOffer))}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span>Risk level: {getFinancingRisk(bestOffer.financing).level}</span>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-foreground">Criteria</th>
                  {offers.map((offer) => (
                    <th key={offer.id} className="text-left p-4 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {offer.id}
                        {offer.id === bestOffer.id && (
                          <Icon name="Crown" size={16} className="text-warning" />
                        )}
                      </div>
                      <div className="text-sm font-normal text-muted-foreground">
                        {offer.buyer.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Offer Price */}
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Offer Price</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="font-medium text-foreground">{formatPrice(offer.offerPrice)}</div>
                      <div className="text-sm text-muted-foreground">
                        {((offer.offerPrice / offer.property.listPrice) * 100).toFixed(1)}% of list
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Net to Seller */}
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Est. Net to Seller</td>
                  {offers.map((offer) => {
                    const net = calculateNetToSeller(offer);
                    const isHighest = net === Math.max(...offers.map(o => calculateNetToSeller(o)));
                    return (
                      <td key={offer.id} className="p-4">
                        <div className={`font-medium ${isHighest ? 'text-success' : 'text-foreground'}`}>
                          {formatPrice(net)}
                          {isHighest && <Icon name="TrendingUp" size={16} className="inline ml-1" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Financing */}
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Financing</td>
                  {offers.map((offer) => {
                    const risk = getFinancingRisk(offer.financing);
                    return (
                      <td key={offer.id} className="p-4">
                        <div className="font-medium text-foreground">{offer.financing}</div>
                        <div className={`text-sm ${risk.color}`}>
                          {risk.level} Risk
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Down Payment */}
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Down Payment</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="font-medium text-foreground">{formatPrice(offer.downPayment)}</div>
                      <div className="text-sm text-muted-foreground">
                        {((offer.downPayment / offer.offerPrice) * 100).toFixed(1)}%
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Earnest Money */}
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Earnest Money</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="font-medium text-foreground">{formatPrice(offer.earnestMoney)}</div>
                    </td>
                  ))}
                </tr>

                {/* Contingencies */}
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Contingencies</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="font-medium text-foreground">{offer.contingencies.length}</div>
                      <div className="text-sm text-muted-foreground">
                        {offer.contingencies.join(', ')}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Closing Date */}
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Closing Date</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="font-medium text-foreground">
                        {new Date(offer.closingDate).toLocaleDateString()}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Expiration */}
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Expires</td>
                  {offers.map((offer) => {
                    const daysUntilExpiration = Math.ceil(
                      (new Date(offer.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <td key={offer.id} className="p-4">
                        <div className="font-medium text-foreground">
                          {new Date(offer.expirationDate).toLocaleDateString()}
                        </div>
                        <div className={`text-sm ${daysUntilExpiration <= 1 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {daysUntilExpiration > 0 ? `${daysUntilExpiration} days` : 'Expired'}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Status */}
                <tr>
                  <td className="p-4 font-medium text-foreground">Status</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        offer.status === 'pending' ? 'bg-warning text-warning-foreground' :
                        offer.status === 'accepted' ? 'bg-success text-success-foreground' :
                        offer.status === 'rejected' ? 'bg-destructive text-destructive-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {offer.status}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Highest Offer</h4>
              <p className="text-sm text-muted-foreground">
                {offers.reduce((highest, current) => 
                  current.offerPrice > highest.offerPrice ? current : highest
                ).buyer.name} - {formatPrice(Math.max(...offers.map(o => o.offerPrice)))}
              </p>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Lowest Risk</h4>
              <p className="text-sm text-muted-foreground">
                {offers.find(o => o.financing === 'Cash')?.buyer.name || 'None'} - Cash offers have lowest risk
              </p>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Fastest Closing</h4>
              <p className="text-sm text-muted-foreground">
                {offers.reduce((fastest, current) => 
                  new Date(current.closingDate) < new Date(fastest.closingDate) ? current : fastest
                ).buyer.name} - {new Date(Math.min(...offers.map(o => new Date(o.closingDate)))).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close Comparison
          </Button>
          <Button variant="default" iconName="Download">
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfferComparison;