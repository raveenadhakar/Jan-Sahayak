import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, FileText, CheckCircle, AlertTriangle, 
  Calendar, MapPin, Phone, Mail, Clock, Star, Award
} from 'lucide-react';

const Dashboard = ({ userInfo, selectedLanguage }) => {
  const [stats, setStats] = useState({
    totalComplaints: 12,
    resolvedComplaints: 8,
    pendingComplaints: 4,
    activeSchemes: 6,
    villagePopulation: 2500,
    lastLogin: new Date().toLocaleDateString()
  });

  const translations = {
    hi: {
      dashboard: 'डैशबोर्ड',
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
      contactOfficials: 'अधिकारियों से संपर्क करें'
    },
    en: {
      dashboard: 'Dashboard',
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
      contactOfficials: 'Contact Officials'
    },
    ur: {
      dashboard: 'ڈیش بورڈ',
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
      contactOfficials: 'حکام سے رابطہ کریں'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  const StatCard = ({ icon, title, value, color, trend }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">{trend}</span>
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon, title, description, onClick, color }) => (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left w-full border-l-4 ${color}`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full bg-gradient-to-br ${color.replace('border-l-', 'from-').replace('-500', '-400')} to-${color.split('-')[1]}-600`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t.dashboard}</h2>
            <p className="text-blue-100">
              {selectedLanguage === 'hi' && `स्वागत है, ${userInfo.name}`}
              {selectedLanguage === 'en' && `Welcome, ${userInfo.name}`}
              {selectedLanguage === 'ur' && `خوش آمدید، ${userInfo.name}`}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-blue-200">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{userInfo.village}, {userInfo.district}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{t.lastLogin}: {stats.lastLogin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          title={t.totalComplaints}
          value={stats.totalComplaints}
          color="from-blue-500 to-blue-600"
          trend="+2 this month"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title={t.resolved}
          value={stats.resolvedComplaints}
          color="from-green-500 to-green-600"
          trend="67% success rate"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          title={t.pending}
          value={stats.pendingComplaints}
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          title={t.activeSchemes}
          value={stats.activeSchemes}
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Village Information */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-500" />
          <span>{t.villageStats}</span>
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-blue-600 font-semibold">{t.population}</p>
                <p className="text-2xl font-bold text-blue-800">{stats.villagePopulation.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-green-600 font-semibold">
                  {selectedLanguage === 'hi' && 'रेटिंग'}
                  {selectedLanguage === 'en' && 'Rating'}
                  {selectedLanguage === 'ur' && 'درجہ بندی'}
                </p>
                <p className="text-2xl font-bold text-green-800">4.2/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{t.quickActions}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            icon={<FileText className="w-6 h-6 text-white" />}
            title={t.fileNewComplaint}
            description={selectedLanguage === 'hi' ? 'आवाज़ या टेक्स्ट में शिकायत दर्ज करें' : 
                        selectedLanguage === 'en' ? 'File complaint via voice or text' :
                        'آواز یا ٹیکسٹ میں شکایت درج کریں'}
            color="border-l-red-500"
            onClick={() => {}}
          />
          <QuickActionCard
            icon={<Award className="w-6 h-6 text-white" />}
            title={t.checkSchemeStatus}
            description={selectedLanguage === 'hi' ? 'सरकारी योजनाओं की स्थिति देखें' : 
                        selectedLanguage === 'en' ? 'Check government scheme status' :
                        'سرکاری اسکیموں کی صورتحال دیکھیں'}
            color="border-l-blue-500"
            onClick={() => {}}
          />
          <QuickActionCard
            icon={<Calendar className="w-6 h-6 text-white" />}
            title={t.viewNotices}
            description={selectedLanguage === 'hi' ? 'पंचायत की सूचनाएं और घोषणाएं' : 
                        selectedLanguage === 'en' ? 'Panchayat notices and announcements' :
                        'پنچایت کی اطلاعات اور اعلانات'}
            color="border-l-green-500"
            onClick={() => {}}
          />
          <QuickActionCard
            icon={<Phone className="w-6 h-6 text-white" />}
            title={t.contactOfficials}
            description={selectedLanguage === 'hi' ? 'सरकारी अधिकारियों से संपर्क करें' : 
                        selectedLanguage === 'en' ? 'Contact government officials' :
                        'سرکاری حکام سے رابطہ کریں'}
            color="border-l-purple-500"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;