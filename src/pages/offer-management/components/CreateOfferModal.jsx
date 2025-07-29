import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateOfferModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    listPrice: '',
    offerPrice: '',
    earnestMoney: '',
    downPayment: '',
    financing: '',
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    buyerAgent: '',
    closingDate: '',
    expirationDate: '',
    contingencies: [],
    inspectionPeriod: '10',
    financingContingency: '21',
    appraisalContingency: true,
    personalProperty: '',
    specialConditions: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const financingOptions = [
    { value: '', label: 'Select financing type' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Conventional', label: 'Conventional' },
    { value: 'FHA', label: 'FHA' },
    { value: 'VA', label: 'VA' },
    { value: 'USDA', label: 'USDA' }
  ];

  const contingencyOptions = [
    'Inspection',
    'Financing',
    'Appraisal',
    'Sale of Current Home',
    'HOA Review',
    'Title Review'
  ];

  const agents = [
    { value: '', label: 'Select buyer agent' },
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

  const handleContingencyChange = (contingency, checked) => {
    const currentContingencies = formData.contingencies || [];
    if (checked) {
      setFormData(prev => ({
        ...prev,
        contingencies: [...currentContingencies, contingency]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        contingencies: currentContingencies.filter(c => c !== contingency)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required';
    if (!formData.listPrice) newErrors.listPrice = 'List price is required';
    if (!formData.offerPrice) newErrors.offerPrice = 'Offer price is required';
    if (!formData.earnestMoney) newErrors.earnestMoney = 'Earnest money is required';
    if (!formData.downPayment) newErrors.downPayment = 'Down payment is required';
    if (!formData.financing) newErrors.financing = 'Financing type is required';
    if (!formData.buyerName.trim()) newErrors.buyerName = 'Buyer name is required';
    if (!formData.buyerEmail.trim()) {
      newErrors.buyerEmail = 'Buyer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyerEmail)) {
      newErrors.buyerEmail = 'Please enter a valid email address';
    }
    if (!formData.buyerPhone.trim()) newErrors.buyerPhone = 'Buyer phone is required';
    if (!formData.buyerAgent) newErrors.buyerAgent = 'Buyer agent is required';
    if (!formData.closingDate) newErrors.closingDate = 'Closing date is required';
    if (!formData.expirationDate) newErrors.expirationDate = 'Expiration date is required';

    // Validate that expiration date is in the future
    if (formData.expirationDate) {
      const expirationDate = new Date(formData.expirationDate);
      const today = new Date();
      if (expirationDate <= today) {
        newErrors.expirationDate = 'Expiration date must be in the future';
      }
    }

    // Validate that closing date is after expiration date
    if (formData.expirationDate && formData.closingDate) {
      const expirationDate = new Date(formData.expirationDate);
      const closingDate = new Date(formData.closingDate);
      if (closingDate <= expirationDate) {
        newErrors.closingDate = 'Closing date must be after expiration date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const offerData = {
        id: `OFF-${Date.now().toString().slice(-6)}`,
        property: {
          address: formData.propertyAddress,
          listPrice: parseInt(formData.listPrice),
          type: 'Single Family' // Could be enhanced to be selectable
        },
        buyer: {
          name: formData.buyerName,
          agent: formData.buyerAgent,
          email: formData.buyerEmail,
          phone: formData.buyerPhone
        },
        offerPrice: parseInt(formData.offerPrice),
        earnestMoney: parseInt(formData.earnestMoney),
        downPayment: parseInt(formData.downPayment),
        financing: formData.financing,
        contingencies: formData.contingencies,
        closingDate: new Date(formData.closingDate),
        expirationDate: new Date(formData.expirationDate),
        status: 'pending',
        submittedDate: new Date(),
        terms: {
          inspectionPeriod: parseInt(formData.inspectionPeriod),
          financingContingency: parseInt(formData.financingContingency),
          appraisalContingency: formData.appraisalContingency,
          personalProperty: formData.personalProperty ? formData.personalProperty.split(',').map(item => item.trim()) : [],
          specialConditions: formData.specialConditions
        },
        documents: [
          { name: 'Purchase Agreement', status: 'pending', date: new Date().toISOString().split('T')[0] }
        ]
      };

      await onSave(offerData);
      
      // Reset form
      setFormData({
        propertyAddress: '',
        listPrice: '',
        offerPrice: '',
        earnestMoney: '',
        downPayment: '',
        financing: '',
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        buyerAgent: '',
        closingDate: '',
        expirationDate: '',
        contingencies: [],
        inspectionPeriod: '10',
        financingContingency: '21',
        appraisalContingency: true,
        personalProperty: '',
        specialConditions: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating offer:', error);
      setErrors({ submit: 'Failed to create offer. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create New Offer</h2>
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
                  label="List Price"
                  type="number"
                  placeholder="750000"
                  value={formData.listPrice}
                  onChange={(e) => handleInputChange('listPrice', e.target.value)}
                  error={errors.listPrice}
                  required
                />

                <Input
                  label="Offer Price"
                  type="number"
                  placeholder="725000"
                  value={formData.offerPrice}
                  onChange={(e) => handleInputChange('offerPrice', e.target.value)}
                  error={errors.offerPrice}
                  required
                />
              </div>
            </div>

            {/* Financial Terms */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Financial Terms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Earnest Money"
                  type="number"
                  placeholder="15000"
                  value={formData.earnestMoney}
                  onChange={(e) => handleInputChange('earnestMoney', e.target.value)}
                  error={errors.earnestMoney}
                  required
                />

                <Input
                  label="Down Payment"
                  type="number"
                  placeholder="145000"
                  value={formData.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  error={errors.downPayment}
                  required
                />

                <Select
                  label="Financing Type"
                  options={financingOptions}
                  value={formData.financing}
                  onChange={(value) => handleInputChange('financing', value)}
                  error={errors.financing}
                  required
                />
              </div>
            </div>

            {/* Buyer Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Buyer Information</h3>
              
              <Input
                label="Buyer Name"
                type="text"
                placeholder="John & Mary Smith"
                value={formData.buyerName}
                onChange={(e) => handleInputChange('buyerName', e.target.value)}
                error={errors.buyerName}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Buyer Email"
                  type="email"
                  placeholder="buyer@email.com"
                  value={formData.buyerEmail}
                  onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                  error={errors.buyerEmail}
                  required
                />

                <Input
                  label="Buyer Phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.buyerPhone}
                  onChange={(e) => handleInputChange('buyerPhone', e.target.value)}
                  error={errors.buyerPhone}
                  required
                />

                <Select
                  label="Buyer Agent"
                  options={agents}
                  value={formData.buyerAgent}
                  onChange={(value) => handleInputChange('buyerAgent', value)}
                  error={errors.buyerAgent}
                  required
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Timeline</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Offer Expiration Date"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  error={errors.expirationDate}
                  required
                />

                <Input
                  label="Proposed Closing Date"
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => handleInputChange('closingDate', e.target.value)}
                  error={errors.closingDate}
                  required
                />
              </div>
            </div>

            {/* Contingencies */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Contingencies</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contingencyOptions.map((contingency) => (
                  <Checkbox
                    key={contingency}
                    label={contingency}
                    checked={formData.contingencies.includes(contingency)}
                    onChange={(e) => handleContingencyChange(contingency, e.target.checked)}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Inspection Period (days)"
                  type="number"
                  placeholder="10"
                  value={formData.inspectionPeriod}
                  onChange={(e) => handleInputChange('inspectionPeriod', e.target.value)}
                />

                <Input
                  label="Financing Contingency (days)"
                  type="number"
                  placeholder="21"
                  value={formData.financingContingency}
                  onChange={(e) => handleInputChange('financingContingency', e.target.value)}
                />
              </div>

              <Checkbox
                label="Appraisal Contingency"
                checked={formData.appraisalContingency}
                onChange={(e) => handleInputChange('appraisalContingency', e.target.checked)}
              />
            </div>

            {/* Additional Terms */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Additional Terms</h3>
              
              <Input
                label="Personal Property Included"
                type="text"
                placeholder="Refrigerator, Washer/Dryer, etc. (comma separated)"
                value={formData.personalProperty}
                onChange={(e) => handleInputChange('personalProperty', e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Special Conditions
                </label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Any special conditions or terms..."
                  value={formData.specialConditions}
                  onChange={(e) => handleInputChange('specialConditions', e.target.value)}
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
            Create Offer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferModal;