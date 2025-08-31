import React, { useState, useEffect } from 'react';
import {
  Mic, MicOff, Volume2, VolumeX, MessageSquare, X, Sparkles,
  Phone, Headphones, Zap, Star, Users, Heart, Award
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { geminiService } from '../services/geminiService';

const VoiceAgentUI = ({ 
  userInfo, 
  selectedLanguage, 
  onNavigate, 
  isVisible = true,
  onToggleVisibility,
  mode = 'overlay' // 'overlay', 'modal', or 'fullscreen'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);

  const translations = {
    hi: {
      voiceAssistant: 'आवाज़ सहायक',
      listening: 'सुन रहा हूं...',
      processing: 'जवाब तैयार कर रहा हूं...',
      youSaid: 'आपने कहा:',
      janSahayak: 'जन सहायक:',
      startListening: 'बोलना शुरू करें',
      stopListening: 'सुनना बंद करें',
      speakResponse: 'जवाब सुनें',
      stopSpeaking: 'बोलना बंद करें',
      conversationHistory: 'बातचीत का इतिहास',
      clearHistory: 'इतिहास साफ करें',
      voiceModeOn: 'आवाज़ मोड चालू',
      voiceModeOff: 'आवाज़ मोड बंद',
      tryCommands: 'कोशिश करें:',
      weatherCommand: '"मौसम बताओ"',
      schemeCommand: '"योजना दिखाओ"',
      complaintCommand: '"शिकायत दर्ज करें"',
      helpCommand: '"मदद चाहिए"',
      poweredBy: 'द्वारा संचालित',
      murfAI: 'Murf AI',
      assemblyAI: 'Assembly AI',
      available247: '24/7 उपलब्ध'
    },
    en: {
      voiceAssistant: 'Voice Assistant',
      listening: 'Listening...',
      processing: 'Preparing response...',
      youSaid: 'You said:',
      janSahayak: 'Jan Sahayak:',
      startListening: 'Start Listening',
      stopListening: 'Stop Listening',
      speakResponse: 'Speak Response',
      stopSpeaking: 'Stop Speaking',
      conversationHistory: 'Conversation History',
      clearHistory: 'Clear History',
      voiceModeOn: 'Voice Mode ON',
      voiceModeOff: 'Voice Mode OFF',
      tryCommands: 'Try saying:',
      weatherCommand: '"Weather update"',
      schemeCommand: '"Show schemes"',
      complaintCommand: '"File complaint"',
      helpCommand: '"Help me"',
      poweredBy: 'Powered by',
      murfAI: 'Murf AI',
      assemblyAI: 'Assembly AI',
      available247: '24/7 Available'
    },
    ur: {
      voiceAssistant: 'آواز کا معاون',
      listening: 'سن رہا ہوں...',
      processing: 'جواب تیار کر رہا ہوں...',
      youSaid: 'آپ نے کہا:',
      janSahayak: 'جن سہایک:',
      startListening: 'سننا شروع کریں',
      stopListening: 'سننا بند کریں',
      speakResponse: 'جواب سنیں',
      stopSpeaking: 'بولنا بند کریں',
      conversationHistory: 'بات چیت کی تاریخ',
      clearHistory: 'تاریخ صاف کریں',
      voiceModeOn: 'آواز موڈ آن',
      voiceModeOff: 'آواز موڈ آف',
      tryCommands: 'کہنے کی کوشش کریں:',
      weatherCommand: '"موسم بتائیں"',
      schemeCommand: '"اسکیم دکھائیں"',
      complaintCommand: '"شکایت درج کریں"',
      helpCommand: '"مدد چاہیے"',
      poweredBy: 'کی طرف سے',
      murfAI: 'Murf AI',
      assemblyAI: 'Assembly AI',
      available247: '24/7 دستیاب'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = async () => {
      if (!isListening) return;

      try {
        const recognitionInstance = await speechService.startSpeechRecognition(
          selectedLanguage,
          (transcript, isFinal) => {
            setTranscript(transcript);
            if (isFinal && transcript.trim()) {
              handleVoiceCommand(transcript);
            }
          },
          (error) => {
            console.error('Speech recognition error:', error);
            setIsListening(false);
          }
        );
        setRecognition(recognitionInstance);
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setIsListening(false);
      }
    };

    initSpeechRecognition();

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, [isListening, selectedLanguage]);

  // Handle voice commands
  const handleVoiceCommand = async (command) => {
    setIsProcessing(true);
    
    try {
      let response = '';
      let shouldNavigate = false;
      const lowerCommand = command.toLowerCase();

      // Enhanced voice command processing
      if (lowerCommand.includes('मौसम') || lowerCommand.includes('weather') || lowerCommand.includes('موسم')) {
        response = selectedLanguage === 'hi' ? 
          `${userInfo.district || 'आपके क्षेत्र'} में आज का मौसम देख रहा हूं। होम पेज पर जा रहा हूं।` :
          selectedLanguage === 'en' ? 
          `Checking today's weather for ${userInfo.district || 'your area'}. Going to home page.` :
          `${userInfo.district || 'آپ کے علاقے'} میں آج کا موسم دیکھ رہا ہوں۔ ہوم پیج پر جا رہا ہوں۔`;
        onNavigate('home');
        shouldNavigate = true;
      }
      else if (lowerCommand.includes('योजना') || lowerCommand.includes('scheme') || lowerCommand.includes('اسکیم')) {
        response = selectedLanguage === 'hi' ? 
          'सरकारी योजनाओं का सेक्शन खोल रहा हूं। यहां आप अपनी पात्रता देख सकते हैं।' :
          selectedLanguage === 'en' ? 
          'Opening government schemes section. Here you can check your eligibility.' :
          'سرکاری اسکیموں کا سیکشن کھول رہا ہوں۔ یہاں آپ اپنی اہلیت دیکھ سکتے ہیں۔';
        onNavigate('rights');
        shouldNavigate = true;
      }
      else if (lowerCommand.includes('शिकायत') || lowerCommand.includes('complaint') || lowerCommand.includes('شکایت')) {
        response = selectedLanguage === 'hi' ? 
          'शिकायत सेक्शन खोल रहा हूं। यहां आप आवाज़ में भी अपनी समस्या दर्ज कर सकते हैं।' :
          selectedLanguage === 'en' ? 
          'Opening complaints section. Here you can register your issues using voice as well.' :
          'شکایات کا سیکشن کھول رہا ہوں۔ یہاں آپ آواز میں بھی اپنی شکایت درج کر سکتے ہیں۔';
        onNavigate('complaints');
        shouldNavigate = true;
      }
      else if (lowerCommand.includes('ग्रामवाणी') || lowerCommand.includes('village') || lowerCommand.includes('گاؤں')) {
        response = selectedLanguage === 'hi' ? 
          'ग्रामवाणी सेक्शन खोल रहा हूं। यहां आप गांव की खबरें सुन सकते हैं।' :
          selectedLanguage === 'en' ? 
          'Opening Village Voice section. Here you can listen to village news.' :
          'گرام وانی سیکشن کھول رहا ہوں۔ یہاں آپ گاؤں کی خبریں سن سکتے ہیں۔';
        onNavigate('gramvaani');
        shouldNavigate = true;
      }
      else if (lowerCommand.includes('मदद') || lowerCommand.includes('help') || lowerCommand.includes('مدد')) {
        response = selectedLanguage === 'hi' ? 
          'मैं जन सहायक हूं। आप मुझसे मौसम, योजनाओं, शिकायत दर्ज करने के बारे में पूछ सकते हैं। "मौसम बताओ", "योजना दिखाओ", "शिकायत दर्ज करें" जैसे वाक्य बोलें।' :
          selectedLanguage === 'en' ? 
          'I am Jan Sahayak. You can ask me about weather, schemes, filing complaints. Say phrases like "weather update", "show schemes", "file complaint".' :
          'میں جن سہایک ہوں۔ آپ مجھ سے موسم، اسکیمیں، شکایت درج کرنے کے بارے میں پوچھ سکتے ہیں۔ "موسم بتائیں"، "اسکیم دکھائیں"، "شکایت درج کریں" جیسے جملے بولیں۔';
      }
      else {
        // Use AI for complex queries
        try {
          response = await geminiService.processVoiceCommand(command, selectedLanguage, userInfo);
        } catch (error) {
          response = selectedLanguage === 'hi' ? 
            'मुझे समझने में समस्या हुई। कृपया "मदद" कहें या सरल शब्दों में पूछें।' :
            selectedLanguage === 'en' ? 
            'I had trouble understanding. Please say "help" or ask in simple words.' :
            'مجھے سمجھنے میں مسئلہ ہوا۔ براہ کرم "مدد" کہیں یا آسان الفاظ میں پوچھیں۔';
        }
      }

      setAiResponse(response);

      // Add to conversation history
      const conversationEntry = {
        id: Date.now(),
        userInput: command,
        aiResponse: response,
        timestamp: new Date(),
        language: selectedLanguage
      };
      setConversationHistory(prev => [conversationEntry, ...prev.slice(0, 9)]);

      // Speak response if voice mode is on
      if (voiceMode) {
        await speechService.textToSpeech(response, selectedLanguage);
      }

    } catch (error) {
      console.error('Error processing voice command:', error);
      const errorMessage = selectedLanguage === 'hi' ? 
        'माफ करें, कुछ समस्या हुई। कृपया दोबारा कोशिश करें।' :
        selectedLanguage === 'en' ? 
        'Sorry, something went wrong. Please try again.' :
        'معاف کریں، کچھ مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں۔';
      setAiResponse(errorMessage);
      
      if (voiceMode) {
        await speechService.textToSpeech(errorMessage, selectedLanguage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle voice recording
  const toggleVoiceRecording = () => {
    if (isListening) {
      setIsListening(false);
      if (recognition) {
        recognition.stop();
      }
    } else {
      setIsListening(true);
      setTranscript('');
      setAiResponse('');
    }
  };

  // Speak AI response
  const speakResponse = async () => {
    if (!aiResponse) return;
    
    if (isSpeaking) {
      speechService.webSpeechTTS('', selectedLanguage);
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await speechService.textToSpeech(aiResponse, selectedLanguage);
      } catch (error) {
        console.error('Speech error:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggleVisibility}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 border-4 border-white"
      >
        <Mic className="w-8 h-8" />
      </button>
    );
  }

  // Fullscreen mode for separate route
  if (mode === 'fullscreen') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{t.voiceAssistant}</h1>
                  <p className="text-blue-100 text-lg">{t.available247}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('home')}
                className="p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Voice Controls */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Voice Controls</h2>
              
              {/* Main Voice Button */}
              <div className="flex items-center justify-center mb-8">
                <button
                  onClick={toggleVoiceRecording}
                  className={`w-32 h-32 rounded-full shadow-2xl flex items-center justify-center transition-all transform border-8 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse border-red-300'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 border-blue-300'
                  }`}
                >
                  {isListening ? (
                    <div className="flex space-x-2">
                      <div className="w-3 h-12 bg-white rounded-full animate-bounce"></div>
                      <div className="w-3 h-8 bg-white rounded-full animate-bounce delay-75"></div>
                      <div className="w-3 h-12 bg-white rounded-full animate-bounce delay-150"></div>
                    </div>
                  ) : (
                    <Mic className="w-16 h-16 text-white" />
                  )}
                </button>
              </div>

              {/* Status Display */}
              {isListening && (
                <div className="bg-red-50 rounded-2xl p-6 border-4 border-red-200 mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-bold text-lg">{t.listening}</span>
                  </div>
                  {transcript && (
                    <p className="text-gray-600 italic text-lg">"{transcript}"</p>
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="bg-blue-50 rounded-2xl p-6 border-4 border-blue-200 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-600 font-bold text-lg">{t.processing}</span>
                  </div>
                </div>
              )}

              {aiResponse && !isListening && !isProcessing && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-4 border-green-200 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-700 font-bold text-lg">{t.janSahayak}</span>
                    <button
                      onClick={speakResponse}
                      className={`p-3 rounded-2xl transition-all ${
                        isSpeaking 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                  </div>
                  <p className="text-gray-700 text-lg">{aiResponse}</p>
                </div>
              )}

              {/* Voice Mode Toggle */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700 font-medium text-lg">{voiceMode ? t.voiceModeOn : t.voiceModeOff}</span>
                <button
                  onClick={() => setVoiceMode(!voiceMode)}
                  className={`w-16 h-8 rounded-full transition-all ${
                    voiceMode ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-all ${
                    voiceMode ? 'translate-x-8' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            </div>

            {/* Commands and History */}
            <div className="space-y-8">
              {/* Quick Commands */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t.tryCommands}</h3>
                <div className="space-y-4">
                  <div className="bg-blue-100 text-blue-600 px-6 py-4 rounded-2xl text-lg font-medium">
                    {t.weatherCommand}
                  </div>
                  <div className="bg-green-100 text-green-600 px-6 py-4 rounded-2xl text-lg font-medium">
                    {t.schemeCommand}
                  </div>
                  <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-lg font-medium">
                    {t.complaintCommand}
                  </div>
                  <div className="bg-purple-100 text-purple-600 px-6 py-4 rounded-2xl text-lg font-medium">
                    {t.helpCommand}
                  </div>
                </div>
              </div>

              {/* Conversation History */}
              {conversationHistory.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{t.conversationHistory}</h3>
                    <button
                      onClick={() => setConversationHistory([])}
                      className="text-red-600 hover:text-red-800 transition-all px-4 py-2 bg-red-100 rounded-xl"
                    >
                      {t.clearHistory}
                    </button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto space-y-4">
                    {conversationHistory.map((entry) => (
                      <div key={entry.id} className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-gray-600 mb-2 text-lg">
                          <strong>{t.youSaid}</strong> {entry.userInput}
                        </p>
                        <p className="text-blue-600 text-lg">
                          <strong>{t.janSahayak}</strong> {entry.aiResponse}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {entry.timestamp.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Powered By */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg mb-2">{t.poweredBy}</p>
            <div className="flex items-center justify-center space-x-8">
              <span className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-medium">{t.murfAI}</span>
              </span>
              <span className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-lg">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-medium">{t.assemblyAI}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal mode with background blur
  if (mode === 'modal') {
    return (
      <>
        {/* Background Blur Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onToggleVisibility}
        />
        
        {/* Modal Content */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-t-3xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{t.voiceAssistant}</h3>
                    <p className="text-blue-100">{t.available247}</p>
                  </div>
                </div>
                <button
                  onClick={onToggleVisibility}
                  className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Voice Controls */}
            <div className="p-8 space-y-6">
              {/* Main Voice Button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={toggleVoiceRecording}
                  className={`w-24 h-24 rounded-full shadow-xl flex items-center justify-center transition-all transform border-4 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse border-red-300'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 border-blue-300'
                  }`}
                >
                  {isListening ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-8 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-6 bg-white rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-8 bg-white rounded-full animate-bounce delay-150"></div>
                    </div>
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </button>
              </div>

              {/* Status Display */}
              {isListening && (
                <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-bold">{t.listening}</span>
                  </div>
                  {transcript && (
                    <p className="text-sm text-gray-600 italic">"{transcript}"</p>
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-600 font-bold">{t.processing}</span>
                  </div>
                </div>
              )}

              {aiResponse && !isListening && !isProcessing && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-bold">{t.janSahayak}</span>
                    <button
                      onClick={speakResponse}
                      className={`p-2 rounded-xl transition-all ${
                        isSpeaking 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-gray-700">{aiResponse}</p>
                </div>
              )}

              {/* Voice Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{voiceMode ? t.voiceModeOn : t.voiceModeOff}</span>
                <button
                  onClick={() => setVoiceMode(!voiceMode)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    voiceMode ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${
                    voiceMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>

              {/* Quick Commands */}
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3">{t.tryCommands}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs bg-blue-100 text-blue-600 px-3 py-2 rounded-xl text-center">
                    {t.weatherCommand}
                  </div>
                  <div className="text-xs bg-green-100 text-green-600 px-3 py-2 rounded-xl text-center">
                    {t.schemeCommand}
                  </div>
                  <div className="text-xs bg-red-100 text-red-600 px-3 py-2 rounded-xl text-center">
                    {t.complaintCommand}
                  </div>
                  <div className="text-xs bg-purple-100 text-purple-600 px-3 py-2 rounded-xl text-center">
                    {t.helpCommand}
                  </div>
                </div>
              </div>

              {/* Conversation History */}
              {conversationHistory.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{t.conversationHistory}</span>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-blue-600 hover:text-blue-800 transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {showHistory && (
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {conversationHistory.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="bg-gray-50 rounded-xl p-3 text-xs">
                          <p className="text-gray-600 mb-1">
                            <strong>{t.youSaid}</strong> {entry.userInput}
                          </p>
                          <p className="text-blue-600">
                            <strong>{t.janSahayak}</strong> {entry.aiResponse}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Powered By */}
              <div className="text-center text-xs text-gray-500">
                <p>{t.poweredBy}</p>
                <div className="flex items-center justify-center space-x-4 mt-1">
                  <span className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{t.murfAI}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-blue-500" />
                    <span>{t.assemblyAI}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default overlay mode
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Voice Agent Panel */}
      <div className={`bg-white rounded-3xl shadow-2xl border-4 border-blue-200 transition-all ${
        isExpanded ? 'w-96 h-auto' : 'w-80 h-auto'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-t-3xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t.voiceAssistant}</h3>
                <p className="text-blue-100 text-sm">{t.available247}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleVisibility}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="p-6 space-y-4">
          {/* Main Voice Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={toggleVoiceRecording}
              className={`w-20 h-20 rounded-full shadow-xl flex items-center justify-center transition-all transform border-4 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse border-red-300'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 border-blue-300'
              }`}
            >
              {isListening ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-8 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-6 bg-white rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-8 bg-white rounded-full animate-bounce delay-150"></div>
                </div>
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>
          </div>

          {/* Status Display */}
          {isListening && (
            <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-bold">{t.listening}</span>
              </div>
              {transcript && (
                <p className="text-sm text-gray-600 italic">"{transcript}"</p>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-600 font-bold">{t.processing}</span>
              </div>
            </div>
          )}

          {aiResponse && !isListening && !isProcessing && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 font-bold">{t.janSahayak}</span>
                <button
                  onClick={speakResponse}
                  className={`p-2 rounded-xl transition-all ${
                    isSpeaking 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-700 text-sm">{aiResponse}</p>
            </div>
          )}

          {/* Voice Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">{voiceMode ? t.voiceModeOn : t.voiceModeOff}</span>
            <button
              onClick={() => setVoiceMode(!voiceMode)}
              className={`w-12 h-6 rounded-full transition-all ${
                voiceMode ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${
                voiceMode ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>

          {/* Quick Commands */}
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3">{t.tryCommands}</h4>
            <div className="space-y-2">
              <div className="text-xs bg-blue-100 text-blue-600 px-3 py-2 rounded-xl">
                {t.weatherCommand}
              </div>
              <div className="text-xs bg-green-100 text-green-600 px-3 py-2 rounded-xl">
                {t.schemeCommand}
              </div>
              <div className="text-xs bg-red-100 text-red-600 px-3 py-2 rounded-xl">
                {t.complaintCommand}
              </div>
              <div className="text-xs bg-purple-100 text-purple-600 px-3 py-2 rounded-xl">
                {t.helpCommand}
              </div>
            </div>
          </div>

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{t.conversationHistory}</span>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-blue-600 hover:text-blue-800 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
              
              {showHistory && (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {conversationHistory.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="bg-gray-50 rounded-xl p-3 text-xs">
                      <p className="text-gray-600 mb-1">
                        <strong>{t.youSaid}</strong> {entry.userInput}
                      </p>
                      <p className="text-blue-600">
                        <strong>{t.janSahayak}</strong> {entry.aiResponse}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Powered By */}
          <div className="text-center text-xs text-gray-500">
            <p>{t.poweredBy}</p>
            <div className="flex items-center justify-center space-x-4 mt-1">
              <span className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{t.murfAI}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-blue-500" />
                <span>{t.assemblyAI}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentUI;