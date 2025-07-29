import openai from './openaiClient';

/**
 * Transcribes audio files using OpenAI Whisper
 * @param {File} audioFile - Audio file to transcribe
 * @returns {Promise<Object>} Transcription results with summary
 */
export async function transcribeAudio(audioFile) {
  try {
    // Transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile,
      response_format: 'text'
    });

    // Generate summary and action items from transcription
    const summary = await summarizeTranscription(transcription);

    return {
      transcription: transcription,
      summary: summary.summary,
      actionItems: summary.actionItems,
      keyPoints: summary.keyPoints,
      speakers: summary.speakers,
      duration: summary.estimatedDuration,
      transcribedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please ensure the file is in a supported format (MP3, MP4, WAV, etc.) and under 25MB.');
  }
}

/**
 * Summarizes transcription and extracts action items
 * @param {string} transcription - The transcribed text
 * @returns {Promise<Object>} Summary and action items
 */
async function summarizeTranscription(transcription) {
  try {
    const prompt = `
Analyze this real estate conversation transcription and provide a structured summary:

Transcription:
"${transcription}"

Extract:
1. Key discussion points and decisions
2. Action items and follow-ups needed
3. Important dates, prices, or property details mentioned
4. Client concerns or questions
5. Next steps agreed upon
6. Identify likely speakers (agent, client, etc.)
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert at analyzing real estate conversations and extracting key information and action items.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'transcription_summary_response',
          schema: {
            type: 'object',
            properties: {
              summary: { type: 'string' },
              keyPoints: { type: 'array', items: { type: 'string' } },
              actionItems: { 
                type: 'array', 
                items: {
                  type: 'object',
                  properties: {
                    task: { type: 'string' },
                    assignedTo: { type: 'string' },
                    dueDate: { type: 'string' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                  },
                  required: ['task', 'priority']
                }
              },
              speakers: { type: 'array', items: { type: 'string' } },
              estimatedDuration: { type: 'string' },
              meetingType: { type: 'string', enum: ['phone_call', 'showing', 'consultation', 'negotiation', 'other'] }
            },
            required: ['summary', 'keyPoints', 'actionItems', 'speakers'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error summarizing transcription:', error);
    
    // Return basic summary
    return {
      summary: 'Audio transcription completed. Manual review recommended.',
      keyPoints: ['Transcription available for review'],
      actionItems: [{
        task: 'Review transcription and identify action items',
        priority: 'medium'
      }],
      speakers: ['Unknown'],
      estimatedDuration: 'Unknown',
      meetingType: 'other'
    };
  }
}

/**
 * Translates audio from another language to English
 * @param {File} audioFile - Audio file to translate
 * @returns {Promise<Object>} Translation results
 */
export async function translateAudio(audioFile) {
  try {
    const translation = await openai.audio.translations.create({
      model: 'whisper-1',
      file: audioFile,
      response_format: 'text'
    });

    return {
      translation,
      translatedAt: new Date().toISOString(),
      originalLanguage: 'auto-detected',
      targetLanguage: 'English'
    };
  } catch (error) {
    console.error('Error translating audio:', error);
    throw new Error('Failed to translate audio. Please ensure the file is in a supported format and under 25MB.');
  }
}