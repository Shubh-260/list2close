import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import OfferCard from './components/OfferCard';
import OfferDetails from './components/OfferDetails';
import CreateOfferModal from './components/CreateOfferModal';
import OfferComparison from './components/OfferComparison';
import apiClient from '../../services/apiClient';
import websocketService from '../../services/websocketService';

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    property: 'all',
    dateRange: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Under Review' },
    { value: 'countered', label: 'Countered' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'expired', label: 'Expired' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ];

  useEffect(() => {
    loadOffers();
    setupWebSocketListeners();

    return () => {
      websocketService.off('offerUpdate', handleOfferUpdate);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [offers, filters]);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      // Load mock data for demo
      setOffers(mockOffers);
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocketListeners = () => {
    websocketService.on('offerUpdate', handleOfferUpdate);
    websocketService.subscribeToOffers();
  };

  const handleOfferUpdate = (updatedOffer) => {
    setOffers(prev => 
      prev.map(o => o.id === updatedOffer.id ? updatedOffer : o)
    );
  };

  const applyFilters = () => {
    let filtered = [...offers];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(offer =>
        offer.property.address.toLowerCase().includes(searchTerm) ||
        offer.buyer.name.toLowerCase().includes(searchTerm) ||
        offer.id.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(o => o.status === filters.status);
    }

    setFilteredOffers(filtered);
  };

  const handleCreateOffer = async (offerData) => {
    try {
      const newOffer = await apiClient.createOffer(offerData);
      setOffers(prev => [newOffer, ...prev]);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleUpdateOffer = async (offerId, updates) => {
    try {
      const updatedOffer = await apiClient.updateOffer(offerId, updates);
      setOffers(prev => 
        prev.map(o => o.id === offerId ? updatedOffer : o)
      );
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };

  const handleCompareOffers = () => {
    if (selectedOffers.length >= 2) {
      setIsComparisonOpen(true);
    }
  };

  const mockOffers = [
    {
      id: 'OFF-001',
      property: {
        address: '123 Oak Street, Downtown, CA 90210',
        listPrice: 750000,
        type: 'Single Family'
      },
      buyer: {
        name: 'John & Mary Smith',
        agent: 'Mike Chen',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567'
      },
      offerPrice: 725000,
      earnestMoney: 15000,
      downPayment: 145000,
      financing: 'Conventional',
      contingencies: ['Inspection', 'Financing', 'Appraisal'],
      closingDate: new Date('2025-03-15'),
      expirationDate: new Date('2025-02-05'),
      status: 'pending',
      submittedDate: new Date('2025-01-28'),
      terms: {
        inspectionPeriod: 10,
        financingContingency: 21,
        appraisalContingency: true,
        personalProperty: ['Refrigerator', 'Washer/Dryer'],
        specialConditions: 'Seller to provide home warranty'
      },
      documents: [
        { name: 'Purchase Agreement', status: 'signed', date: '2025-01-28' },
        { name: 'Pre-approval Letter', status: 'attached', date: '2025-01-28' }
      ]
    },
    {
      id: 'OFF-002',
      property: {
        address: '123 Oak Street, Downtown, CA 90210',
        listPrice: 750000,
        type: 'Single Family'
      },
      buyer: {
        name: 'David & Lisa Wilson',
        agent: 'Sarah Johnson',
        email: 'david.wilson@email.com',
        phone: '(555) 234-5678'
      },
      offerPrice: 760000,
      earnestMoney: 20000,
      downPayment: 152000,
      financing: 'Cash',
      contingencies: ['Inspection'],
      closingDate: new Date('2025-02-28'),
      expirationDate: new Date('2025-02-05'),
      status: 'reviewed',
      submittedDate: new Date('2025-01-29'),
      terms: {
        inspectionPeriod: 7,
        financingContingency: 0,
        appraisalContingency: false,
        personalProperty: ['All appliances'],
        specialConditions: 'As-is condition, no repairs'
      },
      documents: [
        { name: 'Purchase Agreement', status: 'signed', date: '2025-01-29' },
        { name: 'Proof of Funds', status: 'attached', date: '2025-01-29' }
      ]
    },
    {
      id: 'OFF-003',
      property: {
        address: '456 Pine Avenue, Suburbs, CA 90211',
        listPrice: 525000,
        type: 'Condo'
      },
      buyer: {
        name: 'Jennifer Brown',
        agent: 'Lisa Rodriguez',
        email: 'jennifer.brown@email.com',
        phone: '(555) 345-6789'
      },
      offerPrice: 510000,
      earnestMoney: 10000,
      downPayment: 102000,
      financing: 'FHA',
      contingencies: ['Inspection', 'Financing', 'Appraisal'],
      closingDate: new Date('2025-03-30'),
      expirationDate: new Date('2025-02-10'),
      status: 'countered',
      submittedDate: new Date('2025-01-25'),
      terms: {
        inspectionPeriod: 14,
        financingContingency: 30,
        appraisalContingency: true,
        personalProperty: [],
        specialConditions: 'Seller to pay closing costs up to $5,000'
      },
      documents: [
        { name: 'Purchase Agreement', status: 'signed', date: '2025-01-25' },
        { name: 'Pre-approval Letter', status: 'attached', date: '2025-01-25' },
        { name: 'Counter Offer', status: 'pending', date: '2025-01-30' }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading offers...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Offer Management - RealtyFlow AI</title>
        <meta name="description" content="Manage and compare real estate offers with AI-powered insights and automated workflows." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Offer Management</h1>
              <p className="text-muted-foreground mt-1">
                Track, compare, and manage property offers
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedOffers.length >= 2 && (
                <Button
                  variant="outline"
                  iconName="BarChart3"
                  iconPosition="left"
                  onClick={handleCompareOffers}
                >
                  Compare ({selectedOffers.length})
                </Button>
              )}
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
              >
                New Offer
              </Button>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search offers by property, buyer, or ID..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <Select
                options={statusOptions}
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                className="w-48"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredOffers.length} of {offers.length} offers
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded-full" />
                <span>Pending: {offers.filter(o => o.status === 'pending').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span>Accepted: {offers.filter(o => o.status === 'accepted').length}</span>
              </div>
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isSelected={selectedOffers.includes(offer.id)}
                onSelect={(selected) => {
                  if (selected) {
                    setSelectedOffers(prev => [...prev, offer.id]);
                  } else {
                    setSelectedOffers(prev => prev.filter(id => id !== offer.id));
                  }
                }}
                onView={() => {
                  setSelectedOffer(offer);
                  setIsDetailsOpen(true);
                }}
                onUpdate={handleUpdateOffer}
              />
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No offers found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first offer or adjust your search criteria.
              </p>
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Offer
              </Button>
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateOfferModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateOffer}
        />

        <OfferDetails
          offer={selectedOffer}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedOffer(null);
          }}
          onUpdate={handleUpdateOffer}
        />

        <OfferComparison
          offers={offers.filter(o => selectedOffers.includes(o.id))}
          isOpen={isComparisonOpen}
          onClose={() => {
            setIsComparisonOpen(false);
            setSelectedOffers([]);
          }}
        />
      </div>
    </>
  );
};

export default OfferManagement;