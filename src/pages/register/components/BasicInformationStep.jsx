import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BasicInformationStep = ({ formData, errors, onChange }) => {
  const brokerageOptions = [
    { value: '', label: 'Select your brokerage' },
    { value: 'keller-williams', label: 'Keller Williams' },
    { value: 'coldwell-banker', label: 'Coldwell Banker' },
    { value: 're-max', label: 'RE/MAX' },
    { value: 'century-21', label: 'Century 21' },
    { value: 'berkshire-hathaway', label: 'Berkshire Hathaway HomeServices' },
    { value: 'compass', label: 'Compass' },
    { value: 'exp-realty', label: 'eXp Realty' },
    { value: 'other', label: 'Other' }
  ];

  const stateOptions = [
    { value: '', label: 'Select state' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Let's start with your personal and contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your professional email"
        description="This will be your login email and primary contact"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        error={errors.email}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          description="Your business phone number"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          error={errors.phone}
          required
        />

        <Select
          label="State"
          placeholder="Select your state"
          description="State where you're licensed"
          options={stateOptions}
          value={formData.state}
          onChange={(value) => onChange('state', value)}
          error={errors.state}
          required
        />
      </div>

      <Select
        label="Brokerage"
        placeholder="Select your brokerage"
        description="The real estate company you work with"
        options={brokerageOptions}
        value={formData.brokerage}
        onChange={(value) => onChange('brokerage', value)}
        error={errors.brokerage}
        required
        searchable
      />

      {formData.brokerage === 'other' && (
        <Input
          label="Other Brokerage Name"
          type="text"
          placeholder="Enter your brokerage name"
          value={formData.otherBrokerage}
          onChange={(e) => onChange('otherBrokerage', e.target.value)}
          error={errors.otherBrokerage}
          required
        />
      )}

      <Input
        label="City"
        type="text"
        placeholder="Enter your city"
        description="Primary city where you operate"
        value={formData.city}
        onChange={(e) => onChange('city', e.target.value)}
        error={errors.city}
        required
      />
    </div>
  );
};

export default BasicInformationStep;