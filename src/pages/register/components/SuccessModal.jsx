import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessModal = ({ isOpen, userData }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleSkipTour = () => {
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome to RealtyFlow AI!
        </h2>
        
        <p className="text-muted-foreground mb-6">
          Your account has been created successfully. We've sent a verification email to{' '}
          <span className="font-medium text-foreground">{userData.email}</span>
        </p>

        <div className="bg-muted/50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-medium text-foreground mb-2">What's Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Icon name="Mail" size={16} className="text-accent" />
              Check your email and verify your account
            </li>
            <li className="flex items-center gap-2">
              <Icon name="User" size={16} className="text-accent" />
              Complete your profile setup
            </li>
            <li className="flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-accent" />
              Take a quick tour of the platform
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button 
            variant="default" 
            fullWidth 
            iconName="ArrowRight" 
            iconPosition="right"
            onClick={handleGetStarted}
          >
            Get Started with Tour
          </Button>
          
          <Button 
            variant="ghost" 
            fullWidth
            onClick={handleSkipTour}
          >
            Skip Tour, Go to Dashboard
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Need help getting started? Check out our{' '}
            <button className="text-accent hover:underline">
              Quick Start Guide
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;