import React, { useState, useEffect, useMemo } from 'react';

import Button from '../../components/ui/Button';
import LeadFilters from './components/LeadFilters';
import BulkActionToolbar from './components/BulkActionToolbar';
import LeadsTable from './components/LeadsTable';
import LeadMobileCard from './components/LeadMobileCard';
import { qualifyLead, generateFollowUpMessages } from '../../services/leadQualificationService';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'lastActivity', direction: 'desc' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [isLoading, setIsLoading] = useState(true);
  const [qualifyingLeads, setQualifyingLeads] = useState(new Set());

  // Mock leads data
  const mockLeads = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      source: "website",
      qualificationScore: 92,
      status: "qualified",
      lastActivity: {
        type: "Property inquiry",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      assignedTo: "Sarah Johnson",
      tags: ["First Time Buyer", "Pre-approved"],
      notes: "Interested in 3BR homes under $500K",
      message: "Looking for a 3-bedroom house under $500K in the downtown area. We're pre-approved and ready to move quickly.",
      budget: "$400K - $500K",
      timeline: "Next 30 days",
      propertyType: "Single Family Home"
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com", 
      phone: "(555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      source: "referral",
      qualificationScore: 87,
      status: "nurturing",
      lastActivity: {
        type: "Email opened",
        date: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      assignedTo: "Mike Chen",
      tags: ["Investor", "Cash Buyer"],
      notes: "Looking for investment properties in downtown area",
      message: "I'm an investor looking for rental properties in the downtown area. Cash buyer, looking for properties under $300K.",
      budget: "Under $300K",
      timeline: "Flexible",
      propertyType: "Multi-Family"
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.johnson@email.com",
      phone: "(555) 345-6789",
      avatar: null,
      source: "social_media",
      qualificationScore: 73,
      status: "contacted",
      lastActivity: {
        type: "Phone call",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      assignedTo: "Lisa Rodriguez",
      tags: ["Luxury Market"],
      notes: "Interested in luxury condos with city views"
    },
    {
      id: 4,
      name: "Sarah Davis",
      email: "sarah.davis@email.com",
      phone: "(555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      source: "zillow",
      qualificationScore: 65,
      status: "new",
      lastActivity: {
        type: "Form submission",
        date: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      assignedTo: "David Kim",
      tags: ["Relocating"],
      notes: "Moving from out of state, needs assistance with area"
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert.wilson@email.com",
      phone: "(555) 567-8901",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      source: "cold_call",
      qualificationScore: 45,
      status: "lost",
      lastActivity: {
        type: "No response",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      assignedTo: "Sarah Johnson",
      tags: [],
      notes: "Multiple attempts made, no response"
    },
    {
      id: 6,
      name: "Jennifer Brown",
      email: "jennifer.brown@email.com",
      phone: "(555) 678-9012",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      source: "open_house",
      qualificationScore: 89,
      status: "converted",
      lastActivity: {
        type: "Contract signed",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      assignedTo: "Mike Chen",
      tags: ["Downsizing", "Cash Buyer"],
      notes: "Successfully closed on downtown condo"
    },
    {
      id: 7,
      name: "David Martinez",
      email: "david.martinez@email.com",
      phone: "(555) 789-0123",
      avatar: null,
      source: "realtor_com",
      qualificationScore: 78,
      status: "qualified",
      lastActivity: {
        type: "Property showing",
        date: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      assignedTo: "Lisa Rodriguez",
      tags: ["Upsizing"],
      notes: "Growing family, needs larger home with good schools"
    },
    {
      id: 8,
      name: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      phone: "(555) 890-1234",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      source: "website",
      qualificationScore: 56,
      status: "nurturing",
      lastActivity: {
        type: "Newsletter click",
        date: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      assignedTo: "David Kim",
      tags: ["First Time Buyer"],
      notes: "Still researching, needs education on buying process"
    }
  ];

  // Initialize leads data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setIsLoading(false);
    }, 1000);
  }, []);

  // AI Lead Qualification Handler
  const handleAIQualification = async (lead) => {
    if (qualifyingLeads.has(lead.id)) return;
    
    setQualifyingLeads(prev => new Set([...prev, lead.id]));
    
    try {
      const qualificationData = await qualifyLead({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        message: lead.message,
        budget: lead.budget,
        timeline: lead.timeline,
        propertyType: lead.propertyType
      });

      // Update lead with AI qualification results
      setLeads(prev => prev.map(l => 
        l.id === lead.id 
          ? {
              ...l,
              qualificationScore: qualificationData.qualificationScore,
              status: qualificationData.status,
              tags: [...(l.tags || []), ...qualificationData.tags],
              aiQualification: qualificationData,
              lastActivity: {
                type: "AI Qualification Complete",
                date: new Date()
              }
            }
          : l
      ));

      // Generate follow-up messages
      const followUpMessages = await generateFollowUpMessages({
        ...lead,
        qualificationScore: qualificationData.qualificationScore,
        status: qualificationData.status,
        tags: qualificationData.tags
      });

      console.log('AI-generated follow-up messages:', followUpMessages);
      
    } catch (error) {
      console.error('Error qualifying lead:', error);
    } finally {
      setQualifyingLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    }
  };

  // Filter and sort leads
  const processedLeads = useMemo(() => {
    let result = [...leads];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm) ||
        lead.phone.includes(searchTerm)
      );
    }

    if (filters.source) {
      result = result.filter(lead => lead.source === filters.source);
    }

    if (filters.status) {
      result = result.filter(lead => lead.status === filters.status);
    }

    if (filters.scoreRange) {
      const [min, max] = filters.scoreRange.split('-').map(Number);
      result = result.filter(lead => lead.qualificationScore >= min && lead.qualificationScore <= max);
    }

    if (filters.activityDate) {
      const filterDate = new Date(filters.activityDate);
      result = result.filter(lead => new Date(lead.lastActivity.date) >= filterDate);
    }

    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(lead =>
        filters.tags.some(tag => lead.tags.includes(tag))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === 'lastActivity') {
          aValue = new Date(a.lastActivity.date);
          bValue = new Date(b.lastActivity.date);
        } else if (sortConfig.key === 'score') {
          aValue = a.qualificationScore;
          bValue = b.qualificationScore;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [leads, filters, sortConfig]);

  // Update filtered leads when processed leads change
  useEffect(() => {
    setFilteredLeads(processedLeads);
  }, [processedLeads]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedLeads([]); // Clear selection when filters change
  };

  const handleSort = (columnKey) => {
    setSortConfig(prevConfig => ({
      key: columnKey,
      direction: prevConfig.key === columnKey && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedLeads(newSelection);
  };

  const handleBulkAction = (action, leadIds, value) => {
    console.log('Bulk action:', action, leadIds, value);
    
    switch (action) {
      case 'ai_qualify':
        leadIds.forEach(leadId => {
          const lead = leads.find(l => l.id === leadId);
          if (lead) handleAIQualification(lead);
        });
        break;
      case 'assign':
        console.log(`Assigning ${leadIds.length} leads to ${value}`);
        break;
      case 'status':
        console.log(`Updating status of ${leadIds.length} leads to ${value}`);
        break;
      case 'campaign':
        console.log(`Enrolling ${leadIds.length} leads in campaign ${value}`);
        break;
      case 'delete':
        console.log(`Deleting ${leadIds.length} leads`);
        setLeads(prev => prev.filter(lead => !leadIds.includes(lead.id)));
        break;
      case 'clear':
        setSelectedLeads([]);
        break;
      default:
        break;
    }
  };

  const handleLeadAction = (action, lead) => {
    console.log('Lead action:', action, lead);
    
    switch (action) {
      case 'ai_qualify':
        handleAIQualification(lead);
        break;
      case 'call':
        console.log(`Calling ${lead.name} at ${lead.phone}`);
        break;
      case 'email':
        console.log(`Emailing ${lead.name} at ${lead.email}`);
        break;
      case 'sms':
        console.log(`Sending SMS to ${lead.name} at ${lead.phone}`);
        break;
      case 'note':
        console.log(`Adding note for ${lead.name}`);
        break;
      case 'schedule':
        console.log(`Scheduling meeting with ${lead.name}`);
        break;
      case 'assign':
        console.log(`Reassigning ${lead.name}`);
        break;
      case 'tag':
        console.log(`Adding tags to ${lead.name}`);
        break;
      case 'archive':
        console.log(`Archiving ${lead.name}`);
        break;
      case 'delete':
        console.log(`Deleting ${lead.name}`);
        setLeads(prev => prev.filter(l => l.id !== lead.id));
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-text-secondary">Loading leads...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0 p-6">
          <LeadFilters
            onFiltersChange={handleFiltersChange}
            resultCount={filteredLeads.length}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">Lead Management</h1>
                <p className="text-text-secondary">
                  Track, qualify, and nurture your prospects with AI-powered insights
                </p>
              </div>
              
              {/* View Toggle - Desktop */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  iconName="Table"
                  iconPosition="left"
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  iconName="Grid3X3"
                  iconPosition="left"
                >
                  Cards
                </Button>
              </div>
            </div>

            {/* Mobile Filters Toggle */}
            <div className="lg:hidden mb-4">
              <Button variant="outline" iconName="Filter" iconPosition="left">
                Filters ({Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v !== '').length})
              </Button>
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          <div className="mb-6">
            <BulkActionToolbar
              selectedLeads={selectedLeads}
              onBulkAction={handleBulkAction}
              totalLeads={leads.length}
              qualifyingLeads={qualifyingLeads}
            />
          </div>

          {/* Leads Content */}
          {viewMode === 'table' ? (
            <div className="hidden md:block">
              <LeadsTable
                leads={filteredLeads}
                selectedLeads={selectedLeads}
                onSelectionChange={handleSelectionChange}
                onLeadAction={handleLeadAction}
                onSort={handleSort}
                sortConfig={sortConfig}
                qualifyingLeads={qualifyingLeads}
              />
            </div>
          ) : null}

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {filteredLeads.map((lead) => (
              <LeadMobileCard
                key={lead.id}
                lead={lead}
                isSelected={selectedLeads.includes(lead.id)}
                onSelect={(leadId, checked) => {
                  if (checked) {
                    setSelectedLeads([...selectedLeads, leadId]);
                  } else {
                    setSelectedLeads(selectedLeads.filter(id => id !== leadId));
                  }
                }}
                onAction={handleLeadAction}
                isQualifying={qualifyingLeads.has(lead.id)}
              />
            ))}
          </div>

          {/* Desktop Cards View */}
          {viewMode === 'cards' && (
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <LeadMobileCard
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLeads.includes(lead.id)}
                  onSelect={(leadId, checked) => {
                    if (checked) {
                      setSelectedLeads([...selectedLeads, leadId]);
                    } else {
                      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
                    }
                  }}
                  onAction={handleLeadAction}
                  isQualifying={qualifyingLeads.has(lead.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredLeads.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                Showing {filteredLeads.length} of {leads.length} leads
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;