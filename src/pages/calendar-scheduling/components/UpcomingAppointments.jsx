import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingAppointments = ({ appointments, onAppointmentClick, onReschedule }) => {
  const formatDateTime = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dateStr;
    if (appointmentDate.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = appointmentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }

    const timeStr = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return { dateStr, timeStr };
  };

  const getAppointmentIcon = (type) => {
    const icons = {
      showing: 'Home',
      consultation: 'Users',
      listing: 'FileText',
      inspection: 'Search',
      meeting: 'Calendar'
    };
    return icons[type] || 'Calendar';
  };

  const getAppointmentColor = (type) => {
    const colors = {
      showing: 'text-blue-600 bg-blue-50',
      consultation: 'text-green-600 bg-green-50',
      listing: 'text-purple-600 bg-purple-50',
      inspection: 'text-orange-600 bg-orange-50',
      meeting: 'text-gray-600 bg-gray-50'
    };
    return colors[type] || colors.meeting;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      cancelled: 'text-red-600 bg-red-100',
      completed: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || colors.pending;
  };

  // Sort appointments by date and time
  const sortedAppointments = [...appointments]
    .filter(apt => new Date(apt.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 10); // Show only next 10 appointments

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Upcoming Appointments</h3>
          <Button variant="ghost" size="sm" iconName="Plus">
            Add New
          </Button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sortedAppointments.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Calendar" size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No upcoming appointments</p>
            <Button variant="outline" size="sm" className="mt-3" iconName="Plus">
              Schedule First Appointment
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedAppointments.map((appointment) => {
              const { dateStr, timeStr } = formatDateTime(appointment.startTime);
              const iconName = getAppointmentIcon(appointment.type);
              const colorClass = getAppointmentColor(appointment.type);
              const statusColor = getStatusColor(appointment.status);

              return (
                <div
                  key={appointment.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => onAppointmentClick(appointment)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon name={iconName} size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {appointment.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          <span>{dateStr} at {timeStr}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="User" size={14} />
                          <span className="truncate">{appointment.client}</span>
                        </div>
                      </div>

                      {appointment.property && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <Icon name="MapPin" size={14} />
                          <span className="truncate">{appointment.property}</span>
                        </div>
                      )}

                      {appointment.notes && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {appointment.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {appointment.reminderSent && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Icon name="Check" size={12} />
                              <span>Reminder sent</span>
                            </div>
                          )}
                          {appointment.confirmed && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Icon name="CheckCircle" size={12} />
                              <span>Confirmed</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReschedule(appointment);
                            }}
                            iconName="Clock"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Edit appointment:', appointment.id);
                            }}
                            iconName="Edit"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {sortedAppointments.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" size="sm" fullWidth>
            View All Appointments
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;