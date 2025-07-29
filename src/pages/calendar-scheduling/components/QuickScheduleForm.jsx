import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickScheduleForm = ({ onSchedule, availableSlots }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    client: '',
    date: '',
    time: '',
    duration: '60',
    property: '',
    notes: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const appointmentTypes = [
    { value: 'showing', label: 'Property Showing' },
    { value: 'consultation', label: 'Client Consultation' },
    { value: 'listing', label: 'Listing Appointment' },
    { value: 'inspection', label: 'Property Inspection' },
    { value: 'meeting', label: 'General Meeting' }
  ];

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' }
  ];

  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:30', label: '4:30 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '17:30', label: '5:30 PM' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.type || !formData.client || !formData.date || !formData.time) {
        alert('Please fill in all required fields');
        return;
      }

      // Create appointment object
      const appointment = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type,
        client: formData.client,
        startTime: new Date(`${formData.date}T${formData.time}`),
        endTime: new Date(new Date(`${formData.date}T${formData.time}`).getTime() + parseInt(formData.duration) * 60000),
        property: formData.property,
        notes: formData.notes,
        status: 'pending',
        reminderSent: false,
        confirmed: false
      };

      await onSchedule(appointment);

      // Reset form
      setFormData({
        title: '',
        type: '',
        client: '',
        date: '',
        time: '',
        duration: '60',
        property: '',
        notes: ''
      });
      setIsExpanded(false);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getAvailableTimesForDate = (selectedDate) => {
    if (!selectedDate || !availableSlots) return timeSlots;
    
    const dateSlots = availableSlots[selectedDate] || [];
    return timeSlots.filter(slot => dateSlots.includes(slot.value));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-medium text-gray-900">Quick Schedule</h3>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-gray-500"
          />
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Appointment Title"
            type="text"
            placeholder="e.g., Property showing for 123 Main St"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />

          <Select
            label="Appointment Type"
            placeholder="Select appointment type"
            options={appointmentTypes}
            value={formData.type}
            onChange={(value) => handleInputChange('type', value)}
            required
          />

          <Input
            label="Client Name"
            type="text"
            placeholder="Enter client name"
            value={formData.client}
            onChange={(e) => handleInputChange('client', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              min={getMinDate()}
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />

            <Select
              label="Time"
              placeholder="Select time"
              options={getAvailableTimesForDate(formData.date)}
              value={formData.time}
              onChange={(value) => handleInputChange('time', value)}
              required
            />
          </div>

          <Select
            label="Duration"
            options={durationOptions}
            value={formData.duration}
            onChange={(value) => handleInputChange('duration', value)}
          />

          <Input
            label="Property Address (Optional)"
            type="text"
            placeholder="Enter property address"
            value={formData.property}
            onChange={(e) => handleInputChange('property', e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Add any additional notes or preparation requirements"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              iconName="Calendar"
              iconPosition="left"
            >
              Schedule Appointment
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {!isExpanded && (
        <div className="p-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setIsExpanded(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Schedule New Appointment
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickScheduleForm;