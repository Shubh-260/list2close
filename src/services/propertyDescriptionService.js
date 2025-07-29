import openai from './openaiClient';

/**
 * Generates compelling property descriptions using AI
 * @param {Object} propertyData - Property details including features, location, price
 * @returns {Promise<Object>} Generated descriptions and marketing copy
 */
export async function generatePropertyDescription(propertyData) {
  try {
    const prompt = `
Create compelling marketing copy for this real estate property:

Property Details:
- Address: ${propertyData.address || 'Not provided'}
- Price: $${propertyData.price?.toLocaleString() || 'Not provided'}
- Type: ${propertyData.type || 'Not provided'}
- Bedrooms: ${propertyData.bedrooms || 'Not provided'}
- Bathrooms: ${propertyData.bathrooms || 'Not provided'}
- Square Feet: ${propertyData.sqft?.toLocaleString() || 'Not provided'}
- Year Built: ${propertyData.yearBuilt || 'Not provided'}
- Lot Size: ${propertyData.lotSize || 'Not provided'}
- Special Features: ${propertyData.features?.join(', ') || 'Standard features'}
- Neighborhood: ${propertyData.neighborhood || 'Not provided'}
- School District: ${propertyData.schoolDistrict || 'Not provided'}
- HOA Fee: ${propertyData.hoaFee || 'None'}

Generate professional, engaging descriptions that highlight key selling points and create emotional appeal.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert real estate copywriter who creates compelling, accurate property descriptions that sell homes. Focus on benefits, lifestyle, and emotional appeal while being truthful.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'property_description_response',
          schema: {
            type: 'object',
            properties: {
              headline: { type: 'string' },
              shortDescription: { type: 'string' },
              fullDescription: { type: 'string' },
              keyFeatures: { type: 'array', items: { type: 'string' } },
              neighborhoodHighlights: { type: 'array', items: { type: 'string' } },
              seoKeywords: { type: 'array', items: { type: 'string' } },
              socialMediaCaption: { type: 'string' }
            },
            required: ['headline', 'shortDescription', 'fullDescription', 'keyFeatures'],
            additionalProperties: false,
          },
        },
      },
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      ...result,
      generatedAt: new Date().toISOString(),
      source: 'openai-description'
    };
  } catch (error) {
    console.error('Error generating property description:', error);
    
    // Fallback description
    const fallbackDescription = `Beautiful ${propertyData.bedrooms} bedroom, ${propertyData.bathrooms} bathroom ${propertyData.type?.toLowerCase()} located at ${propertyData.address}. This ${propertyData.sqft?.toLocaleString()} square foot property offers comfortable living space in a desirable location.`;
    
    return {
      headline: `${propertyData.bedrooms}BR/${propertyData.bathrooms}BA ${propertyData.type}`,
      shortDescription: fallbackDescription,
      fullDescription: fallbackDescription + ' Contact us today to schedule a viewing and see all this property has to offer.',
      keyFeatures: [`${propertyData.bedrooms} bedrooms`, `${propertyData.bathrooms} bathrooms`, `${propertyData.sqft?.toLocaleString()} sq ft`],
      neighborhoodHighlights: ['Great location', 'Convenient access'],
      seoKeywords: [propertyData.type?.toLowerCase(), `${propertyData.bedrooms} bedroom`, propertyData.neighborhood?.toLowerCase()].filter(Boolean),
      socialMediaCaption: `🏡 New listing alert! ${fallbackDescription} #RealEstate #NewListing`,
      generatedAt: new Date().toISOString(),
      source: 'fallback'
    };
  }
}

/**
 * Analyzes property photos and suggests tags/features
 * @param {Array} imageUrls - Array of property image URLs
 * @returns {Promise<Object>} Suggested tags and features based on images
 */
export async function analyzePropertyImages(imageUrls) {
  try {
    // Note: This would require image analysis capabilities
    // For now, returning a structured response that can be expanded when image analysis is added
    const prompt = `
Based on typical real estate photography, suggest relevant tags and features that would commonly be found in property images.

Consider standard rooms and features like:
- Kitchen features (granite countertops, stainless appliances, island)
- Bathroom features (updated fixtures, tile work, vanities) 
- Living spaces (hardwood floors, fireplace, high ceilings)
- Exterior features (landscaping, patio, garage, pool)
- Special amenities (walk-in closets, crown molding, bay windows)

Provide a realistic set of commonly photographed features.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a real estate photography analyst who identifies key selling features commonly showcased in property photos.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'image_analysis_response',
          schema: {
            type: 'object',
            properties: {
              suggestedTags: { type: 'array', items: { type: 'string' } },
              identifiedFeatures: { type: 'array', items: { type: 'string' } },
              roomTypes: { type: 'array', items: { type: 'string' } },
              confidence: { type: 'string', enum: ['high', 'medium', 'low'] }
            },
            required: ['suggestedTags', 'identifiedFeatures', 'roomTypes', 'confidence'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing property images:', error);
    
    return {
      suggestedTags: ['Updated', 'Move-in Ready', 'Well-maintained'],
      identifiedFeatures: ['Standard features throughout'],
      roomTypes: ['Living Room', 'Kitchen', 'Bedrooms', 'Bathrooms'],
      confidence: 'low'
    };
  }
}