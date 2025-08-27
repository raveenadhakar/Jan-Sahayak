import React, { useState, useEffect } from 'react';
import {
  Award, Heart, Wheat, Shield, Gift, Building2, GraduationCap,
  Zap, Droplets, Home, Baby, Users, CheckCircle, Clock,
  AlertTriangle, Phone, ExternalLink, Download, Volume2, VolumeX,
  FileText, X, RefreshCw, MapPin, Calendar
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { realDataService } from '../services/realDataService';

const GovernmentSchemes = ({ userInfo, selectedLanguage }) => {
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load real scheme data
  useEffect(() => {
    loadSchemeData();
  }, [userInfo.state, userInfo.district]);

  const loadSchemeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const realSchemes = await realDataService.getRealGovernmentSchemes(
        userInfo.state || 'Uttar Pradesh',
        userInfo.district || 'Muzaffarnagar'
      );
      setSchemes(realSchemes);
    } catch (error) {
      console.error('Error loading scheme data:', error);
      setError('Failed to load scheme data');
      // Fallback to mock data
      setSchemes(getMockSchemes());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockSchemes = () => [
    {
      id: 'pmkisan',
      name: 'PM-KISAN',
      nameEn: 'PM-KISAN',
      nameHi: 'पीएम-किसान',
      nameUr: 'پی ایم کسان',
      description: 'किसानों को आर्थिक सहायता',
      descriptionEn: 'Financial assistance to farmers',
      descriptionUr: 'کسانوں کو مالی امداد',
      amount: '₹6,000/वर्ष',
      status: 'eligible',
      category: 'agriculture',
      icon: <Wheat className="w-6 h-6 text-white" />,
      benefits: [
        'सालाना ₹6,000 की सहायता',
        'तीन किस्तों में भुगतान',
        'सीधे बैंक खाते में ट्रांसफर'
      ],
      eligibility: [
        'छोटे और सीमांत किसान',
        '2 हेक्टेयर तक की भूमि',
        'आधार कार्ड आवश्यक'
      ],
      documents: ['आधार कार्ड', 'बैंक पासबुक', 'भूमि दस्तावेज'],
      applicationProcess: 'ऑनलाइन या CSC केंद्र पर आवेदन करें',
      helpline: '155261',
      website: 'pmkisan.gov.in'
    },
    {
      id: 'ayushman',
      name: 'Ayushman Bharat',
      nameEn: 'Ayushman Bharat',
      nameHi: 'आयुष्मान भारत',
      nameUr: 'آیوشمان بھارت',
      description: 'स्वास्थ्य बीमा योजना',
      descriptionEn: 'Health insurance scheme',
      descriptionUr: 'صحت کی بیمہ اسکیم',
      amount: '₹5 लाख/परिवार',
      status: 'registered',
      category: 'health',
      icon: <Heart className="w-6 h-6 text-white" />,
      benefits: [
        'सालाना ₹5 लाख तक का कवरेज',
        'कैशलेस इलाज',
        'पूरे भारत में मान्य'
      ],
      eligibility: [
        'SECC 2011 के अनुसार पात्र परिवार',
        'गरीबी रेखा से नीचे के परिवार'
      ],
      documents: ['राशन कार्ड', 'आधार कार्ड', 'आय प्रमाण पत्र'],
      applicationProcess: 'नजदीकी CSC या अस्पताल में संपर्क करें',
      helpline: '14555',
      website: 'pmjay.gov.in'
    },
    {
      id: 'pension',
      name: 'Old Age Pension',
      nameEn: 'Old Age Pension',
      nameHi: 'वृद्धावस्था पेंशन',
      nameUr: 'بڑھاپے کی پنشن',
      description: 'बुजुर्गों के लिए पेंशन',
      descriptionEn: 'Pension for elderly',
      descriptionUr: 'بزرگوں کے لیے پنشن',
      amount: '₹1,200/माह',
      status: 'pending',
      category: 'social',
      icon: <Shield className="w-6 h-6 text-white" />,
      benefits: [
        'मासिक ₹1,200 की पेंशन',
        'सीधे बैंक खाते में भुगतान',
        'जीवन भर की सुरक्षा'
      ],
      eligibility: [
        '60 वर्ष या अधिक आयु',
        'गरीबी रेखा से नीचे का परिवार',
        'कोई नियमित आय नहीं'
      ],
      documents: ['आधार कार्ड', 'आयु प्रमाण पत्र', 'आय प्रमाण पत्र', 'बैंक पासबुक'],
      applicationProcess: 'जिला कलेक्टर कार्यालय में आवेदन करें',
      helpline: '1800-180-1551',
      website: 'nsap.nic.in'
    },
    {
      id: 'ration',
      name: 'Ration Card',
      nameEn: 'Ration Card',
      nameHi: 'राशन कार्ड',
      nameUr: 'راشن کارڈ',
      description: 'सब्सिडी वाला अनाज',
      descriptionEn: 'Subsidized food grains',
      descriptionUr: 'سبسڈی والا اناج',
      amount: '5 किलो/व्यक्ति',
      status: 'active',
      category: 'food',
      icon: <Gift className="w-6 h-6 text-white" />,
      benefits: [
        'सब्सिडी दर पर अनाज',
        'चावल ₹3/किलो',
        'गेहूं ₹2/किलो'
      ],
      eligibility: [
        'भारतीय नागरिक',
        'स्थायी निवासी',
        'आय के अनुसार श्रेणी'
      ],
      documents: ['आधार कार्ड', 'निवास प्रमाण पत्र', 'आय प्रमाण पत्र'],
      applicationProcess: 'खाद्य विभाग कार्यालय में आवेदन करें',
      helpline: '1967',
      website: 'nfsa.gov.in'
    },
    {
      id: 'housing',
      name: 'PM Awas Yojana',
      nameEn: 'PM Awas Yojana',
      nameHi: 'पीएम आवास योजना',
      nameUr: 'پی ایم آواس یوجنا',
      description: 'सभी के लिए घर',
      descriptionEn: 'Housing for all',
      descriptionUr: 'سب کے لیے گھر',
      amount: '₹1.2 लाख सहायता',
      status: 'eligible',
      category: 'housing',
      icon: <Home className="w-6 h-6 text-white" />,
      benefits: [
        'घर निर्माण के लिए ₹1.2 लाख',
        'शौचालय निर्माण सहायता',
        'बिजली कनेक्शन सहायता'
      ],
      eligibility: [
        'BPL परिवार',
        'कच्चे घर में रहने वाले',
        'भूमिहीन मजदूर'
      ],
      documents: ['आधार कार्ड', 'BPL कार्ड', 'भूमि दस्तावेज'],
      applicationProcess: 'ग्राम पंचायत या ब्लॉक कार्यालय में आवेदन करें',
      helpline: '1800-11-6446',
      website: 'pmayg.nic.in'
    },
    {
      id: 'education',
      name: 'Sarva Shiksha Abhiyan',
      nameEn: 'Sarva Shiksha Abhiyan',
      nameHi: 'सर्व शिक्षा अभियान',
      nameUr: 'سرو شکشا ابھیان',
      description: 'सभी बच्चों के लिए शिक्षा',
      descriptionEn: 'Education for all children',
      descriptionUr: 'تمام بچوں کے لیے تعلیم',
      amount: 'निःशुल्क शिक्षा',
      status: 'active',
      category: 'education',
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      benefits: [
        'निःशुल्क प्राथमिक शिक्षा',
        'मुफ्त किताबें और यूनिफॉर्म',
        'मध्याह्न भोजन'
      ],
      eligibility: [
        '6-14 वर्ष के बच्चे',
        'सभी जाति और धर्म',
        'गरीब परिवारों को प्राथमिकता'
      ],
      documents: ['जन्म प्रमाण पत्र', 'आधार कार्ड', 'निवास प्रमाण पत्र'],
      applicationProcess: 'नजदीकी सरकारी स्कूल में संपर्क करें',
      helpline: '1800-11-0031',
      website: 'ssa.nic.in'
    }
  ];

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);

  const translations = {
    hi: {
      schemes: 'सरकारी योजनाएं',
      mySchemes: 'मेरी योजनाएं',
      allSchemes: 'सभी योजनाएं',
      eligible: 'पात्र',
      registered: 'पंजीकृत',
      active: 'सक्रिय',
      pending: 'लंबित',
      rejected: 'अस्वीकृत',
      benefits: 'लाभ',
      eligibility: 'पात्रता',
      documents: 'आवश्यक दस्तावेज',
      applicationProcess: 'आवेदन प्रक्रिया',
      helpline: 'हेल्पलाइन',
      website: 'वेबसाइट',
      apply: 'आवेदन करें',
      checkStatus: 'स्थिति देखें',
      viewDetails: 'विवरण देखें',
      listen: 'सुनें',
      stop: 'रोकें',
      agriculture: 'कृषि',
      health: 'स्वास्थ्य',
      social: 'सामाजिक',
      food: 'खाद्य',
      education: 'शिक्षा',
      housing: 'आवास',
      contactInfo: 'संपर्क जानकारी',
      download: 'डाउनलोड',
      byCategory: 'श्रेणी के अनुसार'
    },
    en: {
      schemes: 'Government Schemes',
      mySchemes: 'My Schemes',
      allSchemes: 'All Schemes',
      eligible: 'Eligible',
      registered: 'Registered',
      active: 'Active',
      pending: 'Pending',
      rejected: 'Rejected',
      benefits: 'Benefits',
      eligibility: 'Eligibility',
      documents: 'Required Documents',
      applicationProcess: 'Application Process',
      helpline: 'Helpline',
      website: 'Website',
      apply: 'Apply',
      checkStatus: 'Check Status',
      viewDetails: 'View Details',
      listen: 'Listen',
      stop: 'Stop',
      agriculture: 'Agriculture',
      health: 'Health',
      social: 'Social',
      food: 'Food',
      education: 'Education',
      housing: 'Housing',
      contactInfo: 'Contact Information',
      download: 'Download',
      byCategory: 'By Category'
    },
    ur: {
      schemes: 'سرکاری اسکیمیں',
      mySchemes: 'میری اسکیمیں',
      allSchemes: 'تمام اسکیمیں',
      eligible: 'اہل',
      registered: 'رجسٹرڈ',
      active: 'فعال',
      pending: 'زیر التواء',
      rejected: 'مسترد',
      benefits: 'فوائد',
      eligibility: 'اہلیت',
      documents: 'ضروری دستاویزات',
      applicationProcess: 'درخواست کا عمل',
      helpline: 'ہیلپ لائن',
      website: 'ویب سائٹ',
      apply: 'درخواست دیں',
      checkStatus: 'صورتحال دیکھیں',
      viewDetails: 'تفصیلات دیکھیں',
      listen: 'سنیں',
      stop: 'رکیں',
      agriculture: 'زراعت',
      health: 'صحت',
      social: 'سماجی',
      food: 'خوراک',
      education: 'تعلیم',
      housing: 'رہائش',
      contactInfo: 'رابطہ کی معلومات',
      download: 'ڈاؤن لوڈ',
      byCategory: 'قسم کے مطابق'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  const speakSchemeInfo = async (scheme) => {
    const schemeId = `scheme-${scheme.id}`;

    if (isSpeaking && currentSpeakingId === schemeId) {
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
    setCurrentSpeakingId(schemeId);

    const schemeText = `${scheme[`name${selectedLanguage === 'en' ? 'En' : selectedLanguage === 'ur' ? 'Ur' : 'Hi'}`]}। ${scheme[`description${selectedLanguage === 'en' ? 'En' : selectedLanguage === 'ur' ? 'Ur' : ''}`]}। राशि: ${scheme.amount}। स्थिति: ${scheme.status}`;

    try {
      await speechService.textToSpeech(schemeText, selectedLanguage);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'registered': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'eligible': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'agriculture': return 'from-green-500 to-green-600';
      case 'health': return 'from-red-500 to-red-600';
      case 'social': return 'from-blue-500 to-blue-600';
      case 'food': return 'from-orange-500 to-orange-600';
      case 'education': return 'from-purple-500 to-purple-600';
      case 'housing': return 'from-indigo-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    if (filter === 'all') return true;
    return scheme.status === filter || scheme.category === filter;
  });

  const SchemeCard = ({ scheme }) => (
    <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-gray-100">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${getCategoryColor(scheme.category)} shadow-lg`}>
            {scheme.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {scheme[`name${selectedLanguage === 'en' ? 'En' : selectedLanguage === 'ur' ? 'Ur' : 'Hi'}`]}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {scheme[`description${selectedLanguage === 'en' ? 'En' : selectedLanguage === 'ur' ? 'Ur' : ''}`]}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => speakSchemeInfo(scheme)}
            className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all shadow-md border-2 border-blue-200"
          >
            {isSpeaking && currentSpeakingId === `scheme-${scheme.id}` ? (
              <VolumeX className="w-5 h-5 animate-pulse" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <span className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 ${getStatusColor(scheme.status)}`}>
            {t[scheme.status]}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
          <span className="text-gray-700 font-bold text-lg">
            {selectedLanguage === 'hi' && 'राशि:'}
            {selectedLanguage === 'en' && 'Amount:'}
            {selectedLanguage === 'ur' && 'رقم:'}
          </span>
          <span className="font-bold text-green-600 text-xl">{scheme.amount}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
          <span className="text-gray-700 font-bold text-lg">
            {selectedLanguage === 'hi' && 'श्रेणी:'}
            {selectedLanguage === 'en' && 'Category:'}
            {selectedLanguage === 'ur' && 'قسم:'}
          </span>
          <span className="text-gray-800 font-bold text-lg">{t[scheme.category]}</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setSelectedScheme(scheme)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-4 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all font-bold shadow-lg transform hover:scale-105 text-lg"
        >
          {t.viewDetails}
        </button>
        {scheme.status === 'eligible' && (
          <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-4 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all font-bold shadow-lg transform hover:scale-105 text-lg">
            {t.apply}
          </button>
        )}
        {(scheme.status === 'registered' || scheme.status === 'pending' || scheme.status === 'active') && (
          <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold shadow-lg transform hover:scale-105 text-lg">
            {t.checkStatus}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl border-4 border-white">
        <div className="flex items-center space-x-6">
          <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm border-2 border-white/30">
            <Award className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-3">{t.schemes}</h2>
            <p className="text-blue-100 text-xl">
              {selectedLanguage === 'hi' && `${userInfo.name || 'आपके'} के लिए उपलब्ध योजनाएं`}
              {selectedLanguage === 'en' && `Available schemes for ${userInfo.name || 'you'}`}
              {selectedLanguage === 'ur' && `${userInfo.name || 'آپ'} کے لیے دستیاب اسکیمیں`}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-gray-100">
        <div className="flex flex-wrap gap-4">
          {['all', 'eligible', 'registered', 'active', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-8 py-4 rounded-2xl transition-all font-bold text-lg border-3 ${filter === status
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border-blue-300'
                : 'text-gray-700 hover:bg-gray-100 border-gray-300 bg-gray-50'
                }`}
            >
              {t[status === 'all' ? 'allSchemes' : status]}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6 text-2xl">{t.byCategory}</h3>
        <div className="flex flex-wrap gap-4">
          {['agriculture', 'health', 'social', 'food', 'education', 'housing'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-8 py-4 rounded-2xl transition-all flex items-center space-x-3 font-bold text-lg border-3 ${filter === category
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl transform scale-105 border-purple-300'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
            >
              <span>{t[category]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredSchemes.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className={`p-6 rounded-3xl bg-gradient-to-br ${getCategoryColor(selectedScheme.category)} shadow-xl border-2 border-white`}>
                  {selectedScheme.icon}
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-gray-800 mb-3">
                    {selectedScheme[`name${selectedLanguage === 'en' ? 'En' : selectedLanguage === 'ur' ? 'Ur' : 'Hi'}`]}
                  </h3>
                  <p className="text-gray-600 text-xl">
                    {selectedScheme[`description${selectedLanguage === 'en' ? 'En' : selectedLanguage === 'ur' ? 'Ur' : ''}`]}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-4 hover:bg-gray-100 rounded-2xl transition-all border-2 border-gray-300"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Benefits */}
                <div className="bg-green-50 rounded-3xl p-6 border-3 border-green-200">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <span>{t.benefits}</span>
                  </h4>
                  <ul className="space-y-4">
                    {selectedScheme.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-md border-2 border-green-200">
                        <div className="w-4 h-4 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility */}
                <div className="bg-blue-50 rounded-3xl p-6 border-3 border-blue-200">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                    <Users className="w-8 h-8 text-blue-500" />
                    <span>{t.eligibility}</span>
                  </h4>
                  <ul className="space-y-4">
                    {selectedScheme.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-md border-2 border-blue-200">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium text-lg">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Documents */}
                <div className="bg-orange-50 rounded-3xl p-6 border-3 border-orange-200">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-orange-500" />
                    <span>{t.documents}</span>
                  </h4>
                  <ul className="space-y-4">
                    {selectedScheme.documents.map((doc, index) => (
                      <li key={index} className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-md border-2 border-orange-200">
                        <div className="w-4 h-4 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium text-lg">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Application Process */}
                <div className="bg-purple-50 rounded-3xl p-6 border-3 border-purple-200">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-purple-500" />
                    <span>{t.applicationProcess}</span>
                  </h4>
                  <p className="text-gray-700 font-medium text-lg p-4 bg-white rounded-2xl shadow-md border-2 border-purple-200">{selectedScheme.applicationProcess}</p>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border-3 border-gray-300">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6">{t.contactInfo}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-md border-2 border-gray-200">
                      <Phone className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{t.helpline}</p>
                        <p className="text-gray-600 text-xl font-mono">{selectedScheme.helpline}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-md border-2 border-gray-200">
                      <ExternalLink className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{t.website}</p>
                        <p className="text-blue-600 font-mono text-lg">{selectedScheme.website}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-6 mt-10">
              <button
                onClick={() => speakSchemeInfo(selectedScheme)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-5 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-4 font-bold shadow-xl transform hover:scale-105 text-lg border-3 border-blue-300"
              >
                {isSpeaking && currentSpeakingId === `scheme-${selectedScheme.id}` ? (
                  <VolumeX className="w-6 h-6 animate-pulse" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
                <span>{isSpeaking && currentSpeakingId === `scheme-${selectedScheme.id}` ? t.stop : t.listen}</span>
              </button>

              {selectedScheme.status === 'eligible' && (
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-5 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all flex items-center space-x-4 font-bold shadow-xl transform hover:scale-105 text-lg border-3 border-green-300">
                  <ExternalLink className="w-6 h-6" />
                  <span>{t.apply}</span>
                </button>
              )}

              {(selectedScheme.status === 'registered' || selectedScheme.status === 'pending' || selectedScheme.status === 'active') && (
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center space-x-4 font-bold shadow-xl transform hover:scale-105 text-lg border-3 border-orange-300">
                  <Clock className="w-6 h-6" />
                  <span>{t.checkStatus}</span>
                </button>
              )}

              <button className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-10 py-5 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all flex items-center space-x-4 font-bold shadow-xl transform hover:scale-105 text-lg border-3 border-gray-300">
                <Download className="w-6 h-6" />
                <span>{t.download}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentSchemes;