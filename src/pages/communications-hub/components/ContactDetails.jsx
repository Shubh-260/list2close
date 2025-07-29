import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactDetails = ({ contact, onUpdateContact, onScheduleAppointment, onAddNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState(contact || {});
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  const interactionHistory = [
    {
      id: 1,
      type: 'email',
      title: 'Property inquiry sent',
      description: 'Sent information about 123 Oak Street listing',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 2,
      type: 'call',
      title: 'Phone consultation',
      description: 'Discussed budget and preferences - 45 min call',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 3,
      type: 'showing',
      title: 'Property showing scheduled',
      description: 'Viewing at 456 Pine Avenue - Tomorrow 2:00 PM',
      timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'scheduled'
    }
  ];

  const extractedTasks = [
    {
      id: 1,
      title: 'Send mortgage pre-approval info',
      description: 'Client mentioned needing financing options',
      priority: 'high',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: 2,
      title: 'Schedule home inspection',
      description: 'Coordinate with inspector for 123 Oak Street',
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: 3,
      title: 'Follow up on offer response',
      description: 'Check with seller agent on counteroffer',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completed: true
    }
  ];

  const notes = [
    {
      id: 1,
      content: `Client is very interested in properties with large backyards for their two dogs. Budget is flexible up to $450K. Prefers newer construction but open to renovated homes.`,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      author: 'Sarah Johnson'
    },
    {
      id: 2,
      content: `Mentioned they need to sell their current home first. Estimated timeline is 2-3 months. Should coordinate with listing team.`,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      author: 'Sarah Johnson'
    }
  ];

  const handleSaveContact = () => {
    onUpdateContact(editedContact);
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        timestamp: new Date(),
        author: 'Sarah Johnson'
      };
      onAddNote(note);
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInteractionIcon = (type) => {
    const iconMap = {
      email: 'Mail',
      call: 'Phone',
      showing: 'Home',
      meeting: 'Calendar'
    };
    return iconMap[type] || 'MessageSquare';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colorMap[priority] || 'text-muted-foreground';
  };

  if (!contact) {
    return (
      <div className="w-80 bg-surface border-l border-border flex items-center justify-center">
        <div className="text-center p-6">
          <Icon name="User" size={48} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Select a conversation to view contact details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Contact Details</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName={isEditing ? "X" : "Edit"}
            onClick={() => setIsEditing(!isEditing)}
          />
        </div>

        {/* Contact Info */}
        <div className="text-center mb-4">
          <Image
            src={contact.avatar}
            alt={contact.name}
            className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
          />
          
          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="text"
                value={editedContact.name || ''}
                onChange={(e) => setEditedContact({...editedContact, name: e.target.value})}
                placeholder="Full name"
              />
              <Input
                type="email"
                value={editedContact.email || ''}
                onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
                placeholder="Email address"
              />
              <Input
                type="tel"
                value={editedContact.phone || ''}
                onChange={(e) => setEditedContact({...editedContact, phone: e.target.value})}
                placeholder="Phone number"
              />
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={handleSaveContact}>
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h4 className="font-medium text-foreground">{contact.name}</h4>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  contact.type === 'lead' ?'bg-warning/10 text-warning' :'bg-success/10 text-success'
                }`}>
                  {contact.type}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  Score: {contact.leadScore || 85}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Calendar"
            iconPosition="left"
            onClick={() => onScheduleAppointment(contact)}
          >
            Schedule
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Phone"
            iconPosition="left"
          >
            Call
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Extracted Tasks */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Icon name="Sparkles" size={16} className="text-accent" />
              AI Tasks
            </h4>
            <span className="text-xs text-muted-foreground">
              {extractedTasks.filter(t => !t.completed).length} pending
            </span>
          </div>
          
          <div className="space-y-2">
            {extractedTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={`p-2 rounded-md border ${
                  task.completed ? 'bg-muted/50 border-muted' : 'bg-background border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className={`text-sm font-medium ${
                      task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}>
                      {task.title}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon 
                        name="Clock" 
                        size={12} 
                        className="text-muted-foreground" 
                      />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(task.dueDate)}
                      </span>
                      <Icon 
                        name="AlertCircle" 
                        size={12} 
                        className={getPriorityColor(task.priority)}
                      />
                    </div>
                  </div>
                  <button className="p-1 hover:bg-muted rounded">
                    <Icon 
                      name={task.completed ? "CheckCircle" : "Circle"} 
                      size={16} 
                      className={task.completed ? "text-success" : "text-muted-foreground"}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction History */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3">Recent Activity</h4>
          <div className="space-y-3">
            {interactionHistory.map((interaction) => (
              <div key={interaction.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  interaction.status === 'completed' ? 'bg-success/10' : 'bg-accent/10'
                }`}>
                  <Icon 
                    name={getInteractionIcon(interaction.type)} 
                    size={14} 
                    className={interaction.status === 'completed' ? 'text-success' : 'text-accent'}
                  />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-foreground">{interaction.title}</h5>
                  <p className="text-xs text-muted-foreground">{interaction.description}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(interaction.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Notes</h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              onClick={() => setShowAddNote(!showAddNote)}
            />
          </div>

          {showAddNote && (
            <div className="mb-3 p-3 bg-muted rounded-lg">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this contact..."
                className="w-full p-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <Button variant="default" size="sm" onClick={handleAddNote}>
                  Save Note
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddNote(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="p-3 bg-background rounded-lg border border-border">
                <p className="text-sm text-foreground mb-2">{note.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{note.author}</span>
                  <span>{formatDate(note.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;