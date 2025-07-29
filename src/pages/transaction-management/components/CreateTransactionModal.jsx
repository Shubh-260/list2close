import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: '',
    propertyAddress: '',
    propertyPrice: '',
    propertyType: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    agent: '',
    contractDate: '',
    closingDate: '',
    status: 'pending'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const transactionTypes = [
    { value: '', label: 'Select transaction type' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'sale', label: 'Sale' },
    { value: 'lease', label: 'Lease' },
    { value: 'refinance', label: 'Refinance' }
  ];

  const propertyTypes = [
    { value: '', label: 'Select property type' },
    { value: 'Single Family', label: 'Single Family' },
    { value: 'Condo', label: 'Condo' },
    { value: 'Townhouse', label: 'Townhouse' },
    { value: 'Multi-Family', label: 'Multi-Family' },
    { value: 'Land', label: 'Land' },
    { value: 'Commercial', label: 'Commercial' }
  ];

  const agents = [
    { value: '', label: 'Select agent' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Mike Chen', label: 'Mike Chen' },
    { value: 'Lisa Rodriguez', label: 'Lisa Rodriguez' },
    { value: 'David Kim', label: 'David Kim' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Transaction type is required';
    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required';
    if (!formData.propertyPrice) newErrors.propertyPrice = 'Property price is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Client email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }
    if (!formData.clientPhone.trim()) newErrors.clientPhone = 'Client phone is required';
    if (!formData.agent) newErrors.agent = 'Agent is required';
    if (!formData.contractDate) newErrors.contractDate = 'Contract date is required';
    if (!formData.closingDate) newErrors.closingDate = 'Closing date is required';

    // Validate that closing date is after contract date
    if (formData.contractDate && formData.closingDate) {
      const contractDate = new Date(formData.contractDate);
      const closingDate = new Date(formData.closingDate);
      if (closingDate <= contractDate) {
        newErrors.closingDate = 'Closing date must be after contract date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTimeline = () => {
    const contractDate = new Date(formData.contractDate);
    const closingDate = new Date(formData.closingDate);
    const totalDays = Math.ceil((closingDate - contractDate) / (1000 * 60 * 60 * 24));

    const timeline = [
      { 
        step: 'Contract Signed', 
        date: contractDate, 
        completed: true 
      },
      { 
        step: 'Inspection Period', 
        date: new Date(contractDate.getTime() + Math.ceil(totalDays * 0.2) * 24 * 60 * 60 * 1000), 
        completed: false,
        current: true
      },
      { 
        step: 'Appraisal', 
        date: new Date(contractDate.getTime() + Math.ceil(totalDays * 0.4) * 24 * 60 * 60 * 1000), 
        completed: false 
      },
      { 
        step: 'Financing Approval', 
        date: new Date(contractDate.getTime() + Math.ceil(totalDays * 0.7) * 24 * 60 * 60 * 1000), 
        completed: false 
      },
      { 
        step: 'Final Walkthrough', 
        date: new Date(closingDate.getTime() - 2 * 24 * 60 * 60 * 1000), 
        completed: false 
      },
      { 
        step: 'Closing', 
        date: closingDate, 
        completed: false 
      }
    ];

    return timeline;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const transactionData = {
        id: `TXN-${Date.now().toString().slice(-6)}`,
        type: formData.type,
        status: formData.status,
        property: {
          address: formData.propertyAddress,
          price: parseInt(formData.propertyPrice),
          type: formData.propertyType
        },
        client: {
          name: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone
        },
        agent: formData.agent,
        contractDate: new Date(formData.contractDate),
        closingDate: new Date(formData.closingDate),
        timeline: generateTimeline(),
        documents: [],
        progress: 10
      };

      await onSave(transactionData);
      
      // Reset form
      setFormData({
        type: '',
        propertyAddress: '',
        propertyPrice: '',
        propertyType: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        agent: '',
        contractDate: '',
        closingDate: '',
        status: 'pending'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      setErrors({ submit: 'Failed to create transaction. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create New Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Transaction Type */}
            <Select
              label="Transaction Type"
              options={transactionTypes}
              value={formData.type}
              onChange={(value) => handleInputChange('type', value)}
              error={errors.type}
              required
            />

            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Property Information</h3>
              
              <Input
                label="Property Address"
                type="text"
                placeholder="123 Main Street, City, State 12345"
                value={formData.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                error={errors.propertyAddress}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Property Price"
                  type="number"
                  placeholder="750000"
                  value={formData.propertyPrice}
                  onChange={(e) => handleInputChange('propertyPrice', e.target.value)}
                  error={errors.propertyPrice}
                  required
                />

                <Select
                  label="Property Type"
                  options={propertyTypes}
                  value={formData.propertyType}
                  onChange={(value) => handleInputChange('propertyType', value)}
                  error={errors.propertyType}
                  required
                />
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Client Information</h3>
              
              <Input
                label="Client Name"
                type="text"
                placeholder="John & Mary Smith"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                error={errors.clientName}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Client Email"
                  type="email"
                  placeholder="client@email.com"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  error={errors.clientEmail}
                  required
                />

                <Input
                  label="Client Phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  error={errors.clientPhone}
                  required
                />
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Transaction Details</h3>
              
              <Select
                label="Assigned Agent"
                options={agents}
                value={formData.agent}
                onChange={(value) => handleInputChange('agent', value)}
                error={errors.agent}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contract Date"
                  type="date"
                  value={formData.contractDate}
                  onChange={(e) => handleInputChange('contractDate', e.target.value)}
                  error={errors.contractDate}
                  required
                />

                <Input
                  label="Expected Closing Date"
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => handleInputChange('closingDate', e.target.value)}
                  error={errors.closingDate}
                  required
                />
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive" />
                  <span className="text-sm text-destructive">{errors.submit}</span>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            loading={isLoading}
            iconName="Plus"
            iconPosition="left"
          >
            Create Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionModal;