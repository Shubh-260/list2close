import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const LeadFilters = ({ onFiltersChange, resultCount }) => {
  const [filters, setFilters] = useState({
    search: '',
    source: '',
    scoreRange: '',
    activityDate: '',
    status: '',
    tags: []
  });

  const [isExpanded, setIsExpanded] = useState(true);

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'open_house', label: 'Open House' },
    { value: 'zillow', label: 'Zillow' },
    { value: 'realtor_com', label: 'Realtor.com' }
  ];

  const scoreRangeOptions = [
    { value: '', label: 'All Scores' },
    { value: '90-100', label: 'Hot (90-100)' },
    { value: '70-89', label: 'Warm (70-89)' },
    { value: '50-69', label: 'Cold (50-69)' },
    { value: '0-49', label: 'Unqualified (0-49)' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'nurturing', label: 'Nurturing' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' }
  ];

  const availableTags = [
    'First Time Buyer',
    'Investor',
    'Luxury Market',
    'Relocating',
    'Downsizing',
    'Upsizing',
    'Cash Buyer',
    'Pre-approved'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      source: '',
      scoreRange: '',
      activityDate: '',
      status: '',
      tags: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="font-medium text-text-primary">Filters</h3>
          {resultCount !== undefined && (
            <span className="px-2 py-1 bg-accent/10 text-accent text-sm rounded-full">
              {resultCount} results
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-text-secondary" 
            />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <Input
              type="search"
              placeholder="Search leads by name, email, or phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Source Filter */}
          <div>
            <Select
              label="Lead Source"
              options={sourceOptions}
              value={filters.source}
              onChange={(value) => handleFilterChange('source', value)}
            />
          </div>

          {/* Score Range Filter */}
          <div>
            <Select
              label="Qualification Score"
              options={scoreRangeOptions}
              value={filters.scoreRange}
              onChange={(value) => handleFilterChange('scoreRange', value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <Select
              label="Lead Status"
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          {/* Activity Date Filter */}
          <div>
            <Input
              type="date"
              label="Last Activity After"
              value={filters.activityDate}
              onChange={(e) => handleFilterChange('activityDate', e.target.value)}
            />
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tags
            </label>
            <div className="space-y-2">
              {availableTags.map((tag) => (
                <Checkbox
                  key={tag}
                  label={tag}
                  checked={filters.tags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadFilters;