import React from 'react';

import Button from '../../../components/ui/Button';

const MiniCalendar = ({ currentDate, onDateSelect, onMonthChange, appointments }) => {
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

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toDateString();
    return appointments.filter(apt => new Date(apt.startTime).toDateString() === dateStr);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    onMonthChange(nextMonth);
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            iconName="ChevronLeft"
            className="h-6 w-6"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            iconName="ChevronRight"
            className="h-6 w-6"
          />
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-8" />;
          }

          const dayAppointments = getAppointmentsForDate(day);
          const isToday = day.toDateString() === today.toDateString();
          const isSelected = day.toDateString() === currentDate.toDateString();
          const hasAppointments = dayAppointments.length > 0;

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={`h-8 w-8 text-xs rounded-md flex items-center justify-center relative transition-colors duration-200 ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : isToday
                  ? 'bg-blue-100 text-blue-600 font-medium' :'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day.getDate()}
              {hasAppointments && (
                <div className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-primary-foreground' : 'bg-blue-500'
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Has appointments</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-100 rounded-full" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;