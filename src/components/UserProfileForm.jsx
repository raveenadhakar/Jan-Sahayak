import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Phone, Mail, Home, Briefcase, DollarSign, Calendar, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { locationService } from '../services/locationService';
import { authService } from '../services/authService';

const UserProfileForm = ({ isOpen, onClose, userInfo, selectedLanguage, onSuccess }) => {
  const [profile, setProfile] = useState({
    name: '',
    mobile: '',
    email: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    village: '',
    areaType: 'rural',
    occupation: '',
    annualIncome: '',
    familySize: '',
    landOwnership: '',
    houseOwnership: '',
    bankAccount: 'yes',
    aadhaar: 'yes',
    rationCard: 'yes'
  });
  
  const [searchResults, setSearchResults] = useState({
    states: [],
    districts: [],
    villages: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const translations = {
    hi: {
      completeProfile: 'प्रोफाइल पूरी करें',
      personalInfo: 'व्यक्तिगत जानकारी',
      locationInfo: 'स्थान की जानकारी',
      economicInfo: 'आर्थिक जानकारी',
      documentsInfo: 'दस्तावेज़ की जानकारी',
      name: 'पूरा नाम',
      mobile: 'मोबाइल नंबर',
      email: 'ईमेल (वैकल्पिक)',
      age: 'उम्र',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      state: 'राज्य',
      district: 'जिला',
      village: 'गांव/शहर',
      areaType: 'क्षेत्र का प्रकार',
      rural: 'ग्रामीण',
      urban: 'शहरी',
      occupation: 'व्यवसाय',
      farmer: 'किसान',
      laborer: 'मजदूर',
      business: 'व्यापार',
      service: 'नौकरी',
      student: 'छात्र',
      unemployed: 'बेरोजगार',
      annualIncome: 'वार्षिक आय (₹)',
      familySize: 'परिवार के सदस्य',
      landOwnership: 'भूमि का मालिक',
      houseOwnership: 'पक्का घर का मालिक',
      bankAccount: 'बैंक खाता',
      aadhaar: 'आधार कार्ड',
      rationCard: 'राशन कार्ड',
      yes: 'हाँ',
      no: 'नहीं',
      next: 'आगे',
      previous: 'पिछला',
      submit: 'सबमिट करें',
      cancel: 'रद्द करें',
      submitting: 'सबमिट हो रहा है...',
      searchLocation: 'स्थान खोजें...',
      profileCompletion: 'प्रोफाइल पूर्णता',
      whyNeeded: 'यह जानकारी क्यों चाहिए?',
      schemeEligibility: 'सरकारी योजनाओं की पात्रता जांचने के लिए',
      personalizedServices: 'व्यक्तिगत सेवाएं प्रदान करने के लिए',
      dataSecure: 'आपका डेटा सुरक्षित है और केवल योजनाओं के लिए उपयोग होगा'
    },
    en: {
      completeProfile: 'Complete Profile',
      personalInfo: 'Personal Information',
      locationInfo: 'Location Information',
      economicInfo: 'Economic Information',
      documentsInfo: 'Documents Information',
      name: 'Full Name',
      mobile: 'Mobile Number',
      email: 'Email (Optional)',
      age: 'Age',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      state: 'State',
      district: 'District',
      village: 'Village/City',
      areaType: 'Area Type',
      rural: 'Rural',
      urban: 'Urban',
      occupation: 'Occupation',
      farmer: 'Farmer',
      laborer: 'Laborer',
      business: 'Business',
      service: 'Service',
      student: 'Student',
      unemployed: 'Unemployed',
      annualIncome: 'Annual Income (₹)',
      familySize: 'Family Members',
      landOwnership: 'Land Owner',
      houseOwnership: 'Pucca House Owner',
      bankAccount: 'Bank Account',
      aadhaar: 'Aadhaar Card',
      rationCard: 'Ration Card',
      yes: 'Yes',
      no: 'No',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      cancel: 'Cancel',
      submitting: 'Submitting...',
      searchLocation: 'Search location...',
      profileCompletion: 'Profile Completion',
      whyNeeded: 'Why is this information needed?',
      schemeEligibility: 'To check eligibility for government schemes',
      personalizedServices: 'To provide personalized services',
      dataSecure: 'Your data is secure and used only for schemes'
    },
    ur: {
      completeProfile: 'پروفائل مکمل کریں',
      personalInfo: 'ذاتی معلومات',
      locationInfo: 'مقام کی معلومات',
      economicInfo: 'اقتصادی معلومات',
      documentsInfo: 'دستاویزات کی معلومات',
      name: 'پورا نام',
      mobile: 'موبائل نمبر',
      email: 'ای میل (اختیاری)',
      age: 'عمر',
      gender: 'جنس',
      male: 'مرد',
      female: 'عورت',
      other: 'دیگر',
      state: 'ریاست',
      district: 'ضلع',
      village: 'گاؤں/شہر',
      areaType: 'علاقے کی قسم',
      rural: 'دیہی',
      urban: 'شہری',
      occupation: 'پیشہ',
      farmer: 'کسان',
      laborer: 'مزدور',
      business: 'کاروبار',
      service: 'نوکری',
      student: 'طالب علم',
      unemployed: 'بے روزگار',
      annualIncome: 'سالانہ آمدنی (₹)',
      familySize: 'خاندان کے افراد',
      landOwnership: 'زمین کا مالک',
      houseOwnership: 'پکے گھر کا مالک',
      bankAccount: 'بینک اکاؤنٹ',
      aadhaar: 'آدھار کارڈ',
      rationCard: 'راشن کارڈ',
      yes: 'ہاں',
      no: 'نہیں',
      next: 'اگلا',
      previous: 'پچھلا',
      submit: 'جمع کریں',
      cancel: 'منسوخ کریں',
      submitting: 'جمع ہو رہا ہے...',
      searchLocation: 'مقام تلاش کریں...',
      profileCompletion: 'پروفائل کی تکمیل',
      whyNeeded: 'یہ معلومات کیوں درکار ہیں؟',
      schemeEligibility: 'سرکاری اسکیموں کی اہلیت چیک کرنے کے لیے',
      personalizedServices: 'ذاتی خدمات فراہم کرنے کے لیے',
      dataSecure: 'آپ کا ڈیٹا محفوظ ہے اور صرف اسکیموں کے لیے استعمال ہوگا'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  // Load existing user data
  useEffect(() => {
    if (userInfo && isOpen) {
      setProfile(prev => ({
        ...prev,
        name: userInfo.name || '',
        mobile: userInfo.mobile || '',
        email: userInfo.email || '',
        age: userInfo.age || '',
        gender: userInfo.gender || '',
        state: userInfo.state || '',
        district: userInfo.district || '',
        village: userInfo.village || '',
        areaType: userInfo.areaType || 'rural',
        occupation: userInfo.occupation || '',
        annualIncome: userInfo.annualIncome || '',
        familySize: userInfo.familySize || '',
        landOwnership: userInfo.landOwnership || '',
        houseOwnership: userInfo.houseOwnership || '',
        bankAccount: userInfo.bankAccount || 'yes',
        aadhaar: userInfo.aadhaar || 'yes',
        rationCard: userInfo.rationCard || 'yes'
      }));
    }
  }, [userInfo, isOpen]);

  // Calculate completion percentage
  useEffect(() => {
    const requiredFields = ['name', 'mobile', 'age', 'gender', 'state', 'district', 'village', 'occupation', 'annualIncome', 'familySize'];
    const completedFields = requiredFields.filter(field => profile[field] && profile[field].toString().trim() !== '');
    setCompletionPercentage(Math.round((completedFields.length / requiredFields.length) * 100));
  }, [profile]);

  // Load location data
  useEffect(() => {
    setSearchResults({
      states: locationService.getStates(),
      districts: profile.state ? locationService.getDistricts(profile.state) : [],
      villages: profile.state && profile.district ? locationService.getVillages(profile.state, profile.district) : []
    });
  }, [profile.state, profile.district]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate location
      const locationValidation = locationService.validateLocation(profile.state, profile.district, profile.village);
      if (!locationValidation.isValid) {
        throw new Error(locationValidation.errors.join(', '));
      }

      // Update user profile
      const result = await authService.updateProfile({
        ...profile,
        profileComplete: true,
        profileCompletedAt: new Date().toISOString()
      });

      if (result.success) {
        onSuccess && onSuccess(result.user);
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-500" />
              <span>{t.personalInfo}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.name} *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.mobile} *</label>
                <input
                  type="tel"
                  value={profile.mobile}
                  onChange={(e) => setProfile(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.email}</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.age} *</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  min="1"
                  max="120"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.gender} *</label>
                <div className="flex space-x-4">
                  {['male', 'female', 'other'].map(gender => (
                    <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={profile.gender === gender}
                        onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span>{t[gender]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <span>{t.locationInfo}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.state} *</label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value, district: '', village: '' }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select State</option>
                  {searchResults.states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.district} *</label>
                <select
                  value={profile.district}
                  onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value, village: '' }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  disabled={!profile.state}
                >
                  <option value="">Select District</option>
                  {searchResults.districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.village} *</label>
                <select
                  value={profile.village}
                  onChange={(e) => setProfile(prev => ({ ...prev, village: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  disabled={!profile.district}
                >
                  <option value="">Select Village/City</option>
                  {searchResults.villages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.areaType} *</label>
                <div className="flex space-x-4">
                  {['rural', 'urban'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="areaType"
                        value={type}
                        checked={profile.areaType === type}
                        onChange={(e) => setProfile(prev => ({ ...prev, areaType: e.target.value }))}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span>{t[type]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {profile.state && profile.district && profile.village && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Location Verified</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  {profile.village}, {profile.district}, {profile.state}
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-purple-500" />
              <span>{t.economicInfo}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.occupation} *</label>
                <select
                  value={profile.occupation}
                  onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Occupation</option>
                  {['farmer', 'laborer', 'business', 'service', 'student', 'unemployed'].map(occ => (
                    <option key={occ} value={occ}>{t[occ]}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.annualIncome} *</label>
                <input
                  type="number"
                  value={profile.annualIncome}
                  onChange={(e) => setProfile(prev => ({ ...prev, annualIncome: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.familySize} *</label>
                <input
                  type="number"
                  value={profile.familySize}
                  onChange={(e) => setProfile(prev => ({ ...prev, familySize: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  min="1"
                  max="20"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.landOwnership}</label>
                <div className="flex space-x-4">
                  {['yes', 'no'].map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="landOwnership"
                        value={option}
                        checked={profile.landOwnership === option}
                        onChange={(e) => setProfile(prev => ({ ...prev, landOwnership: e.target.value }))}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span>{t[option]}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.houseOwnership}</label>
                <div className="flex space-x-4">
                  {['yes', 'no'].map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="houseOwnership"
                        value={option}
                        checked={profile.houseOwnership === option}
                        onChange={(e) => setProfile(prev => ({ ...prev, houseOwnership: e.target.value }))}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span>{t[option]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-orange-500" />
              <span>{t.documentsInfo}</span>
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'bankAccount', label: t.bankAccount },
                { key: 'aadhaar', label: t.aadhaar },
                { key: 'rationCard', label: t.rationCard }
              ].map(({ key, label }) => (
                <div key={key} className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
                  <div className="flex space-x-4">
                    {['yes', 'no'].map(option => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          value={option}
                          checked={profile[key] === option}
                          onChange={(e) => setProfile(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-4 h-4 text-blue-500"
                        />
                        <span>{t[option]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">{t.whyNeeded}</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• {t.schemeEligibility}</li>
                <li>• {t.personalizedServices}</li>
                <li>• {t.dataSecure}</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.completeProfile}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">{t.profileCompletion}</span>
            <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          {[1, 2, 3, 4].map(stepNum => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 4 && (
                <div className={`w-12 h-1 ${step > stepNum ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                step === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t.previous}
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold"
              >
                {t.next}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || completionPercentage < 80}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                  isSubmitting || completionPercentage < 80
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{isSubmitting ? t.submitting : t.submit}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;