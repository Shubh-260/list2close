import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OfferDetails = ({ offer, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCountering, setIsCountering] = useState(false);
  const [counterOffer, setCounterOffer] = useState({
    price: '',
    closingDate: '',
    terms: ''
  });

  if (!isOpen || !offer) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'terms', label: 'Terms & Conditions', icon: 'List' },
    { id: 'documents', label: 'Documents', icon: 'Folder' },
    { id: 'communications', label: 'Communications', icon: 'MessageSquare' },
    { id: 'analysis', label: 'AI Analysis', icon: 'Brain' }
  ];

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

  const handleStatusUpdate = async (newStatus) => {
    try {
      await onUpdate(offer.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating offer status:', error);
    }
  };

  const handleCounterOffer = async () => {
    try {
      const counterData = {
        status: 'countered',
        counterOffer: {
          price: parseInt(counterOffer.price),
          closingDate: counterOffer.closingDate,
          terms: counterOffer.terms,
          submittedDate: new Date()
        }
      };
      await onUpdate(offer.id, counterData);
      setIsCountering(false);
      setCounterOffer({ price: '', closingDate: '', terms: '' });
    } catch (error) {
      console.error('Error submitting counter offer:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Property & Buyer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium text-foreground mb-3">Property Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Address</span>
              <p className="font-medium text-foreground">{offer.property.address}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">List Price</span>
              <p className="font-medium text-foreground">{formatPrice(offer.property.listPrice)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Property Type</span>
              <p className="font-medium text-foreground">{offer.property.type}</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium text-foreground mb-3">Buyer Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Name</span>
              <p className="font-medium text-foreground">{offer.buyer.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Agent</span>
              <p className="font-medium text-foreground">{offer.buyer.agent}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Contact</span>
              <p className="font-medium text-foreground">{offer.buyer.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Details */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Offer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Offer Price</span>
            <p className="text-xl font-bold text-foreground">{formatPrice(offer.offerPrice)}</p>
            <p className="text-sm text-muted-foreground">
              {((offer.offerPrice / offer.property.listPrice) * 100).toFixed(1)}% of list price
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Earnest Money</span>
            <p className="font-medium text-foreground">{formatPrice(offer.earnestMoney)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Down Payment</span>
            <p className="font-medium text-foreground">{formatPrice(offer.downPayment)}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Important Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Submitted</span>
            <p className="font-medium text-foreground">
              {new Date(offer.submittedDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Expires</span>
            <p className="font-medium text-foreground">
              {new Date(offer.expirationDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Closing Date</span>
            <p className="font-medium text-foreground">
              {new Date(offer.closingDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Financing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Financing Type</span>
            <p className="font-medium text-foreground">{offer.financing}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Down Payment</span>
            <p className="font-medium text-foreground">
              {formatPrice(offer.downPayment)} ({((offer.downPayment / offer.offerPrice) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Contingencies</h3>
        <div className="space-y-2">
          {offer.contingencies.map((contingency, index) => (
            <div key={index} className="flex items-center gap-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-foreground">{contingency}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Terms & Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Inspection Period</span>
            <p className="font-medium text-foreground">{offer.terms.inspectionPeriod} days</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Financing Contingency</span>
            <p className="font-medium text-foreground">{offer.terms.financingContingency} days</p>
          </div>
        </div>
        
        {offer.terms.personalProperty.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">Personal Property Included</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {offer.terms.personalProperty.map((item, index) => (
                <span key={index} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {offer.terms.specialConditions && (
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">Special Conditions</span>
            <p className="text-foreground mt-1">{offer.terms.specialConditions}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Offer Documents</h3>
        <Button variant="outline" size="sm" iconName="Upload">
          Upload Document
        </Button>
      </div>
      
      <div className="space-y-3">
        {offer.documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{doc.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {doc.status} • {doc.date}
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
    </div>
  );

  const renderCommunications = () => (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-foreground mb-2">Communication History</h3>
        <p className="text-muted-foreground mb-4">
          All communications related to this offer will appear here.
        </p>
        <Button variant="outline" iconName="Plus">
          Add Communication
        </Button>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Brain" size={20} className="text-primary" />
          <h3 className="font-medium text-foreground">AI Offer Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">85</div>
            <div className="text-sm text-muted-foreground">Offer Strength Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">Medium</div>
            <div className="text-sm text-muted-foreground">Risk Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">High</div>
            <div className="text-sm text-muted-foreground">Recommendation</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-foreground mb-2">Strengths</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                Strong offer price at {((offer.offerPrice / offer.property.listPrice) * 100).toFixed(1)}% of list
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                {offer.financing === 'Cash' ? 'Cash offer eliminates financing risk' : 'Pre-approved financing'}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                Reasonable closing timeline
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Considerations</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="AlertCircle" size={14} className="text-warning" />
                {offer.contingencies.length} contingencies may extend timeline
              </li>
              <li className="flex items-center gap-2">
                <Icon name="AlertCircle" size={14} className="text-warning" />
                Offer expires in {Math.ceil((new Date(offer.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))} days
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">AI Recommendation</h4>
            <p className="text-sm text-muted-foreground">
              This is a strong offer with minimal risk. Consider accepting or making a minor counter offer 
              to optimize terms while maintaining buyer interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{offer.id}</h2>
              <p className="text-sm text-muted-foreground">{offer.property.address}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(offer.status)}`}>
              {offer.status}
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
          {activeTab === 'terms' && renderTerms()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'communications' && renderCommunications()}
          {activeTab === 'analysis' && renderAnalysis()}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center gap-3">
            {offer.status === 'pending' && (
              <>
                <Button
                  variant="default"
                  iconName="Check"
                  iconPosition="left"
                  onClick={() => handleStatusUpdate('accepted')}
                >
                  Accept Offer
                </Button>
                <Button
                  variant="outline"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={() => setIsCountering(true)}
                >
                  Counter Offer
                </Button>
                <Button
                  variant="destructive"
                  iconName="X"
                  iconPosition="left"
                  onClick={() => handleStatusUpdate('rejected')}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Counter Offer Modal */}
        {isCountering && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-card rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-foreground mb-4">Submit Counter Offer</h3>
              
              <div className="space-y-4">
                <Input
                  label="Counter Price"
                  type="number"
                  placeholder={offer.offerPrice.toString()}
                  value={counterOffer.price}
                  onChange={(e) => setCounterOffer(prev => ({ ...prev, price: e.target.value }))}
                />
                
                <Input
                  label="Closing Date"
                  type="date"
                  value={counterOffer.closingDate}
                  onChange={(e) => setCounterOffer(prev => ({ ...prev, closingDate: e.target.value }))}
                />
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Additional Terms
                  </label>
                  <textarea
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Any additional terms or conditions..."
                    value={counterOffer.terms}
                    onChange={(e) => setCounterOffer(prev => ({ ...prev, terms: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button
                  variant="default"
                  onClick={handleCounterOffer}
                  disabled={!counterOffer.price}
                >
                  Submit Counter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCountering(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetails;