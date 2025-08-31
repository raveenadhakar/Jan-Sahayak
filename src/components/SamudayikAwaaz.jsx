import React, { useState, useEffect } from 'react';
import {
    Volume2, VolumeX, Mic, MicOff, Phone, Newspaper,
    Scale, CloudRain, Vote, Heart, Bell, Home, Info,
    Calendar, MapPin, FileText, CheckCircle, Wheat,
    Shield, Gift, HelpCircle, LogIn, LogOut, Play, Pause,
    Sparkles, TrendingUp, AlertTriangle, Users, Building2,
    Sun, Cloud, Droplets, Wind, Star, Award, User, MessageSquare, X
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import ImprovedDashboard from './ImprovedDashboard';
import ComplaintsManager from './ComplaintsManager';
import GovernmentSchemes from './GovernmentSchemes';
import EnhancedVillageVoice from './EnhancedVillageVoice';
import AuthModal from './AuthModal';
import NotificationPanel from './NotificationPanel';
import QuickComplaintForm from './QuickComplaintForm';
import OfficialsContact from './OfficialsContact';
import VoiceAgentUI from './VoiceAgentUI';

const SamudayikAwaaz = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('hi');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        mobile: '',
        village: '',
        district: '',
        state: ''
    });
    const [showLogin, setShowLogin] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [error, setError] = useState(null);
    const [showQuickComplaint, setShowQuickComplaint] = useState(false);
    const [showOfficialsContact, setShowOfficialsContact] = useState(false);
    const [voiceConversationHistory, setVoiceConversationHistory] = useState([]);
    const [showVoiceHistory, setShowVoiceHistory] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [showVoiceAgent, setShowVoiceAgent] = useState(true);
    const [voiceAgentMode, setVoiceAgentMode] = useState('overlay'); // 'overlay', 'modal', 'fullscreen'

    // Language translations
    const translations = {
        hi: {
            appName: 'जन सहायक',
            location: 'मुज़फ्फरनगर, उत्तर प्रदेश',
            home: 'होम',
            gramvaani: 'ग्रामवाणी',
            rights: 'अधिकार',
            complaints: 'शिकायत',
            login: 'लॉगिन',
            logout: 'लॉगआउट',
            voiceCall: 'आवाज़ से बात करें',
            callNumber: '1800-AWAAZ-HUB पर कॉल करें',
            todaySummary: 'आज का सारांश',
            lightRain: 'हल्की बारिश',
            wheatPrice: 'गेहूं की कीमत',
            fileComplaint: 'शिकायत दर्ज करें',
            recordVoice: 'आवाज़ में रिकॉर्ड करें',
            checkScheme: 'योजना जांचें',
            checkEligibility: 'पात्रता देखें',
            recentActivity: 'हाल की गतिविधि',
            listening: 'सुन रहा हूं...',
            name: 'नाम',
            mobile: 'मोबाइल नंबर',
            village: 'गांव',
            district: 'जिला',
            state: 'राज्य',
            address: 'पता',
            submit: 'सबमिट',
            startVoice: 'आवाज़ कमांड शुरू करें',
            cancel: 'रद्द करें',
            enterInfo: 'अपनी जानकारी दर्ज करें',
            enterName: 'अपना नाम लिखें',
            villageName: 'गांव का नाम',
            available247: '24/7 उपलब्ध',
            youSaid: 'आपने कहा:',
            janSahayak: 'जन सहायक:',
            preparing: 'जवाब तैयार कर रहा हूं...',
            hello: 'नमस्ते'
        },
        en: {
            appName: 'Jan Sahayak',
            location: 'Muzaffarnagar, Uttar Pradesh',
            home: 'Home',
            gramvaani: 'Village Voice',
            rights: 'Rights',
            complaints: 'Complaints',
            login: 'Login',
            logout: 'Logout',
            voiceCall: 'Voice Call',
            callNumber: 'Call 1800-AWAAZ-HUB',
            todaySummary: "Today's Summary",
            lightRain: 'Light Rain',
            wheatPrice: 'Wheat Price',
            fileComplaint: 'File Complaint',
            recordVoice: 'Record Voice',
            checkScheme: 'Check Scheme',
            checkEligibility: 'Check Eligibility',
            recentActivity: 'Recent Activity',
            listening: 'Listening...',
            name: 'Name',
            mobile: 'Mobile Number',
            village: 'Village',
            district: 'District',
            state: 'State',
            address: 'Address',
            submit: 'Submit',
            startVoice: 'Start Voice Command',
            cancel: 'Cancel',
            enterInfo: 'Enter your information',
            enterName: 'Enter your name',
            villageName: 'Village name',
            available247: '24/7 Available',
            youSaid: 'You said:',
            janSahayak: 'Jan Sahayak:',
            preparing: 'Preparing response...',
            hello: 'Hello'
        },
        ur: {
            appName: 'جن سہایک',
            location: 'مظفر نگر، اتر پردیش',
            home: 'ہوم',
            gramvaani: 'گاؤں کی آواز',
            rights: 'حقوق',
            complaints: 'شکایات',
            login: 'لاگ ان',
            logout: 'لاگ آؤٹ',
            voiceCall: 'آواز سے بات کریں',
            callNumber: '1800-AWAAZ-HUB پر کال کریں',
            todaySummary: 'آج کا خلاصہ',
            lightRain: 'ہلکی بارش',
            wheatPrice: 'گندم کی قیمت',
            fileComplaint: 'شکایت درج کریں',
            recordVoice: 'آواز ریکارڈ کریں',
            checkScheme: 'اسکیم چیک کریں',
            checkEligibility: 'اہلیت چیک کریں',
            recentActivity: 'حالیہ سرگرمی',
            listening: 'سن رہا ہوں...',
            name: 'نام',
            mobile: 'موبائل نمبر',
            village: 'گاؤں',
            district: 'ضلع',
            state: 'ریاست',
            address: 'پتہ',
            submit: 'جمع کریں',
            startVoice: 'آواز کمانڈ شروع کریں',
            cancel: 'منسوخ کریں',
            enterInfo: 'اپنی معلومات درج کریں',
            enterName: 'اپنا نام لکھیں',
            villageName: 'گاؤں کا نام',
            available247: '24/7 دستیاب',
            youSaid: 'آپ نے کہا:',
            janSahayak: 'جن سہایک:',
            preparing: 'جواب تیار کر رہا ہوں...',
            hello: 'السلام علیکم'
        }
    };

    const t = translations[selectedLanguage];

    // Load user data from authService
    useEffect(() => {
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUserInfo(currentUser);
                setIsLoggedIn(true);
                // Load notification count
                const unreadCount = notificationService.getUnreadCount(currentUser.id);
                setNotifications(unreadCount);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            setError('Failed to load user data');
        }
    }, []);

    // Update notification count when user logs in
    useEffect(() => {
        if (isLoggedIn && userInfo.id) {
            const unreadCount = notificationService.getUnreadCount(userInfo.id);
            setNotifications(unreadCount);
        }
    }, [isLoggedIn, userInfo]);

    // Initialize speech recognition
    useEffect(() => {
        const initSpeechRecognition = async () => {
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
                        setError('Speech recognition failed');
                    }
                );
                setRecognition(recognitionInstance);
            } catch (error) {
                console.error('Failed to initialize speech recognition:', error);
                setError('Speech recognition not available');
            }
        };

        if (isListening) {
            initSpeechRecognition();
        }

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

    // Text-to-speech function
    const speakText = async (text, id = null) => {
        try {
            if (isSpeaking && currentSpeakingId === id) {
                speechService.webSpeechTTS('', selectedLanguage);
                setIsSpeaking(false);
                setCurrentSpeakingId(null);
                return;
            }

            if (isSpeaking) {
                speechService.webSpeechTTS('', selectedLanguage);
            }

            setIsSpeaking(true);
            setCurrentSpeakingId(id);

            await speechService.textToSpeech(text, selectedLanguage);

            setIsSpeaking(false);
            setCurrentSpeakingId(null);
        } catch (error) {
            console.error('Speech error:', error);
            setIsSpeaking(false);
            setCurrentSpeakingId(null);
            setError('Speech synthesis failed');
        }
    };

    // Enhanced Voice command handler with advanced AI response for MUrf AI Challenge
    const handleVoiceCommand = async (command) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Check for navigation commands first
            const lowerCommand = command.toLowerCase();
            let response = '';
            let shouldNavigate = false;

            // Enhanced Voice Commands for MUrf AI Challenge
            
            // Profile completion commands
            if (lowerCommand.includes('प्रोफाइल') || lowerCommand.includes('profile') || lowerCommand.includes('پروفائل') ||
                lowerCommand.includes('जानकारी भरें') || lowerCommand.includes('complete profile') || lowerCommand.includes('معلومات بھریں')) {
                if (!isLoggedIn) {
                    response = selectedLanguage === 'hi' ? 'आपको पहले लॉगिन करना होगा। मैं आपको लॉगिन पेज पर ले जा रहा हूं।' :
                              selectedLanguage === 'en' ? 'You need to login first. Taking you to the login page.' :
                              'آپ کو پہلے لاگ ان کرنا ہوگا۔ آپ کو لاگ ان پیج پر لے جا رہا ہوں۔';
                    setShowLogin(true);
                } else {
                    response = selectedLanguage === 'hi' ? 'मैं आपको होम पेज पर ले जा रहा हूं जहां आप अपनी प्रोफाइल पूरी कर सकते हैं।' :
                              selectedLanguage === 'en' ? 'Taking you to home page where you can complete your profile.' :
                              'آپ کو ہوم پیج پر لے جا رہا ہوں جہاں آپ اپنی پروفائل مکمل کر سکتے ہیں۔';
                    setActiveTab('home');
                }
                shouldNavigate = true;
            }
            // Voice-guided complaint filing
            else if (lowerCommand.includes('आवाज़ में शिकायत') || lowerCommand.includes('voice complaint') || lowerCommand.includes('آواز میں شکایت') ||
                     lowerCommand.includes('बोलकर शिकायत') || lowerCommand.includes('speak complaint')) {
                response = selectedLanguage === 'hi' ? 'बहुत अच्छा! मैं आपकी आवाज़ में शिकायत दर्ज करने में मदद करूंगा। शिकायत सेक्शन खोल रहा हूं।' :
                          selectedLanguage === 'en' ? 'Great! I will help you file a voice complaint. Opening complaints section.' :
                          'بہترین! میں آپ کی آواز میں شکایت درج کرنے میں مدد کروں گا۔ شکایات کا سیکشن کھول رہا ہوں۔';
                setActiveTab('complaints');
                shouldNavigate = true;
            }
            // Scheme eligibility check with voice
            else if (lowerCommand.includes('योजना की पात्रता') || lowerCommand.includes('scheme eligibility') || lowerCommand.includes('اسکیم کی اہلیت') ||
                     lowerCommand.includes('क्या मैं योग्य हूं') || lowerCommand.includes('am i eligible') || lowerCommand.includes('کیا میں اہل ہوں')) {
                response = selectedLanguage === 'hi' ? 'मैं आपकी योजनाओं की पात्रता जांच रहा हूं। सरकारी योजनाओं का सेक्शन खोल रहा हूं।' :
                          selectedLanguage === 'en' ? 'Checking your scheme eligibility. Opening government schemes section.' :
                          'آپ کی اسکیموں کی اہلیت چیک کر رہا ہوں۔ سرکاری اسکیموں کا سیکشن کھول رہا ہوں۔';
                setActiveTab('rights');
                shouldNavigate = true;
            }
            // Weather related queries
            else if (lowerCommand.includes('मौसम') || lowerCommand.includes('weather') || lowerCommand.includes('موسم') || 
                lowerCommand.includes('आज का मौसम') || lowerCommand.includes('aaj ka mausam')) {
                
                // Get real weather data
                try {
                    const { weatherService } = await import('../services/weatherService');
                    const weatherData = await weatherService.getLocationWeather(
                        userInfo.state || 'Uttar Pradesh',
                        userInfo.district || 'Muzaffarnagar',
                        userInfo.village || ''
                    );
                    
                    response = selectedLanguage === 'hi' ? 
                        `${weatherData.location} में आज का मौसम: ${weatherData.current.condition}, तापमान ${weatherData.current.temperature}°C है। ${weatherData.current.advice}` :
                        selectedLanguage === 'en' ? 
                        `Today's weather in ${weatherData.location}: ${weatherData.current.conditionEn}, temperature ${weatherData.current.temperature}°C. ${weatherData.current.advice}` :
                        `${weatherData.location} میں آج کا موسم: ${weatherData.current.condition}، درجہ حرارت ${weatherData.current.temperature}°C ہے۔ ${weatherData.current.advice}`;
                } catch (weatherError) {
                    console.error('Weather service error:', weatherError);
                    response = selectedLanguage === 'hi' ? 
                        `${userInfo.district || 'आपके क्षेत्र'} में मौसम की जानकारी देख रहा हूं। होम पेज पर जा रहा हूं।` :
                        selectedLanguage === 'en' ? 
                        `Checking weather information for ${userInfo.district || 'your area'}. Going to home page.` :
                        `${userInfo.district || 'آپ کے علاقے'} میں موسم کی معلومات دیکھ رہا ہوں۔ ہوم پیج پر جا رہا ہوں۔`;
                }
                
                setActiveTab('home');
                shouldNavigate = true;
            }
            // Complaint related queries
            else if (lowerCommand.includes('शिकायत') || lowerCommand.includes('complaint') || lowerCommand.includes('شکایت')) {
                response = selectedLanguage === 'hi' ? 'मैं आपको शिकायत सेक्शन पर ले जा रहा हूं। यहां आप आवाज़ में भी अपनी समस्या दर्ज कर सकते हैं।' :
                          selectedLanguage === 'en' ? 'Taking you to complaints section. Here you can register your issues using voice as well.' :
                          'آپ کو شکایات کے سیکشن میں لے جا رہا ہوں۔ یہاں آپ آواز میں بھی اپنی شکایت درج کر سکتے ہیں۔';
                setActiveTab('complaints');
                shouldNavigate = true;
            }
            // Schemes related queries
            else if (lowerCommand.includes('योजना') || lowerCommand.includes('scheme') || lowerCommand.includes('اسکیم') ||
                     lowerCommand.includes('सरकारी योजना') || lowerCommand.includes('yojana')) {
                response = selectedLanguage === 'hi' ? 'मैं आपको सरकारी योजनाओं के सेक्शन पर ले जा रहा हूं। यहां आप PM-KISAN, आयुष्मान भारत जैसी योजनाओं की जानकारी देख सकते हैं और आवाज़ में पूछ सकते हैं।' :
                          selectedLanguage === 'en' ? 'Taking you to government schemes section. Here you can see information about PM-KISAN, Ayushman Bharat and ask questions using voice.' :
                          'آپ کو سرکاری اسکیموں کے سیکشن میں لے جا رہا ہوں۔ یہاں آپ پی ایم کسان، آیوشمان بھارت جیسی اسکیموں کی معلومات دیکھ سکتے ہیں اور آواز میں سوال پوچھ سکتے ہیں۔';
                setActiveTab('rights');
                shouldNavigate = true;
            }
            // Village voice related queries
            else if (lowerCommand.includes('ग्रामवाणी') || lowerCommand.includes('village') || lowerCommand.includes('گاؤں') ||
                     lowerCommand.includes('गांव की आवाज') || lowerCommand.includes('gram vaani')) {
                response = selectedLanguage === 'hi' ? 'मैं आपको ग्रामवाणी सेक्शन पर ले जा रहा हूं। यहां आप गांव की खबरें सुन सकते हैं और आवाज़ में अपनी बात कह सकते हैं।' :
                          selectedLanguage === 'en' ? 'Taking you to Village Voice section. Here you can listen to village news and share your voice.' :
                          'آپ کو گرام وانی سیکشن میں لے جا رہا ہوں۔ یہاں آپ گاؤں کی خبریں سن سکتے ہیں اور آواز میں اپنی بات کہہ سکتے ہیں۔';
                setActiveTab('gramvaani');
                shouldNavigate = true;
            }
            // Home related queries
            else if (lowerCommand.includes('होम') || lowerCommand.includes('home') || lowerCommand.includes('ہوم') ||
                     lowerCommand.includes('मुख्य पृष्ठ') || lowerCommand.includes('dashboard')) {
                response = selectedLanguage === 'hi' ? 'मैं आपको होम पेज पर ले जा रहा हूं। यहां आप सभी सेवाओं का उपयोग कर सकते हैं।' :
                          selectedLanguage === 'en' ? 'Taking you to home page. Here you can access all services.' :
                          'آپ کو ہوم پیج پر لے جا رہا ہوں۔ یہاں آپ تمام خدمات کا استعمال کر سکتے ہیں۔';
                setActiveTab('home');
                shouldNavigate = true;
            }
            // Voice assistant help
            else if (lowerCommand.includes('मदद') || lowerCommand.includes('help') || lowerCommand.includes('مدد') ||
                     lowerCommand.includes('कैसे करें') || lowerCommand.includes('how to') || lowerCommand.includes('کیسے کریں')) {
                response = selectedLanguage === 'hi' ? 'मैं जन सहायक हूं, आपका आवाज़ सहायक। आप मुझसे मौसम, सरकारी योजनाओं, शिकायत दर्ज करने, गांव की खबरों के बारे में पूछ सकते हैं। बस बोलिए "शिकायत दर्ज करें" या "योजना की जानकारी" जैसे वाक्य।' :
                          selectedLanguage === 'en' ? 'I am Jan Sahayak, your voice assistant. You can ask me about weather, government schemes, filing complaints, village news. Just say phrases like "file complaint" or "scheme information".' :
                          'میں جن سہایک ہوں، آپ کا آواز کا معاون۔ آپ مجھ سے موسم، سرکاری اسکیمیں، شکایت درج کرنے، گاؤں کی خبروں کے بارے میں پوچھ سکتے ہیں۔ بس کہیے "شکایت درج کریں" یا "اسکیم کی معلومات" جیسے جملے۔';
            }
            // Generic greeting or unclear command
            else {
                // Try to get AI response for other queries
                try {
                    response = await geminiService.processVoiceCommand(command, selectedLanguage, userInfo);
                } catch (aiError) {
                    console.error('AI service error:', aiError);
                    response = selectedLanguage === 'hi' ? 'मैं आपकी मदद करने के लिए यहां हूं। आप मुझसे "मदद" कहकर सभी आवाज़ कमांड जान सकते हैं। या फिर "मौसम", "योजना", "शिकायत" जैसे शब्द बोलें।' :
                              selectedLanguage === 'en' ? 'I am here to help you. Say "help" to learn all voice commands. Or speak words like "weather", "schemes", "complaints".' :
                              'میں آپ کی مدد کے لیے یہاں ہوں۔ تمام آواز کمانڈز جاننے کے لیے "مدد" کہیں۔ یا پھر "موسم"، "اسکیم"، "شکایت" جیسے الفاظ بولیں۔';
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
            setVoiceConversationHistory(prev => [conversationEntry, ...prev.slice(0, 9)]); // Keep last 10 conversations

            // Enhanced speech with better voice quality using MUrf API
            await speechService.textToSpeech(response, selectedLanguage);

        } catch (error) {
            console.error('Error processing voice command:', error);
            const errorMessage = selectedLanguage === 'hi' ? 'माफ करें, मुझे समझने में समस्या हुई। कृपया दोबारा कोशिश करें या "मदद" कहें।' :
                selectedLanguage === 'en' ? 'Sorry, I had trouble understanding. Please try again or say "help".' :
                    'معاف کریں، مجھے سمجھنے میں مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں یا "مدد" کہیں۔';
            setAiResponse(errorMessage);
            setError('Voice command processing failed');
            await speechService.textToSpeech(errorMessage, selectedLanguage);
        } finally {
            setIsProcessing(false);
        }
    };

    // Toggle voice recording
    const toggleVoiceRecording = () => {
        try {
            if (isListening) {
                setIsListening(false);
                if (recognition) {
                    recognition.stop();
                }
            } else {
                setIsListening(true);
                setTranscript('');
                setAiResponse('');
                setError(null);
            }
        } catch (error) {
            console.error('Error toggling voice recording:', error);
            setError('Voice recording failed');
        }
    };

    // Auth success handler
    const handleAuthSuccess = (user) => {
        setUserInfo(user);
        setIsLoggedIn(true);
        setError(null);
    };

    // Logout handler
    const handleLogout = () => {
        try {
            const result = authService.logout();
            if (result.success) {
                setIsLoggedIn(false);
                setUserInfo({ name: '', mobile: '', village: '', district: '', state: '' });
                setError(null);
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Logout error:', error);
            setError('Logout failed');
        }
    };

    const TabButton = ({ id, label, emoji, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center p-4 rounded-xl transition-all focus-ring ${activeTab === id
                ? 'bg-gradient-primary text-white shadow-clean-lg'
                : 'text-secondary hover:bg-accent hover:text-primary bg-primary'
                }`}
        >
            <div className="relative mb-2">
                <span className="text-3xl">{emoji}</span>
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </div>
            <span className="text-caption font-semibold text-center leading-tight">{label}</span>
        </button>
    );

    // Enhanced Voice Interface for MUrf AI Challenge
    const VoiceButton = () => (
        <div className="fixed bottom-24 right-6 z-50">
            {/* Main Voice Button */}
            <button
                onClick={toggleVoiceRecording}
                className={`w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all transform border-4 ${isListening
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

            {/* Voice Mode Toggle */}
            <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`absolute -top-16 right-0 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${isVoiceMode
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                title={isVoiceMode ? 'Voice Mode ON' : 'Voice Mode OFF'}
            >
                {isVoiceMode ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>

            {/* Voice History Button */}
            {voiceConversationHistory.length > 0 && (
                <button
                    onClick={() => setShowVoiceHistory(true)}
                    className="absolute -top-32 right-0 w-12 h-12 rounded-full shadow-lg bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-all"
                    title="Voice Conversation History"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {voiceConversationHistory.length}
                    </span>
                </button>
            )}

            {/* Enhanced Voice Feedback */}
            {isListening && (
                <div className="absolute -top-24 right-24 bg-white rounded-2xl p-4 shadow-xl min-w-80 border-2 border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-lg text-red-600 font-bold">{t.listening}</span>
                        <div className="ml-auto text-xs text-gray-500">
                            {selectedLanguage === 'hi' && 'हिंदी में बोलें'}
                            {selectedLanguage === 'en' && 'Speak in English'}
                            {selectedLanguage === 'ur' && 'اردو میں بولیں'}
                        </div>
                    </div>
                    {transcript && (
                        <div className="mb-3">
                            <p className="text-sm font-semibold text-gray-700 mb-1">{t.youSaid}</p>
                            <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">"{transcript}"</p>
                        </div>
                    )}
                    {isProcessing && (
                        <div className="mb-3">
                            <p className="text-sm font-semibold text-blue-700 mb-1">{t.janSahayak}</p>
                            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">{t.preparing}</p>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{t.startVoice}</p>
                        <div className="flex space-x-2">
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {selectedLanguage === 'hi' && 'मौसम'}
                                {selectedLanguage === 'en' && 'Weather'}
                                {selectedLanguage === 'ur' && 'موسم'}
                            </span>
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                {selectedLanguage === 'hi' && 'योजना'}
                                {selectedLanguage === 'en' && 'Schemes'}
                                {selectedLanguage === 'ur' && 'اسکیم'}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                {selectedLanguage === 'hi' && 'शिकायत'}
                                {selectedLanguage === 'en' && 'Complaint'}
                                {selectedLanguage === 'ur' && 'شکایت'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Response Display */}
            {aiResponse && !isListening && (
                <div className="absolute -top-20 right-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 shadow-xl min-w-80 border-2 border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-purple-700">{t.janSahayak}</span>
                        <button
                            onClick={() => speakText(aiResponse, 'ai-response')}
                            className={`ml-auto p-1 rounded-full transition-all ${isSpeaking && currentSpeakingId === 'ai-response'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                        >
                            {isSpeaking && currentSpeakingId === 'ai-response' ? 
                                <VolumeX className="w-4 h-4" /> : 
                                <Volume2 className="w-4 h-4" />
                            }
                        </button>
                    </div>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm">{aiResponse}</p>
                    <div className="mt-3 flex justify-between items-center">
                        <button
                            onClick={() => setAiResponse('')}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            {selectedLanguage === 'hi' && 'बंद करें'}
                            {selectedLanguage === 'en' && 'Close'}
                            {selectedLanguage === 'ur' && 'بند کریں'}
                        </button>
                        <span className="text-xs text-gray-400">
                            {selectedLanguage === 'hi' && 'MUrf AI द्वारा संचालित'}
                            {selectedLanguage === 'en' && 'Powered by MUrf AI'}
                            {selectedLanguage === 'ur' && 'MUrf AI کے ذریعے'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );

    const ComplaintButton = () => (
        <div className="fixed bottom-24 left-6 z-50">
            <button
                onClick={() => {
                    if (isLoggedIn) {
                        setShowQuickComplaint(true);
                    } else {
                        setShowLogin(true);
                    }
                }}
                className="voice-btn bg-gradient-danger"
                title={isLoggedIn ? t.fileComplaint : t.login}
            >
                <FileText className="icon-lg text-white" />
            </button>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {isLoggedIn ? t.fileComplaint : t.login}
            </div>
        </div>
    );

    const handleComplaintSuccess = (complaint) => {
        // Refresh notifications
        if (userInfo.id) {
            const unreadCount = notificationService.getUnreadCount(userInfo.id);
            setNotifications(unreadCount);
        }
        
        // Show success message
        const successMessage = selectedLanguage === 'hi' ? `शिकायत सफलतापूर्वक दर्ज की गई! ID: ${complaint.id}` :
            selectedLanguage === 'en' ? `Complaint filed successfully! ID: ${complaint.id}` :
            `شکایت کامیابی سے درج کی گئی! ID: ${complaint.id}`;
        
        // You could add a toast notification here
        console.log(successMessage);
    };

    // Voice Conversation History Modal
    const VoiceHistoryModal = () => (
        showVoiceHistory && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                            <MessageSquare className="w-8 h-8 text-blue-600" />
                            <span>
                                {selectedLanguage === 'hi' && 'आवाज़ बातचीत का इतिहास'}
                                {selectedLanguage === 'en' && 'Voice Conversation History'}
                                {selectedLanguage === 'ur' && 'آواز گفتگو کی تاریخ'}
                            </span>
                        </h3>
                        <button
                            onClick={() => setShowVoiceHistory(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {voiceConversationHistory.map((conversation) => (
                            <div key={conversation.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-gray-500">
                                        {conversation.timestamp.toLocaleString()}
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                        {conversation.language === 'hi' && 'हिंदी'}
                                        {conversation.language === 'en' && 'English'}
                                        {conversation.language === 'ur' && 'اردو'}
                                    </span>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <User className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm font-semibold text-gray-700">
                                                {selectedLanguage === 'hi' && 'आपने कहा'}
                                                {selectedLanguage === 'en' && 'You said'}
                                                {selectedLanguage === 'ur' && 'آپ نے کہا'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"{conversation.userInput}"</p>
                                    </div>
                                    
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <Sparkles className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-semibold text-blue-700">
                                                    {selectedLanguage === 'hi' && 'जन सहायक'}
                                                    {selectedLanguage === 'en' && 'Jan Sahayak'}
                                                    {selectedLanguage === 'ur' && 'جن سہایک'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => speakText(conversation.aiResponse, `history-${conversation.id}`)}
                                                className={`p-1 rounded-full transition-all ${isSpeaking && currentSpeakingId === `history-${conversation.id}`
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                    }`}
                                            >
                                                {isSpeaking && currentSpeakingId === `history-${conversation.id}` ? 
                                                    <VolumeX className="w-4 h-4" /> : 
                                                    <Volume2 className="w-4 h-4" />
                                                }
                                            </button>
                                        </div>
                                        <p className="text-sm text-blue-600">{conversation.aiResponse}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {voiceConversationHistory.length === 0 && (
                            <div className="text-center py-12">
                                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    {selectedLanguage === 'hi' && 'कोई आवाज़ बातचीत नहीं मिली'}
                                    {selectedLanguage === 'en' && 'No voice conversations found'}
                                    {selectedLanguage === 'ur' && 'کوئی آواز گفتگو نہیں ملی'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <button
                            onClick={() => setVoiceConversationHistory([])}
                            className="text-red-600 hover:text-red-700 flex items-center space-x-2 text-sm font-medium"
                            disabled={voiceConversationHistory.length === 0}
                        >
                            <X className="w-4 h-4" />
                            <span>
                                {selectedLanguage === 'hi' && 'इतिहास साफ़ करें'}
                                {selectedLanguage === 'en' && 'Clear History'}
                                {selectedLanguage === 'ur' && 'تاریخ صاف کریں'}
                            </span>
                        </button>
                        <span className="text-xs text-gray-400">
                            {selectedLanguage === 'hi' && 'MUrf AI आवाज़ सहायक'}
                            {selectedLanguage === 'en' && 'MUrf AI Voice Assistant'}
                            {selectedLanguage === 'ur' && 'MUrf AI آواز معاون'}
                        </span>
                    </div>
                </div>
            </div>
        )
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
            {/* Enhanced Navbar */}
            <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Brand/Logo Area (Left Side) */}
                        <div className="flex items-center space-x-4">
                            {/* Logo */}
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 via-white to-green-500 rounded-xl text-gray-800 font-bold text-xl shadow-lg border-2 border-gray-200">
                                IN
                            </div>
                            
                            {/* Brand and Location */}
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                                    {t.appName}
                                </h1>
                                <div className="flex items-center text-base text-gray-600 mt-1">
                                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                    <span className="font-medium">
                                        {isLoggedIn 
                                            ? `${userInfo.village || 'गांव'}, ${userInfo.district || 'जिला'}, ${userInfo.state || 'राज्य'}`
                                            : t.location
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation/Utility Area (Right Side) */}
                        <div className="flex items-center space-x-3">
                            {/* User Profile (if logged in) */}
                            {isLoggedIn && (
                                <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-semibold text-gray-900">
                                            {t.hello}, {userInfo.name?.split(' ')[0] || 'User'}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {selectedLanguage === 'hi' && 'सत्यापित उपयोगकर्ता'}
                                            {selectedLanguage === 'en' && 'Verified User'}
                                            {selectedLanguage === 'ur' && 'تصدیق شدہ صارف'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Access Button */}
                            <button
                                onClick={() => window.open('./admin.html', '_blank')}
                                className="hidden md:flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-2 rounded-xl hover:bg-red-100 transition-all text-sm font-medium border border-red-200"
                                title="Admin Dashboard - सरकारी अधिकारियों के लिए"
                            >
                                <Shield className="w-4 h-4" />
                                <span>Admin</span>
                            </button>

                            {/* Language Selector */}
                            <div className="relative">
                                <label className="sr-only">
                                    {selectedLanguage === 'hi' && 'भाषा चुनें'}
                                    {selectedLanguage === 'en' && 'Select Language'}
                                    {selectedLanguage === 'ur' && 'زبان منتخب کریں'}
                                </label>
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="appearance-none bg-white border-2 border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all shadow-sm"
                                >
                                    <option value="hi">🇮🇳 हिंदी</option>
                                    <option value="en">🇬🇧 English</option>
                                    <option value="ur">🇵🇰 اردو</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Notifications */}
                            <button
                                onClick={() => setShowNotifications(true)}
                                className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-transparent hover:border-blue-200"
                                title={
                                    selectedLanguage === 'hi' ? 'सूचनाएं' :
                                    selectedLanguage === 'en' ? 'Notifications' :
                                    'اطلاعات'
                                }
                            >
                                <Bell className="w-6 h-6" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                                        {notifications > 9 ? '9+' : notifications}
                                    </span>
                                )}
                            </button>

                            {/* Login/Logout */}
                            {!isLoggedIn ? (
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transform hover:scale-105"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>{t.login}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-500 border-2 border-transparent hover:border-red-200"
                                    title={
                                        selectedLanguage === 'hi' ? 'लॉगआउट' :
                                        selectedLanguage === 'en' ? 'Logout' :
                                        'لاگ آؤٹ'
                                    }
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="hidden sm:inline">{t.logout}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile User Info Bar (if logged in) */}
                {isLoggedIn && (
                    <div className="md:hidden bg-gradient-to-r from-blue-50 to-green-50 border-t border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-sm">
                                    {t.hello}, {userInfo.name?.split(' ')[0] || 'User'}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {selectedLanguage === 'hi' && 'सत्यापित उपयोगकर्ता'}
                                    {selectedLanguage === 'en' && 'Verified User'}
                                    {selectedLanguage === 'ur' && 'تصدیق شدہ صارف'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Error Display */}
            {error && (
                <div className="mx-6 mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-2xl text-red-800 flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6" />
                    <span className="font-medium">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-600 hover:text-red-800"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Auth Modal */}
            <AuthModal 
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSuccess={handleAuthSuccess}
                selectedLanguage={selectedLanguage}
            />

            {/* Notification Panel */}
            <NotificationPanel 
                isOpen={showNotifications}
                onClose={() => {
                    setShowNotifications(false);
                    // Refresh notification count
                    if (userInfo.id) {
                        const unreadCount = notificationService.getUnreadCount(userInfo.id);
                        setNotifications(unreadCount);
                    }
                }}
                userInfo={userInfo}
                selectedLanguage={selectedLanguage}
                onTabChange={setActiveTab}
            />

            {/* Voice Conversation History Modal */}
            {showVoiceHistory && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                                <span>
                                    {selectedLanguage === 'hi' && 'आवाज़ बातचीत का इतिहास'}
                                    {selectedLanguage === 'en' && 'Voice Conversation History'}
                                    {selectedLanguage === 'ur' && 'آواز گفتگو کی تاریخ'}
                                </span>
                            </h3>
                            <button
                                onClick={() => setShowVoiceHistory(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {voiceConversationHistory.map((conversation) => (
                                <div key={conversation.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-gray-500">
                                            {conversation.timestamp.toLocaleString()}
                                        </span>
                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                            {conversation.language === 'hi' && 'हिंदी'}
                                            {conversation.language === 'en' && 'English'}
                                            {conversation.language === 'ur' && 'اردو'}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="bg-white rounded-lg p-3 shadow-sm">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <User className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-semibold text-green-700">
                                                    {selectedLanguage === 'hi' && 'आपने कहा'}
                                                    {selectedLanguage === 'en' && 'You said'}
                                                    {selectedLanguage === 'ur' && 'آپ نے کہا'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">"{conversation.userInput}"</p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-semibold text-blue-700">
                                                        {selectedLanguage === 'hi' && 'जन सहायक'}
                                                        {selectedLanguage === 'en' && 'Jan Sahayak'}
                                                        {selectedLanguage === 'ur' && 'جن سہایک'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => speakText(conversation.aiResponse, `history-${conversation.id}`)}
                                                    className={`p-1 rounded-full transition-all ${isSpeaking && currentSpeakingId === `history-${conversation.id}`
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                        }`}
                                                >
                                                    {isSpeaking && currentSpeakingId === `history-${conversation.id}` ? 
                                                        <VolumeX className="w-4 h-4" /> : 
                                                        <Volume2 className="w-4 h-4" />
                                                    }
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-700">{conversation.aiResponse}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {voiceConversationHistory.length === 0 && (
                                <div className="text-center py-12">
                                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        {selectedLanguage === 'hi' && 'अभी तक कोई आवाज़ बातचीत नहीं हुई'}
                                        {selectedLanguage === 'en' && 'No voice conversations yet'}
                                        {selectedLanguage === 'ur' && 'ابھی تک کوئی آواز گفتگو نہیں ہوئی'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <button
                                onClick={() => setVoiceConversationHistory([])}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                                disabled={voiceConversationHistory.length === 0}
                            >
                                <X className="w-4 h-4" />
                                <span>
                                    {selectedLanguage === 'hi' && 'इतिहास साफ़ करें'}
                                    {selectedLanguage === 'en' && 'Clear History'}
                                    {selectedLanguage === 'ur' && 'تاریخ صاف کریں'}
                                </span>
                            </button>
                            <span className="text-xs text-gray-400">
                                {selectedLanguage === 'hi' && 'MUrf AI आवाज़ सहायक'}
                                {selectedLanguage === 'en' && 'MUrf AI Voice Assistant'}
                                {selectedLanguage === 'ur' && 'MUrf AI آواز معاون'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Voice Command Section - Simplified */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="card-clean bg-gradient-success text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Phone className="icon-xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-subheading font-bold mb-1">{t.voiceCall}</h2>
                                <p className="text-body text-white/90">{t.callNumber}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                    <span className="text-caption text-white/80">{t.available247}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={toggleVoiceRecording}
                                className={`voice-btn ${isListening ? 'recording' : ''}`}
                            >
                                {isListening ? <MicOff className="icon-lg" /> : <Mic className="icon-lg" />}
                            </button>
                        </div>
                    </div>
                    
                    {(isListening || transcript || aiResponse) && (
                        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            {isListening && (
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-4 bg-white rounded-full animate-voice-wave"></div>
                                        <div className="w-2 h-6 bg-white rounded-full animate-voice-wave delay-75"></div>
                                        <div className="w-2 h-4 bg-white rounded-full animate-voice-wave delay-150"></div>
                                    </div>
                                    <p className="text-body font-semibold">🎤 {t.listening}</p>
                                </div>
                            )}

                            {transcript && (
                                <div className="bg-white/10 p-3 rounded-lg mb-3">
                                    <p className="text-caption text-white/70 mb-1">💬 {t.youSaid}</p>
                                    <p className="text-body italic">"{transcript}"</p>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="bg-white/10 p-3 rounded-lg mb-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-body">⚡ {t.preparing}</p>
                                    </div>
                                </div>
                            )}

                            {aiResponse && (
                                <div className="bg-white/10 p-3 rounded-lg">
                                    <p className="text-caption text-white/70 mb-1">🤖 {t.janSahayak}</p>
                                    <p className="text-body">{aiResponse}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Navigation - Improved */}
            <div className="max-w-7xl mx-auto px-6 pb-6">
                <div className="card-clean p-4">
                    <div className="grid grid-cols-5 gap-3">
                        <TabButton
                            id="home"
                            label={t.home}
                            emoji="🏠"
                        />
                        <TabButton
                            id="gramvaani"
                            label={t.gramvaani}
                            emoji="📢"
                        />
                        <TabButton
                            id="rights"
                            label={t.rights}
                            emoji="⚖️"
                        />
                        <TabButton
                            id="complaints"
                            label={t.complaints}
                            emoji="📝"
                            count={notifications}
                        />
                        <TabButton
                            id="voiceagent"
                            label={selectedLanguage === 'hi' ? 'आवाज़ सहायक' : selectedLanguage === 'en' ? 'Voice Agent' : 'آواز معاون'}
                            emoji="🎤"
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 pb-32">
                <div className="min-h-[60vh]">
                    {activeTab === 'home' && (
                        <ImprovedDashboard
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                            onTabChange={setActiveTab}
                            onComplaintSuccess={handleComplaintSuccess}
                            setUserInfo={setUserInfo}
                        />
                    )}

                    {activeTab === 'gramvaani' && (
                        <EnhancedVillageVoice
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                        />
                    )}

                    {activeTab === 'rights' && (
                        <GovernmentSchemes
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                            setUserInfo={setUserInfo}
                        />
                    )}

                    {activeTab === 'complaints' && (
                        <ComplaintsManager
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                            onTabChange={setActiveTab}
                            onComplaintSuccess={handleComplaintSuccess}
                            setUserInfo={setUserInfo}
                        />
                    )}

                    {activeTab === 'voiceagent' && (
                        <VoiceAgentUI
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                            onNavigate={setActiveTab}
                            isVisible={true}
                            onToggleVisibility={() => setActiveTab('home')}
                            mode="fullscreen"
                        />
                    )}
                </div>
            </div>

            {/* Floating Action Buttons - Removed as requested */}

            {/* Quick Complaint Form Modal */}
            <QuickComplaintForm
                isOpen={showQuickComplaint}
                onClose={() => setShowQuickComplaint(false)}
                selectedLanguage={selectedLanguage}
                onSuccess={handleComplaintSuccess}
            />

            {/* Officials Contact Modal */}
            <OfficialsContact
                isOpen={showOfficialsContact}
                onClose={() => setShowOfficialsContact(false)}
                selectedLanguage={selectedLanguage}
                userInfo={userInfo}
            />

            {/* Enhanced Voice Agent UI - Only show when not in voiceagent tab */}
            {activeTab !== 'voiceagent' && (
                <>
                    <VoiceAgentUI
                        userInfo={userInfo}
                        selectedLanguage={selectedLanguage}
                        onNavigate={setActiveTab}
                        isVisible={showVoiceAgent}
                        onToggleVisibility={() => setShowVoiceAgent(!showVoiceAgent)}
                        mode={voiceAgentMode}
                    />
                    
                    {/* Voice Agent Mode Switcher */}
                    {!showVoiceAgent && (
                        <div className="fixed bottom-24 right-6 z-40 flex flex-col space-y-2">
                            <button
                                onClick={() => {
                                    setVoiceAgentMode('overlay');
                                    setShowVoiceAgent(true);
                                }}
                                className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all"
                                title={selectedLanguage === 'hi' ? 'ओवरले मोड' : selectedLanguage === 'en' ? 'Overlay Mode' : 'اوورلے موڈ'}
                            >
                                <div className="w-6 h-6 border-2 border-white rounded"></div>
                            </button>
                            
                            <button
                                onClick={() => {
                                    setVoiceAgentMode('modal');
                                    setShowVoiceAgent(true);
                                }}
                                className="w-12 h-12 bg-purple-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-600 transition-all"
                                title={selectedLanguage === 'hi' ? 'मोडल मोड' : selectedLanguage === 'en' ? 'Modal Mode' : 'موڈل موڈ'}
                            >
                                <div className="w-6 h-6 bg-white/20 rounded backdrop-blur-sm flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded"></div>
                                </div>
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('voiceagent')}
                                className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all"
                                title={selectedLanguage === 'hi' ? 'फुल स्क्रीन मोड' : selectedLanguage === 'en' ? 'Fullscreen Mode' : 'فل اسکرین موڈ'}
                            >
                                <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded"></div>
                                </div>
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Bottom Action Bar - Persistent */}
            <div className="fixed bottom-0 left-0 right-0 bg-primary border-t border-gray-200 shadow-clean-xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-center space-x-4">
                        <a
                            href="tel:18001801551"
                            className="btn-secondary bg-white text-primary hover:bg-gray-50 flex items-center space-x-2"
                        >
                            <span className="text-2xl">📞</span>
                            <span className="font-semibold">1800-180-1551</span>
                        </a>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    setVoiceAgentMode('modal');
                                    setShowVoiceAgent(true);
                                }}
                                className="btn-secondary bg-white text-primary hover:bg-gray-50 flex items-center space-x-2"
                            >
                                <span className="text-xl">🎤</span>
                                <span className="font-medium">
                                    {selectedLanguage === 'hi' ? 'मोडल' : selectedLanguage === 'en' ? 'Modal' : 'موڈل'}
                                </span>
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('voiceagent')}
                                className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2"
                            >
                                <span className="text-2xl">🎤</span>
                                <span className="font-semibold">
                                    {selectedLanguage === 'hi' ? 'आवाज़ सहायक' : selectedLanguage === 'en' ? 'Voice Agent' : 'آواز معاون'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SamudayikAwaaz;