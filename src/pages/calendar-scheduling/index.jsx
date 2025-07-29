import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import CalendarHeader from './components/CalendarHeader';
import CalendarView from './components/CalendarView';
import MiniCalendar from './components/MiniCalendar';
import UpcomingAppointments from './components/UpcomingAppointments';
import QuickScheduleForm from './components/QuickScheduleForm';
import AppointmentModal from './components/AppointmentModal';

const CalendarScheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});

  // Mock appointments data
  useEffect(() => {
    const mockAppointments = [
      {
        id: '1',
        title: 'Property Showing - 123 Oak Street',
        type: 'showing',
        client: 'John Smith',
        startTime: new Date(2025, 0, 30, 10, 0),
        endTime: new Date(2025, 0, 30, 11, 0),
        property: '123 Oak Street, Downtown',
        notes: `Client is interested in 3-bedroom properties with modern amenities.\nPrefer properties with parking and good school district.\nBudget range: $450,000 - $550,000`,
        status: 'confirmed',
        reminderSent: true,
        confirmed: true
      },
      {
        id: '2',
        title: 'Client Consultation - First Time Buyers',
        type: 'consultation',
        client: 'Sarah & Mike Johnson',
        startTime: new Date(2025, 0, 30, 14, 0),
        endTime: new Date(2025, 0, 30, 15, 30),
        property: '',
        notes: `First-time home buyers consultation.\nDiscuss mortgage pre-approval process.\nReview available properties in their price range.`,
        status: 'pending',
        reminderSent: false,
        confirmed: false
      },
      {
        id: '3',
        title: 'Listing Appointment - 456 Pine Avenue',
        type: 'listing',
        client: 'Robert Davis',
        startTime: new Date(2025, 0, 31, 9, 0),
        endTime: new Date(2025, 0, 31, 10, 30),
        property: '456 Pine Avenue, Westside',
        notes: `Property evaluation and listing discussion.\nHome built in 1995, recently renovated kitchen.\nOwner looking for quick sale.`,
        status: 'confirmed',
        reminderSent: true,
        confirmed: true
      },
      {
        id: '4',
        title: 'Property Inspection - 789 Maple Drive',
        type: 'inspection',
        client: 'Emily Chen',
        startTime: new Date(2025, 1, 1, 11, 0),
        endTime: new Date(2025, 1, 1, 12, 0),
        property: '789 Maple Drive, Eastside',
        notes: `Final inspection before closing.\nCheck all agreed-upon repairs completed.\nReview property condition report.`,
        status: 'confirmed',
        reminderSent: true,
        confirmed: true
      },
      {
        id: '5',
        title: 'Team Meeting - Weekly Review',
        type: 'meeting',
        client: 'RealtyFlow Team',
        startTime: new Date(2025, 1, 3, 16, 0),
        endTime: new Date(2025, 1, 3, 17, 0),
        property: '',
        notes: `Weekly team meeting to review:\n- Current listings and showings\n- Lead conversion rates\n- Upcoming marketing campaigns`,
        status: 'pending',
        reminderSent: false,
        confirmed: false
      },
      {
        id: '6',
        title: 'Property Showing - 321 Cedar Lane',
        type: 'showing',
        client: 'David Wilson',
        startTime: new Date(2025, 1, 5, 13, 0),
        endTime: new Date(2025, 1, 5, 14, 0),
        property: '321 Cedar Lane, Northside',
        notes: `Second showing for interested buyer.\nClient wants to bring spouse for final decision.\nProperty features: 4BR/3BA, large backyard, updated appliances.`,
        status: 'pending',
        reminderSent: false,
        confirmed: false
      }
    ];

    setAppointments(mockAppointments);

    // Mock available time slots
    const mockAvailableSlots = {
      '2025-01-30': ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
      '2025-01-31': ['09:00', '10:30', '11:00', '13:00', '13:30', '14:00', '15:00', '16:00'],
      '2025-02-01': ['09:00', '09:30', '10:00', '12:00', '12:30', '13:00', '14:00', '15:00', '16:00'],
      '2025-02-03': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '17:00'],
      '2025-02-04': ['09:00', '09:30', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      '2025-02-05': ['09:00', '10:00', '11:00', '12:00', '14:30', '15:00', '16:00', '17:00']
    };

    setAvailableSlots(mockAvailableSlots);
  }, []);

  const handleDateSelect = (date) => {
    setCurrentDate(date);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleTimeSlotClick = (date, time) => {
    const [hours, minutes] = time.split(':');
    const appointmentTime = new Date(date);
    appointmentTime.setHours(parseInt(hours), parseInt(minutes));

    const newAppointment = {
      id: null,
      title: '',
      type: '',
      client: '',
      startTime: appointmentTime,
      endTime: new Date(appointmentTime.getTime() + 60 * 60 * 1000),
      property: '',
      notes: '',
      status: 'pending',
      reminderSent: false,
      confirmed: false
    };

    setSelectedAppointment(newAppointment);
    setIsModalOpen(true);
  };

  const handleScheduleAppointment = async (appointment) => {
    try {
      if (appointment.id) {
        // Update existing appointment
        setAppointments(prev => 
          prev.map(apt => apt.id === appointment.id ? appointment : apt)
        );
      } else {
        // Add new appointment
        const newAppointment = {
          ...appointment,
          id: Date.now().toString()
        };
        setAppointments(prev => [...prev, newAppointment]);
      }
      console.log('Appointment scheduled successfully:', appointment);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  };

  const handleSaveAppointment = async (appointment) => {
    try {
      setAppointments(prev => 
        prev.map(apt => apt.id === appointment.id ? appointment : apt)
      );
      console.log('Appointment saved successfully:', appointment);
    } catch (error) {
      console.error('Error saving appointment:', error);
      throw error;
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      console.log('Appointment deleted successfully:', appointmentId);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleMonthChange = (date) => {
    setCurrentDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        
        {/* Calendar Header */}
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onNavigate={handleNavigate}
          onToday={handleToday}
        />

        {/* Main Content */}
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Left Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 p-4 space-y-6 overflow-y-auto">
            {/* Mini Calendar */}
            <MiniCalendar
              currentDate={currentDate}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              appointments={appointments}
            />

            {/* Quick Schedule Form */}
            <QuickScheduleForm
              onSchedule={handleScheduleAppointment}
              availableSlots={availableSlots}
            />

            {/* Upcoming Appointments */}
            <UpcomingAppointments
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
              onReschedule={handleReschedule}
            />
          </div>

          {/* Main Calendar View */}
          <div className="flex-1 p-6">
            <CalendarView
              currentDate={currentDate}
              viewMode={viewMode}
              appointments={appointments}
              onDateSelect={handleDateSelect}
              onAppointmentClick={handleAppointmentClick}
              onTimeSlotClick={handleTimeSlotClick}
            />
          </div>
        </div>

        {/* Appointment Modal */}
        <AppointmentModal
          appointment={selectedAppointment}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
          }}
          onSave={handleSaveAppointment}
          onDelete={handleDeleteAppointment}
        />
      </div>
    </div>
  );
};

export default CalendarScheduling;