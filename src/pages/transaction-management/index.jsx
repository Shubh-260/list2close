import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TransactionCard from './components/TransactionCard';
import TransactionDetails from './components/TransactionDetails';
import CreateTransactionModal from './components/CreateTransactionModal';
import DocumentManager from './components/DocumentManager';
import TimelineView from './components/TimelineView';
import apiClient from '../../services/apiClient';
import websocketService from '../../services/websocketService';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDocumentManagerOpen, setIsDocumentManagerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'timeline', 'table'
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    agent: 'all',
    dateRange: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_contract', label: 'Under Contract' },
    { value: 'inspection', label: 'Inspection Period' },
    { value: 'appraisal', label: 'Appraisal' },
    { value: 'financing', label: 'Financing' },
    { value: 'final_walkthrough', label: 'Final Walkthrough' },
    { value: 'closing', label: 'Closing' },
    { value: 'closed', label: 'Closed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'sale', label: 'Sale' },
    { value: 'lease', label: 'Lease' },
    { value: 'refinance', label: 'Refinance' }
  ];

  useEffect(() => {
    loadTransactions();
    setupWebSocketListeners();

    return () => {
      websocketService.off('transactionUpdate', handleTransactionUpdate);
      websocketService.off('deadlineApproaching', handleDeadlineAlert);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Load mock data for demo
      setTransactions(mockTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocketListeners = () => {
    websocketService.on('transactionUpdate', handleTransactionUpdate);
    websocketService.on('deadlineApproaching', handleDeadlineAlert);
    websocketService.subscribeToTransactions();
  };

  const handleTransactionUpdate = (updatedTransaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  };

  const handleDeadlineAlert = (alert) => {
    // Show notification for approaching deadlines
    console.log('Deadline approaching:', alert);
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.property.address.toLowerCase().includes(searchTerm) ||
        transaction.client.name.toLowerCase().includes(searchTerm) ||
        transaction.id.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    setFilteredTransactions(filtered);
  };

  const handleCreateTransaction = async (transactionData) => {
    try {
      const newTransaction = await apiClient.createTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleUpdateTransaction = async (transactionId, updates) => {
    try {
      const updatedTransaction = await apiClient.updateTransaction(transactionId, updates);
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? updatedTransaction : t)
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const mockTransactions = [
    {
      id: 'TXN-001',
      type: 'purchase',
      status: 'under_contract',
      property: {
        address: '123 Oak Street, Downtown, CA 90210',
        price: 750000,
        type: 'Single Family'
      },
      client: {
        name: 'John & Mary Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567'
      },
      agent: 'Sarah Johnson',
      contractDate: new Date('2025-01-15'),
      closingDate: new Date('2025-02-28'),
      timeline: [
        { step: 'Contract Signed', date: new Date('2025-01-15'), completed: true },
        { step: 'Inspection Period', date: new Date('2025-01-25'), completed: false, current: true },
        { step: 'Appraisal', date: new Date('2025-02-05'), completed: false },
        { step: 'Financing Approval', date: new Date('2025-02-15'), completed: false },
        { step: 'Final Walkthrough', date: new Date('2025-02-26'), completed: false },
        { step: 'Closing', date: new Date('2025-02-28'), completed: false }
      ],
      documents: [
        { id: 1, name: 'Purchase Agreement', type: 'contract', status: 'signed', uploadDate: '2025-01-15' },
        { id: 2, name: 'Inspection Report', type: 'inspection', status: 'pending', uploadDate: null }
      ],
      progress: 35
    },
    {
      id: 'TXN-002',
      type: 'sale',
      status: 'closing',
      property: {
        address: '456 Pine Avenue, Suburbs, CA 90211',
        price: 525000,
        type: 'Condo'
      },
      client: {
        name: 'Lisa Wilson',
        email: 'lisa.wilson@email.com',
        phone: '(555) 234-5678'
      },
      agent: 'Mike Chen',
      contractDate: new Date('2024-12-20'),
      closingDate: new Date('2025-01-30'),
      timeline: [
        { step: 'Contract Signed', date: new Date('2024-12-20'), completed: true },
        { step: 'Inspection Period', date: new Date('2024-12-30'), completed: true },
        { step: 'Appraisal', date: new Date('2025-01-10'), completed: true },
        { step: 'Financing Approval', date: new Date('2025-01-20'), completed: true },
        { step: 'Final Walkthrough', date: new Date('2025-01-28'), completed: false, current: true },
        { step: 'Closing', date: new Date('2025-01-30'), completed: false }
      ],
      documents: [
        { id: 3, name: 'Listing Agreement', type: 'contract', status: 'signed', uploadDate: '2024-12-20' },
        { id: 4, name: 'Appraisal Report', type: 'appraisal', status: 'completed', uploadDate: '2025-01-10' }
      ],
      progress: 85
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading transactions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Transaction Management - RealtyFlow AI</title>
        <meta name="description" content="Manage real estate transactions from contract to closing with AI-powered automation." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Transaction Management</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage deals from contract to closing
              </p>
            </div>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Transaction
            </Button>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search transactions by property, client, or ID..."
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
              <Select
                options={typeOptions}
                value={filters.type}
                onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                className="w-48"
              />
              <div className="flex border border-border rounded-lg">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 ${viewMode === 'cards' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon name="Grid3X3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-2 ${viewMode === 'timeline' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon name="GitBranch" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded-full" />
                <span>Deadlines Approaching: 3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span>On Track: {filteredTransactions.filter(t => t.status !== 'cancelled').length}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onSelect={() => {
                    setSelectedTransaction(transaction);
                    setIsDetailsOpen(true);
                  }}
                  onUpdate={handleUpdateTransaction}
                />
              ))}
            </div>
          )}

          {viewMode === 'timeline' && (
            <TimelineView
              transactions={filteredTransactions}
              onTransactionSelect={(transaction) => {
                setSelectedTransaction(transaction);
                setIsDetailsOpen(true);
              }}
            />
          )}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first transaction to start tracking deals.
              </p>
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Transaction
              </Button>
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateTransactionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateTransaction}
        />

        <TransactionDetails
          transaction={selectedTransaction}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTransaction(null);
          }}
          onUpdate={handleUpdateTransaction}
          onOpenDocuments={() => setIsDocumentManagerOpen(true)}
        />

        <DocumentManager
          transaction={selectedTransaction}
          isOpen={isDocumentManagerOpen}
          onClose={() => setIsDocumentManagerOpen(false)}
        />
      </div>
    </>
  );
};

export default TransactionManagement;