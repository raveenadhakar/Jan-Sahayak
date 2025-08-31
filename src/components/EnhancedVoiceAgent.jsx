import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader, Settings, History, Download } from 'lucide-react';
import { useVoiceAgent } from '../hooks/useVoiceAgent';

const EnhancedVoiceAgent = ({ onNavigate, userContext, className = '' }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [language, setLanguage] = useState('hi');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const {
    isListening,
    isProcessing,
    isSpeaking,
    transcription,
    response,
    error,
    connectionStatus,
    conversation,
    toggleListening,
    processTextCommand,
    speak,
    setLanguage: setVoiceLanguage,
    clearConversation,
    getVoiceShortcuts,
    executeShortcut,
    getConversationStats,
    exportConversation
  } = useVoiceAgent({
    language,
    onNavigate,
    userContext
  });

  useEffect(() => {
    setVoiceLanguage(language);
  }, [language, setVoiceLanguage]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleTextInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      processTextCommand(e.target.value.trim());
      e.target.value = '';
    }
  };

  const getLanguageText = (key) => {
    const texts = {
      hi: {
        title: '🎤 आवाज़ सहायक',
        listening: 'सुन रहा हूँ...',
        processing: 'प्रोसेसिंग...',
        tapToSpeak: 'बोलने के लिए दबाएं',
        youSaid: 'आपने कहा:',
        assistant: 'सहायक:',
        quickCommands: 'त्वरित कमांड:',
        connected: 'कनेक्टेड',
        disconnected: 'डिस्कनेक्टेड',
        speaking: 'बोल रहा है...',
        typeMessage: 'यहाँ टाइप करें...',
        settings: 'सेटिंग्स',
        history: 'इतिहास',
        clearHistory: 'इतिहास साफ़ करें',
        export: 'एक्सपोर्ट',
        voiceEnabled: 'आवाज़ सक्षम',
        error: 'त्रुटि:'
      },
      en: {
        title: '🎤 Voice Assistant',
        listening: 'Listening...',
        processing: 'Processing...',
        tapToSpeak: 'Tap to speak',
        youSaid: 'You said:',
        assistant: 'Assistant:',
        quickCommands: 'Quick Commands:',
        connected: 'Connected',
        disconnected: 'Disconnected',
        speaking: 'Speaking...',
        typeMessage: 'Type here...',
        settings: 'Settings',
        history: 'History',
        clearHistory: 'Clear History',
        export: 'Export',
        voiceEnabled: 'Voice Enabled',
        error: 'Error:'
      },
      ur: {
        title: '🎤 صوتی معاون',
        listening: 'سن رہا ہوں...',
        processing: 'پروسیسنگ...',
        tapToSpeak: 'بولنے کے لیے دبائیں',
        youSaid: 'آپ نے کہا:',
        assistant: 'معاون:',
        quickCommands: 'فوری کمانڈز:',
        connected: 'جڑا ہوا',
        disconnected: 'منقطع',
        speaking: 'بول رہا ہے...',
        typeMessage: 'یہاں ٹائپ کریں...',
        settings: 'ترتیبات',
        history: 'تاریخ',
        clearHistory: 'تاریخ صاف کریں',
        export: 'ایکسپورٹ',
        voiceEnabled: 'آواز فعال',
        error: 'خرابی:'
      }
    };
    return texts[language]?.[key] || texts['hi'][key];
  };

  const getQuickCommands = () => {
    const commands = {
      hi: [
        { text: 'मेरी शिकायत दर्ज करें', action: () => onNavigate?.('/complaints') },
        { text: 'मौसम की जानकारी', action: () => processTextCommand('मौसम बताओ') },
        { text: 'सरकारी योजनाएं', action: () => onNavigate?.('/schemes') },
        { text: 'मंडी भाव', action: () => processTextCommand('मंडी भाव बताओ') },
        { text: 'नजदीकी अस्पताल', action: () => processTextCommand('नजदीकी अस्पताल कहाँ है') },
        { text: 'कृषि सलाह', action: () => processTextCommand('फसल की सलाह चाहिए') }
      ],
      en: [
        { text: 'File a complaint', action: () => onNavigate?.('/complaints') },
        { text: 'Weather information', action: () => processTextCommand('weather update') },
        { text: 'Government schemes', action: () => onNavigate?.('/schemes') },
        { text: 'Market prices', action: () => processTextCommand('market prices') },
        { text: 'Nearby hospital', action: () => processTextCommand('find nearby hospital') },
        { text: 'Agricultural advice', action: () => processTextCommand('crop advisory') }
      ],
      ur: [
        { text: 'شکایت درج کریں', action: () => onNavigate?.('/complaints') },
        { text: 'موسمی معلومات', action: () => processTextCommand('موسم بتائیں') },
        { text: 'سرکاری اسکیمز', action: () => onNavigate?.('/schemes') },
        { text: 'مارکیٹ ریٹس', action: () => processTextCommand('مارکیٹ ریٹ بتائیں') },
        { text: 'قریبی ہسپتال', action: () => processTextCommand('قریبی ہسپتال کہاں ہے') },
        { text: 'زرعی مشورہ', action: () => processTextCommand('فصل کا مشورہ') }
      ]
    };
    return commands[language] || commands['hi'];
  };

  const stats = getConversationStats();

  return (
    <div className={`enhanced-voice-agent bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          {getLanguageText('title')}
        </h3>
        
        <div className="flex items-center gap-2">
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
          
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <Settings size={16} />
          </button>
          
          {/* History Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <History size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-gray-50 border-b">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{getLanguageText('voiceEnabled')}</label>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="text-xs text-gray-600">
              <div>Status: {connectionStatus === 'connected' ? getLanguageText('connected') : getLanguageText('disconnected')}</div>
              <div>Messages: {stats.totalMessages}</div>
              <div>Avg Confidence: {(stats.averageConfidence * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="p-4 bg-gray-50 border-b max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">{getLanguageText('history')}</h4>
            <div className="flex gap-2">
              <button
                onClick={exportConversation}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                {getLanguageText('export')}
              </button>
              <button
                onClick={clearConversation}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                {getLanguageText('clearHistory')}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {conversation.slice(-5).map((msg, index) => (
              <div key={index} className={`text-xs p-2 rounded ${
                msg.type === 'user' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                <div className="font-medium">
                  {msg.type === 'user' ? getLanguageText('youSaid') : getLanguageText('assistant')}
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Voice Interface */}
      <div className="p-6">
        {/* Voice Control Button */}
        <div className="text-center mb-6">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isProcessing || !voiceEnabled}
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
            {isListening && getLanguageText('listening')}
            {isProcessing && getLanguageText('processing')}
            {!isListening && !isProcessing && getLanguageText('tapToSpeak')}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              {getLanguageText('error')} {error}
            </p>
          </div>
        )}

        {/* Conversation Display */}
        <div className="conversation-area mb-4 max-h-60 overflow-y-auto">
          {transcription && (
            <div className="user-message bg-blue-50 p-3 rounded-lg mb-2">
              <div className="flex items-start gap-2">
                <MessageCircle size={16} className="text-blue-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    {getLanguageText('youSaid')}
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
                    {getLanguageText('assistant')}
                  </p>
                  <p className="text-gray-800">{response}</p>
                </div>
              </div>
            </div>
          )}
          
          {!transcription && !response && (
            <div className="welcome-message text-center text-gray-600 py-4">
              <p className="text-sm">
                {language === 'hi' && 'नमस्ते! मैं आपकी आवाज़ सहायक हूँ। कैसे मदद कर सकती हूँ?'}
                {language === 'en' && 'Hello! I am your voice assistant. How can I help you?'}
                {language === 'ur' && 'السلام علیکم! میں آپ کا صوتی معاون ہوں۔ کیسے مدد کر سکتی ہوں؟'}
              </p>
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={getLanguageText('typeMessage')}
            onKeyPress={handleTextInput}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
        </div>

        {/* Quick Commands */}
        <div className="quick-commands">
          <p className="text-sm font-medium text-gray-700 mb-3">
            {getLanguageText('quickCommands')}
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            {getQuickCommands().map((command, index) => (
              <button
                key={index}
                onClick={command.action}
                className="text-left text-sm bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border transition-colors"
                disabled={isListening || isProcessing}
              >
                {command.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar px-4 py-2 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>
            {connectionStatus === 'connected' ? getLanguageText('connected') : getLanguageText('disconnected')}
          </span>
        </div>
        
        {isSpeaking && (
          <div className="flex items-center gap-1">
            <Volume2 size={12} className="text-green-500" />
            <span>{getLanguageText('speaking')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVoiceAgent;