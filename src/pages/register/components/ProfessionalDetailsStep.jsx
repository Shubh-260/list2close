import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';

const ProfessionalDetailsStep = ({ formData, errors, onChange }) => {
  const experienceOptions = [
    { value: '', label: 'Select experience level' },
    { value: 'new', label: 'New Agent (0-1 years)' },
    { value: 'junior', label: 'Junior Agent (1-3 years)' },
    { value: 'experienced', label: 'Experienced Agent (3-7 years)' },
    { value: 'senior', label: 'Senior Agent (7-15 years)' },
    { value: 'veteran', label: 'Veteran Agent (15+ years)' }
  ];

  const specializationOptions = [
    'Residential Sales',
    'Luxury Properties',
    'First-Time Buyers',
    'Investment Properties',
    'Commercial Real Estate',
    'New Construction',
    'Foreclosures/REO',
    'Relocation Services',
    'Senior Housing',
    'Vacation/Second Homes'
  ];

  const handleSpecializationChange = (specialization, checked) => {
    const currentSpecializations = formData.specializations || [];
    if (checked) {
      onChange('specializations', [...currentSpecializations, specialization]);
    } else {
      onChange('specializations', currentSpecializations.filter(s => s !== specialization));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Professional Details</h2>
        <p className="text-muted-foreground">Tell us about your real estate experience and expertise</p>
      </div>

      <Input
        label="Real Estate License Number"
        type="text"
        placeholder="Enter your license number"
        description="Your state-issued real estate license number"
        value={formData.licenseNumber}
        onChange={(e) => onChange('licenseNumber', e.target.value)}
        error={errors.licenseNumber}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Years of Experience"
          placeholder="Select your experience level"
          description="How long have you been in real estate?"
          options={experienceOptions}
          value={formData.experience}
          onChange={(value) => onChange('experience', value)}
          error={errors.experience}
          required
        />

        <Input
          label="Annual Transaction Volume"
          type="number"
          placeholder="25"
          description="Average deals closed per year"
          value={formData.transactionVolume}
          onChange={(e) => onChange('transactionVolume', e.target.value)}
          error={errors.transactionVolume}
          min="0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="MLS ID (Optional)"
          type="text"
          placeholder="Enter your MLS ID"
          description="Your Multiple Listing Service ID"
          value={formData.mlsId}
          onChange={(e) => onChange('mlsId', e.target.value)}
          error={errors.mlsId}
        />

        <Input
          label="NAR Member ID (Optional)"
          type="text"
          placeholder="Enter your NAR ID"
          description="National Association of Realtors ID"
          value={formData.narId}
          onChange={(e) => onChange('narId', e.target.value)}
          error={errors.narId}
        />
      </div>

      <div>
        <CheckboxGroup 
          label="Specializations" 
          error={errors.specializations}
          className="space-y-3"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Select all areas where you have expertise (choose at least 2)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {specializationOptions.map((specialization) => (
              <Checkbox
                key={specialization}
                label={specialization}
                checked={(formData.specializations || []).includes(specialization)}
                onChange={(e) => handleSpecializationChange(specialization, e.target.checked)}
              />
            ))}
          </div>
        </CheckboxGroup>
      </div>

      <Input
        label="Professional Website (Optional)"
        type="url"
        placeholder="https://yourwebsite.com"
        description="Your professional website or online portfolio"
        value={formData.website}
        onChange={(e) => onChange('website', e.target.value)}
        error={errors.website}
      />

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium text-foreground mb-2">Professional Verification</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We'll verify your license information with your state's real estate commission. 
          This helps maintain platform integrity and builds client trust.
        </p>
        <Checkbox
          label="I authorize RealtyFlow AI to verify my real estate license"
          checked={formData.authorizeVerification || false}
          onChange={(e) => onChange('authorizeVerification', e.target.checked)}
          required
        />
      </div>
    </div>
  );
};

export default ProfessionalDetailsStep;