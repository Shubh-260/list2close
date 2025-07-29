import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const CalendarView = ({ 
  currentDate, 
  viewMode, 
  appointments, 
  onDateSelect, 
  onAppointmentClick, 
  onTimeSlotClick 
}) => {
  const [draggedAppointment, setDraggedAppointment] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    let day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      let day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toDateString();
    return appointments.filter(apt => new Date(apt.startTime).toDateString() === dateStr);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAppointmentColor = (type) => {
    const colors = {
      showing: 'bg-blue-100 border-blue-300 text-blue-800',
      consultation: 'bg-green-100 border-green-300 text-green-800',
      listing: 'bg-purple-100 border-purple-300 text-purple-800',
      inspection: 'bg-orange-100 border-orange-300 text-orange-800',
      meeting: 'bg-gray-100 border-gray-300 text-gray-800'
    };
    return colors[type] || colors.meeting;
  };

  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetDate, targetTime = null) => {
    e.preventDefault();
    if (draggedAppointment && targetDate) {
      const newStartTime = new Date(targetDate);
      if (targetTime) {
        const [hours, minutes] = targetTime.split(':');
        newStartTime.setHours(parseInt(hours), parseInt(minutes));
      } else {
        newStartTime.setHours(new Date(draggedAppointment.startTime).getHours());
        newStartTime.setMinutes(new Date(draggedAppointment.startTime).getMinutes());
      }
      
      // Check for conflicts
      const hasConflict = appointments.some(apt => 
        apt.id !== draggedAppointment.id &&
        new Date(apt.startTime).toDateString() === newStartTime.toDateString() &&
        Math.abs(new Date(apt.startTime).getTime() - newStartTime.getTime()) < 60 * 60 * 1000
      );
      
      if (hasConflict) {
        alert('Time slot conflict detected. Please choose a different time.');
      } else {
        console.log('Reschedule appointment:', draggedAppointment.id, 'to', newStartTime);
      }
    }
    setDraggedAppointment(null);
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Month Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayAppointments = day ? getAppointmentsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isSelected = day && day.toDateString() === currentDate.toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-32 p-2 border-r border-b border-gray-100 ${
                  !day ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                } ${isSelected ? 'bg-blue-50' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => day && handleDrop(e, day)}
                onClick={() => day && onDateSelect(day)}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                      {isToday && (
                        <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full inline-block" />
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map(apt => (
                        <div
                          key={apt.id}
                          className={`text-xs p-1 rounded border cursor-pointer ${getAppointmentColor(apt.type)}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, apt)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick(apt);
                          }}
                        >
                          <div className="font-medium truncate">{formatTime(apt.startTime)}</div>
                          <div className="truncate">{apt.title}</div>
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayAppointments.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-3 bg-gray-50 border-r border-gray-200"></div>
          {weekDays.map(day => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={day.toISOString()} className="p-3 text-center bg-gray-50 border-r border-gray-200">
                <div className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-sm ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="max-h-96 overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-2 text-xs text-gray-500 bg-gray-50 border-r border-gray-200 text-center">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              {weekDays.map(day => {
                const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                const slotAppointments = getAppointmentsForDate(day).filter(apt => {
                  const aptHour = new Date(apt.startTime).getHours();
                  return aptHour === hour;
                });

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="p-1 border-r border-gray-100 min-h-12 hover:bg-gray-50 cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, timeSlot)}
                    onClick={() => onTimeSlotClick(day, timeSlot)}
                  >
                    {slotAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded border mb-1 cursor-pointer ${getAppointmentColor(apt.type)}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, apt)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick(apt);
                        }}
                      >
                        <div className="font-medium">{apt.title}</div>
                        <div>{apt.client}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayAppointments = getAppointmentsForDate(currentDate);

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Day Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-900">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>

        {/* Time Slots */}
        <div className="max-h-96 overflow-y-auto">
          {hours.map(hour => {
            const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
            const hourAppointments = dayAppointments.filter(apt => {
              const aptHour = new Date(apt.startTime).getHours();
              return aptHour === hour;
            });

            return (
              <div key={hour} className="flex border-b border-gray-100">
                <div className="w-20 p-3 text-xs text-gray-500 bg-gray-50 border-r border-gray-200 text-center">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div 
                  className="flex-1 p-2 min-h-16 hover:bg-gray-50 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, currentDate, timeSlot)}
                  onClick={() => onTimeSlotClick(currentDate, timeSlot)}
                >
                  {hourAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className={`p-2 rounded border mb-2 cursor-pointer ${getAppointmentColor(apt.type)}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, apt)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(apt);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{apt.title}</div>
                          <div className="text-sm">{apt.client}</div>
                          <div className="text-xs text-gray-600">
                            {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                          </div>
                        </div>
                        <Icon name="GripVertical" size={16} className="text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
    </div>
  );
};

export default CalendarView;