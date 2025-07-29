import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { Checkbox } from '../../../components/ui/Checkbox';
import LeadScoreBadge from './LeadScoreBadge';
import LeadStatusBadge from './LeadStatusBadge';
import LeadQuickActions from './LeadQuickActions';

const LeadsTable = ({ leads, selectedLeads, onSelectionChange, onLeadAction, onSort, sortConfig }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const columns = [
    { key: 'select', label: '', width: 'w-12', sortable: false },
    { key: 'contact', label: 'Contact', width: 'w-64', sortable: true },
    { key: 'source', label: 'Source', width: 'w-32', sortable: true },
    { key: 'score', label: 'Score', width: 'w-24', sortable: true },
    { key: 'status', label: 'Status', width: 'w-32', sortable: true },
    { key: 'lastActivity', label: 'Last Activity', width: 'w-40', sortable: true },
    { key: 'assignedTo', label: 'Assigned To', width: 'w-32', sortable: true },
    { key: 'actions', label: 'Actions', width: 'w-32', sortable: false }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(leads.map(lead => lead.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectLead = (leadId, checked) => {
    if (checked) {
      onSelectionChange([...selectedLeads, leadId]);
    } else {
      onSelectionChange(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleSort = (columnKey) => {
    if (columns.find(col => col.key === columnKey)?.sortable) {
      onSort(columnKey);
    }
  };

  const getSortIcon = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return 'ArrowUpDown';
    }
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatLastActivity = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return activityDate.toLocaleDateString();
  };

  const getSourceIcon = (source) => {
    const sourceIcons = {
      website: 'Globe',
      referral: 'Users',
      social_media: 'Share2',
      cold_call: 'Phone',
      open_house: 'Home',
      zillow: 'Building',
      realtor_com: 'Building2'
    };
    return sourceIcons[source] || 'HelpCircle';
  };

  const allSelected = leads.length > 0 && selectedLeads.length === leads.length;
  const someSelected = selectedLeads.length > 0 && selectedLeads.length < leads.length;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.width} px-4 py-3 text-left`}
                >
                  {column.key === 'select' ? (
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  ) : (
                    <button
                      onClick={() => handleSort(column.key)}
                      className={`flex items-center gap-2 text-sm font-medium text-text-primary hover:text-foreground transition-colors ${
                        column.sortable ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      disabled={!column.sortable}
                    >
                      <span>{column.label}</span>
                      {column.sortable && (
                        <Icon 
                          name={getSortIcon(column.key)} 
                          size={14} 
                          className="text-text-secondary" 
                        />
                      )}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className={`hover:bg-muted/20 transition-colors duration-200 ${
                  selectedLeads.includes(lead.id) ? 'bg-accent/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(lead.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Select */}
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                  />
                </td>

                {/* Contact */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {lead.avatar ? (
                        <Image
                          src={lead.avatar}
                          alt={lead.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                          <Icon name="User" size={16} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-text-primary truncate">
                        {lead.name}
                      </div>
                      <div className="text-sm text-text-secondary truncate">
                        {lead.email}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {lead.phone}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Source */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon 
                      name={getSourceIcon(lead.source)} 
                      size={16} 
                      className="text-text-secondary" 
                    />
                    <span className="text-sm text-text-primary capitalize">
                      {lead.source.replace('_', ' ')}
                    </span>
                  </div>
                </td>

                {/* Score */}
                <td className="px-4 py-3">
                  <LeadScoreBadge score={lead.qualificationScore} />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <LeadStatusBadge status={lead.status} />
                </td>

                {/* Last Activity */}
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <div className="text-text-primary">
                      {lead.lastActivity.type}
                    </div>
                    <div className="text-text-secondary">
                      {formatLastActivity(lead.lastActivity.date)}
                    </div>
                  </div>
                </td>

                {/* Assigned To */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                      {lead.assignedTo.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-text-primary">
                      {lead.assignedTo}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className={`transition-opacity duration-200 ${
                    hoveredRow === lead.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <LeadQuickActions
                      lead={lead}
                      onAction={onLeadAction}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No leads found
          </h3>
          <p className="text-text-secondary mb-4">
            Try adjusting your filters or add new leads to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;