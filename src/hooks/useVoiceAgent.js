import { useState, useEffect, useRef, useCallback } from 'react';
import VoiceAgentService from '../services/voiceAgentService';

// Custom hook for voice agent functionality
export const useVoiceAgent = (options = {}) => {
  const {
    language = 'hi',
    autoStart = false,
    onNavigate,
    userContext = {}
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [conversation, setConversation] = useState([]);

  const voiceServiceRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize voice service
  useEffect(() => {
    if (!isInitializedRef.current) {
      voiceServiceRef.current = new VoiceAgentService();
      
      // Set up event handlers
      voiceServiceRef.current.onTranscriptionReceived = handleTranscription;
      voiceServiceRef.current.onResponseReceived = handleResponse;
      voiceServiceRef.current.onAudioPlaying = setIsSpeaking;
      voiceServiceRef.current.onNavigate = onNavigate;
      
      // Set language
      voiceServiceRef.current.setLanguage(language);
      
      isInitializedRef.current = true;
      
      // Auto-start if requested
      if (autoStart) {
        startListening();
      }
    }

    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopListening();
      }
    };
  }, []);

  // Handle transcription updates
  const handleTranscription = useCallback((text) => {
    setTranscription(text);
    setIsProcessing(true);
    setError(null);
    
    // Add to conversation
    setConversation(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date().toISOString(),
      language: language
    }]);
  }, [language]);

  // Handle response updates
  const handleResponse = useCallback((responseData) => {
    const responseText = responseData.text || responseData.message || '';
    setResponse(responseText);
    setIsProcessing(false);
    
    // Add to conversation
    setConversation(prev => [...prev, {
      id: Date.now() + 1,
      type: 'assistant',
      text: responseText,
      timestamp: new Date().toISOString(),
      intent: responseData.intent,
      confidence: responseData.confidence
    }]);
    
    // Speak the response if available
    if (responseText && voiceServiceRef.current) {
      voiceServiceRef.current.speak(responseText, getVoiceForLanguage(language));
    }
  }, [language]);

  // Start listening for voice input
  const startListening = useCallback(async () => {
    if (!voiceServiceRef.current) return { success: false, error: 'Service not initialized' };
    
    try {
      const result = await voiceServiceRef.current.startListening();
      if (result.success) {
        setIsListening(true);
        setTranscription('');
        setResponse('');
        setError(null);
        setConnectionStatus('connected');
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Stop listening for voice input
  const stopListening = useCallback(() => {
    if (!voiceServiceRef.current) return { success: false, error: 'Service not initialized' };
    
    const result = voiceServiceRef.current.stopListening();
    setIsListening(false);
    setIsProcessing(false);
    setConnectionStatus('disconnected');
    return result;
  }, []);

  // Toggle listening state
  const toggleListening = useCallback(async () => {
    if (isListening) {
      return stopListening();
    } else {
      return await startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Process text command directly
  const processTextCommand = useCallback(async (text) => {
    if (!voiceServiceRef.current) return;
    
    setIsProcessing(true);
    try {
      await voiceServiceRef.current.processVoiceCommand(text, userContext);
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  }, [userContext]);

  // Speak text using TTS
  const speak = useCallback(async (text, voiceOptions = {}) => {
    if (!voiceServiceRef.current) return;
    
    const voice = voiceOptions.voice || getVoiceForLanguage(language);
    await voiceServiceRef.current.speak(text, voice);
  }, [language]);

  // Change language
  const setLanguage = useCallback((newLanguage) => {
    if (voiceServiceRef.current) {
      voiceServiceRef.current.setLanguage(newLanguage);
    }
  }, []);

  // Clear conversation history
  const clearConversation = useCallback(() => {
    setConversation([]);
    setTranscription('');
    setResponse('');
    setError(null);
  }, []);

  // Get voice shortcuts for current language
  const getVoiceShortcuts = useCallback(() => {
    if (!voiceServiceRef.current) return {};
    return voiceServiceRef.current.getVoiceShortcuts()[language] || {};
  }, [language]);

  // Execute voice shortcut
  const executeShortcut = useCallback((shortcutKey) => {
    const shortcuts = getVoiceShortcuts();
    const shortcutFunction = shortcuts[shortcutKey];
    if (shortcutFunction) {
      shortcutFunction();
    }
  }, [getVoiceShortcuts]);

  // Get appropriate voice for language
  const getVoiceForLanguage = (lang) => {
    const voiceMap = {
      'hi': 'hi-IN',
      'en': 'en-IN',
      'ur': 'ur-PK'
    };
    return voiceMap[lang] || 'hi-IN';
  };

  // Get conversation statistics
  const getConversationStats = useCallback(() => {
    const userMessages = conversation.filter(msg => msg.type === 'user');
    const assistantMessages = conversation.filter(msg => msg.type === 'assistant');
    
    return {
      totalMessages: conversation.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      averageConfidence: assistantMessages.reduce((acc, msg) => 
        acc + (msg.confidence || 0), 0) / assistantMessages.length || 0,
      languages: [...new Set(conversation.map(msg => msg.language))],
      duration: conversation.length > 0 ? 
        new Date(conversation[conversation.length - 1].timestamp) - 
        new Date(conversation[0].timestamp) : 0
    };
  }, [conversation]);

  // Export conversation data
  const exportConversation = useCallback(() => {
    const exportData = {
      conversation,
      stats: getConversationStats(),
      exportedAt: new Date().toISOString(),
      language,
      userContext
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-conversation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [conversation, getConversationStats, language, userContext]);

  return {
    // State
    isListening,
    isProcessing,
    isSpeaking,
    transcription,
    response,
    error,
    connectionStatus,
    conversation,
    
    // Actions
    startListening,
    stopListening,
    toggleListening,
    processTextCommand,
    speak,
    setLanguage,
    clearConversation,
    executeShortcut,
    
    // Utilities
    getVoiceShortcuts,
    getConversationStats,
    exportConversation,
    
    // Service reference (for advanced usage)
    voiceService: voiceServiceRef.current
  };
};

export default useVoiceAgent;