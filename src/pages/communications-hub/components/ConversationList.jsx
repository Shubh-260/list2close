import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ConversationList = ({ conversations, activeConversationId, onConversationSelect, searchQuery, onSearchChange, filterType, onFilterChange }) => {
  const filterOptions = [
    { value: 'all', label: 'All Messages' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'leads', label: 'Leads' },
    { value: 'clients', label: 'Clients' }
  ];

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) {
      return messageTime.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageTime.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getChannelIcon = (channel) => {
    const iconMap = {
      email: 'Mail',
      sms: 'MessageSquare',
      whatsapp: 'MessageCircle'
    };
    return iconMap[channel] || 'MessageSquare';
  };

  const getChannelColor = (channel) => {
    const colorMap = {
      email: 'text-blue-600',
      sms: 'text-green-600',
      whatsapp: 'text-emerald-600'
    };
    return colorMap[channel] || 'text-gray-600';
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'unread') return matchesSearch && conversation.unreadCount > 0;
    if (filterType === 'leads') return matchesSearch && conversation.contact.type === 'lead';
    if (filterType === 'clients') return matchesSearch && conversation.contact.type === 'client';
    
    return matchesSearch && conversation.lastMessage.channel === filterType;
  });

  return (
    <div className="w-80 bg-surface border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <button className="p-2 hover:bg-muted rounded-md transition-colors duration-200">
            <Icon name="Plus" size={20} className="text-muted-foreground" />
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-3">
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Filter */}
        <Select
          options={filterOptions}
          value={filterType}
          onChange={onFilterChange}
          placeholder="Filter messages"
        />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`p-4 border-b border-border cursor-pointer transition-colors duration-200 hover:bg-muted ${
                activeConversationId === conversation.id ? 'bg-accent/10 border-r-2 border-r-accent' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Image
                    src={conversation.contact.avatar}
                    alt={conversation.contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-surface" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {conversation.contact.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Icon 
                        name={getChannelIcon(conversation.lastMessage.channel)} 
                        size={14} 
                        className={getChannelColor(conversation.lastMessage.channel)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      conversation.contact.type === 'lead' ?'bg-warning/10 text-warning' :'bg-success/10 text-success'
                    }`}>
                      {conversation.contact.type}
                    </span>
                    {conversation.hasTask && (
                      <Icon name="CheckSquare" size={14} className="text-accent" />
                    )}
                    {conversation.isUrgent && (
                      <Icon name="AlertCircle" size={14} className="text-error" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;