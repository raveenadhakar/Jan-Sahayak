import React, { useState, useEffect } from 'react';
import {
  Newspaper, Volume2, VolumeX, Calendar, MapPin, AlertTriangle,
  CloudRain, Sun, Thermometer, Wind, Droplets, Eye,
  Wheat, TrendingUp, Users, Phone, RefreshCw, Play, Pause,
  ChevronRight, Clock, Star, Award, Building2, Heart, ExternalLink,
  Mic, MicOff, Settings, Headphones, Languages
} from 'lucide-react';
import { weatherService } from '../services/weatherService';
import { newsService } from '../services/newsService';
import { murfVoiceService } from '../services/murfVoiceService';
import { authService } from '../services/authService';

const EnhancedVillageVoice = ({ userInfo, selectedLanguage }) => {
  const [activeSection, setActiveSection] = useState('weather');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [weatherData, setWeatherData] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLocation, setUserLocation] = useState({ 
    state: 'Uttar Pradesh', 
    district: 'Muzaffarnagar', 
    village: 'Muzaffarnagar' 
  });
  
  // Voice settings
  const [voiceSettings, setVoiceSettings] = useState({
    enabled: true,
    autoPlay: false,
    speed: 1.0,
    voice: null
  });

  const translations = {
    hi: {
      villageVoice: 'ग्रामवाणी',
      weather: 'मौसम',
      news: 'समाचार',
      announcements: 'घोषणाएं',
      todayWeather: 'आज का मौसम',
      temperature: 'तापमान',
      humidity: 'नमी',
      windSpeed: 'हवा की गति',
      feelsLike: 'महसूस होता है',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      latestNews: 'ताज़ा समाचार',
      readMore: 'और पढ़ें',
      listen: 'सुनें',
      stop: 'रोकें',
      refresh: 'रीफ्रेश करें',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि हुई',
      retry: 'पुनः प्रयास करें',
      voiceSettings: 'आवाज़ सेटिंग्स',
      autoPlay: 'स्वचालित प्ले',
      voiceSpeed: 'आवाज़ की गति',
      selectVoice: 'आवाज़ चुनें',
      testVoice: 'आवाज़ टेस्ट करें',
      important: 'महत्वपूर्ण',
      medium: 'सामान्य',
      low: 'कम',
      government: 'सरकारी',
      agriculture: 'कृषि',
      health: 'स्वास्थ्य',
      education: 'शिक्षा',
      infrastructure: 'बुनियादी ढांचा',
      general: 'सामान्य',
      verified: 'सत्यापित',
      source: 'स्रोत',
      publishedAt: 'प्रकाशित',
      readingTime: 'पढ़ने का समय',
      minutes: 'मिनट',
      weatherAdvice: 'मौसम सलाह',
      farmingTips: 'कृषि सुझाव'
    },
    en: {
      villageVoice: 'Village Voice',
      weather: 'Weather',
      news: 'News',
      announcements: 'Announcements',
      todayWeather: "Today's Weather",
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      feelsLike: 'Feels Like',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      latestNews: 'Latest News',
      readMore: 'Read More',
      listen: 'Listen',
      stop: 'Stop',
      refresh: 'Refresh',
      loading: 'Loading...',
      error: 'Error occurred',
      retry: 'Retry',
      voiceSettings: 'Voice Settings',
      autoPlay: 'Auto Play',
      voiceSpeed: 'Voice Speed',
      selectVoice: 'Select Voice',
      testVoice: 'Test Voice',
      important: 'Important',
      medium: 'Medium',
      low: 'Low',
      government: 'Government',
      agriculture: 'Agriculture',
      health: 'Health',
      education: 'Education',
      infrastructure: 'Infrastructure',
      general: 'General',
      verified: 'Verified',
      source: 'Source',
      publishedAt: 'Published',
      readingTime: 'Reading Time',
      minutes: 'minutes',
      weatherAdvice: 'Weather Advice',
      farmingTips: 'Farming Tips'
    },
    ur: {
      villageVoice: 'گاؤں کی آواز',
      weather: 'موسم',
      news: 'خبریں',
      announcements: 'اعلانات',
      todayWeather: 'آج کا موسم',
      temperature: 'درجہ حرارت',
      humidity: 'نمی',
      windSpeed: 'ہوا کی رفتار',
      feelsLike: 'محسوس ہوتا ہے',
      sunrise: 'طلوع آفتاب',
      sunset: 'غروب آفتاب',
      latestNews: 'تازہ خبریں',
      readMore: 'مزید پڑھیں',
      listen: 'سنیں',
      stop: 'رکیں',
      refresh: 'ریفریش کریں',
      loading: 'لوڈ ہو رہا ہے...',
      error: 'خرابی ہوئی',
      retry: 'دوبارہ کوشش کریں',
      voiceSettings: 'آواز کی ترتیبات',
      autoPlay: 'خودکار پلے',
      voiceSpeed: 'آواز کی رفتار',
      selectVoice: 'آواز منتخب کریں',
      testVoice: 'آواز ٹیسٹ کریں',
      important: 'اہم',
      medium: 'درمیانہ',
      low: 'کم',
      government: 'سرکاری',
      agriculture: 'زراعت',
      health: 'صحت',
      education: 'تعلیم',
      infrastructure: 'بنیادی ڈھانچہ',
      general: 'عام',
      verified: 'تصدیق شدہ',
      source: 'ذریعہ',
      publishedAt: 'شائع شدہ',
      readingTime: 'پڑھنے کا وقت',
      minutes: 'منٹ',
      weatherAdvice: 'موسمی مشورہ',
      farmingTips: 'کاشتکاری کے نکات'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  // Load user data and location-based content
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    if (user && user.state && user.district && user.village) {
      setUserLocation({
        state: user.state,
        district: user.district,
        village: user.village
      });
      loadLocationBasedData(user.state, user.district, user.village);
    } else {
      loadDefaultData();
    }
  }, [selectedLanguage, userInfo]);

  const loadLocationBasedData = async (state, district, village) => {
    setIsLoading(true);
    setError(null);
    try {
      // Load weather data for user's location
      const weather = await weatherService.getLocationWeather(state, district, village);
      setWeatherData(weather);

      // Load location-based news
      const news = await newsService.getLocationNews(state, district, selectedLanguage);
      setLatestNews(news);

    } catch (error) {
      console.error('Location data loading error:', error);
      setError(t.error);
      loadDefaultData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDefaultData = async () => {
    setIsLoading(true);
    try {
      // Load default weather for Muzaffarnagar
      const weather = await weatherService.getLocationWeather('Uttar Pradesh', 'Muzaffarnagar', 'Muzaffarnagar');
      setWeatherData(weather);

      // Load default news
      const news = await newsService.getLocationNews('Uttar Pradesh', 'Muzaffarnagar', selectedLanguage);
      setLatestNews(news);
    } catch (error) {
      console.error('Default data loading error:', error);
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakContent = async (content, id) => {
    if (isSpeaking && currentSpeakingId === id) {
      // Stop current speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    setIsSpeaking(true);
    setCurrentSpeakingId(id);

    try {
      // Try Murf Voice API first, fallback to browser TTS
      const result = await murfVoiceService.textToSpeech(content, selectedLanguage, voiceSettings.voice);
      if (!result.success) {
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'en' ? 'en-IN' : 'ur-PK';
        utterance.rate = voiceSettings.speed;
        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentSpeakingId(null);
        };
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      government: '🏛️',
      agriculture: '🌾',
      weather: '🌤️',
      health: '🏥',
      education: '📚',
      infrastructure: '🏗️',
      general: '📢'
    };
    return icons[category] || '📢';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const WeatherSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">🌤️ {t.loading}</p>
          </div>
        </div>
      );
    }

    if (!weatherData) {
      return (
        <div className="text-center p-20">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">{t.error}</p>
          <button 
            onClick={() => loadLocationBasedData(userLocation.state, userLocation.district, userLocation.village)}
            className="bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-all"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            {t.retry}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Current Weather - Enhanced for Rural Users */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl border-4 border-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-4xl font-bold mb-4 flex items-center space-x-3">
                <span className="text-6xl">{weatherData.current.icon}</span>
                <span>{t.todayWeather}</span>
              </h3>
              
              <div className="flex items-center space-x-2 mb-4 text-blue-100">
                <MapPin className="w-6 h-6" />
                <span className="text-2xl font-semibold">
                  {userLocation.village}, {userLocation.district}
                </span>
                {currentUser && currentUser.profileComplete && (
                  <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold">
                    ✓ {t.verified}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="text-center">
                  <Thermometer className="w-12 h-12 text-yellow-300 mx-auto mb-2" />
                  <span className="text-7xl font-bold block">{weatherData.current.temperature}°C</span>
                  <p className="text-xl">{t.temperature}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-8 h-8 text-blue-300" />
                    <div>
                      <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
                      <p className="text-blue-200">{t.humidity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Wind className="w-8 h-8 text-gray-300" />
                    <div>
                      <p className="text-2xl font-bold">{weatherData.current.windSpeed} km/h</p>
                      <p className="text-blue-200">{t.windSpeed}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-2xl p-4 mb-4">
                <p className="text-xl font-medium">{weatherData.current.condition}</p>
                <p className="text-blue-200 mt-1">{weatherData.current.advice}</p>
              </div>
            </div>
            
            <button
              onClick={() => speakContent(
                selectedLanguage === 'hi' 
                  ? `${userLocation.village} में आज का मौसम: तापमान ${weatherData.current.temperature} डिग्री सेल्सियस, ${weatherData.current.condition}, नमी ${weatherData.current.humidity} प्रतिशत, हवा की गति ${weatherData.current.windSpeed} किलोमीटर प्रति घंटा। ${weatherData.current.advice}`
                  : selectedLanguage === 'en'
                  ? `Today's weather in ${userLocation.village}: Temperature ${weatherData.current.temperature} degrees Celsius, ${weatherData.current.condition}, Humidity ${weatherData.current.humidity} percent, Wind speed ${weatherData.current.windSpeed} kilometers per hour. ${weatherData.current.advice}`
                  : `${userLocation.village} میں آج کا موسم: درجہ حرارت ${weatherData.current.temperature} ڈگری سیلسیس، ${weatherData.current.condition}، نمی ${weatherData.current.humidity} فیصد، ہوا کی رفتار ${weatherData.current.windSpeed} کلومیٹر فی گھنٹہ۔ ${weatherData.current.advice}`,
                'weather-current'
              )}
              className="voice-btn"
            >
              {isSpeaking && currentSpeakingId === 'weather-current' ? (
                <VolumeX className="w-10 h-10 animate-pulse" />
              ) : (
                <Volume2 className="w-10 h-10" />
              )}
            </button>
          </div>
          
          {/* Weather Alerts */}
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <div className="space-y-3">
              {weatherData.alerts.map((alert, index) => (
                <div key={index} className={`bg-white/20 rounded-2xl p-4 border-2 border-white/30 ${
                  alert.priority === 'high' ? 'bg-red-500/30' : 
                  alert.priority === 'medium' ? 'bg-yellow-500/30' : 'bg-blue-500/30'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{alert.icon}</span>
                    <p className="text-lg font-semibold">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Farming Advice */}
          {weatherData.farmingAdvice && weatherData.farmingAdvice.length > 0 && (
            <div className="mt-6 bg-green-500/20 rounded-2xl p-4 border-2 border-green-300/50">
              <h4 className="text-xl font-bold mb-3 flex items-center space-x-2">
                <span className="text-2xl">🌾</span>
                <span>{t.farmingTips}</span>
              </h4>
              <div className="space-y-2">
                {weatherData.farmingAdvice.map((advice, index) => (
                  <p key={index} className="text-lg">{advice}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const NewsSection = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
          <Newspaper className="w-8 h-8 text-blue-500" />
          <span>{t.latestNews}</span>
        </h3>
        <button
          onClick={() => loadLocationBasedData(userLocation.state, userLocation.district, userLocation.village)}
          className="p-3 text-gray-500 hover:text-blue-500 transition-all rounded-full hover:bg-blue-50"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-6">
        {latestNews.map((news, index) => (
          <div key={news.id} className="news-card">
            <div className="flex items-start space-x-4">
              <div className="text-5xl flex-shrink-0">
                {getCategoryIcon(news.category)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(news.priority)}`}>
                    {t[news.priority]}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{news.publishedAt}</span>
                  </span>
                  {news.readingTime && (
                    <span className="text-sm text-gray-500">
                      {news.readingTime} {t.minutes}
                    </span>
                  )}
                </div>
                
                <h5 className="font-bold text-gray-800 mb-3 text-xl leading-tight">{news.title}</h5>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-lg">{news.description}</p>
                
                {news.summary && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
                    <p className="text-blue-800 font-medium">💡 {news.summary}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{news.source}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {news.url && (
                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t.readMore}</span>
                      </a>
                    )}
                    
                    <button
                      onClick={() => speakContent(
                        `${news.title}। ${news.description}`,
                        `news-${news.id}`
                      )}
                      className="voice-btn bg-green-500 hover:bg-green-600 w-12 h-12"
                    >
                      {isSpeaking && currentSpeakingId === `news-${news.id}` ? (
                        <VolumeX className="w-5 h-5 animate-pulse" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {latestNews.length === 0 && (
          <div className="text-center p-12 bg-gray-50 rounded-3xl border-4 border-gray-200">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">{t.error}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center space-x-3">
              <span className="text-5xl">📢</span>
              <span>{t.villageVoice}</span>
            </h1>
            
            {/* Voice Settings */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => murfVoiceService.debugVoice()}
                className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-all flex items-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>{t.testVoice}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-3xl p-4 shadow-xl border-4 border-gray-100 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'weather', label: t.weather, icon: '🌤️' },
              { id: 'news', label: t.news, icon: '📰' }
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all font-bold text-lg ${
                  activeSection === id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[60vh]">
          {activeSection === 'weather' && <WeatherSection />}
          {activeSection === 'news' && <NewsSection />}
        </div>
      </div>
    </div>
  );
};

export default EnhancedVillageVoice;