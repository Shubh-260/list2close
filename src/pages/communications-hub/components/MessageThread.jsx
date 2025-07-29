import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { extractTasksFromMessage, generateSmartReplies, moderateMessageContent } from '../../../services/communicationService';
import Select from '../../../components/ui/Select';


const MessageThread = ({ conversation, onSendMessage, onScheduleAppointment, onAddNote, scrollToBottom, setShowTemplates, fileInputRef, setIsRecording, isRecording, format }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('email');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [smartReplies, setSmartReplies] = useState([]);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState([]);
  const [isAnalyzingMessage, setIsAnalyzingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  useEffect(() => {
    if (conversation?.messages?.length > 0) {
      generateSmartReplyOptions();
      analyzeLatestMessage();
    }
  }, [conversation]);

  const generateSmartReplyOptions = async () => {
    if (!conversation?.messages?.length) return;

    setIsGeneratingReplies(true);
    try {
      const latestMessage = conversation.messages[conversation.messages.length - 1];
      if (latestMessage.sender !== 'You') {
        const replies = await generateSmartReplies(
          latestMessage.content,
          conversation.messages,
          conversation.contact
        );
        setSmartReplies(replies);
      }
    } catch (error) {
      console.error('Error generating smart replies:', error);
    } finally {
      setIsGeneratingReplies(false);
    }
  };

  const analyzeLatestMessage = async () => {
    if (!conversation?.messages?.length) return;

    const latestMessage = conversation.messages[conversation.messages.length - 1];
    if (latestMessage.sender === 'You') return; // Don't analyze our own messages

    setIsAnalyzingMessage(true);
    try {
      const taskAnalysis = await extractTasksFromMessage(
        latestMessage.content,
        {
          sender: latestMessage.sender,
          channel: latestMessage.channel,
          contactType: conversation.contact?.type
        }
      );

      setExtractedTasks(taskAnalysis.tasks);

      // Log the analysis for debugging
      console.log('AI Task Analysis:', taskAnalysis);

      // If requires immediate attention, could trigger notifications
      if (taskAnalysis.requiresImmedateAttention) {
        console.log('🚨 Message requires immediate attention!');
      }
    } catch (error) {
      console.error('Error analyzing message:', error);
    } finally {
      setIsAnalyzingMessage(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Moderate message content before sending
    try {
      const moderation = await moderateMessageContent(newMessage);
      if (moderation.flagged) {
        alert('Message contains inappropriate content and cannot be sent.');
        return;
      }
    } catch (error) {
      console.warn('Content moderation failed, proceeding with send:', error);
    }

    const messageData = {
      content: newMessage.trim(),
      channel: selectedChannel,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    onSendMessage(messageData);
    setNewMessage('');
    setAttachments([]);
    setSmartReplies([]); // Clear smart replies after sending
  };

  const handleSmartReplySelect = (reply) => {
    setNewMessage(reply.content);
    setSmartReplies([]); // Clear other options
  };

  const handleTaskComplete = (taskIndex) => {
    setExtractedTasks((prev) =>
    prev.filter((_, index) => index !== taskIndex)
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateSelect = (template) => {
    const populatedContent = template.content.
    replace('{name}', conversation.contact.name).
    replace('{address}', '123 Oak Street').
    replace('{date}', 'tomorrow');

    setNewMessage(populatedContent);
    setShowTemplates(false);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email':return 'Mail';
      case 'sms':return 'MessageSquare';
      case 'whatsapp':return 'MessageCircle';
      default:return 'MessageSquare';
    }
  };

  const getChannelColor = (channel) => {
    const colorMap = {
      email: 'text-blue-600',
      sms: 'text-green-600',
      whatsapp: 'text-emerald-600'
    };
    return colorMap[channel] || 'text-gray-600';
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageCircle" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No conversation selected</h3>
          <p className="text-muted-foreground">Choose a conversation to start messaging</p>
        </div>
      </div>);

  }

  return (
    <div className="flex-1 flex flex-col bg-background border-l border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {conversation.contact?.avatar ?
              <img
                src={conversation.contact.avatar}
                alt={conversation.contact?.name}
                className="w-10 h-10 rounded-full object-cover" /> :


              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-muted-foreground" />
                </div>
              }
              {conversation.contact?.isOnline &&
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
              }
            </div>
            <div>
              <h3 className="font-medium text-foreground">{conversation.contact?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {conversation.contact?.isOnline ? 'Online' : 'Offline'} • {conversation.contact?.type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAnalyzingMessage &&
            <div className="flex items-center gap-2 text-sm text-orange-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                Analyzing...
              </div>
            }
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onScheduleAppointment(conversation.contact)}
              iconName="Calendar">

              Schedule
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddNote('Add note from message thread')}
              iconName="FileText">

              Note
            </Button>
          </div>
        </div>

        {/* AI Extracted Tasks */}
        {extractedTasks.length > 0 &&
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Brain" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                AI Detected Tasks ({extractedTasks.length})
              </span>
            </div>
            <div className="space-y-2">
              {extractedTasks.map((task, index) =>
            <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`
                  }>
                        {task.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">{task.category}</span>
                    </div>
                  </div>
                  <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTaskComplete(index)}
                iconName="Check">

                    Done
                  </Button>
                </div>
            )}
            </div>
          </div>
        }
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages?.map((message, index) =>
        <div
          key={index}
          className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>

            <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`
            }>

              <p className="text-sm">{message.content}</p>
              
              {message.attachment &&
            <div className="mt-2 p-2 bg-black bg-opacity-10 rounded">
                  <div className="flex items-center gap-2">
                    <Icon name="Paperclip" size={14} />
                    <span className="text-xs">{message.attachment.name}</span>
                  </div>
                </div>
            }

              {message.aiSuggestion && message.sender === 'You' &&
            <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
                  <Icon name="Lightbulb" size={12} className="inline mr-1" />
                  AI Suggestion: {message.aiSuggestion}
                </div>
            }
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-75">
                  {format(new Date(message.timestamp), 'h:mm a')}
                </span>
                <div className="flex items-center gap-1">
                  <Icon
                  name={getChannelIcon(message.channel)}
                  size={12}
                  className="opacity-75" />

                  {message.sender === 'You' &&
                <Icon
                  name={message.status === 'read' ? 'CheckCheck' : 'Check'}
                  size={12}
                  className="opacity-75" />

                }
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Smart Replies */}
      {smartReplies.length > 0 &&
      <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Sparkles" size={16} className="text-blue-600" />
            <span className="text-sm font-medium">AI Suggested Replies:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {smartReplies.map((reply, index) =>
          <button
            key={index}
            onClick={() => handleSmartReplySelect(reply)}
            className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-full border border-blue-200 transition-colors">

                {reply.content.length > 50 ? reply.content.substring(0, 50) + '...' : reply.content}
              </button>
          )}
          </div>
        </div>
      }

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex items-center gap-2">
            <Select
              options={[
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'whatsapp', label: 'WhatsApp' }]
              }
              value={selectedChannel}
              onChange={setSelectedChannel}
              className="w-32" />

          </div>
          
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Type your ${selectedChannel} message...`}
                className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }} />

            </div>
            
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                iconName="Smile" />

              <Button
                type="submit"
                disabled={!newMessage.trim()}
                iconName="Send" />

            </div>
          </div>

          {isGeneratingReplies &&
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Generating smart replies...
            </div>
          }
        </form>
      </div>
    </div>);

};

export default MessageThread;