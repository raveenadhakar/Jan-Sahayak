import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Wheat, Calendar, Users, Megaphone, 
  TrendingUp, AlertTriangle, Info, Volume2, VolumeX,
  Thermometer, Wind, Droplets, Sun, Cloud, Zap,
  Building2, Phone, MapPin, Clock, Star, Play, Pause,
  GraduationCap, CheckCircle, FileText, ExternalLink, Download, X,
  Newspaper, RefreshCw
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { weatherService } from '../services/weatherService';
import { newsService } from '../services/newsService';

const VillageVoice = ({ userInfo, selectedLanguage }) => {
  const [activeSection, setActiveSection] = useState('weather');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [weatherData, setWeatherData] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  const [agricultureData, setAgricultureData] = useState([
    { crop: 'गेहूं', price: '₹2,150', change: '+₹50', trend: 'up', market: 'मुज़फ्फरनगर मंडी' },
    { crop: 'चावल', price: '₹3,200', change: '-₹25', trend: 'down', market: 'दिल्ली मंडी' },
    { crop: 'आलू', price: '₹800', change: '+₹15', trend: 'up', market: 'स्थानीय मंडी' },
    { crop: 'प्याज', price: '₹1,200', change: '+₹100', trend: 'up', market: 'आगरा मंडी' },
    { crop: 'टमाटर', price: '₹600', change: '-₹50', trend: 'down', market: 'स्थानीय मंडी' }
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'ग्राम सभा की बैठक',
      description: 'कल शाम 5 बजे पंचायत भवन में ग्राम सभा की बैठक है। सभी ग्रामवासी उपस्थित रहें।',
      date: '2024-08-25',
      time: '17:00',
      priority: 'high',
      category: 'meeting',
      speaker: 'सरपंच जी'
    },
    {
      id: 2,
      title: 'पानी की सप्लाई',
      description: 'कल सुबह 6 से 8 बजे तक पानी की सप्लाई बंद रहेगी। कृपया पहले से पानी भर लें।',
      date: '2024-08-24',
      time: '06:00',
      priority: 'medium',
      category: 'utility',
      speaker: 'जल विभाग'
    },
    {
      id: 3,
      title: 'स्वास्थ्य शिविर',
      description: 'आगामी रविवार को गांव में निःशुल्क स्वास्थ्य जांच शिविर लगेगा। समय: सुबह 9 से दोपहर 2 बजे तक।',
      date: '2024-08-28',
      time: '09:00',
      priority: 'medium',
      category: 'health',
      speaker: 'स्वास्थ्य विभाग'
    }
  ]);

  const [villageStats, setVillageStats] = useState({
    population: 2500,
    households: 450,
    literacyRate: 68,
    employmentRate: 72,
    facilities: {
      school: 2,
      hospital: 1,
      bank: 1,
      postOffice: 1,
      temple: 3
    }
  });

  const translations = {
    hi: {
      villageVoice: 'ग्रामवाणी',
      weather: 'मौसम',
      agriculture: 'कृषि',
      announcements: 'घोषणाएं',
      villageInfo: 'गांव की जानकारी',
      todayWeather: 'आज का मौसम',
      temperature: 'तापमान',
      humidity: 'नमी',
      windSpeed: 'हवा की गति',
      forecast: 'मौसम पूर्वानुमान',
      marketPrices: 'मंडी भाव',
      crop: 'फसल',
      price: 'भाव',
      market: 'मंडी',
      change: 'बदलाव',
      listen: 'सुनें',
      stop: 'रोकें',
      high: 'महत्वपूर्ण',
      medium: 'सामान्य',
      low: 'कम',
      meeting: 'बैठक',
      utility: 'सुविधा',
      health: 'स्वास्थ्य',
      population: 'जनसंख्या',
      households: 'परिवार',
      literacyRate: 'साक्षरता दर',
      employmentRate: 'रोजगार दर',
      facilities: 'सुविधाएं',
      school: 'स्कूल',
      hospital: 'अस्पताल',
      bank: 'बैंक',
      postOffice: 'डाकघर',
      temple: 'मंदिर',
      agricultureTips: 'कृषि सुझाव',
      importantContacts: 'महत्वपूर्ण संपर्क',
      sarpanch: 'सरपंच जी',
      policeStation: 'पुलिस चौकी',
      healthCenter: 'स्वास्थ्य केंद्र',
      electricityDept: 'बिजली विभाग'
    },
    en: {
      villageVoice: 'Village Voice',
      weather: 'Weather',
      agriculture: 'Agriculture',
      announcements: 'Announcements',
      villageInfo: 'Village Information',
      todayWeather: "Today's Weather",
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      forecast: 'Weather Forecast',
      marketPrices: 'Market Prices',
      crop: 'Crop',
      price: 'Price',
      market: 'Market',
      change: 'Change',
      listen: 'Listen',
      stop: 'Stop',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      meeting: 'Meeting',
      utility: 'Utility',
      health: 'Health',
      population: 'Population',
      households: 'Households',
      literacyRate: 'Literacy Rate',
      employmentRate: 'Employment Rate',
      facilities: 'Facilities',
      school: 'School',
      hospital: 'Hospital',
      bank: 'Bank',
      postOffice: 'Post Office',
      temple: 'Temple',
      agricultureTips: 'Agricultural Tips',
      importantContacts: 'Important Contacts',
      sarpanch: 'Sarpanch',
      policeStation: 'Police Station',
      healthCenter: 'Health Center',
      electricityDept: 'Electricity Department'
    },
    ur: {
      villageVoice: 'گاؤں کی آواز',
      weather: 'موسم',
      agriculture: 'زراعت',
      announcements: 'اعلانات',
      villageInfo: 'گاؤں کی معلومات',
      todayWeather: 'آج کا موسم',
      temperature: 'درجہ حرارت',
      humidity: 'نمی',
      windSpeed: 'ہوا کی رفتار',
      forecast: 'موسمی پیشن گوئی',
      marketPrices: 'منڈی کے بھاؤ',
      crop: 'فصل',
      price: 'قیمت',
      market: 'منڈی',
      change: 'تبدیلی',
      listen: 'سنیں',
      stop: 'رکیں',
      high: 'اہم',
      medium: 'عام',
      low: 'کم',
      meeting: 'میٹنگ',
      utility: 'سہولت',
      health: 'صحت',
      population: 'آبادی',
      households: 'خاندان',
      literacyRate: 'خواندگی کی شرح',
      employmentRate: 'روزگار کی شرح',
      facilities: 'سہولات',
      school: 'اسکول',
      hospital: 'ہسپتال',
      bank: 'بینک',
      postOffice: 'ڈاک خانہ',
      temple: 'مندر',
      agricultureTips: 'زرعی تجاویز',
      importantContacts: 'اہم رابطے',
      sarpanch: 'سرپنچ',
      policeStation: 'پولیس اسٹیشن',
      healthCenter: 'صحت مرکز',
      electricityDept: 'بجلی کا شعبہ'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  // Load weather and news data
  useEffect(() => {
    loadWeatherData();
    loadNewsData();
  }, [selectedLanguage, userInfo.village]);

  const loadWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const city = userInfo.village || 'Muzaffarnagar';
      const [current, forecast] = await Promise.all([
        weatherService.getCurrentWeather(city, selectedLanguage),
        weatherService.getWeatherForecast(city, selectedLanguage)
      ]);
      setWeatherData(current);
      setWeatherForecast(forecast);
    } catch (error) {
      console.error('Error loading weather data:', error);
      setError('Weather data unavailable');
      // Set mock data as fallback
      setWeatherData({
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        localizedCondition: 'बादल',
        city: userInfo.village || 'मुज़फ्फरनगर'
      });
      setWeatherForecast([
        { dayName: 'आज', maxTemp: 28, minTemp: 18, localizedCondition: 'बादल' },
        { dayName: 'कल', maxTemp: 30, minTemp: 20, localizedCondition: 'धूप' },
        { dayName: 'परसों', maxTemp: 26, minTemp: 16, localizedCondition: 'बारिश' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNewsData = async () => {
    try {
      const [general, government, agriculture] = await Promise.all([
        newsService.getLatestNews('भारत समाचार', selectedLanguage, 3),
        newsService.getGovernmentNews(selectedLanguage),
        newsService.getAgricultureNews(selectedLanguage)
      ]);
      setLatestNews([...government, ...agriculture, ...general].slice(0, 5));
    } catch (error) {
      console.error('Error loading news data:', error);
      // Use mock news data
      setLatestNews(newsService.getMockNews(selectedLanguage));
    }
  };

  const speakContent = async (content, id) => {
    if (isSpeaking && currentSpeakingId === id) {
      try {
        speechService.webSpeechTTS('', selectedLanguage);
      } catch (error) {
        console.error('Error stopping speech:', error);
      }
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    setIsSpeaking(true);
    setCurrentSpeakingId(id);

    try {
      await speechService.textToSpeech(content, selectedLanguage);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
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
            <p className="text-xl text-gray-600">🌤️ मौसम की जानकारी लोड हो रही है...</p>
          </div>
        </div>
      );
    }

    if (!weatherData) {
      return (
        <div className="text-center p-20">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">मौसम की जानकारी उपलब्ध नहीं है</p>
          <button 
            onClick={loadWeatherData}
            className="bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-all"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            पुनः प्रयास करें
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Current Weather */}
        <div className="bg-village-sky rounded-3xl p-8 text-white shadow-village-xl border-4 border-white card-village">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-responsive-3xl font-bold mb-4 text-shadow-lg">
                🌤️ {t.todayWeather}
              </h3>
              <p className="text-xl mb-4 opacity-90">📍 {weatherData.city}</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-10 h-10 icon-bounce" />
                  <span className="text-5xl font-bold text-shadow">{weatherData.temperature}°C</span>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {weatherData.condition === 'Clear' && '☀️'}
                    {weatherData.condition === 'Clouds' && '☁️'}
                    {weatherData.condition === 'Rain' && '🌧️'}
                    {weatherData.condition === 'Drizzle' && '🌦️'}
                    {weatherData.condition === 'Thunderstorm' && '⛈️'}
                    {weatherData.condition === 'Snow' && '❄️'}
                    {weatherData.condition === 'Mist' && '🌫️'}
                  </div>
                  <p className="text-lg font-medium">{weatherData.localizedCondition}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => speakContent(
                `${weatherData.city} में आज का मौसम: तापमान ${weatherData.temperature} डिग्री सेल्सियस, ${weatherData.localizedCondition}, नमी ${weatherData.humidity} प्रतिशत, हवा की गति ${weatherData.windSpeed} किलोमीटर प्रति घंटा`,
                'weather-current'
              )}
              className="bg-white/20 p-4 rounded-2xl hover:bg-white/30 transition-all border-2 border-white/30 btn-village"
            >
              {isSpeaking && currentSpeakingId === 'weather-current' ? (
                <VolumeX className="w-8 h-8 animate-pulse" />
              ) : (
                <Volume2 className="w-8 h-8" />
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-white/20 rounded-3xl p-6 text-center border-2 border-white/30 card-village">
              <div className="text-4xl mb-3">💧</div>
              <p className="text-lg opacity-80 mb-2">{t.humidity}</p>
              <p className="text-2xl font-bold">{weatherData.humidity}%</p>
            </div>
            <div className="bg-white/20 rounded-3xl p-6 text-center border-2 border-white/30 card-village">
              <div className="text-4xl mb-3">💨</div>
              <p className="text-lg opacity-80 mb-2">{t.windSpeed}</p>
              <p className="text-2xl font-bold">{weatherData.windSpeed} km/h</p>
            </div>
            <div className="bg-white/20 rounded-3xl p-6 text-center border-2 border-white/30 card-village">
              <div className="text-4xl mb-3">🌡️</div>
              <p className="text-lg opacity-80 mb-2">Feels Like</p>
              <p className="text-2xl font-bold">{weatherData.feelsLike || weatherData.temperature}°C</p>
            </div>
          </div>

          {/* Weather Advice */}
          <div className="mt-6 p-4 bg-white/20 rounded-2xl border-2 border-white/30">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="font-bold mb-2">मौसम सलाह:</p>
                <p className="text-sm opacity-90">
                  {weatherService.getWeatherAdvice(weatherData, selectedLanguage)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Forecast */}
        <div className="bg-white rounded-3xl p-8 shadow-village-xl border-4 border-gray-100 card-village">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
              <div className="text-3xl">📅</div>
              <span>{t.forecast}</span>
            </h4>
            <button 
              onClick={loadWeatherData}
              className="p-2 text-gray-500 hover:text-blue-500 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weatherForecast.slice(0, 3).map((day, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all border-village border-gray-200 card-village">
                <p className="font-bold text-gray-800 mb-3 text-xl">{day.dayName}</p>
                <div className="text-5xl mb-4">
                  {day.condition === 'Clear' && '☀️'}
                  {day.condition === 'Clouds' && '☁️'}
                  {day.condition === 'Rain' && '🌧️'}
                  {day.localizedCondition?.includes('बारिश') && '🌧️'}
                  {day.localizedCondition?.includes('धूप') && '☀️'}
                  {day.localizedCondition?.includes('बादल') && '☁️'}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-red-500">{day.maxTemp}°</span>
                  <span className="text-lg text-gray-500">{day.minTemp}°</span>
                </div>
                <p className="text-lg text-gray-600 font-medium">{day.localizedCondition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div className="bg-white rounded-3xl p-8 shadow-village-xl border-4 border-gray-100 card-village">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
              <div className="text-3xl">📰</div>
              <span>ताज़ा समाचार</span>
            </h4>
            <button 
              onClick={loadNewsData}
              className="p-2 text-gray-500 hover:text-blue-500 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {latestNews.slice(0, 3).map((news, index) => (
              <div key={news.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all card-village">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">
                    {news.category === 'government' && '🏛️'}
                    {news.category === 'agriculture' && '🌾'}
                    {news.category === 'weather' && '🌤️'}
                    {news.category === 'health' && '🏥'}
                    {news.category === 'general' && '📢'}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-800 mb-2">{news.title}</h5>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{news.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">📍 {news.source}</span>
                      <button
                        onClick={() => speakContent(
                          `समाचार: ${news.title}। ${news.description}`,
                          `news-${news.id}`
                        )}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-all"
                      >
                        {isSpeaking && currentSpeakingId === `news-${news.id}` ? (
                          <VolumeX className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AgricultureSection = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <Wheat className="w-8 h-8 text-green-500" />
            <span>{t.marketPrices}</span>
          </h3>
          <button
            onClick={() => speakContent(
              `आज के मंडी भाव: ${agricultureData.map(item => `${item.crop} ${item.price}`).join(', ')}`,
              'agriculture-prices'
            )}
            className="bg-green-50 text-green-600 p-4 rounded-2xl hover:bg-green-100 transition-all border-2 border-green-200"
          >
            {isSpeaking && currentSpeakingId === 'agriculture-prices' ? (
              <VolumeX className="w-6 h-6 animate-pulse" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
        </div>
        
        <div className="space-y-6">
          {agricultureData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-all border-3 border-gray-200">
              <div className="flex items-center space-x-6">
                <div className="bg-green-100 p-4 rounded-2xl border-2 border-green-200">
                  <Wheat className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xl">{item.crop}</h4>
                  <p className="text-lg text-gray-600">{item.market}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{item.price}</p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`w-5 h-5 ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-lg font-bold ${
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agricultural Tips */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-4 border-green-200">
        <h4 className="text-2xl font-bold text-green-800 mb-6 flex items-center space-x-3">
          <Info className="w-8 h-8" />
          <span>{t.agricultureTips}</span>
        </h4>
        <ul className="space-y-4 text-green-700">
          <li className="flex items-start space-x-4 p-4 bg-white rounded-2xl border-2 border-green-200">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-lg">बारिश के मौसम में फसल की सुरक्षा के लिए उचित जल निकासी का प्रबंध करें</span>
          </li>
          <li className="flex items-start space-x-4 p-4 bg-white rounded-2xl border-2 border-green-200">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-lg">मंडी भाव की नियमित जानकारी के लिए किसान कॉल सेंटर 1800-180-1551 पर संपर्क करें</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const AnnouncementsSection = () => (
    <div className="space-y-6">
      {announcements.map((announcement) => (
        <div key={announcement.id} className={`bg-white rounded-3xl p-8 shadow-xl border-l-8 border-4 border-gray-100 ${getPriorityColor(announcement.priority).replace('bg-', 'border-l-')}`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <Megaphone className="w-8 h-8 text-blue-500" />
                <h4 className="text-2xl font-bold text-gray-800">{announcement.title}</h4>
                <span className={`px-4 py-2 rounded-2xl text-lg font-bold border-2 ${getPriorityColor(announcement.priority)}`}>
                  {t[announcement.priority]}
                </span>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{announcement.description}</p>
              <div className="flex items-center space-x-6 text-lg text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6" />
                  <span>{announcement.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-6 h-6" />
                  <span>{announcement.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6" />
                  <span>{announcement.speaker}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => speakContent(
                `${announcement.title}। ${announcement.description}। दिनांक: ${announcement.date}, समय: ${announcement.time}`,
                `announcement-${announcement.id}`
              )}
              className="bg-blue-50 text-blue-600 p-4 rounded-2xl hover:bg-blue-100 transition-all ml-6 border-2 border-blue-200"
            >
              {isSpeaking && currentSpeakingId === `announcement-${announcement.id}` ? (
                <VolumeX className="w-6 h-6 animate-pulse" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const VillageInfoSection = () => (
    <div className="space-y-8">
      {/* Village Statistics */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center space-x-3">
          <Building2 className="w-8 h-8 text-purple-500" />
          <span>{userInfo.village || 'गांव'} - {t.villageInfo}</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-2xl p-6 text-center border-3 border-blue-200">
            <Users className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-lg text-blue-600 font-bold mb-2">{t.population}</p>
            <p className="text-3xl font-bold text-blue-800">{villageStats.population.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 text-center border-3 border-green-200">
            <Building2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-lg text-green-600 font-bold mb-2">{t.households}</p>
            <p className="text-3xl font-bold text-green-800">{villageStats.households}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 text-center border-3 border-purple-200">
            <Star className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <p className="text-lg text-purple-600 font-bold mb-2">{t.literacyRate}</p>
            <p className="text-3xl font-bold text-purple-800">{villageStats.literacyRate}%</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 text-center border-3 border-orange-200">
            <TrendingUp className="w-10 h-10 text-orange-500 mx-auto mb-3" />
            <p className="text-lg text-orange-600 font-bold mb-2">{t.employmentRate}</p>
            <p className="text-3xl font-bold text-orange-800">{villageStats.employmentRate}%</p>
          </div>
        </div>
      </div>

      {/* Village Facilities */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-gray-100">
        <h4 className="text-2xl font-bold text-gray-800 mb-6">{t.facilities}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(villageStats.facilities).map(([facility, count]) => (
            <div key={facility} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 flex items-center space-x-4 border-3 border-gray-200">
              <div className="bg-indigo-100 p-4 rounded-2xl border-2 border-indigo-200">
                <Building2 className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">{t[facility]}</p>
                <p className="text-3xl font-bold text-indigo-600">{count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border-4 border-indigo-200">
        <h4 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center space-x-3">
          <Phone className="w-8 h-8" />
          <span>{t.importantContacts}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border-3 border-indigo-200">
            <p className="font-bold text-gray-800 text-xl mb-2">{t.sarpanch}</p>
            <p className="text-indigo-600 text-xl font-mono">+91 98765 43210</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-3 border-indigo-200">
            <p className="font-bold text-gray-800 text-xl mb-2">{t.policeStation}</p>
            <p className="text-indigo-600 text-xl font-mono">100 / +91 98765 43211</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-3 border-indigo-200">
            <p className="font-bold text-gray-800 text-xl mb-2">{t.healthCenter}</p>
            <p className="text-indigo-600 text-xl font-mono">108 / +91 98765 43212</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-3 border-indigo-200">
            <p className="font-bold text-gray-800 text-xl mb-2">{t.electricityDept}</p>
            <p className="text-indigo-600 text-xl font-mono">1912 / +91 98765 43213</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-4 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border-4 border-white">
        <div className="flex items-center space-x-6">
          <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm border-2 border-white/30">
            <Megaphone className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-3">{t.villageVoice}</h2>
            <p className="text-green-100 text-xl">
              {selectedLanguage === 'hi' && `${userInfo.village || 'गांव'} की आवाज़`}
              {selectedLanguage === 'en' && `Voice of ${userInfo.village || 'Village'}`}
              {selectedLanguage === 'ur' && `${userInfo.village || 'گاؤں'} کی آواز`}
            </p>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-3xl p-4 shadow-xl border-4 border-gray-100">
        <div className="grid grid-cols-4 gap-4">
          {['weather', 'agriculture', 'announcements', 'villageInfo'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`p-6 rounded-2xl transition-all text-center border-3 ${
                activeSection === section
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                {section === 'weather' && <CloudRain className="w-8 h-8" />}
                {section === 'agriculture' && <Wheat className="w-8 h-8" />}
                {section === 'announcements' && <Megaphone className="w-8 h-8" />}
                {section === 'villageInfo' && <Building2 className="w-8 h-8" />}
                <span className="text-lg font-bold">{t[section]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="min-h-96">
        {activeSection === 'weather' && <WeatherSection />}
        {activeSection === 'agriculture' && <AgricultureSection />}
        {activeSection === 'announcements' && <AnnouncementsSection />}
        {activeSection === 'villageInfo' && <VillageInfoSection />}
      </div>
    </div>
  );
};

export default VillageVoice;