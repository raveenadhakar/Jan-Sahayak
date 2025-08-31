import React, { useState, useEffect } from 'react';
import {
    Mic, MicOff, FileText, CheckCircle, AlertTriangle,
    X, Calendar, User, MessageSquare, Eye, LogIn, RefreshCw
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { sharedComplaintService } from '../services/sharedComplaintService';
import { authService } from '../services/authService';

const ComplaintsManager = ({ userInfo, selectedLanguage, onTabChange, onComplaintSuccess, setUserInfo }) => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewComplaint, setShowNewComplaint] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [newComplaint, setNewComplaint] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        images: []
    });
    const [filter, setFilter] = useState('all');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    // Translations
    const translations = {
        hi: {
            complaints: 'शिकायतें',
            newComplaint: 'नई शिकायत',
            myComplaints: 'मेरी शिकायतें',
            fileComplaint: 'शिकायत दर्ज करें',
            title: 'शीर्षक',
            description: 'विवरण',
            category: 'श्रेणी',
            priority: 'प्राथमिकता',
            status: 'स्थिति',
            date: 'दिनांक',
            assignedTo: 'सौंपा गया',
            updates: 'अपडेट',
            submit: 'सबमिट करें',
            cancel: 'रद्द करें',
            recording: 'रिकॉर्डिंग...',
            startRecording: 'रिकॉर्डिंग शुरू करें',
            stopRecording: 'रिकॉर्डिंग बंद करें',
            attachImage: 'फोटो जोड़ें',
            viewDetails: 'विवरण देखें',
            all: 'सभी',
            submitted: 'दर्ज की गई',
            under_review: 'समीक्षा में',
            in_progress: 'प्रगति में',
            resolved: 'हल हुई',
            closed: 'बंद',
            rejected: 'अस्वीकृत',
            high: 'उच्च',
            medium: 'मध्यम',
            low: 'निम्न',
            infrastructure: 'बुनियादी ढांचा',
            water: 'पानी',
            electricity: 'बिजली',
            health: 'स्वास्थ्य',
            education: 'शिक्षा',
            other: 'अन्य',
            loadingComplaints: 'शिकायतें लोड हो रही हैं...',
            loadingError: 'शिकायतें लोड करने में त्रुटि',
            retry: 'पुनः प्रयास करें'
        },
        en: {
            complaints: 'Complaints',
            newComplaint: 'New Complaint',
            myComplaints: 'My Complaints',
            fileComplaint: 'File Complaint',
            title: 'Title',
            description: 'Description',
            category: 'Category',
            priority: 'Priority',
            status: 'Status',
            date: 'Date',
            assignedTo: 'Assigned To',
            updates: 'Updates',
            submit: 'Submit',
            cancel: 'Cancel',
            recording: 'Recording...',
            startRecording: 'Start Recording',
            stopRecording: 'Stop Recording',
            attachImage: 'Attach Image',
            viewDetails: 'View Details',
            all: 'All',
            submitted: 'Submitted',
            under_review: 'Under Review',
            in_progress: 'In Progress',
            resolved: 'Resolved',
            closed: 'Closed',
            rejected: 'Rejected',
            high: 'High',
            medium: 'Medium',
            low: 'Low',
            infrastructure: 'Infrastructure',
            water: 'Water',
            electricity: 'Electricity',
            health: 'Health',
            education: 'Education',
            other: 'Other',
            loadingComplaints: 'Loading complaints...',
            loadingError: 'Failed to load complaints',
            retry: 'Retry'
        },
        ur: {
            complaints: 'شکایات',
            newComplaint: 'نئی شکایت',
            myComplaints: 'میری شکایات',
            fileComplaint: 'شکایت درج کریں',
            title: 'عنوان',
            description: 'تفصیل',
            category: 'قسم',
            priority: 'ترجیح',
            status: 'صورتحال',
            date: 'تاریخ',
            assignedTo: 'تفویض کردہ',
            updates: 'اپ ڈیٹس',
            submit: 'جمع کریں',
            cancel: 'منسوخ کریں',
            recording: 'ریکارڈنگ...',
            startRecording: 'ریکارڈنگ شروع کریں',
            stopRecording: 'ریکارڈنگ بند کریں',
            attachImage: 'تصویر منسلک کریں',
            viewDetails: 'تفصیلات دیکھیں',
            all: 'تمام',
            submitted: 'جمع شدہ',
            under_review: 'جائزہ میں',
            in_progress: 'جاری',
            resolved: 'حل شدہ',
            closed: 'بند',
            rejected: 'مسترد',
            high: 'اعلیٰ',
            medium: 'درمیانہ',
            low: 'کم',
            infrastructure: 'بنیادی ڈھانچہ',
            water: 'پانی',
            electricity: 'بجلی',
            health: 'صحت',
            education: 'تعلیم',
            other: 'دیگر',
            loadingComplaints: 'شکایات لوڈ ہو رہی ہیں...',
            loadingError: 'شکایات لوڈ کرنے میں خرابی',
            retry: 'دوبارہ کوشش کریں'
        }
    };

    const t = translations[selectedLanguage] || translations.hi;
    // Check if user is logged in
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setIsLoggedIn(!!currentUser);
        if (currentUser) {
            loadUserComplaints(currentUser.id);
            
            // Add real-time listener for complaint updates
            const unsubscribe = sharedComplaintService.addListener(() => {
                loadUserComplaints(currentUser.id);
            });
            
            return unsubscribe;
        } else {
            setIsLoading(false);
        }
    }, [userInfo]);

    const loadUserComplaints = async (userId) => {
        setIsLoading(true);
        setError(null);
        try {
            const userComplaints = sharedComplaintService.getUserComplaints(userId);
            setComplaints(userComplaints);
        } catch (error) {
            console.error('Error loading complaints:', error);
            setError('Failed to load complaints');
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const toggleRecording = async () => {
        if (isRecording) {
            setIsRecording(false);
            speechService.stopRecording();
        } else {
            setIsRecording(true);
            try {
                const recognition = await speechService.startSpeechRecognition(
                    selectedLanguage,
                    (transcript, isFinal) => {
                        setTranscript(transcript);
                        if (isFinal) {
                            setNewComplaint(prev => ({
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
    const handleSubmitComplaint = async () => {
        if (!newComplaint.title || !newComplaint.description || !newComplaint.category) {
            showNotification('error',
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
                title: newComplaint.title,
                description: newComplaint.description,
                category: newComplaint.category,
                priority: newComplaint.priority,
                location: `${currentUser.village}, ${currentUser.district}, ${currentUser.state}`,
                contactNumber: currentUser.mobile,
                attachments: newComplaint.images || []
            };

            const result = sharedComplaintService.addComplaint(complaintData, currentUser.id);

            if (result.success) {
                showNotification('success',
                    selectedLanguage === 'hi' ? `शिकायत सफलतापूर्वक दर्ज की गई! शिकायत संख्या: ${result.complaint.id}` :
                        selectedLanguage === 'en' ? `Complaint filed successfully! Complaint ID: ${result.complaint.id}` :
                            `شکایت کامیابی سے درج کی گئی! شکایت نمبر: ${result.complaint.id}`
                );

                setNewComplaint({ title: '', description: '', category: '', priority: 'medium', images: [] });
                setShowNewComplaint(false);
                loadUserComplaints(currentUser.id);

                if (onComplaintSuccess) {
                    onComplaintSuccess(result.complaint);
                }

                setTimeout(async () => {
                    try {
                        const aiResponse = await geminiService.processVoiceCommand(
                            `New complaint filed: ${result.complaint.title}. ${result.complaint.description}. Category: ${result.complaint.category}. Please provide guidance on next steps and expected timeline.`,
                            selectedLanguage,
                            currentUser
                        );

                        sharedComplaintService.updateComplaintStatus(
                            result.complaint.id,
                            'under_review',
                            aiResponse
                        );

                        loadUserComplaints(currentUser.id);
                    } catch (error) {
                        console.error('AI processing error:', error);
                    }
                }, 2000);

            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error filing complaint:', error);
            showNotification('error',
                selectedLanguage === 'hi' ? `शिकायत दर्ज करने में त्रुटि: ${error.message}` :
                    selectedLanguage === 'en' ? `Error filing complaint: ${error.message}` :
                        `شکایت درج کرنے میں خرابی: ${error.message}`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'under_review': return 'bg-orange-100 text-orange-800';
            case 'submitted': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-orange-100 text-orange-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        if (filter === 'all') return true;
        return complaint.status === filter;
    });

    // If user is not logged in, show login prompt
    if (!isLoggedIn) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border-4 border-blue-200 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogIn className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        {selectedLanguage === 'hi' && 'लॉगिन आवश्यक'}
                        {selectedLanguage === 'en' && 'Login Required'}
                        {selectedLanguage === 'ur' && 'لاگ ان ضروری'}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                        {selectedLanguage === 'hi' && 'शिकायत दर्ज करने के लिए कृपया पहले लॉगिन करें'}
                        {selectedLanguage === 'en' && 'Please login first to file complaints'}
                        {selectedLanguage === 'ur' && 'شکایت درج کرنے کے لیے پہلے لاگ ان کریں'}
                    </p>
                    <button
                        onClick={() => onTabChange && onTabChange('home')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg transform hover:scale-105"
                    >
                        {selectedLanguage === 'hi' && 'लॉगिन करें'}
                        {selectedLanguage === 'en' && 'Login Now'}
                        {selectedLanguage === 'ur' && 'ابھی لاگ ان کریں'}
                    </button>
                </div>
            </div>
        );
    }
    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">📋 {t.loadingComplaints}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="text-center p-20">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">{t.loadingError}</p>
                <button
                    onClick={() => loadUserComplaints(userInfo?.id)}
                    className="bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-all"
                >
                    <RefreshCw className="w-5 h-5 inline mr-2" />
                    {t.retry}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-md ${notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    <div className="flex items-center space-x-2">
                        {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertTriangle className="w-5 h-5" />
                        )}
                        <span className="font-medium">{notification.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-auto p-1 hover:bg-white/20 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">{t.myComplaints}</h2>
                <button
                    onClick={() => setShowNewComplaint(true)}
                    className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                    <FileText className="w-5 h-5" />
                    <span>{t.newComplaint}</span>
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-lg">
                <div className="flex space-x-2">
                    {['all', 'submitted', 'under_review', 'in_progress', 'resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl transition-all ${filter === status
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {t[status === 'in_progress' ? 'in_progress' : status]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
                {filteredComplaints.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">
                            {selectedLanguage === 'hi' && 'कोई शिकायत नहीं मिली'}
                            {selectedLanguage === 'en' && 'No complaints found'}
                            {selectedLanguage === 'ur' && 'کوئی شکایت نہیں ملی'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {selectedLanguage === 'hi' && 'अपनी पहली शिकायत दर्ज करें'}
                            {selectedLanguage === 'en' && 'File your first complaint'}
                            {selectedLanguage === 'ur' && 'اپنی پہلی شکایت درج کریں'}
                        </p>
                        <button
                            onClick={() => setShowNewComplaint(true)}
                            className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
                        >
                            <FileText className="w-5 h-5" />
                            <span>{t.newComplaint}</span>
                        </button>
                    </div>
                ) : (
                    filteredComplaints.map((complaint) => (
                        <div key={complaint.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                                            {t[complaint.status]}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>
                                            {t[complaint.priority]}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{complaint.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(complaint.createdAt).toLocaleDateString('hi-IN')}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <User className="w-4 h-4" />
                                            <span>{complaint.assignedDepartment}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <FileText className="w-4 h-4" />
                                            <span>{complaint.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedComplaint(complaint)}
                                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all flex items-center space-x-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>{t.viewDetails}</span>
                                </button>
                            </div>

                            {/* Latest Update */}
                            {complaint.statusHistory && complaint.statusHistory.length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MessageSquare className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-semibold text-gray-700">{t.updates}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{complaint.statusHistory[complaint.statusHistory.length - 1].note}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            {/* New Complaint Modal */}
            {showNewComplaint && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">{t.fileComplaint}</h3>
                            <button
                                onClick={() => setShowNewComplaint(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.title}</label>
                                <input
                                    type="text"
                                    value={newComplaint.title}
                                    onChange={(e) => setNewComplaint(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder={selectedLanguage === 'hi' ? 'शिकायत का शीर्षक' : selectedLanguage === 'en' ? 'Complaint title' : 'شکایت کا عنوان'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">{t.description}</label>
                                <div className="relative">
                                    <textarea
                                        value={newComplaint.description}
                                        onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-32 resize-none"
                                        placeholder={selectedLanguage === 'hi' ? 'विस्तार से बताएं...' : selectedLanguage === 'en' ? 'Describe in detail...' : 'تفصیل سے بتائیں...'}
                                    />
                                    <button
                                        onClick={toggleRecording}
                                        className={`absolute bottom-4 right-4 p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>
                                </div>
                                {isRecording && (
                                    <p className="text-sm text-red-600 mt-2 flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span>{t.recording}</span>
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">{t.category}</label>
                                    <select
                                        value={newComplaint.category}
                                        onChange={(e) => setNewComplaint(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    >
                                        <option value="">
                                            {selectedLanguage === 'hi' ? 'श्रेणी चुनें' : selectedLanguage === 'en' ? 'Select category' : 'قسم منتخب کریں'}
                                        </option>
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
                                        value={newComplaint.priority}
                                        onChange={(e) => setNewComplaint(prev => ({ ...prev, priority: e.target.value }))}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    >
                                        <option value="low">{t.low}</option>
                                        <option value="medium">{t.medium}</option>
                                        <option value="high">{t.high}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <button
                                    onClick={() => setShowNewComplaint(false)}
                                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    onClick={handleSubmitComplaint}
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>
                                                {selectedLanguage === 'hi' ? 'सबमिट हो रहा है...' :
                                                    selectedLanguage === 'en' ? 'Submitting...' :
                                                        'جمع ہو رہا ہے...'}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="w-5 h-5" />
                                            <span>{t.submit}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Complaint Details Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">{selectedComplaint.title}</h3>
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 mb-1">{t.status}</div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedComplaint.status)}`}>
                                        {t[selectedComplaint.status]}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 mb-1">{t.priority}</div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(selectedComplaint.priority)}`}>
                                        {t[selectedComplaint.priority]}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 mb-1">{t.date}</div>
                                    <div className="font-semibold">{new Date(selectedComplaint.createdAt).toLocaleDateString('hi-IN')}</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-3">{t.description}</h4>
                                <p className="text-gray-600 bg-gray-50 rounded-xl p-4">{selectedComplaint.description}</p>
                            </div>

                            {selectedComplaint.statusHistory && selectedComplaint.statusHistory.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-3">{t.updates}</h4>
                                    <div className="space-y-3">
                                        {selectedComplaint.statusHistory.map((update, index) => (
                                            <div key={index} className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(update.status)}`}>
                                                        {t[update.status]}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(update.timestamp).toLocaleDateString('hi-IN')}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">{update.note}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintsManager;