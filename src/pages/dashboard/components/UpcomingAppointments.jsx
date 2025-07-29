import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingAppointments = () => {
  const appointments = [
    {
      id: 1,
      type: 'showing',
      title: 'Property Showing',
      client: 'John & Mary Smith',
      property: '123 Oak Street, Downtown',
      time: '2:00 PM',
      date: 'Today',
      status: 'confirmed',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Client Consultation',
      client: 'Sarah Johnson',
      property: 'New listing discussion',
      time: '4:30 PM',
      date: 'Today',
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      type: 'inspection',
      title: 'Home Inspection',
      client: 'Mike Davis',
      property: '456 Pine Avenue, Suburbs',
      time: '10:00 AM',
      date: 'Tomorrow',
      status: 'confirmed',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      type: 'closing',
      title: 'Closing Meeting',
      client: 'Lisa & Tom Wilson',
      property: '789 Maple Drive, Westside',
      time: '1:00 PM',
      date: 'Tomorrow',
      status: 'confirmed',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const typeIcons = {
    showing: 'Home',
    meeting: 'Users',
    inspection: 'Search',
    closing: 'FileCheck'
  };

  const statusColors = {
    confirmed: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Upcoming Appointments</h3>
          <Button variant="ghost" size="sm" iconName="Calendar" iconPosition="left">
            View Calendar
          </Button>
        </div>
      </div>
      
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="p-4 hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={appointment.avatar} 
                  alt={appointment.client}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-card-foreground mb-1">
                      {appointment.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {appointment.client}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColors[appointment.status]}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Icon name={typeIcons[appointment.type]} size={14} />
                    <span>{appointment.property}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      <span>{appointment.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="xs" iconName="MessageSquare">
                      Message
                    </Button>
                    <Button variant="ghost" size="xs" iconName="Phone">
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="Plus" iconPosition="left">
          Schedule New Appointment
        </Button>
      </div>
    </div>
  );
};

export default UpcomingAppointments;