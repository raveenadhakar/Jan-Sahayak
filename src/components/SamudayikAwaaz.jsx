import React, { useState, useEffect } from 'react';
import {
    Volume2, VolumeX, Mic, MicOff, Phone, Newspaper,
    Scale, CloudRain, Vote, Heart, Bell, Home, Info,
    Calendar, MapPin, FileText, CheckCircle, Wheat,
    Shield, Gift, HelpCircle, LogIn, LogOut, Play, Pause,
    Sparkles, TrendingUp, AlertTriangle, Users, Building2,
    Sun, Cloud, Droplets, Wind, Star, Award
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { authService } from '../services/authService';
import Dashboard from './Dashboard';
import ComplaintsManager from './ComplaintsManager';
import GovernmentSchemes from './GovernmentSchemes';
import VillageVoice from './VillageVoice';
import AuthModal from './AuthModal';

const SamudayikAwaaz = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState(3);
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
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            setError('Failed to load user data');
        }
    }, []);

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

    // Voice command handler with AI response
    const handleVoiceCommand = async (command) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Check for navigation commands first
            const lowerCommand = command.toLowerCase();

            if (lowerCommand.includes('शिकायत') || lowerCommand.includes('complaint') || lowerCommand.includes('شکایت')) {
                setActiveTab('complaints');
            } else if (lowerCommand.includes('योजना') || lowerCommand.includes('scheme') || lowerCommand.includes('اسکیم')) {
                setActiveTab('rights');
            } else if (lowerCommand.includes('ग्रामवाणी') || lowerCommand.includes('village') || lowerCommand.includes('گاؤں')) {
                setActiveTab('gramvaani');
            } else if (lowerCommand.includes('होम') || lowerCommand.includes('home') || lowerCommand.includes('ہوم')) {
                setActiveTab('home');
            }

            // Get AI response
            const response = await geminiService.processVoiceCommand(command, selectedLanguage, userInfo);
            setAiResponse(response);

            // Speak the response
            await speechService.textToSpeech(response, selectedLanguage);

        } catch (error) {
            console.error('Error processing voice command:', error);
            const errorMessage = selectedLanguage === 'hi' ? 'माफ करें, मुझे समझने में समस्या हुई।' :
                selectedLanguage === 'en' ? 'Sorry, I had trouble understanding.' :
                    'معاف کریں، مجھے سمجھنے میں مسئلہ ہوا۔';
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

    const TabButton = ({ id, icon, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center p-4 rounded-2xl transition-all transform border-2 ${activeTab === id
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl scale-105 border-blue-300'
                : 'text-gray-600 hover:bg-gray-50 hover:scale-102 border-gray-200 bg-white'
                }`}
        >
            <div className="relative">
                {icon}
                {count && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                        {count}
                    </span>
                )}
            </div>
            <span className="text-sm mt-2 font-bold">{label}</span>
        </button>
    );

    const VoiceButton = () => (
        <div className="fixed bottom-24 right-6 z-50">
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
            {isListening && (
                <div className="absolute -top-20 right-0 bg-white rounded-2xl p-4 shadow-xl min-w-64 border-2 border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-lg text-red-600 font-bold">{t.listening}</span>
                    </div>
                    {transcript && (
                        <p className="text-sm text-gray-600 italic mb-2">"{transcript}"</p>
                    )}
                    <p className="text-xs text-gray-500">{t.startVoice}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-4 left-1/3 w-8 h-8 bg-white/10 rounded-full animate-pulse delay-700"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="bg-white/20 p-2 rounded-3xl backdrop-blur-sm border-2 border-white/30">
                                <img 
                                    src="/logo.png" 
                                    alt="Jan Sahayak Logo" 
                                    className="w-16 h-16 object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
                                    {t.appName}
                                </h1>
                                <p className="text-blue-100 text-lg flex items-center space-x-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>{isLoggedIn ? `${userInfo.village}, ${userInfo.district}, ${userInfo.state}` : t.location}</span>
                                </p>
                                {isLoggedIn && (
                                    <p className="text-blue-200 text-lg flex items-center space-x-2 mt-2">
                                        <Users className="w-4 h-4" />
                                        <span>{t.hello}, {userInfo.name}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-3 text-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                <option value="hi" className="text-black">🇮🇳 हिंदी</option>
                                <option value="en" className="text-black">🇬🇧 English</option>
                                <option value="ur" className="text-black">🇵🇰 اردو</option>
                            </select>

                            {!isLoggedIn ? (
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl hover:bg-white/30 transition-all transform hover:scale-105 border-2 border-white/30"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span className="text-lg font-bold">{t.login}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl hover:bg-white/30 transition-all transform hover:scale-105 border-2 border-white/30"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-lg font-bold">{t.logout}</span>
                                </button>
                            )}

                            <div className="relative">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl border-2 border-white/30">
                                    <Bell className="w-8 h-8" />
                                    {notifications > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-sm w-8 h-8 flex items-center justify-center animate-bounce font-bold">
                                            {notifications}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            {/* Voice Command Section */}
            <div className="p-6">
                <div className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border-4 border-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-2xl mb-2 flex items-center space-x-3">
                                    <Phone className="w-8 h-8" />
                                    <span>{t.voiceCall}</span>
                                </h2>
                                <p className="text-white/80 text-lg mb-3">{t.callNumber}</p>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                                    <span className="text-lg text-white/70 font-medium">
                                        🕐 {t.available247}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleVoiceRecording}
                                    className={`p-6 rounded-full transition-all transform border-3 ${isListening
                                        ? 'bg-red-500 animate-pulse scale-110 shadow-xl border-red-300'
                                        : 'bg-white/20 hover:bg-white/30 hover:scale-105 border-white/30'
                                        }`}
                                >
                                    {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                                </button>
                                <div className="bg-white/20 p-4 rounded-full border-2 border-white/30">
                                    <Phone className="w-12 h-12 text-white" />
                                </div>
                            </div>
                        </div>
                        {(isListening || transcript || aiResponse) && (
                            <div className="mt-6 p-6 bg-white/20 backdrop-blur-sm rounded-3xl border-2 border-white/30">
                                {isListening && (
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-6 bg-white rounded-full animate-bounce"></div>
                                            <div className="w-3 h-8 bg-white rounded-full animate-bounce delay-75"></div>
                                            <div className="w-3 h-6 bg-white rounded-full animate-bounce delay-150"></div>
                                        </div>
                                        <p className="text-lg font-bold">🎤 {t.listening}</p>
                                    </div>
                                )}

                                {transcript && (
                                    <div className="bg-white/20 p-4 rounded-2xl mb-4 border-2 border-white/30">
                                        <p className="text-sm text-white/70 mb-2">💬 {t.youSaid}</p>
                                        <p className="text-lg italic">"{transcript}"</p>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="bg-white/20 p-4 rounded-2xl mb-4 border-2 border-white/30">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-lg">⚡ {t.preparing}</p>
                                        </div>
                                    </div>
                                )}

                                {aiResponse && (
                                    <div className="bg-white/20 p-4 rounded-2xl border-2 border-white/30">
                                        <p className="text-sm text-white/70 mb-2">🤖 {t.janSahayak}</p>
                                        <p className="text-lg">{aiResponse}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 pb-6">
                <div className="bg-white rounded-3xl p-4 shadow-xl border-4 border-gray-100">
                    <div className="grid grid-cols-4 gap-4">
                        <TabButton
                            id="home"
                            icon={<Home className="w-8 h-8" />}
                            label={`🏠 ${t.home}`}
                        />
                        <TabButton
                            id="gramvaani"
                            icon={<Newspaper className="w-8 h-8" />}
                            label={`📢 ${t.gramvaani}`}
                        />
                        <TabButton
                            id="rights"
                            icon={<Scale className="w-8 h-8" />}
                            label={`⚖️ ${t.rights}`}
                        />
                        <TabButton
                            id="complaints"
                            icon={<FileText className="w-8 h-8" />}
                            label={`📝 ${t.complaints}`}
                            count={notifications}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="px-4 pb-32 max-w-6xl mx-auto">
                <div className="min-h-[60vh]">
                    {activeTab === 'home' && (
                        <Dashboard
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                            onTabChange={setActiveTab}
                        />
                    )}

                    {activeTab === 'gramvaani' && (
                        <VillageVoice
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                        />
                    )}

                    {activeTab === 'rights' && (
                        <GovernmentSchemes
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                        />
                    )}

                    {activeTab === 'complaints' && (
                        <ComplaintsManager
                            userInfo={userInfo}
                            selectedLanguage={selectedLanguage}
                        />
                    )}
                </div>
            </div>

            {/* Voice Button */}
            <VoiceButton />

            {/* Bottom Call Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 to-blue-600 border-t-4 border-white p-4 shadow-2xl">
                <div className="flex items-center justify-center space-x-6">
                    <button
                        onClick={() => window.open('tel:1800-AWAAZ-HUB')}
                        className="flex items-center space-x-4 bg-white/20 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-white/30"
                    >
                        <Phone className="w-6 h-6" />
                        <span className="font-bold text-lg">📞 1800-AWAAZ-HUB</span>
                    </button>
                    <button
                        onClick={toggleVoiceRecording}
                        className={`flex items-center space-x-3 px-6 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 border-2 ${isListening
                            ? 'bg-red-500 text-white animate-pulse border-red-300'
                            : 'bg-white/20 text-white hover:bg-white/30 border-white/30'
                            }`}
                    >
                        <Mic className="w-5 h-5" />
                        <span className="text-lg font-bold">
                            {isListening ? `🔴 ${t.listening}` : `🎤 ${t.startVoice}`}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SamudayikAwaaz;