import React, { useState, useEffect } from 'react';
import {
    Mic, MicOff, FileText, Send, Clock, CheckCircle, AlertTriangle,
    X, Camera, Paperclip, MapPin, Calendar, User, Phone, Star,
    MessageSquare, Eye, Download, Filter
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';

const ComplaintsManager = ({ userInfo, selectedLanguage, onTabChange }) => {
    const [complaints, setComplaints] = useState([
        {
            id: 'JAN001',
            title: 'सड़क की मरम्मत',
            description: 'मुख्य सड़क पर बड़े गड्ढे हैं जिससे दुर्घटना का खतरा है',
            category: 'infrastructure',
            status: 'in-progress',
            priority: 'high',
            date: '2024-08-20',
            assignedTo: 'राम कुमार (सड़क विभाग)',
            images: [],
            updates: [
                { date: '2024-08-22', message: 'शिकायत प्राप्त हुई और जांच शुरू की गई', status: 'received' },
                { date: '2024-08-24', message: 'साइट का निरीक्षण किया गया', status: 'in-progress' }
            ]
        },
        {
            id: 'JAN002',
            title: 'पानी की कमी',
            description: 'पिछले 3 दिनों से पानी की सप्लाई नहीं आ रही है',
            category: 'water',
            status: 'resolved',
            priority: 'high',
            date: '2024-08-18',
            assignedTo: 'सुनीता देवी (जल विभाग)',
            images: [],
            updates: [
                { date: '2024-08-18', message: 'शिकायत दर्ज की गई', status: 'received' },
                { date: '2024-08-19', message: 'पाइप लाइन की मरम्मत की गई', status: 'resolved' }
            ]
        }
    ]);

    const [showNewComplaint, setShowNewComplaint] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [newComplaint, setNewComplaint] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        images: []
    });
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [filter, setFilter] = useState('all');

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
            pending: 'लंबित',
            inProgress: 'प्रगति में',
            resolved: 'हल हुई',
            high: 'उच्च',
            medium: 'मध्यम',
            low: 'निम्न',
            infrastructure: 'बुनियादी ढांचा',
            water: 'पानी',
            electricity: 'बिजली',
            health: 'स्वास्थ्य',
            education: 'शिक्षा',
            other: 'अन्य'
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
            pending: 'Pending',
            inProgress: 'In Progress',
            resolved: 'Resolved',
            high: 'High',
            medium: 'Medium',
            low: 'Low',
            infrastructure: 'Infrastructure',
            water: 'Water',
            electricity: 'Electricity',
            health: 'Health',
            education: 'Education',
            other: 'Other'
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
            pending: 'زیر التواء',
            inProgress: 'جاری',
            resolved: 'حل شدہ',
            high: 'اعلیٰ',
            medium: 'درمیانہ',
            low: 'کم',
            infrastructure: 'بنیادی ڈھانچہ',
            water: 'پانی',
            electricity: 'بجلی',
            health: 'صحت',
            education: 'تعلیم',
            other: 'دیگر'
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
        if (!newComplaint.title || !newComplaint.description) {
            alert('Please fill in all required fields');
            return;
        }

        const complaint = {
            id: `JAN${String(complaints.length + 1).padStart(3, '0')}`,
            ...newComplaint,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            assignedTo: 'Processing...',
            updates: [
                {
                    date: new Date().toISOString().split('T')[0],
                    message: selectedLanguage === 'hi' ? 'शिकायत दर्ज की गई' :
                        selectedLanguage === 'en' ? 'Complaint filed' :
                            'شکایت درج کی گئی',
                    status: 'received'
                }
            ]
        };

        setComplaints(prev => [complaint, ...prev]);
        setNewComplaint({ title: '', description: '', category: '', priority: 'medium', images: [] });
        setShowNewComplaint(false);

        // Simulate AI processing
        setTimeout(async () => {
            try {
                const aiResponse = await geminiService.processVoiceCommand(
                    `New complaint filed: ${complaint.title}. ${complaint.description}. Please provide guidance on next steps.`,
                    selectedLanguage,
                    userInfo
                );

                setComplaints(prev => prev.map(c =>
                    c.id === complaint.id
                        ? {
                            ...c,
                            updates: [...c.updates, {
                                date: new Date().toISOString().split('T')[0],
                                message: aiResponse,
                                status: 'processing'
                            }]
                        }
                        : c
                ));
            } catch (error) {
                console.error('AI processing error:', error);
            }
        }, 2000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
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

    return (
        <div className="space-y-6">
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
                    {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl transition-all ${filter === status
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {t[status === 'in-progress' ? 'inProgress' : status]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                    <div key={complaint.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                                        {t[complaint.status === 'in-progress' ? 'inProgress' : complaint.status]}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>
                                        {t[complaint.priority]}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">{complaint.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{complaint.date}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <User className="w-4 h-4" />
                                        <span>{complaint.assignedTo}</span>
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
                        {complaint.updates.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-semibold text-gray-700">{t.updates}</span>
                                </div>
                                <p className="text-sm text-gray-600">{complaint.updates[complaint.updates.length - 1].message}</p>
                            </div>
                        )}
                    </div>
                ))}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">{t.category}</label>
                                    <select
                                        value={newComplaint.category}
                                        onChange={(e) => setNewComplaint(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    >
                                        <option value="">{selectedLanguage === 'hi' ? 'चुनें' : selectedLanguage === 'en' ? 'Select' : 'منتخب کریں'}</option>
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

                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={() => setShowNewComplaint(false)}
                                    className="flex-1 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    onClick={handleSubmitComplaint}
                                    className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold transform hover:scale-105"
                                >
                                    {t.submit}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Complaint Details Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                            <div className="flex items-center space-x-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedComplaint.status)}`}>
                                    {t[selectedComplaint.status === 'in-progress' ? 'inProgress' : selectedComplaint.status]}
                                </span>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(selectedComplaint.priority)}`}>
                                    {t[selectedComplaint.priority]}
                                </span>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">{t.description}</h4>
                                <p className="text-gray-600">{selectedComplaint.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">{t.date}</h4>
                                    <p className="text-gray-600">{selectedComplaint.date}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">{t.assignedTo}</h4>
                                    <p className="text-gray-600">{selectedComplaint.assignedTo}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-4">{t.updates}</h4>
                                <div className="space-y-3">
                                    {selectedComplaint.updates.map((update, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-gray-700">{update.date}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(update.status)}`}>
                                                    {t[update.status === 'in-progress' ? 'inProgress' : update.status]}
                                                </span>
                                            </div>
                                            <p className="text-gray-600">{update.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintsManager;