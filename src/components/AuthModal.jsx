import React, { useState } from 'react';
import { 
  Users, LogIn, UserPlus, X, AlertTriangle, CheckCircle,
  Phone, MapPin, Building2, User, Eye, EyeOff
} from 'lucide-react';
import { authService } from '../services/authService';

const AuthModal = ({ isOpen, onClose, onSuccess, selectedLanguage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuggestions, setShowSuggestions] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: '',
    district: '',
    state: ''
  });

  const translations = {
    hi: {
      login: 'लॉगिन',
      signup: 'साइन अप',
      welcome: 'स्वागत है',
      createAccount: 'नया खाता बनाएं',
      existingUser: 'पहले से खाता है?',
      newUser: 'नया उपयोगकर्ता?',
      loginHere: 'यहाँ लॉगिन करें',
      signupHere: 'यहाँ साइन अप करें',
      name: 'पूरा नाम',
      mobile: 'मोबाइल नंबर',
      village: 'गांव',
      district: 'जिला',
      state: 'राज्य',
      enterName: 'अपना पूरा नाम लिखें',
      enterMobile: 'मोबाइल नंबर दर्ज करें',
      enterVillage: 'गांव का नाम लिखें',
      enterDistrict: 'जिला का नाम लिखें',
      enterState: 'राज्य का नाम लिखें',
      submit: 'सबमिट',
      cancel: 'रद्द करें',
      processing: 'प्रक्रिया जारी...',
      loginSuccess: 'सफलतापूर्वक लॉगिन हुए!',
      signupSuccess: 'खाता सफलतापूर्वक बनाया गया!',
      mobileLogin: 'मोबाइल से लॉगिन करें'
    },
    en: {
      login: 'Login',
      signup: 'Sign Up',
      welcome: 'Welcome',
      createAccount: 'Create New Account',
      existingUser: 'Already have an account?',
      newUser: 'New user?',
      loginHere: 'Login here',
      signupHere: 'Sign up here',
      name: 'Full Name',
      mobile: 'Mobile Number',
      village: 'Village',
      district: 'District',
      state: 'State',
      enterName: 'Enter your full name',
      enterMobile: 'Enter mobile number',
      enterVillage: 'Enter village name',
      enterDistrict: 'Enter district name',
      enterState: 'Enter state name',
      submit: 'Submit',
      cancel: 'Cancel',
      processing: 'Processing...',
      loginSuccess: 'Login successful!',
      signupSuccess: 'Account created successfully!',
      mobileLogin: 'Login with Mobile'
    },
    ur: {
      login: 'لاگ ان',
      signup: 'سائن اپ',
      welcome: 'خوش آمدید',
      createAccount: 'نیا اکاؤنٹ بنائیں',
      existingUser: 'پہلے سے اکاؤنٹ ہے؟',
      newUser: 'نیا صارف؟',
      loginHere: 'یہاں لاگ ان کریں',
      signupHere: 'یہاں سائن اپ کریں',
      name: 'پورا نام',
      mobile: 'موبائل نمبر',
      village: 'گاؤں',
      district: 'ضلع',
      state: 'ریاست',
      enterName: 'اپنا پورا نام لکھیں',
      enterMobile: 'موبائل نمبر درج کریں',
      enterVillage: 'گاؤں کا نام لکھیں',
      enterDistrict: 'ضلع کا نام لکھیں',
      enterState: 'ریاست کا نام لکھیں',
      submit: 'جمع کریں',
      cancel: 'منسوخ کریں',
      processing: 'عمل جاری...',
      loginSuccess: 'کامیابی سے لاگ ان ہوئے!',
      signupSuccess: 'اکاؤنٹ کامیابی سے بنایا گیا!',
      mobileLogin: 'موبائل سے لاگ ان کریں'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    
    // Show suggestions for location fields
    if (['village', 'district', 'state'].includes(field) && value.length >= 2) {
      const suggestions = authService.getSuggestions(field === 'village' ? 'villages' : field === 'district' ? 'districts' : 'states', value);
      setShowSuggestions(prev => ({ ...prev, [field]: suggestions }));
    } else {
      setShowSuggestions(prev => ({ ...prev, [field]: [] }));
    }
  };

  const selectSuggestion = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowSuggestions(prev => ({ ...prev, [field]: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (isLogin) {
        result = await authService.login(formData.mobile);
      } else {
        result = await authService.signup(formData);
      }

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onSuccess(result.user);
          onClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform border-4 border-blue-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-2xl">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  🇮🇳
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isLogin ? t.welcome : t.createAccount}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isLogin ? t.mobileLogin : 'जन सहायक में शामिल हों'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Toggle Login/Signup */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl transition-all font-bold ${
                isLogin 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LogIn className="w-5 h-5 inline mr-2" />
              {t.login}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl transition-all font-bold ${
                !isLogin 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              {t.signup}
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-2xl text-red-800 flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border-2 border-green-300 rounded-2xl text-green-800 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (only for signup) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  <User className="w-4 h-4 inline mr-2" />
                  {t.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                  placeholder={t.enterName}
                  required={!isLogin}
                />
              </div>
            )}

            {/* Mobile field */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                <Phone className="w-4 h-4 inline mr-2" />
                {t.mobile}
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                placeholder={t.enterMobile}
                pattern="[6-9][0-9]{9}"
                maxLength="10"
                required
              />
            </div>

            {/* Location fields (only for signup) */}
            {!isLogin && (
              <>
                {/* Village */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {t.village}
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder={t.enterVillage}
                    required
                  />
                  {showSuggestions.village?.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                      {showSuggestions.village.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSuggestion('village', suggestion)}
                          className="w-full text-left p-3 hover:bg-blue-50 transition-all border-b border-gray-100 last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* District */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    {t.district}
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder={t.enterDistrict}
                    required
                  />
                  {showSuggestions.district?.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                      {showSuggestions.district.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSuggestion('district', suggestion)}
                          className="w-full text-left p-3 hover:bg-blue-50 transition-all border-b border-gray-100 last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* State */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {t.state}
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder={t.enterState}
                    required
                  />
                  {showSuggestions.state?.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                      {showSuggestions.state.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSuggestion('state', suggestion)}
                          className="w-full text-left p-3 hover:bg-blue-50 transition-all border-b border-gray-100 last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all font-bold text-gray-700 text-lg"
                disabled={isLoading}
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.processing}</span>
                  </div>
                ) : (
                  t.submit
                )}
              </button>
            </div>
          </form>

          {/* Toggle Link */}
          <div className="text-center mt-6 p-4 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 text-sm">
              {isLogin ? t.newUser : t.existingUser}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setFormData({ name: '', mobile: '', village: '', district: '', state: '' });
                }}
                className="ml-2 text-blue-600 font-bold hover:text-blue-800 transition-all"
              >
                {isLogin ? t.signupHere : t.loginHere}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;