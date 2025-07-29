import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PropertyCard from './components/PropertyCard';
import PropertyFilters from './components/PropertyFilters';
import AddListingModal from './components/AddListingModal';
import PropertyAnalytics from './components/PropertyAnalytics';
import SyndicationManager from './components/SyndicationManager';

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    location: 'all',
    priceRange: { min: null, max: null },
    syndication: [],
    hasVirtualTour: false,
    featuredOnly: false,
    minBedrooms: '',
    minBathrooms: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSyndicationOpen, setIsSyndicationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockProperties = [
    {
      id: 1,
      address: "123 Oak Street, Downtown, CA 90210",
      price: 750000,
      type: "Single Family",
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 2100,
      status: "Active",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      hasVirtualTour: true,
      views: 245,
      inquiries: 18,
      showings: 12,
      lastUpdated: "2 hours ago",
      syndication: [
        { name: "MLS", status: "Active" },
        { name: "Zillow", status: "Active" },
        { name: "Realtor.com", status: "Active" },
        { name: "Trulia", status: "Pending" }
      ]
    },
    {
      id: 2,
      address: "456 Pine Avenue, Suburbs, CA 90211",
      price: 525000,
      type: "Condo",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1450,
      status: "Pending",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
      ],
      hasVirtualTour: false,
      views: 189,
      inquiries: 12,
      showings: 8,
      lastUpdated: "1 day ago",
      syndication: [
        { name: "MLS", status: "Active" },
        { name: "Zillow", status: "Active" },
        { name: "Realtor.com", status: "Inactive" }
      ]
    },
    {
      id: 3,
      address: "789 Maple Drive, Waterfront, CA 90212",
      price: 1200000,
      type: "Single Family",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3200,
      status: "Active",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
      ],
      hasVirtualTour: true,
      views: 412,
      inquiries: 28,
      showings: 15,
      lastUpdated: "3 hours ago",
      syndication: [
        { name: "MLS", status: "Active" },
        { name: "Zillow", status: "Active" },
        { name: "Realtor.com", status: "Active" },
        { name: "Trulia", status: "Active" }
      ]
    },
    {
      id: 4,
      address: "321 Cedar Lane, Hills, CA 90213",
      price: 425000,
      type: "Townhouse",
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1800,
      status: "Draft",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
      ],
      hasVirtualTour: false,
      views: 0,
      inquiries: 0,
      showings: 0,
      lastUpdated: "5 hours ago",
      syndication: []
    },
    {
      id: 5,
      address: "654 Birch Court, Downtown, CA 90214",
      price: 850000,
      type: "Multi-Family",
      bedrooms: 6,
      bathrooms: 4,
      sqft: 2800,
      status: "Sold",
      images: [
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop"
      ],
      hasVirtualTour: true,
      views: 356,
      inquiries: 24,
      showings: 18,
      lastUpdated: "1 week ago",
      syndication: [
        { name: "MLS", status: "Inactive" },
        { name: "Zillow", status: "Inactive" }
      ]
    },
    {
      id: 6,
      address: "987 Elm Street, Suburbs, CA 90215",
      price: 675000,
      type: "Single Family",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2000,
      status: "Active",
      images: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
      ],
      hasVirtualTour: false,
      views: 167,
      inquiries: 9,
      showings: 6,
      lastUpdated: "4 hours ago",
      syndication: [
        { name: "MLS", status: "Active" },
        { name: "Zillow", status: "Active" }
      ]
    }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'views', label: 'Most Views' },
    { value: 'inquiries', label: 'Most Inquiries' }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties, sortBy]);

  const applyFilters = () => {
    let filtered = [...properties];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.address.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.type.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(property =>
        property.type.toLowerCase().replace(' ', '-') === filters.type
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(property =>
        property.status.toLowerCase() === filters.status
      );
    }

    // Price range filter
    if (filters.priceRange.min) {
      filtered = filtered.filter(property => property.price >= filters.priceRange.min);
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(property => property.price <= filters.priceRange.max);
    }

    // Virtual tour filter
    if (filters.hasVirtualTour) {
      filtered = filtered.filter(property => property.hasVirtualTour);
    }

    // Bedrooms filter
    if (filters.minBedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.minBedrooms));
    }

    // Bathrooms filter
    if (filters.minBathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.minBathrooms));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'oldest':
          return new Date(a.lastUpdated) - new Date(b.lastUpdated);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'views':
          return b.views - a.views;
        case 'inquiries':
          return b.inquiries - a.inquiries;
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      location: 'all',
      priceRange: { min: null, max: null },
      syndication: [],
      hasVirtualTour: false,
      featuredOnly: false,
      minBedrooms: '',
      minBathrooms: ''
    });
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setIsAddModalOpen(true);
  };

  const handleViewAnalytics = (property) => {
    setSelectedProperty(property);
    setIsAnalyticsOpen(true);
  };

  const handleToggleSyndication = (property) => {
    setSelectedProperty(property);
    setIsSyndicationOpen(true);
  };

  const handleSaveProperty = (propertyData) => {
    if (selectedProperty) {
      // Update existing property
      setProperties(prev => prev.map(p => 
        p.id === selectedProperty.id ? { ...p, ...propertyData } : p
      ));
    } else {
      // Add new property
      const newProperty = {
        ...propertyData,
        id: Date.now(),
        views: 0,
        inquiries: 0,
        showings: 0,
        lastUpdated: 'Just now',
        syndication: []
      };
      setProperties(prev => [newProperty, ...prev]);
    }
    setSelectedProperty(null);
  };

  const handleUpdateSyndication = (syndicationData) => {
    if (selectedProperty) {
      const updatedSyndication = Object.entries(syndicationData)
        .filter(([_, settings]) => settings.enabled)
        .map(([platform, settings]) => ({
          name: platform.charAt(0).toUpperCase() + platform.slice(1),
          status: settings.status
        }));

      setProperties(prev => prev.map(p => 
        p.id === selectedProperty.id 
          ? { ...p, syndication: updatedSyndication }
          : p
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading properties...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Filters */}
        <div className="hidden lg:block w-80 flex-shrink-0 p-6">
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Property Listings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your property portfolio and syndication
              </p>
            </div>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => {
                setSelectedProperty(null);
                setIsAddModalOpen(true);
              }}
            >
              Add Listing
            </Button>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search properties by address or type..."
                value={filters.search}
                onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="w-48"
              />
              <div className="flex border border-border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon name="Grid3X3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon name="List" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-6">
            <Button variant="outline" iconName="Filter" iconPosition="left" fullWidth>
              Show Filters ({Object.values(filters).filter(v => v && v !== 'all' && v !== '' && (typeof v !== 'object' || Object.values(v).some(val => val))).length})
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Properties Grid/List */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Home" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or add a new property listing.
              </p>
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                onClick={() => {
                  setSelectedProperty(null);
                  setIsAddModalOpen(true);
                }}
              >
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' :'space-y-4'
            }`}>
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={handleEditProperty}
                  onViewAnalytics={handleViewAnalytics}
                  onToggleSyndication={handleToggleSyndication}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedProperty(null);
        }}
        onSave={handleSaveProperty}
        property={selectedProperty}
      />

      <PropertyAnalytics
        property={selectedProperty}
        isOpen={isAnalyticsOpen}
        onClose={() => {
          setIsAnalyticsOpen(false);
          setSelectedProperty(null);
        }}
      />

      <SyndicationManager
        property={selectedProperty}
        isOpen={isSyndicationOpen}
        onClose={() => {
          setIsSyndicationOpen(false);
          setSelectedProperty(null);
        }}
        onUpdateSyndication={handleUpdateSyndication}
      />
    </div>
  );
};

export default PropertyListings;