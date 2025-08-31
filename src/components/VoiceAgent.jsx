import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader } from 'lucide-react';
import VoiceAgentService from '../services/voiceAgentService';

const VoiceAgent = ({ onNavigate, userContext }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('hi');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const voiceServiceRef = useRef(null);
  const conversationRef = useRef([]);

  useEffect(() => {
    // Initialize voice service
    voiceServiceRef.current = new VoiceAgentService();
    
    // Set up event handlers
    voiceServiceRef.current.onTranscriptionReceived = handleTranscription;
    voiceServiceRef.current.onResponseReceived = handleResponse;
    voiceServiceRef.current.onAudioPlaying = setIsSpeaking;
    voiceServiceRef.current.onNavigate = onNavigate;
    
    // Set initial language
    voiceServiceRef.current.setLanguage(language);
    
    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopListening();
      }
    };
  }, []);

  const handleTranscription = (text) => {
    setTranscription(text);
    setIsProcessing(true);
    
    // Add to conversation history
    conversationRef.current.push({
      type: 'user',
      text: text,
      timestamp: new Date().toISOString()
    });
  };

  const handleResponse = (responseData) => {
    setResponse(responseData.text || responseData.message);
    setIsProcessing(false);
    
    // Add to conversation history
    conversationRef.current.push({
      type: 'assistant',
      text: responseData.text || responseData.message,
      timestamp: new Date().toISOString()
    });
    
    // Speak the response
    if (responseData.text) {
      voiceServiceRef.current.speak(responseData.text, getVoiceForLanguage(language));
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      const result = voiceServiceRef.current.stopListening();
      setIsListening(false);
      setIsProcessing(false);
    } else {
      const result = await voiceServiceRef.current.startListening();
      if (result.success) {
        setIsListening(true);
        setTranscription('');
        setResponse('');
      } else {
        alert('माइक्रोफोन एक्सेस की अनुमति दें / Please allow microphone access');
      }
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    voiceServiceRef.current.setLanguage(newLanguage);
  };

  const getVoiceForLanguage = (lang) => {
    const voiceMap = {
      'hi': 'hi-IN',
      'en': 'en-IN',
      'ur': 'ur-PK'
    };
    return voiceMap[lang] || 'hi-IN';
  };

  const getGreeting = () => {
    const greetings = {
      'hi': 'नमस्ते! मैं आपकी आवाज़ सहायक हूँ। कैसे मदद कर सकती हूँ?',
      'en': 'Hello! I am your voice assistant. How can I help you?',
      'ur': 'السلام علیکم! میں آپ کا صوتی معاون ہوں۔ کیسے مدد کر سکتی ہوں؟'
    };
    return greetings[language] || greetings['hi'];
  };

  const getQuickCommands = () => {
    const commands = {
      'hi': [
        'मेरी शिकायत दर्ज करें',
        'मौसम की जानकारी',
        'सरकारी योजनाएं',
        'मंडी भाव',
        'नजदीकी अस्पताल'
      ],
      'en': [
        'File a complaint',
        'Weather information',
        'Government schemes',
        'Market prices',
        'Nearby hospital'
      ],
      'ur': [
        'شکایت درج کریں',
        'موسمی معلومات',
        'سرکاری اسکیمز',
        'مارکیٹ ریٹس',
        'قریبی ہسپتال'
      ]
    };
    return commands[language] || commands['hi'];
  };

  const executeQuickCommand = (command) => {
    voiceServiceRef.current.processVoiceCommand(command, userContext);
  };

  return (
    <div className="voice-agent-container bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {language === 'hi' && '🎤 आवाज़ सहायक'}
          {language === 'en' && '🎤 Voice Assistant'}
          {language === 'ur' && '🎤 صوتی معاون'}
        </h3>
        
        {/* Language Selector */}
        <select 
          value={language} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
          <option value="ur">اردو</option>
        </select>
      </div>

      {/* Voice Control Button */}
      <div className="text-center mb-6">
        <button
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader className="animate-spin" size={32} />
          ) : isListening ? (
            <MicOff size={32} />
          ) : (
            <Mic size={32} />
          )}
        </button>
        
        <p className="mt-2 text-sm text-gray-600">
          {isListening && language === 'hi' && 'सुन रहा हूँ...'}
          {isListening && language === 'en' && 'Listening...'}
          {isListening && language === 'ur' && 'سن رہا ہوں...'}
          
          {isProcessing && language === 'hi' && 'प्रोसेसिंग...'}
          {isProcessing && language === 'en' && 'Processing...'}
          {isProcessing && language === 'ur' && 'پروسیسنگ...'}
          
          {!isListening && !isProcessing && language === 'hi' && 'बोलने के लिए दबाएं'}
          {!isListening && !isProcessing && language === 'en' && 'Tap to speak'}
          {!isListening && !isProcessing && language === 'ur' && 'بولنے کے لیے دبائیں'}
        </p>
      </div>

      {/* Conversation Display */}
      <div className="conversation-area mb-4">
        {transcription && (
          <div className="user-message bg-blue-50 p-3 rounded-lg mb-2">
            <div className="flex items-start gap-2">
              <MessageCircle size={16} className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-blue-700">
                  {language === 'hi' && 'आपने कहा:'}
                  {language === 'en' && 'You said:'}
                  {language === 'ur' && 'آپ نے کہا:'}
                </p>
                <p className="text-gray-800">{transcription}</p>
              </div>
            </div>
          </div>
        )}
        
        {response && (
          <div className="assistant-message bg-green-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Volume2 size={16} className="text-green-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-green-700">
                  {language === 'hi' && 'सहायक:'}
                  {language === 'en' && 'Assistant:'}
                  {language === 'ur' && 'معاون:'}
                </p>
                <p className="text-gray-800">{response}</p>
              </div>
            </div>
          </div>
        )}
        
        {!transcription && !response && (
          <div className="welcome-message text-center text-gray-600 py-4">
            <p className="text-sm">{getGreeting()}</p>
          </div>
        )}
      </div>

      {/* Quick Commands */}
      <div className="quick-commands">
        <p className="text-sm font-medium text-gray-700 mb-2">
          {language === 'hi' && 'त्वरित कमांड:'}
          {language === 'en' && 'Quick Commands:'}
          {language === 'ur' && 'فوری کمانڈز:'}
        </p>
        
        <div className="grid grid-cols-1 gap-2">
          {getQuickCommands().map((command, index) => (
            <button
              key={index}
              onClick={() => executeQuickCommand(command)}
              className="text-left text-sm bg-gray-50 hover:bg-gray-100 p-2 rounded border transition-colors"
              disabled={isListening || isProcessing}
            >
              {command}
            </button>
          ))}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="status-bar mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>
            {language === 'hi' && (connectionStatus === 'connected' ? 'कनेक्टेड' : 'डिस्कनेक्टेड')}
            {language === 'en' && (connectionStatus === 'connected' ? 'Connected' : 'Disconnected')}
            {language === 'ur' && (connectionStatus === 'connected' ? 'جڑا ہوا' : 'منقطع')}
          </span>
        </div>
        
        {isSpeaking && (
          <div className="flex items-center gap-1">
            <Volume2 size={12} className="text-green-500" />
            <span>
              {language === 'hi' && 'बोल रहा है...'}
              {language === 'en' && 'Speaking...'}
              {language === 'ur' && 'بول رہا ہے...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAgent;