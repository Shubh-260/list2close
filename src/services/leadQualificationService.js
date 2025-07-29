import openai from './openaiClient';

/**
 * Qualifies a lead using OpenAI's structured output for consistent scoring
 * @param {Object} leadData - Lead information including source, content, contact details
 * @returns {Promise<Object>} Qualification results with score and analysis
 */
export async function qualifyLead(leadData) {
  try {
    const prompt = `
Analyze this real estate lead and provide qualification scoring:

Lead Information:
- Name: ${leadData.name || 'Not provided'}
- Email: ${leadData.email || 'Not provided'}
- Phone: ${leadData.phone || 'Not provided'}
- Source: ${leadData.source || 'Not provided'}
- Message/Inquiry: ${leadData.message || 'Not provided'}
- Budget Information: ${leadData.budget || 'Not provided'}
- Timeline: ${leadData.timeline || 'Not provided'}
- Property Type Interest: ${leadData.propertyType || 'Not provided'}

Evaluate based on:
1. Contact completeness (email, phone)
2. Budget clarity and realistic range
3. Timeline urgency and specificity
4. Property type and location specificity
5. Message quality and motivation level
6. Lead source reliability
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert real estate lead qualification assistant. Analyze leads and provide structured scoring from 0-100 with detailed reasoning.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'lead_qualification_response',
          schema: {
            type: 'object',
            properties: {
              qualificationScore: { type: 'number', minimum: 0, maximum: 100 },
              status: { type: 'string', enum: ['new', 'qualified', 'nurturing', 'contacted', 'converted', 'lost'] },
              priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
              reasoning: { type: 'string' },
              suggestedActions: { type: 'array', items: { type: 'string' } },
              tags: { type: 'array', items: { type: 'string' } },
              followUpRecommendation: { type: 'string' }
            },
            required: ['qualificationScore', 'status', 'priority', 'reasoning', 'suggestedActions', 'tags'],
            additionalProperties: false,
          },
        },
      },
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      ...result,
      timestamp: new Date().toISOString(),
      source: 'openai-qualification'
    };
  } catch (error) {
    console.error('Error qualifying lead with OpenAI:', error);
    
    // Fallback to basic scoring
    return {
      qualificationScore: 50,
      status: 'new',
      priority: 'medium',
      reasoning: 'AI qualification unavailable, using basic scoring',
      suggestedActions: ['Manual review required'],
      tags: ['Unqualified'],
      followUpRecommendation: 'Contact within 24 hours for initial qualification',
      timestamp: new Date().toISOString(),
      source: 'fallback'
    };
  }
}

/**
 * Generates personalized follow-up message suggestions
 * @param {Object} lead - Lead information and qualification data
 * @returns {Promise<Array>} Array of suggested messages for different channels
 */
export async function generateFollowUpMessages(lead) {
  try {
    const prompt = `
Generate personalized follow-up messages for this qualified real estate lead:

Lead Profile:
- Name: ${lead.name}
- Qualification Score: ${lead.qualificationScore}/100
- Status: ${lead.status}
- Interest: ${lead.notes || 'General property interest'}
- Source: ${lead.source}
- Tags: ${lead.tags?.join(', ') || 'None'}

Create 3 different follow-up messages:
1. Email (professional, detailed)
2. SMS (concise, friendly)  
3. WhatsApp (personal, conversational)

Each message should be personalized and appropriate for the lead's qualification level and interest.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional real estate agent creating personalized follow-up messages. Be helpful, professional, and action-oriented.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'followup_messages_response',
          schema: {
            type: 'object',
            properties: {
              email: { 
                type: 'object',
                properties: {
                  subject: { type: 'string' },
                  body: { type: 'string' }
                },
                required: ['subject', 'body']
              },
              sms: { type: 'string' },
              whatsapp: { type: 'string' }
            },
            required: ['email', 'sms', 'whatsapp'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating follow-up messages:', error);
    
    // Fallback messages
    return {
      email: {
        subject: `Following up on your property inquiry, ${lead.name}`,
        body: `Hi ${lead.name},\n\nThank you for your interest in our properties. I'd love to help you find the perfect home that meets your needs.\n\nWhen would be a good time for a quick call to discuss your requirements?\n\nBest regards,\nYour Real Estate Agent`
      },
      sms: `Hi ${lead.name}! Thanks for your property inquiry. I'd love to help you find your dream home. When's a good time to chat? 😊`,
      whatsapp: `Hello ${lead.name}! 👋 I saw your interest in our properties. I have some great options that might be perfect for you. Would you like to see them?`
    };
  }
}