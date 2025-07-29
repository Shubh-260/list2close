import openai from './openaiClient';

/**
 * Extracts tasks and action items from incoming messages using NLP
 * @param {string} messageContent - The message content to analyze
 * @param {Object} context - Additional context like sender, channel, etc.
 * @returns {Promise<Object>} Extracted tasks and suggested actions
 */
export async function extractTasksFromMessage(messageContent, context = {}) {
  try {
    const prompt = `
Analyze this message from a real estate client/lead and extract any tasks, action items, or important information:

Message: "${messageContent}"
Sender: ${context.sender || 'Unknown'}
Channel: ${context.channel || 'Unknown'}
Lead/Client Type: ${context.contactType || 'Unknown'}

Identify:
1. Explicit requests or questions that need responses
2. Implied actions needed (schedule showing, send documents, etc.)
3. Important dates or deadlines mentioned
4. Urgency level of the message
5. Sentiment and engagement level
6. Next steps recommendations
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an AI assistant that helps real estate agents identify tasks and action items from client communications. Be thorough and practical in your analysis.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'task_extraction_response',
          schema: {
            type: 'object',
            properties: {
              tasks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                    category: { type: 'string', enum: ['follow-up', 'document', 'scheduling', 'research', 'other'] },
                    dueDate: { type: 'string' }
                  },
                  required: ['title', 'description', 'priority', 'category']
                }
              },
              sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative', 'urgent'] },
              urgencyLevel: { type: 'string', enum: ['low', 'medium', 'high', 'immediate'] },
              suggestedResponse: { type: 'string' },
              keyTopics: { type: 'array', items: { type: 'string' } },
              requiresImmedateAttention: { type: 'boolean' }
            },
            required: ['tasks', 'sentiment', 'urgencyLevel', 'suggestedResponse', 'keyTopics', 'requiresImmedateAttention'],
            additionalProperties: false,
          },
        },
      },
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      ...result,
      analyzedAt: new Date().toISOString(),
      originalMessage: messageContent,
      context
    };
  } catch (error) {
    console.error('Error extracting tasks from message:', error);
    
    // Fallback analysis
    return {
      tasks: [{
        title: 'Review message',
        description: `Review and respond to message from ${context.sender}`,
        priority: 'medium',
        category: 'follow-up'
      }],
      sentiment: 'neutral',
      urgencyLevel: 'medium',
      suggestedResponse: 'Thank you for your message. I will review this and get back to you shortly.',
      keyTopics: ['General inquiry'],
      requiresImmedateAttention: false,
      analyzedAt: new Date().toISOString(),
      originalMessage: messageContent,
      context,
      source: 'fallback'
    };
  }
}

/**
 * Generates smart reply suggestions based on message context
 * @param {string} incomingMessage - The message to respond to
 * @param {Object} conversationHistory - Recent message history for context
 * @param {Object} contactInfo - Information about the contact
 * @returns {Promise<Array>} Array of suggested responses
 */
export async function generateSmartReplies(incomingMessage, conversationHistory = [], contactInfo = {}) {
  try {
    const historyText = conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join('\n');

    const prompt = `
Generate 3 smart reply options for this real estate conversation:

Contact Information:
- Name: ${contactInfo.name || 'Contact'}
- Type: ${contactInfo.type || 'Lead'}
- Lead Score: ${contactInfo.leadScore || 'N/A'}

Recent Conversation:
${historyText}

Latest Message: "${incomingMessage}"

Create three response options:
1. Quick/Brief response
2. Detailed/Professional response  
3. Action-oriented response (with next steps)

Each response should be appropriate for the context and relationship stage.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional real estate agent generating helpful, appropriate response options for client communications.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'smart_replies_response',
          schema: {
            type: 'object',
            properties: {
              replies: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['quick', 'detailed', 'action-oriented'] },
                    content: { type: 'string' },
                    tone: { type: 'string', enum: ['professional', 'friendly', 'urgent', 'informative'] }
                  },
                  required: ['type', 'content', 'tone']
                }
              }
            },
            required: ['replies'],
            additionalProperties: false,
          },
        },
      },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.replies;
  } catch (error) {
    console.error('Error generating smart replies:', error);
    
    // Fallback replies
    return [
      {
        type: 'quick',
        content: 'Thanks for your message! I\'ll get back to you shortly.',
        tone: 'friendly'
      },
      {
        type: 'detailed',
        content: `Hi ${contactInfo.name || 'there'}, thank you for reaching out. I appreciate your interest and I\'d be happy to help you with your real estate needs. Let me review your message and I\'ll provide you with detailed information shortly.`,
        tone: 'professional'
      },
      {
        type: 'action-oriented',
        content: `Hi ${contactInfo.name || 'there'}! I\'d love to discuss this further. Would you be available for a quick 15-minute call this week? I can share some great options that match what you\'re looking for.`,
        tone: 'friendly'
      }
    ];
  }
}

/**
 * Moderates message content for inappropriate or sensitive content
 * @param {string} content - Message content to moderate
 * @returns {Promise<Object>} Moderation results
 */
export async function moderateMessageContent(content) {
  try {
    const response = await openai.moderations.create({
      model: 'text-moderation-latest',
      input: content,
    });

    const result = response.results[0];
    
    return {
      flagged: result.flagged,
      categories: result.categories,
      categoryScores: result.category_scores,
      safe: !result.flagged,
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error moderating content:', error);
    
    // Fallback - assume safe
    return {
      flagged: false,
      categories: {},
      categoryScores: {},
      safe: true,
      checkedAt: new Date().toISOString(),
      source: 'fallback'
    };
  }
}