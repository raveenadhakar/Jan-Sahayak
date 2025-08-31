import React, { useState } from 'react';
import { Phone, Mail, Copy, Volume2, X } from 'lucide-react';

const OfficialsContact = ({ isOpen, onClose, selectedLanguage = 'hi', userInfo = {} }) => {
    const [copiedNumber, setCopiedNumber] = useState('');

    const translations = {
        hi: {
            officialsContact: 'अधिकारियों से संपर्क करें',
            emergencyContacts: 'आपातकालीन संपर्क',
            helpline: 'हेल्पलाइन नंबर',
            localOfficials: 'स्थानीय अधिकारी',
            districtOfficials: 'जिला अधिकारी',
            call: 'कॉल करें',
            copy: 'कॉपी करें',
            copied: 'कॉपी हो गया!',
            email: 'ईमेल',
            speak: 'सुनें',
            close: 'बंद करें'
        },
        en: {
            officialsContact: 'Contact Officials',
            emergencyContacts: 'Emergency Contacts',
            helpline: 'Helpline Numbers',
            localOfficials: 'Local Officials',
            districtOfficials: 'District Officials',
            call: 'Call',
            copy: 'Copy',
            copied: 'Copied!',
            email: 'Email',
            speak: 'Listen',
            close: 'Close'
        },
        ur: {
            officialsContact: 'حکام سے رابطہ',
            emergencyContacts: 'ہنگامی رابطے',
            helpline: 'ہیلپ لائن نمبرز',
            localOfficials: 'مقامی حکام',
            districtOfficials: 'ضلعی حکام',
            call: 'کال کریں',
            copy: 'کاپی کریں',
            copied: 'کاپی ہو گیا!',
            email: 'ای میل',
            speak: 'سنیں',
            close: 'بند کریں'
        }
    };

    const t = translations[selectedLanguage];

    const emergencyContacts = [
        { name: 'Police', nameHi: 'पुलिस', nameUr: 'پولیس', number: '100', icon: '🚔' },
        { name: 'Fire Brigade', nameHi: 'दमकल', nameUr: 'فائر بریگیڈ', number: '101', icon: '🚒' },
        { name: 'Ambulance', nameHi: 'एम्बुलेंस', nameUr: 'ایمبولینس', number: '108', icon: '🚑' },
        { name: 'Disaster Management', nameHi: 'आपदा प्रबंधन', nameUr: 'ڈیزاسٹر مینجمنٹ', number: '108', icon: '⛑️' }
    ];

    const helplineNumbers = [
        { name: 'Complaint Cell', nameHi: 'शिकायत सेल', nameUr: 'شکایت سیل', number: '1800-180-1551', icon: '📞' },
        { name: 'Women Helpline', nameHi: 'महिला हेल्पलाइन', nameUr: 'خواتین ہیلپ لائن', number: '1090', icon: '👩' },
        { name: 'Child Helpline', nameHi: 'बाल हेल्पलाइन', nameUr: 'بچوں کی ہیلپ لائن', number: '1098', icon: '👶' },
        { name: 'Senior Citizen', nameHi: 'वरिष्ठ नागरिक', nameUr: 'بزرگ شہری', number: '14567', icon: '👴' }
    ];

    const localOfficials = [
        {
            name: 'Sarpanch',
            nameHi: 'सरपंच',
            nameUr: 'سرپنچ',
            person: 'श्री राम कुमार',
            number: '+91-9876543210',
            email: 'sarpanch.village@gov.in',
            icon: '👨‍💼'
        },
        {
            name: 'Village Secretary',
            nameHi: 'ग्राम सचिव',
            nameUr: 'گاؤں سیکرٹری',
            person: 'श्रीमती सुनीता देवी',
            number: '+91-9876543211',
            email: 'secretary.village@gov.in',
            icon: '👩‍💼'
        }
    ];

    const districtOfficials = [
        {
            name: 'Tehsildar',
            nameHi: 'तहसीलदार',
            nameUr: 'تحصیلدار',
            person: 'श्री अजय कुमार सिंह',
            number: '+91-9876543220',
            email: 'tehsildar.mzn@gov.in',
            icon: '🏛️'
        },
        {
            name: 'Block Development Officer',
            nameHi: 'खंड विकास अधिकारी',
            nameUr: 'بلاک ڈیولپمنٹ آفیسر',
            person: 'श्रीमती प्रिया शर्मा',
            number: '+91-9876543221',
            email: 'bdo.mzn@gov.in',
            icon: '🏗️'
        },
        {
            name: 'District Collector',
            nameHi: 'जिला कलेक्टर',
            nameUr: 'ضلعی کلکٹر',
            person: 'श्री विकास गुप्ता IAS',
            number: '+91-9876543222',
            email: 'collector.mzn@gov.in',
            icon: '🎖️'
        }
    ];

    const copyToClipboard = (number) => {
        navigator.clipboard.writeText(number);
        setCopiedNumber(number);
        setTimeout(() => setCopiedNumber(''), 2000);
    };

    const makeCall = (number) => {
        window.open(`tel:${number}`, '_self');
    };

    const sendEmail = (email) => {
        window.open(`mailto:${email}`, '_blank');
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'ur' ? 'ur-PK' : 'en-IN';
            speechSynthesis.speak(utterance);
        }
    };

    const ContactCard = ({ contact, showEmail = false }) => (
        <div className="bg-white rounded-xl p-4 shadow-clean border border-gray-100 hover:shadow-clean-lg transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{contact.icon}</span>
                    <div>
                        <h4 className="font-semibold text-gray-800">
                            {selectedLanguage === 'hi' ? contact.nameHi : 
                             selectedLanguage === 'ur' ? contact.nameUr : contact.name}
                        </h4>
                        {contact.person && (
                            <p className="text-sm text-gray-600">{contact.person}</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => speakText(selectedLanguage === 'hi' ? contact.nameHi : 
                                           selectedLanguage === 'ur' ? contact.nameUr : contact.name)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                >
                    <Volume2 className="w-4 h-4" />
                </button>
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <span className="font-mono text-sm">{contact.number}</span>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => makeCall(contact.number)}
                            className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
                            title={t.call}
                        >
                            <Phone className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => copyToClipboard(contact.number)}
                            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                            title={t.copy}
                        >
                            <Copy className="w-3 h-3" />
                        </button>
                    </div>
                </div>
                
                {showEmail && contact.email && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <span className="text-sm text-gray-600 truncate">{contact.email}</span>
                        <button
                            onClick={() => sendEmail(contact.email)}
                            className="bg-purple-500 text-white p-1 rounded hover:bg-purple-600 transition-colors"
                            title={t.email}
                        >
                            <Mail className="w-3 h-3" />
                        </button>
                    </div>
                )}
                
                {copiedNumber === contact.number && (
                    <div className="text-xs text-green-600 font-medium">{t.copied}</div>
                )}
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-heading font-bold text-primary flex items-center space-x-3">
                            <span className="text-3xl">🏛️</span>
                            <span>{t.officialsContact}</span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-2"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Emergency Contacts */}
                    <div>
                        <h3 className="text-subheading font-bold text-primary mb-4 flex items-center space-x-2">
                            <span className="text-2xl">🚨</span>
                            <span>{t.emergencyContacts}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {emergencyContacts.map((contact, index) => (
                                <ContactCard key={index} contact={contact} />
                            ))}
                        </div>
                    </div>

                    {/* Helpline Numbers */}
                    <div>
                        <h3 className="text-subheading font-bold text-primary mb-4 flex items-center space-x-2">
                            <span className="text-2xl">📞</span>
                            <span>{t.helpline}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {helplineNumbers.map((contact, index) => (
                                <ContactCard key={index} contact={contact} />
                            ))}
                        </div>
                    </div>

                    {/* Local Officials */}
                    <div>
                        <h3 className="text-subheading font-bold text-primary mb-4 flex items-center space-x-2">
                            <span className="text-2xl">👥</span>
                            <span>{t.localOfficials}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {localOfficials.map((contact, index) => (
                                <ContactCard key={index} contact={contact} showEmail={true} />
                            ))}
                        </div>
                    </div>

                    {/* District Officials */}
                    <div>
                        <h3 className="text-subheading font-bold text-primary mb-4 flex items-center space-x-2">
                            <span className="text-2xl">🏢</span>
                            <span>{t.districtOfficials}</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {districtOfficials.map((contact, index) => (
                                <ContactCard key={index} contact={contact} showEmail={true} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficialsContact;