import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarHeader = ({ 
  currentDate, 
  viewMode, 
  onViewModeChange, 
  onNavigate, 
  onToday 
}) => {
  const formatHeaderDate = () => {
    const options = {
      month: viewMode === 'month' ? 'long' : 'short',
      year: 'numeric'
    };

    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'long' })} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      } else {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${startOfWeek.getFullYear()}`;
      }
    }

    return currentDate.toLocaleDateString('en-US', options);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    }
    
    onNavigate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    onNavigate(newDate);
  };

  const viewModeOptions = [
    { value: 'month', label: 'Month', icon: 'Calendar' },
    { value: 'week', label: 'Week', icon: 'CalendarDays' },
    { value: 'day', label: 'Day', icon: 'Clock' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              iconName="ChevronLeft"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              iconName="ChevronRight"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
          >
            Today
          </Button>
          
          <h1 className="text-xl font-semibold text-gray-900">
            {formatHeaderDate()}
          </h1>
        </div>

        {/* Right Section - View Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {viewModeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onViewModeChange(option.value)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === option.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon name={option.icon} size={16} />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              <span className="hidden sm:inline">Export</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
            >
              <span className="hidden sm:inline">Settings</span>
            </Button>
            
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              iconPosition="left"
            >
              <span className="hidden sm:inline">New Appointment</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile View Mode Selector */}
      <div className="flex sm:hidden items-center justify-center mt-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-1 w-full max-w-xs">
          {viewModeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onViewModeChange(option.value)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <Icon name={option.icon} size={16} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;