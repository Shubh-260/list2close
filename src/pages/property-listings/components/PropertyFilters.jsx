import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PropertyFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'single-family', label: 'Single Family' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'multi-family', label: 'Multi-Family' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
    { value: 'draft', label: 'Draft' },
    { value: 'expired', label: 'Expired' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown' },
    { value: 'suburbs', label: 'Suburbs' },
    { value: 'waterfront', label: 'Waterfront' },
    { value: 'hills', label: 'Hills' },
    { value: 'industrial', label: 'Industrial' }
  ];

  const syndicationPlatforms = [
    { id: 'mls', label: 'MLS', checked: filters.syndication?.includes('mls') || false },
    { id: 'zillow', label: 'Zillow', checked: filters.syndication?.includes('zillow') || false },
    { id: 'realtor', label: 'Realtor.com', checked: filters.syndication?.includes('realtor') || false },
    { id: 'trulia', label: 'Trulia', checked: filters.syndication?.includes('trulia') || false }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePriceChange = (type, value) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value ? parseInt(value) : null
      }
    });
  };

  const handleSyndicationChange = (platformId, checked) => {
    const currentSyndication = filters.syndication || [];
    const newSyndication = checked
      ? [...currentSyndication, platformId]
      : currentSyndication.filter(id => id !== platformId);
    
    onFiltersChange({
      ...filters,
      syndication: newSyndication
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.type && filters.type !== 'all') count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.location && filters.location !== 'all') count++;
    if (filters.priceRange?.min || filters.priceRange?.max) count++;
    if (filters.syndication?.length > 0) count++;
    if (filters.hasVirtualTour) count++;
    if (filters.featuredOnly) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <Input
              type="search"
              placeholder="Search properties..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Property Type */}
          <div>
            <Select
              label="Property Type"
              options={propertyTypes}
              value={filters.type || 'all'}
              onChange={(value) => handleFilterChange('type', value)}
            />
          </div>

          {/* Status */}
          <div>
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status || 'all'}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          {/* Location */}
          <div>
            <Select
              label="Location"
              options={locationOptions}
              value={filters.location || 'all'}
              onChange={(value) => handleFilterChange('location', value)}
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.priceRange?.min || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.priceRange?.max || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
              />
            </div>
          </div>

          {/* Syndication Platforms */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Syndication Platforms
            </label>
            <div className="space-y-2">
              {syndicationPlatforms.map((platform) => (
                <Checkbox
                  key={platform.id}
                  label={platform.label}
                  checked={platform.checked}
                  onChange={(e) => handleSyndicationChange(platform.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Additional Options
            </label>
            <div className="space-y-2">
              <Checkbox
                label="Has Virtual Tour"
                checked={filters.hasVirtualTour || false}
                onChange={(e) => handleFilterChange('hasVirtualTour', e.target.checked)}
              />
              <Checkbox
                label="Featured Properties Only"
                checked={filters.featuredOnly || false}
                onChange={(e) => handleFilterChange('featuredOnly', e.target.checked)}
              />
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Min Bedrooms
              </label>
              <Select
                options={[
                  { value: '', label: 'Any' },
                  { value: '1', label: '1+' },
                  { value: '2', label: '2+' },
                  { value: '3', label: '3+' },
                  { value: '4', label: '4+' },
                  { value: '5', label: '5+' }
                ]}
                value={filters.minBedrooms || ''}
                onChange={(value) => handleFilterChange('minBedrooms', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Min Bathrooms
              </label>
              <Select
                options={[
                  { value: '', label: 'Any' },
                  { value: '1', label: '1+' },
                  { value: '2', label: '2+' },
                  { value: '3', label: '3+' },
                  { value: '4', label: '4+' }
                ]}
                value={filters.minBathrooms || ''}
                onChange={(value) => handleFilterChange('minBathrooms', value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;