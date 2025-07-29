import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { transcribeAudio } from '../../../services/transcriptionService';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState(null);

  const handleVoiceNoteCapture = async () => {
    if (!isRecording && !audioFile) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], 'voice-note.wav', { type: 'audio/wav' });
          setAudioFile(audioFile);
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Auto-stop after 5 minutes
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
          }
        }, 300000);

      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check permissions.');
      }
    } else if (isRecording) {
      // Stop recording (this would be handled by the mediaRecorder.stop() above)
      setIsRecording(false);
    } else if (audioFile && !isTranscribing) {
      // Transcribe the audio
      setIsTranscribing(true);
      try {
        const result = await transcribeAudio(audioFile);
        setTranscription(result);
        console.log('Voice note transcription:', result);
      } catch (error) {
        console.error('Error transcribing audio:', error);
        alert('Failed to transcribe audio. Please try again.');
      } finally {
        setIsTranscribing(false);
      }
    }
  };

  const clearVoiceNote = () => {
    setAudioFile(null);
    setTranscription(null);
    setIsRecording(false);
  };

  const quickActions = [
    {
      title: 'Add New Lead',
      description: 'Quickly capture lead information',
      icon: 'UserPlus',
      color: 'bg-blue-500',
      action: () => console.log('Add lead')
    },
    {
      title: 'Schedule Showing',
      description: 'Book property viewing appointment',
      icon: 'Calendar',
      color: 'bg-green-500',
      action: () => console.log('Schedule showing')
    },
    {
      title: 'Voice Note',
      description: isRecording ? 'Recording...' : audioFile ? 'Transcribe Note' : 'Capture voice memo',
      icon: isRecording ? 'Square' : audioFile ? 'FileText' : 'Mic',
      color: isRecording ? 'bg-red-500' : audioFile ? 'bg-purple-500' : 'bg-orange-500',
      action: handleVoiceNoteCapture,
      loading: isTranscribing,
      badge: isRecording ? 'REC' : null
    },
    {
      title: 'Quick Message',
      description: 'Send SMS or email to client',
      icon: 'MessageSquare',
      color: 'bg-indigo-500',
      action: () => console.log('Quick message')
    },
    {
      title: 'Add Property',
      description: 'List new property for sale',
      icon: 'Home',
      color: 'bg-teal-500',
      action: () => console.log('Add property')
    },
    {
      title: 'Market Report',
      description: 'Generate area market analysis',
      icon: 'TrendingUp',
      color: 'bg-pink-500',
      action: () => console.log('Market report')
    }
  ];

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      
      {/* Voice Note Transcription Results */}
      {transcription && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Voice Note Transcribed</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearVoiceNote}
              iconName="X"
            />
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Summary:</strong> {transcription.summary}
            </div>
            {transcription.actionItems?.length > 0 && (
              <div>
                <strong>Actions:</strong>
                <ul className="list-disc list-inside ml-2">
                  {transcription.actionItems.map((item, index) => (
                    <li key={index}>{item.task} ({item.priority})</li>
                  ))}
                </ul>
              </div>
            )}
            {transcription.keyPoints?.length > 0 && (
              <div>
                <strong>Key Points:</strong> {transcription.keyPoints.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            disabled={action.loading}
            className="p-4 rounded-lg border border-border hover:border-primary transition-colors text-left group relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                {action.loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Icon name={action.icon} size={20} />
                )}
              </div>
              {action.badge && (
                <span className="px-2 py-1 text-xs bg-red-500 text-white rounded animate-pulse">
                  {action.badge}
                </span>
              )}
            </div>
            <h4 className="font-medium text-foreground mb-1">{action.title}</h4>
            <p className="text-sm text-muted-foreground">{action.description}</p>
          </button>
        ))}
      </div>

      {audioFile && !transcription && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="FileAudio" size={16} />
            <span className="text-sm">Voice note ready for transcription</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearVoiceNote}
            iconName="Trash2"
          />
        </div>
      )}
    </div>
  );
};

export default QuickActions;