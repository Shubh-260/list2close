import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AccountSetupStep = ({ formData, errors, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const timezoneOptions = [
    { value: '', label: 'Select your timezone' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' }
  ];

  const communicationPreferences = [
    { key: 'emailNotifications', label: 'Email notifications for new leads and updates' },
    { key: 'smsNotifications', label: 'SMS notifications for urgent matters' },
    { key: 'marketingEmails', label: 'Marketing emails about new features and tips' },
    { key: 'weeklyReports', label: 'Weekly performance and activity reports' }
  ];

  const handlePreferenceChange = (key, checked) => {
    const currentPrefs = formData.communicationPreferences || {};
    onChange('communicationPreferences', {
      ...currentPrefs,
      [key]: checked
    });
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'bg-destructive' },
      { strength: 2, label: 'Weak', color: 'bg-warning' },
      { strength: 3, label: 'Fair', color: 'bg-warning' },
      { strength: 4, label: 'Good', color: 'bg-success' },
      { strength: 5, label: 'Strong', color: 'bg-success' }
    ];

    return levels[score];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Account Setup</h2>
        <p className="text-muted-foreground">Create your secure account and set your preferences</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            description="Must be at least 8 characters with uppercase, lowercase, number, and special character"
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            error={errors.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        {formData.password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>
      </div>

      <Select
        label="Timezone"
        placeholder="Select your timezone"
        description="This helps us schedule notifications and reports at the right time"
        options={timezoneOptions}
        value={formData.timezone}
        onChange={(value) => onChange('timezone', value)}
        error={errors.timezone}
        required
      />

      <div>
        <h3 className="font-medium text-foreground mb-4">Communication Preferences</h3>
        <div className="space-y-3">
          {communicationPreferences.map((pref) => (
            <Checkbox
              key={pref.key}
              label={pref.label}
              checked={(formData.communicationPreferences || {})[pref.key] || false}
              onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground">Terms and Agreements</h3>
        
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          description="By checking this box, you agree to our terms and privacy practices"
          checked={formData.agreeToTerms || false}
          onChange={(e) => onChange('agreeToTerms', e.target.checked)}
          error={errors.agreeToTerms}
          required
        />

        <Checkbox
          label="I consent to receive communications about my account and services"
          description="We'll send important updates about your account and our services"
          checked={formData.consentToCommunications || false}
          onChange={(e) => onChange('consentToCommunications', e.target.checked)}
          required
        />

        <Checkbox
          label="I acknowledge that I am a licensed real estate professional"
          description="RealtyFlow AI is designed for licensed real estate professionals only"
          checked={formData.acknowledgeLicensed || false}
          onChange={(e) => onChange('acknowledgeLicensed', e.target.checked)}
          error={errors.acknowledgeLicensed}
          required
        />
      </div>

      <div className="bg-accent/10 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Data Security & Privacy</h4>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and stored securely. We comply with real estate industry 
              standards and never share your client information with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetupStep;