import React, { useState } from 'react';
import { X, FileText, Mic, MicOff, Send, AlertTriangle } from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { authService } from '../services/authService';
import { speechService } from '../services/speechService';

const QuickComplaintForm = ({ isOpen, onClose, selectedLanguage, onSuccess }) => {
  const [complaint, setComplaint] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const translations = {
    hi: {
      quickComplaint: 'त्वरित शिकायत',
      title: 'शीर्षक',
      titlePlaceholder: 'संक्षेप में समस्या बताएं',
      description: 'विवरण',
      descriptionPlaceholder: 'विस्तार से बताएं...',
      category: 'श्रेणी',
      selectCategory: 'श्रेणी चुनें',
      priority: 'प्राथमिकता',
      submit: 'शिकायत दर्ज करें',
      cancel: 'रद्द करें',
      recording: 'रिकॉर्डिंग...',
      submitting: 'दर्ज हो रही है...',
      infrastructure: 'बुनियादी ढांचा',
      water: 'पानी',
      electricity: 'बिजली',
      health: 'स्वास्थ्य',
      education: 'शिक्षा',
      other: 'अन्य',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'निम्न'
    },
    en: {
      quickComplaint: 'Quick Complaint',
      title: 'Title',
      titlePlaceholder: 'Brief description of the issue',
      description: 'Description',
      descriptionPlaceholder: 'Describe in detail...',
      category: 'Category',
      selectCategory: 'Select Category',
      priority: 'Priority',
      submit: 'File Complaint',
      cancel: 'Cancel',
      recording: 'Recording...',
      submitting: 'Submitting...',
      infrastructure: 'Infrastructure',
      water: 'Water',
      electricity: 'Electricity',
      health: 'Health',
      education: 'Education',
      other: 'Other',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    ur: {
      quickComplaint: 'فوری شکایت',
      title: 'عنوان',
      titlePlaceholder: 'مسئلے کا مختصر تذکرہ',
      description: 'تفصیل',
      descriptionPlaceholder: 'تفصیل سے بتائیں...',
      category: 'قسم',
      selectCategory: 'قسم منتخب کریں',
      priority: 'ترجیح',
      submit: 'شکایت درج کریں',
      cancel: 'منسوخ کریں',
      recording: 'ریکارڈنگ...',
      submitting: 'جمع ہو رہا ہے...',
      infrastructure: 'بنیادی ڈھانچہ',
      water: 'پانی',
      electricity: 'بجلی',
      health: 'صحت',
      education: 'تعلیم',
      other: 'دیگر',
      high: 'اعلیٰ',
      medium: 'درمیانہ',
      low: 'کم'
    }
  };

  const t = translations[selectedLanguage] || translations.hi;

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      speechService.stopRecording();
    } else {
      setIsRecording(true);
      try {
        await speechService.startSpeechRecognition(
          selectedLanguage,
          (transcript, isFinal) => {
            if (isFinal) {
              setComplaint(prev => ({
                ...prev,
                description: prev.description + ' ' + transcript
              }));
            }
          },
          (error) => {
            console.error('Speech recognition error:', error);
            setIsRecording(false);
          }
        );
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!complaint.title || !complaint.description || !complaint.category) {
      setError(
        selectedLanguage === 'hi' ? 'कृपया सभी आवश्यक फील्ड भरें' :
        selectedLanguage === 'en' ? 'Please fill in all required fields' :
        'براہ کرم تمام ضروری فیلڈز بھریں'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not logged in');
      }

      const complaintData = {
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        location: `${currentUser.village}, ${currentUser.district}, ${currentUser.state}`,
        contactNumber: currentUser.mobile
      };

      const result = await complaintService.fileComplaint(complaintData, currentUser.id);

      if (result.success) {
        onSuccess && onSuccess(result.complaint);
        setComplaint({ title: '', description: '', category: '', priority: 'medium' });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{t.quickComplaint}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">{t.title}</label>
            <input
              type="text"
              value={complaint.title}
              onChange={(e) => setComplaint(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder={t.titlePlaceholder}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">{t.description}</label>
            <div className="relative">
              <textarea
                value={complaint.description}
                onChange={(e) => setComplaint(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all h-24 resize-none"
                placeholder={t.descriptionPlaceholder}
                required
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                  isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            {isRecording && (
              <p className="text-sm text-red-600 mt-1 flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{t.recording}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">{t.category}</label>
              <select
                value={complaint.category}
                onChange={(e) => setComplaint(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                required
              >
                <option value="">{t.selectCategory}</option>
                <option value="infrastructure">{t.infrastructure}</option>
                <option value="water">{t.water}</option>
                <option value="electricity">{t.electricity}</option>
                <option value="health">{t.health}</option>
                <option value="education">{t.education}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">{t.priority}</label>
              <select
                value={complaint.priority}
                onChange={(e) => setComplaint(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              >
                <option value="low">{t.low}</option>
                <option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold transform hover:scale-105 flex items-center justify-center space-x-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t.submitting : t.submit}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickComplaintForm;