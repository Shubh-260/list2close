import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentCommunications = () => {
  const communications = [
    {
      id: 1,
      type: 'email',
      sender: 'John Smith',
      subject: 'Question about 123 Oak Street',
      preview: 'Hi Sarah, I had a few questions about the property we viewed yesterday. Could you provide more details about...',
      timestamp: '10 minutes ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      type: 'sms',
      sender: 'Mary Johnson',
      subject: 'SMS Message',
      preview: 'Can we reschedule tomorrow\'s meeting to 3 PM instead?',
      timestamp: '25 minutes ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      type: 'whatsapp',
      sender: 'Mike Davis',
      subject: 'WhatsApp Message',
      preview: 'Thanks for the property tour today! The house looks perfect for our family.',
      timestamp: '1 hour ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      type: 'email',
      sender: 'Lisa Wilson',
      subject: 'Offer submission documents',
      preview: 'Please find attached the signed offer documents for 789 Maple Drive. Looking forward to your response.',
      timestamp: '2 hours ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      type: 'sms',
      sender: 'Tom Anderson',
      subject: 'SMS Message',
      preview: 'Hi Sarah, what time works best for the property inspection next week?',
      timestamp: '3 hours ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const typeIcons = {
    email: 'Mail',
    sms: 'MessageSquare',
    whatsapp: 'MessageCircle'
  };

  const typeColors = {
    email: 'bg-primary/10 text-primary',
    sms: 'bg-accent/10 text-accent',
    whatsapp: 'bg-success/10 text-success'
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Recent Communications</h3>
          <Button variant="ghost" size="sm" iconName="MessageSquare" iconPosition="left">
            View All
          </Button>
        </div>
      </div>
      
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {communications.map((comm) => (
          <div 
            key={comm.id} 
            className={`p-4 hover:bg-muted/50 transition-colors duration-200 cursor-pointer ${
              comm.unread ? 'bg-accent/5 border-l-4 border-l-accent' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={comm.avatar} 
                    alt={comm.sender}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${typeColors[comm.type]}`}>
                  <Icon name={typeIcons[comm.type]} size={12} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-medium ${comm.unread ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                      {comm.sender}
                    </h4>
                    {comm.unread && (
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {comm.timestamp}
                  </span>
                </div>
                
                <p className={`text-sm mb-2 ${comm.unread ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                  {comm.subject}
                </p>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {comm.preview}
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="ghost" size="xs" iconName="Reply">
                    Reply
                  </Button>
                  <Button variant="ghost" size="xs" iconName="Forward">
                    Forward
                  </Button>
                  {comm.unread && (
                    <Button variant="ghost" size="xs" iconName="Check">
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="Plus" iconPosition="left">
          Compose Message
        </Button>
      </div>
    </div>
  );
};

export default RecentCommunications;