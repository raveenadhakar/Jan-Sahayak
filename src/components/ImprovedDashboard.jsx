import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, FileText, CheckCircle, AlertTriangle,
  Calendar, MapPin, Phone, Mail, Clock, Star, Award, Plus,
  Settings, Bell, Home, Megaphone
} from 'lucide-react';
import { authService } from '../services/authService';
import { complaintService } from '../services/complaintService';
import { locationService } from '../services/locationService';
import UserProfileForm from './UserProfileForm';
import OfficialsContact from './OfficialsContact';

const ImprovedDashboard = ({ userInfo, selectedLanguage, onTabChange }) => {
  const [stats, setStats] = useState({
    totalComplaints: 12,
    resolvedComplaints: 8,
    pendingComplaints: 4,
    activeSchemes: 6,
    villagePopulation: 2500,
    lastLogin: new Date().toLocaleDateString()
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [realUserStats, setRealUserStats] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [showOfficialsContact, setShowOfficialsContact] = useState(false);

  const translations = {
    hi: {
      dashboard: 'डैशबोर्ड',
      welcome: 'स्वागत है',
      overview: 'सारांश',
      totalComplaints: 'कुल शिकायतें',
      resolved: 'हल हुई',
      pending: 'लंबित',
      activeSchemes: 'सक्रिय योजनाएं',
      villageStats: 'गांव की जानकारी',
      population: 'जनसंख्या',
      lastLogin: 'अंतिम लॉगिन',
      quickActions: 'त्वरित कार्य',
      fileNewComplaint: 'नई शिकायत दर्ज करें',
      checkSchemeStatus: 'योजना की स्थिति देखें',
      viewNotices: 'सूचनाएं देखें',
      contactOfficials: 'अधिकारियों से संपर्क करें',
      complaintCenter: 'शिकायत केंद्र',
      fileComplaintNow: 'अभी शिकायत दर्ज करें',
      complaintDescription: 'आवाज़ या टेक्स्ट में अपनी समस्या बताएं',
      loginToFile: 'शिकायत दर्ज करने के लिए लॉगिन करें',
      demoDataNotice: 'यह डेमो डेटा है। वास्तविक डेटा के लिए लॉगिन करें।',
      completeProfile: 'प्रोफाइल पूरी करें',
      profileIncomplete: 'प्रोफाइल अधूरी है',
      completeForSchemes: 'सरकारी योजनाओं के लिए अपनी प्रोफाइल पूरी करें',
      verifiedLocation: 'सत्यापित स्थान',
      eligibleSchemes: 'पात्र योजनाएं',
      rating: 'रेटिंग',
      yourComplaints: 'आपकी शिकायतें',
      resolvedIssues: 'हल हुए मुद्दे',
      inProgress: 'प्रगति में',
      governmentServices: 'सरकारी सेवाएं',
      communityUpdates: 'समुदायिक अपडेट',
      importantAnnouncements: 'महत्वपूर्ण घोषणाएं'
    },
    en: {
      dashboard: 'Dashboard',
      welcome: 'Welcome',
      overview: 'Overview',
      totalComplaints: 'Total Complaints',
      resolved: 'Resolved',
      pending: 'Pending',
      activeSchemes: 'Active Schemes',
      villageStats: 'Village Information',
      population: 'Population',
      lastLogin: 'Last Login',
      quickActions: 'Quick Actions',
      fileNewComplaint: 'File New Complaint',
      checkSchemeStatus: 'Check Scheme Status',
      viewNotices: 'View Notices',
      contactOfficials: 'Contact Officials',
      complaintCenter: 'Complaint Center',
      fileComplaintNow: 'File Complaint Now',
      complaintDescription: 'Report your issue via voice or text',
      loginToFile: 'Login to file complaints',
      demoDataNotice: 'This is demo data. Login for real data.',
      completeProfile: 'Complete Profile',
      profileIncomplete: 'Profile Incomplete',
      completeForSchemes: 'Complete your profile for government schemes',
      verifiedLocation: 'Verified Location',
      eligibleSchemes: 'Eligible Schemes',
      rating: 'Rating',
      yourComplaints: 'Your Complaints',
      resolvedIssues: 'Resolved Issues',
      inProgress: 'In Progress',
      governmentServices: 'Government Services',
      communityUpdates: 'Community Updates',
      importantAnnouncements: 'Important Announcements'
    },
    ur: {
      dashboard: 'ڈیش بورڈ',
      welcome: 'خوش آمدید',
      overview: 'خلاصہ',
      totalComplaints: 'کل شکایات',
      resolved: 'حل شدہ',
      pending: 'زیر التواء',
      activeSchemes: 'فعال اسکیمیں',
      villageStats: 'گاؤں کی معلومات',
      population: 'آبادی',
      lastLogin: 'آخری لاگ ان',
      quickActions: 'فوری اقدامات',
      fileNewComplaint: 'نئی شکایت درج کریں',
      checkSchemeStatus: 'اسکیم کی صورتحال دیکھیں',
      viewNotices: 'اطلاعات دیکھیں',
      contactOfficials: 'حکام سے رابطہ کریں',
      complaintCenter: 'شکایت مرکز',
      fileComplaintNow: 'ابھی شکایت درج کریں',
      complaintDescription: 'آواز یا ٹیکسٹ میں اپنا مسئلہ بتائیں',
      loginToFile: 'شکایت درج کرنے کے لیے لاگ ان کریں',
      demoDataNotice: 'یہ ڈیمو ڈیٹا ہے۔ حقیقی ڈیٹا کے لیے لاگ ان کریں۔',
      completeProfile: 'پروفائل مکمل کریں',
      profileIncomplete: 'پروفائل نامکمل',
      completeForSchemes: 'سرکاری اسکیموں کے لیے اپنا پروفائل مکمل کریں',
      verifiedLocation: 'تصدیق شدہ مقام',
      eligibleSchemes: 'اہل اسکیمیں',
      rating: 'درجہ بندی',
      yourComplaints: 'آپ کی شکایات',
      resolvedIssues: 'حل شدہ مسائل',
      inProgress: 'جاری',
      governmentServices: 'سرکاری خدمات',
      communityUpdates: 'کمیونٹی اپڈیٹس',
      importantAnnouncements: 'اہم اعلانات'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  // Check authentication and load user data
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setIsLoggedIn(!!currentUser);
    
    if (currentUser) {
      // Load real user data
      const userComplaintStats = complaintService.getUserComplaintStats(currentUser.id);
      
      // Get location data if profile is complete
      let locationInfo = null;
      let schemes = [];
      if (currentUser.state && currentUser.district && currentUser.village) {
        locationInfo = locationService.getLocationData(currentUser.state, currentUser.district, currentUser.village);
        const schemeEligibility = locationService.checkSchemeEligibility(currentUser);
        schemes = schemeEligibility.eligible;
        setEligibleSchemes(schemes);
        setLocationData(locationInfo);
      }
      
      setRealUserStats({
        totalComplaints: userComplaintStats.total,
        resolvedComplaints: userComplaintStats.resolved,
        pendingComplaints: userComplaintStats.submitted + userComplaintStats.under_review + userComplaintStats.in_progress,
        activeSchemes: schemes.length,
        villagePopulation: locationInfo ? locationInfo.population : 2500,
        lastLogin: new Date(currentUser.lastLogin).toLocaleDateString()
      });
    }
  }, [userInfo]);

  // Use real data if logged in, otherwise use demo data
  const displayStats = isLoggedIn && realUserStats ? realUserStats : stats;

  const StatCard = ({ icon, title, value, subtitle, color, onClick }) => (
    <div 
      className={`card-clean card-interactive p-6 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-display text-primary">{value}</p>
          <p className="text-caption text-muted">{subtitle}</p>
        </div>
      </div>
      <h3 className="text-body font-semibold text-secondary">{title}</h3>
    </div>
  );

  const ActionCard = ({ icon, title, description, onClick, color, prominent = false }) => (
    <button
      onClick={onClick}
      className={`card-clean card-interactive text-left w-full p-6 ${
        prominent ? 'bg-gradient-primary text-white' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${prominent ? 'bg-white/20' : color}`}>
          {React.cloneElement(icon, { 
            className: `icon-lg ${prominent ? 'text-white' : ''}` 
          })}
        </div>
        <div className="flex-1">
          <h3 className={`text-subheading font-semibold mb-2 ${
            prominent ? 'text-white' : 'text-primary'
          }`}>
            {title}
          </h3>
          <p className={`text-body ${
            prominent ? 'text-white/90' : 'text-secondary'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-clean-lg">
      {/* Welcome Header */}
      <div className="card-clean p-8 bg-gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display mb-2">{t.dashboard}</h1>
            <p className="text-body-lg mb-4">
              {t.welcome}, {isLoggedIn ? userInfo.name : 'उपयोगकर्ता'}
            </p>
            {isLoggedIn && userInfo.village && (
              <div className="flex items-center space-x-2 text-white/90">
                <MapPin className="icon-sm" />
                <span className="text-body">
                  {userInfo.village}, {userInfo.district}, {userInfo.state}
                </span>
                {locationData && (
                  <span className="bg-white/20 px-2 py-1 rounded-full text-caption font-semibold">
                    ✓ {t.verifiedLocation}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="bg-white/20 p-4 rounded-xl">
              <Home className="icon-2xl text-white mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Data Notice */}
      {!isLoggedIn && (
        <div className="card-clean border-l-4 border-yellow-400 bg-yellow-50">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="icon-lg text-yellow-600" />
            <div>
              <p className="text-body font-semibold text-yellow-800">{t.demoDataNotice}</p>
              <p className="text-caption text-yellow-700">
                {selectedLanguage === 'hi' && 'अपना वास्तविक डेटा देखने के लिए लॉगिन करें या साइन अप करें।'}
                {selectedLanguage === 'en' && 'Login or sign up to see your real data.'}
                {selectedLanguage === 'ur' && 'اپنا حقیقی ڈیٹا دیکھنے کے لیے لاگ ان یا سائن اپ کریں۔'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Completion Notice */}
      {isLoggedIn && (!userInfo.profileComplete || !locationData) && (
        <div className="card-clean border-l-4 border-blue-400 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="icon-lg text-blue-600" />
              <div>
                <p className="text-body font-semibold text-blue-800">{t.profileIncomplete}</p>
                <p className="text-caption text-blue-700">{t.completeForSchemes}</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileForm(true)}
              className="btn-primary"
            >
              {t.completeProfile}
            </button>
          </div>
        </div>
      )}

      {/* Prominent Complaint Center */}
      <div className="card-clean bg-gradient-danger text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Megaphone className="icon-xl text-white" />
              </div>
              <div>
                <h2 className="text-heading">{t.complaintCenter}</h2>
                <p className="text-body-lg text-white/90">{t.complaintDescription}</p>
              </div>
            </div>
          </div>
          <div>
            {isLoggedIn ? (
              <button
                onClick={() => onTabChange && onTabChange('complaints')}
                className="bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-all font-bold text-body-lg flex items-center space-x-2 shadow-clean"
              >
                <Plus className="icon-lg" />
                <span>{t.fileComplaintNow}</span>
              </button>
            ) : (
              <button
                onClick={() => onTabChange && onTabChange('home')}
                className="bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-all font-bold text-body-lg flex items-center space-x-2 shadow-clean"
              >
                <Users className="icon-lg" />
                <span>{t.loginToFile}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="icon-xl text-blue-600" />}
          title={t.totalComplaints}
          value={displayStats.totalComplaints}
          subtitle={isLoggedIn ? t.yourComplaints : "Demo data"}
          color="bg-blue-100"
          onClick={() => onTabChange && onTabChange('complaints')}
        />
        <StatCard
          icon={<CheckCircle className="icon-xl text-green-600" />}
          title={t.resolved}
          value={displayStats.resolvedComplaints}
          subtitle={isLoggedIn ? t.resolvedIssues : "Success rate"}
          color="bg-green-100"
        />
        <StatCard
          icon={<Clock className="icon-xl text-orange-600" />}
          title={t.pending}
          value={displayStats.pendingComplaints}
          subtitle={isLoggedIn ? t.inProgress : ""}
          color="bg-orange-100"
        />
        <StatCard
          icon={<Award className="icon-xl text-purple-600" />}
          title={t.activeSchemes}
          value={displayStats.activeSchemes}
          subtitle={t.eligibleSchemes}
          color="bg-purple-100"
          onClick={() => onTabChange && onTabChange('rights')}
        />
      </div>

      {/* Village Information */}
      <div className="card-clean">
        <h3 className="text-heading mb-6 flex items-center space-x-2">
          <MapPin className="icon-xl text-blue-600" />
          <span>{t.villageStats}</span>
          {locationData && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-caption font-semibold">
              {t.verifiedLocation}
            </span>
          )}
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <Users className="icon-2xl text-blue-600" />
              <div>
                <p className="text-body font-semibold text-blue-600">{t.population}</p>
                <p className="text-display text-blue-800">{displayStats.villagePopulation.toLocaleString()}</p>
                {locationData && (
                  <p className="text-caption text-blue-500 mt-1">
                    {locationData.district} {selectedLanguage === 'hi' ? 'जिला' : selectedLanguage === 'en' ? 'District' : 'ضلع'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <Star className="icon-2xl text-green-600" />
              <div>
                <p className="text-body font-semibold text-green-600">{t.rating}</p>
                <p className="text-display text-green-800">
                  {locationData ? `${locationData.rating}/5` : '4.2/5'}
                </p>
                {locationData && (
                  <p className="text-caption text-green-500 mt-1">
                    {selectedLanguage === 'hi' && 'सत्यापित डेटा'}
                    {selectedLanguage === 'en' && 'Verified Data'}
                    {selectedLanguage === 'ur' && 'تصدیق شدہ ڈیٹا'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Eligible Schemes */}
        {eligibleSchemes.length > 0 && (
          <div className="mt-6 bg-purple-50 rounded-xl p-6">
            <h4 className="text-subheading font-semibold text-purple-800 mb-4 flex items-center space-x-2">
              <Award className="icon-lg" />
              <span>{t.eligibleSchemes} ({eligibleSchemes.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibleSchemes.slice(0, 4).map((scheme, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                  <p className="text-body font-semibold text-purple-800">{scheme.name}</p>
                  <p className="text-caption text-purple-600">{scheme.benefits}</p>
                </div>
              ))}
            </div>
            {eligibleSchemes.length > 4 && (
              <button
                onClick={() => onTabChange && onTabChange('rights')}
                className="mt-4 text-purple-600 hover:text-purple-800 text-body font-semibold"
              >
                +{eligibleSchemes.length - 4} {selectedLanguage === 'hi' ? 'और देखें' : selectedLanguage === 'en' ? 'more' : 'مزید'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card-clean">
        <h3 className="text-heading mb-6">{t.quickActions}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            icon={<FileText />}
            title={t.fileNewComplaint}
            description={selectedLanguage === 'hi' ? 'आवाज़ या टेक्स्ट में शिकायत दर्ज करें' :
              selectedLanguage === 'en' ? 'File complaint via voice or text' :
                'آواز یا ٹیکسٹ میں شکایت درج کریں'}
            color="bg-red-100"
            onClick={() => onTabChange && onTabChange('complaints')}
            prominent={true}
          />
          <ActionCard
            icon={<Award />}
            title={t.checkSchemeStatus}
            description={selectedLanguage === 'hi' ? 'सरकारी योजनाओं की स्थिति देखें' :
              selectedLanguage === 'en' ? 'Check government scheme status' :
                'سرکاری اسکیموں کی صورتحال دیکھیں'}
            color="bg-blue-100"
            onClick={() => onTabChange && onTabChange('rights')}
          />
          <ActionCard
            icon={<Calendar />}
            title={t.viewNotices}
            description={selectedLanguage === 'hi' ? 'पंचायत की सूचनाएं और घोषणाएं' :
              selectedLanguage === 'en' ? 'Panchayat notices and announcements' :
                'پنچایت کی اطلاعات اور اعلانات'}
            color="bg-green-100"
            onClick={() => onTabChange && onTabChange('gramvaani')}
          />
          <ActionCard
            icon={<span className="text-3xl">📞</span>}
            title={t.contactOfficials}
            description={selectedLanguage === 'hi' ? 'सरपंच, तहसीलदार, कलेक्टर से संपर्क करें' :
              selectedLanguage === 'en' ? 'Contact Sarpanch, Tehsildar, Collector' :
                'سرپنچ، تحصیلدار، کلکٹر سے رابطہ کریں'}
            color="bg-purple-100"
            onClick={() => setShowOfficialsContact(true)}
          />
        </div>
      </div>

      {/* User Profile Form Modal */}
      <UserProfileForm
        isOpen={showProfileForm}
        onClose={() => setShowProfileForm(false)}
        userInfo={userInfo}
        selectedLanguage={selectedLanguage}
        onSuccess={(updatedUser) => {
          setUserInfo(updatedUser);
          window.location.reload();
        }}
      />

      {/* Officials Contact Modal */}
      <OfficialsContact
        isOpen={showOfficialsContact}
        onClose={() => setShowOfficialsContact(false)}
        userInfo={userInfo}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
};

export default ImprovedDashboard;