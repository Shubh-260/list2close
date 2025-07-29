import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import BasicInformationStep from './components/BasicInformationStep';
import ProfessionalDetailsStep from './components/ProfessionalDetailsStep';
import AccountSetupStep from './components/AccountSetupStep';
import SuccessModal from './components/SuccessModal';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    brokerage: '',
    otherBrokerage: '',
    
    // Professional Details
    licenseNumber: '',
    experience: '',
    transactionVolume: '',
    mlsId: '',
    narId: '',
    specializations: [],
    website: '',
    authorizeVerification: false,
    
    // Account Setup
    password: '',
    confirmPassword: '',
    timezone: '',
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      weeklyReports: true
    },
    agreeToTerms: false,
    consentToCommunications: false,
    acknowledgeLicensed: false
  });
  
  const [errors, setErrors] = useState({});

  const totalSteps = 3;

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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.brokerage) newErrors.brokerage = 'Brokerage is required';
      if (formData.brokerage === 'other' && !formData.otherBrokerage.trim()) {
        newErrors.otherBrokerage = 'Please specify your brokerage name';
      }
    }

    if (step === 2) {
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
      if (!formData.experience) newErrors.experience = 'Experience level is required';
      if (!formData.specializations || formData.specializations.length < 2) {
        newErrors.specializations = 'Please select at least 2 specializations';
      }
      if (!formData.authorizeVerification) {
        newErrors.authorizeVerification = 'License verification authorization is required';
      }
      if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
        newErrors.website = 'Please enter a valid website URL';
      }
    }

    if (step === 3) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.timezone) newErrors.timezone = 'Timezone is required';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms of service';
      if (!formData.acknowledgeLicensed) {
        newErrors.acknowledgeLicensed = 'You must acknowledge that you are a licensed professional';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', formData);
      setShowSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 2:
        return (
          <ProfessionalDetailsStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 3:
        return (
          <AccountSetupStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Building2" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">RealtyFlow AI</h1>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Already have an account?</span>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-surface rounded-lg shadow-sm border border-border p-6 lg:p-8">
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
          
          <div className="max-w-2xl mx-auto">
            {renderStepContent()}
            
            {errors.submit && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive" />
                  <span className="text-sm text-destructive">{errors.submit}</span>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
                
                {currentStep < totalSteps ? (
                  <Button
                    variant="default"
                    onClick={handleNext}
                    iconName="ArrowRight"
                    iconPosition="right"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleSubmit}
                    loading={isLoading}
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Lock" size={16} className="text-success" />
              <span>Data Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Award" size={16} className="text-success" />
              <span>NAR Compliant</span>
            </div>
          </div>
          
          <p className="mt-4 text-xs text-muted-foreground max-w-2xl mx-auto">
            By registering, you agree to our Terms of Service and Privacy Policy. 
            RealtyFlow AI is designed exclusively for licensed real estate professionals 
            and complies with industry regulations and data protection standards.
          </p>
        </div>
      </main>
      
      <SuccessModal 
        isOpen={showSuccess} 
        userData={formData}
      />
    </div>
  );
};

export default Register;