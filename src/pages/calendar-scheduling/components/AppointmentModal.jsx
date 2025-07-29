import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AppointmentModal = ({ appointment, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: appointment?.title || '',
    type: appointment?.type || '',
    client: appointment?.client || '',
    date: appointment ? new Date(appointment.startTime).toISOString().split('T')[0] : '',
    time: appointment ? new Date(appointment.startTime).toTimeString().slice(0, 5) : '',
    duration: appointment ? Math.round((new Date(appointment.endTime) - new Date(appointment.startTime)) / 60000) : 60,
    property: appointment?.property || '',
    notes: appointment?.notes || '',
    status: appointment?.status || 'pending'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const appointmentTypes = [
    { value: 'showing', label: 'Property Showing' },
    { value: 'consultation', label: 'Client Consultation' },
    { value: 'listing', label: 'Listing Appointment' },
    { value: 'inspection', label: 'Property Inspection' },
    { value: 'meeting', label: 'General Meeting' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedAppointment = {
        ...appointment,
        title: formData.title,
        type: formData.type,
        client: formData.client,
        startTime: new Date(`${formData.date}T${formData.time}`),
        endTime: new Date(new Date(`${formData.date}T${formData.time}`).getTime() + parseInt(formData.duration) * 60000),
        property: formData.property,
        notes: formData.notes,
        status: formData.status
      };

      await onSave(updatedAppointment);
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Failed to save appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setIsLoading(true);
      try {
        await onDelete(appointment.id);
        onClose();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendReminder = () => {
    console.log('Sending reminder for appointment:', appointment.id);
    alert('Reminder sent successfully!');
  };

  const formatDateTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const dateStr = start.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const timeStr = `${start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })} - ${end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;
    
    return { dateStr, timeStr };
  };

  if (!isOpen) return null;

  const { dateStr, timeStr } = appointment ? formatDateTime(appointment.startTime, appointment.endTime) : { dateStr: '', timeStr: '' };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {appointment ? 'Edit Appointment' : 'New Appointment'}
            </h2>
            {appointment && (
              <p className="text-sm text-gray-600 mt-1">
                {dateStr} • {timeStr}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          {appointment && (
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'actions' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Actions
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <Input
                label="Appointment Title"
                type="text"
                placeholder="e.g., Property showing for 123 Main St"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Appointment Type"
                  placeholder="Select type"
                  options={appointmentTypes}
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value)}
                  required
                />

                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                />
              </div>

              <Input
                label="Client Name"
                type="text"
                placeholder="Enter client name"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />

                <Input
                  label="Time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  required
                />

                <Select
                  label="Duration"
                  options={durationOptions}
                  value={formData.duration.toString()}
                  onChange={(value) => handleInputChange('duration', value)}
                />
              </div>

              <Input
                label="Property Address"
                type="text"
                placeholder="Enter property address"
                value={formData.property}
                onChange={(e) => handleInputChange('property', e.target.value)}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Add any additional notes or preparation requirements"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'actions' && appointment && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Communication</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={sendReminder}
                    iconName="Bell"
                    iconPosition="left"
                  >
                    Send Reminder
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Mail"
                    iconPosition="left"
                  >
                    Send Confirmation Email
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="MessageSquare"
                    iconPosition="left"
                  >
                    Send SMS
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Calendar Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Copy"
                    iconPosition="left"
                  >
                    Duplicate Appointment
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Clock"
                    iconPosition="left"
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export to Calendar
                  </Button>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-3">Danger Zone</h3>
                <Button
                  variant="destructive"
                  fullWidth
                  onClick={handleDelete}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Appointment
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;