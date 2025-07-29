import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ConversationList from './components/ConversationList';
import MessageThread from './components/MessageThread';
import ContactDetails from './components/ContactDetails';

const CommunicationsHub = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock conversations data
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        contact: {
          name: 'Michael Rodriguez',
          email: 'michael.rodriguez@email.com',
          phone: '(555) 123-4567',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          type: 'lead',
          leadScore: 92,
          isOnline: true
        },
        lastMessage: {
          content: 'I\'m very interested in the property at 123 Oak Street. When can we schedule a viewing?',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          channel: 'email',
          sender: 'Michael Rodriguez'
        },
        messages: [
          {
            sender: 'Michael Rodriguez',
            content: 'Hi Sarah, I saw your listing for the property at 123 Oak Street. It looks perfect for my family!',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            channel: 'email',
            status: 'read'
          },
          {
            sender: 'You',
            content: 'Hello Michael! Thank you for your interest. The property has 4 bedrooms, 3 bathrooms, and a beautiful backyard. Would you like to schedule a viewing?',
            timestamp: new Date(Date.now() - 90 * 60 * 1000),
            channel: 'email',
            status: 'read',
            aiSuggestion: 'Consider mentioning the recent price reduction and nearby schools'
          },
          {
            sender: 'Michael Rodriguez',
            content: 'I\'m very interested in the property at 123 Oak Street. When can we schedule a viewing?',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            channel: 'email',
            status: 'delivered'
          }
        ],
        unreadCount: 1,
        hasTask: true,
        isUrgent: false
      },
      {
        id: 2,
        contact: {
          name: 'Jennifer Chen',
          email: 'jennifer.chen@email.com',
          phone: '(555) 987-6543',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          type: 'client',
          leadScore: 88,
          isOnline: false
        },
        lastMessage: {
          content: 'The inspection report looks good. Ready to move forward with the offer!',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          channel: 'sms',
          sender: 'Jennifer Chen'
        },
        messages: [
          {
            sender: 'You',
            content: 'Hi Jennifer, the inspection has been completed. I\'ll send you the report shortly.',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            channel: 'sms',
            status: 'read'
          },
          {
            sender: 'Jennifer Chen',
            content: 'The inspection report looks good. Ready to move forward with the offer!',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            channel: 'sms',
            status: 'read'
          }
        ],
        unreadCount: 1,
        hasTask: false,
        isUrgent: false
      },
      {
        id: 3,
        contact: {
          name: 'David Thompson',
          email: 'david.thompson@email.com',
          phone: '(555) 456-7890',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          type: 'lead',
          leadScore: 76,
          isOnline: true
        },
        lastMessage: {
          content: 'Thanks for the market analysis. Can we discuss financing options?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          channel: 'whatsapp',
          sender: 'David Thompson'
        },
        messages: [
          {
            sender: 'You',
            content: 'Here\'s the comprehensive market analysis you requested for the downtown area.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            channel: 'whatsapp',
            status: 'read',
            attachment: {
              type: 'document',
              name: 'Market_Analysis_Downtown.pdf',
              url: '/documents/market-analysis.pdf'
            }
          },
          {
            sender: 'David Thompson',
            content: 'Thanks for the market analysis. Can we discuss financing options?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            channel: 'whatsapp',
            status: 'read'
          }
        ],
        unreadCount: 1,
        hasTask: true,
        isUrgent: true
      },
      {
        id: 4,
        contact: {
          name: 'Sarah Williams',
          email: 'sarah.williams@email.com',
          phone: '(555) 321-0987',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          type: 'client',
          leadScore: 95,
          isOnline: false
        },
        lastMessage: {
          content: 'Closing went smoothly! Thank you for all your help throughout this process.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          channel: 'email',
          sender: 'Sarah Williams'
        },
        messages: [
          {
            sender: 'Sarah Williams',
            content: 'Closing went smoothly! Thank you for all your help throughout this process.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            channel: 'email',
            status: 'read'
          },
          {
            sender: 'You',
            content: 'Congratulations on your new home! It was a pleasure working with you. Don\'t hesitate to reach out if you need anything.',
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
            channel: 'email',
            status: 'read'
          }
        ],
        unreadCount: 0,
        hasTask: false,
        isUrgent: false
      },
      {
        id: 5,
        contact: {
          name: 'Robert Johnson',
          email: 'robert.johnson@email.com',
          phone: '(555) 654-3210',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          type: 'lead',
          leadScore: 67,
          isOnline: true
        },
        lastMessage: {
          content: 'I need to postpone our meeting tomorrow. Can we reschedule for next week?',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          channel: 'sms',
          sender: 'Robert Johnson'
        },
        messages: [
          {
            sender: 'You',
            content: 'Hi Robert, just confirming our meeting tomorrow at 2 PM to discuss your home buying needs.',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            channel: 'sms',
            status: 'read'
          },
          {
            sender: 'Robert Johnson',
            content: 'I need to postpone our meeting tomorrow. Can we reschedule for next week?',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            channel: 'sms',
            status: 'delivered'
          }
        ],
        unreadCount: 1,
        hasTask: true,
        isUrgent: false
      }
    ];

    setConversations(mockConversations);
    setActiveConversation(mockConversations[0]);
  }, []);

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (message) => {
    if (!activeConversation) return;

    const newMessage = {
      sender: 'You',
      content: message.content,
      timestamp: message.timestamp,
      channel: message.channel,
      status: 'sent'
    };

    // Update active conversation
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastMessage: {
        content: message.content,
        timestamp: message.timestamp,
        channel: message.channel,
        sender: 'You'
      }
    };

    setActiveConversation(updatedConversation);

    // Update conversations list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id ? updatedConversation : conv
      )
    );
  };

  const handleScheduleAppointment = (contact) => {
    console.log('Schedule appointment for:', contact.name);
    // Integration with calendar module would go here
  };

  const handleAddNote = (note) => {
    console.log('Add note:', note);
    // Note saving logic would go here
  };

  const handleUpdateContact = (updatedContact) => {
    if (!activeConversation) return;

    const updatedConversation = {
      ...activeConversation,
      contact: updatedContact
    };

    setActiveConversation(updatedConversation);
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id ? updatedConversation : conv
      )
    );
  };

  return (
    <>
      <Helmet>
        <title>Communications Hub - RealtyFlow AI</title>
        <meta name="description" content="Unified communication interface for managing client interactions across email, SMS, and WhatsApp with AI-powered task extraction." />
      </Helmet>

      <div className="flex h-screen bg-background">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onConversationSelect={handleConversationSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
        />
        
        <MessageThread
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
          onScheduleAppointment={handleScheduleAppointment}
          onAddNote={handleAddNote}
        />
        
        <ContactDetails
          contact={activeConversation?.contact}
          onUpdateContact={handleUpdateContact}
          onScheduleAppointment={handleScheduleAppointment}
          onAddNote={handleAddNote}
        />
      </div>
    </>
  );
};

export default CommunicationsHub;