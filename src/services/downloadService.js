class DownloadService {
  // Download scheme information as PDF-like text file
  downloadSchemeInfo(scheme, userInfo, selectedLanguage) {
    try {
      const content = this.generateSchemeDocument(scheme, userInfo, selectedLanguage);
      const fileName = `${scheme.id}_scheme_info.txt`;
      this.downloadTextFile(content, fileName);
      
      return {
        success: true,
        message: 'Scheme information downloaded successfully'
      };
    } catch (error) {
      console.error('Download error:', error);
      return {
        success: false,
        error: 'Failed to download scheme information'
      };
    }
  }

  // Generate scheme document content
  generateSchemeDocument(scheme, userInfo, selectedLanguage) {
    const currentDate = new Date().toLocaleDateString('hi-IN');
    const currentTime = new Date().toLocaleTimeString('hi-IN');
    
    return `
═══════════════════════════════════════════════════════════════
                    सरकारी योजना जानकारी
                   GOVERNMENT SCHEME INFORMATION
═══════════════════════════════════════════════════════════════

डाउनलोड दिनांक: ${currentDate}
डाउनलोड समय: ${currentTime}
उपयोगकर्ता: ${userInfo.name || 'अज्ञात'}
स्थान: ${userInfo.village || ''}, ${userInfo.district || ''}, ${userInfo.state || ''}

───────────────────────────────────────────────────────────────
योजना विवरण / SCHEME DETAILS
───────────────────────────────────────────────────────────────

योजना का नाम: ${scheme.nameHi || scheme.name}
English Name: ${scheme.nameEn || scheme.name}
योजना ID: ${scheme.id}
श्रेणी: ${scheme.category}
स्थिति: ${scheme.status}
राशि: ${scheme.amount}

विवरण:
${scheme.description || scheme.descriptionEn || 'विवरण उपलब्ध नहीं'}

───────────────────────────────────────────────────────────────
लाभ / BENEFITS
───────────────────────────────────────────────────────────────

${scheme.benefits ? scheme.benefits.map((benefit, index) => 
  `${index + 1}. ${benefit}`
).join('\n') : 'लाभ की जानकारी उपलब्ध नहीं'}

───────────────────────────────────────────────────────────────
पात्रता / ELIGIBILITY
───────────────────────────────────────────────────────────────

${scheme.eligibility ? scheme.eligibility.map((criteria, index) => 
  `${index + 1}. ${criteria}`
).join('\n') : 'पात्रता की जानकारी उपलब्ध नहीं'}

───────────────────────────────────────────────────────────────
आवश्यक दस्तावेज / REQUIRED DOCUMENTS
───────────────────────────────────────────────────────────────

${scheme.documents ? scheme.documents.map((doc, index) => 
  `${index + 1}. ${doc}`
).join('\n') : 'दस्तावेज की जानकारी उपलब्ध नहीं'}

───────────────────────────────────────────────────────────────
आवेदन प्रक्रिया / APPLICATION PROCESS
───────────────────────────────────────────────────────────────

${scheme.applicationProcess || 'आवेदन प्रक्रिया की जानकारी उपलब्ध नहीं'}

───────────────────────────────────────────────────────────────
संपर्क जानकारी / CONTACT INFORMATION
───────────────────────────────────────────────────────────────

हेल्पलाइन नंबर: ${scheme.helpline || 'उपलब्ध नहीं'}
वेबसाइट: ${scheme.website || 'उपलब्ध नहीं'}

${scheme.localOffice ? `स्थानीय कार्यालय: ${scheme.localOffice}` : ''}
${scheme.nearbyCenter ? `नजदीकी केंद्र: ${scheme.nearbyCenter}` : ''}
${scheme.estimatedProcessingTime ? `अनुमानित समय: ${scheme.estimatedProcessingTime}` : ''}

───────────────────────────────────────────────────────────────
महत्वपूर्ण सूचना / IMPORTANT INFORMATION
───────────────────────────────────────────────────────────────

• यह जानकारी केवल संदर्भ के लिए है
• नवीनतम जानकारी के लिए आधिकारिक वेबसाइट देखें
• आवेदन से पहले सभी दस्तावेज तैयार रखें
• किसी भी समस्या के लिए हेल्पलाइन पर संपर्क करें

───────────────────────────────────────────────────────────────
अस्वीकरण / DISCLAIMER
───────────────────────────────────────────────────────────────

यह जानकारी जन सहायक ऐप द्वारा प्रदान की गई है। सभी जानकारी 
सरकारी स्रोतों से ली गई है। नवीनतम अपडेट के लिए संबंधित विभाग 
की आधिकारिक वेबसाइट देखें।

═══════════════════════════════════════════════════════════════
                        जन सहायक
                   डिजिटल इंडिया पहल
                    Digital India Initiative
═══════════════════════════════════════════════════════════════
    `;
  }

  // Download complaint receipt
  downloadComplaintReceipt(complaint, userInfo) {
    try {
      const content = this.generateComplaintReceipt(complaint, userInfo);
      const fileName = `complaint_${complaint.id}_receipt.txt`;
      this.downloadTextFile(content, fileName);
      
      return {
        success: true,
        message: 'Complaint receipt downloaded successfully'
      };
    } catch (error) {
      console.error('Download error:', error);
      return {
        success: false,
        error: 'Failed to download complaint receipt'
      };
    }
  }

  // Generate complaint receipt
  generateComplaintReceipt(complaint, userInfo) {
    const currentDate = new Date().toLocaleDateString('hi-IN');
    const currentTime = new Date().toLocaleTimeString('hi-IN');
    
    return `
═══════════════════════════════════════════════════════════════
                      शिकायत रसीद
                   COMPLAINT RECEIPT
═══════════════════════════════════════════════════════════════

रसीद दिनांक: ${currentDate}
रसीद समय: ${currentTime}

───────────────────────────────────────────────────────────────
शिकायत विवरण / COMPLAINT DETAILS
───────────────────────────────────────────────────────────────

शिकायत संख्या: ${complaint.id}
दर्ज दिनांक: ${new Date(complaint.createdAt).toLocaleDateString('hi-IN')}
दर्ज समय: ${new Date(complaint.createdAt).toLocaleTimeString('hi-IN')}

शिकायत का शीर्षक: ${complaint.title}
श्रेणी: ${complaint.category}
प्राथमिकता: ${complaint.priority}
वर्तमान स्थिति: ${complaint.status}

विवरण:
${complaint.description}

───────────────────────────────────────────────────────────────
शिकायतकर्ता की जानकारी / COMPLAINANT INFORMATION
───────────────────────────────────────────────────────────────

नाम: ${userInfo.name}
मोबाइल: ${userInfo.mobile}
पता: ${userInfo.village}, ${userInfo.district}, ${userInfo.state}

${complaint.contactNumber ? `संपर्क नंबर: ${complaint.contactNumber}` : ''}
${complaint.location ? `स्थान: ${complaint.location}` : ''}

───────────────────────────────────────────────────────────────
विभाग जानकारी / DEPARTMENT INFORMATION
───────────────────────────────────────────────────────────────

संबंधित विभाग: ${complaint.assignedDepartment || 'जिला प्रशासन'}
${complaint.estimatedResolution ? `अनुमानित समाधान: ${complaint.estimatedResolution.displayDate}` : ''}

───────────────────────────────────────────────────────────────
स्थिति इतिहास / STATUS HISTORY
───────────────────────────────────────────────────────────────

${complaint.statusHistory ? complaint.statusHistory.map(history => 
  `${new Date(history.timestamp).toLocaleDateString('hi-IN')} - ${history.status}
  टिप्पणी: ${history.note}`
).join('\n\n') : 'स्थिति इतिहास उपलब्ध नहीं'}

───────────────────────────────────────────────────────────────
महत्वपूर्ण निर्देश / IMPORTANT INSTRUCTIONS
───────────────────────────────────────────────────────────────

• इस रसीद को सुरक्षित रखें
• शिकायत संख्या का उपयोग करके स्थिति जांचें
• अपडेट के लिए नियमित रूप से ऐप देखें
• आपातकाल में संबंधित विभाग से सीधे संपर्क करें

───────────────────────────────────────────────────────────────
संपर्क जानकारी / CONTACT INFORMATION
───────────────────────────────────────────────────────────────

हेल्पलाइन: 1800-180-1551
ईमेल: support@jansahayak.gov.in
वेबसाइट: www.jansahayak.gov.in

═══════════════════════════════════════════════════════════════
                        जन सहायक
                   डिजिटल इंडिया पहल
═══════════════════════════════════════════════════════════════
    `;
  }

  // Download weather report
  downloadWeatherReport(weatherData, userInfo) {
    try {
      const content = this.generateWeatherReport(weatherData, userInfo);
      const fileName = `weather_report_${new Date().toISOString().split('T')[0]}.txt`;
      this.downloadTextFile(content, fileName);
      
      return {
        success: true,
        message: 'Weather report downloaded successfully'
      };
    } catch (error) {
      console.error('Download error:', error);
      return {
        success: false,
        error: 'Failed to download weather report'
      };
    }
  }

  // Generate weather report
  generateWeatherReport(weatherData, userInfo) {
    const currentDate = new Date().toLocaleDateString('hi-IN');
    const currentTime = new Date().toLocaleTimeString('hi-IN');
    
    return `
═══════════════════════════════════════════════════════════════
                      मौसम रिपोर्ट
                    WEATHER REPORT
═══════════════════════════════════════════════════════════════

रिपोर्ट दिनांक: ${currentDate}
रिपोर्ट समय: ${currentTime}
स्थान: ${weatherData.city || userInfo.village || 'अज्ञात'}

───────────────────────────────────────────────────────────────
वर्तमान मौसम / CURRENT WEATHER
───────────────────────────────────────────────────────────────

तापमान: ${weatherData.temperature}°C
महसूस होता है: ${weatherData.feelsLike || weatherData.temperature}°C
मौसम स्थिति: ${weatherData.localizedCondition || weatherData.condition}
नमी: ${weatherData.humidity}%
हवा की गति: ${weatherData.windSpeed} km/h
दृश्यता: ${weatherData.visibility || 'N/A'} km

${weatherData.sunrise ? `सूर्योदय: ${new Date(weatherData.sunrise).toLocaleTimeString('hi-IN')}` : ''}
${weatherData.sunset ? `सूर्यास्त: ${new Date(weatherData.sunset).toLocaleTimeString('hi-IN')}` : ''}

───────────────────────────────────────────────────────────────
कृषि सलाह / AGRICULTURAL ADVICE
───────────────────────────────────────────────────────────────

${this.getAgriculturalAdvice(weatherData)}

───────────────────────────────────────────────────────────────
सामान्य सलाह / GENERAL ADVICE
───────────────────────────────────────────────────────────────

${this.getGeneralAdvice(weatherData)}

═══════════════════════════════════════════════════════════════
                        जन सहायक
                   मौसम सेवा विभाग
═══════════════════════════════════════════════════════════════
    `;
  }

  // Get agricultural advice based on weather
  getAgriculturalAdvice(weatherData) {
    const condition = weatherData.condition?.toLowerCase() || '';
    
    if (condition.includes('rain')) {
      return `• बारिश के कारण खेतों में जल भराव से बचें
• फसल की कटाई स्थगित करें
• जल निकासी की व्यवस्था करें
• कीटनाशक का छिड़काव न करें`;
    } else if (condition.includes('clear')) {
      return `• सिंचाई का उचित समय है
• कीटनाशक का छिड़काव कर सकते हैं
• फसल की कटाई के लिए अच्छा मौसम
• बीज बुआई के लिए उपयुक्त`;
    } else {
      return `• मौसम के अनुसार कृषि कार्य करें
• नियमित रूप से मौसम की जांच करते रहें
• आवश्यकतानुसार सिंचाई करें`;
    }
  }

  // Get general advice based on weather
  getGeneralAdvice(weatherData) {
    const temp = weatherData.temperature || 25;
    
    if (temp > 35) {
      return `• गर्मी से बचने के लिए घर में रहें
• पर्याप्त पानी पिएं
• धूप में बाहर न निकलें
• हल्के रंग के कपड़े पहनें`;
    } else if (temp < 10) {
      return `• ठंड से बचने के लिए गर्म कपड़े पहनें
• गर्म पेय पदार्थ लें
• बुजुर्गों और बच्चों का विशेष ख्याल रखें`;
    } else {
      return `• मौसम सामान्य है
• दैनिक कार्य सामान्य रूप से कर सकते हैं
• स्वास्थ्य का ध्यान रखें`;
    }
  }

  // Generic text file download function
  downloadTextFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Download user profile summary
  downloadProfileSummary(userInfo) {
    try {
      const content = this.generateProfileSummary(userInfo);
      const fileName = `profile_summary_${userInfo.name?.replace(/\s+/g, '_') || 'user'}.txt`;
      this.downloadTextFile(content, fileName);
      
      return {
        success: true,
        message: 'Profile summary downloaded successfully'
      };
    } catch (error) {
      console.error('Download error:', error);
      return {
        success: false,
        error: 'Failed to download profile summary'
      };
    }
  }

  // Generate profile summary
  generateProfileSummary(userInfo) {
    const currentDate = new Date().toLocaleDateString('hi-IN');
    
    return `
═══════════════════════════════════════════════════════════════
                    उपयोगकर्ता प्रोफाइल
                     USER PROFILE
═══════════════════════════════════════════════════════════════

निर्यात दिनांक: ${currentDate}

───────────────────────────────────────────────────────────────
व्यक्तिगत जानकारी / PERSONAL INFORMATION
───────────────────────────────────────────────────────────────

नाम: ${userInfo.name || 'अज्ञात'}
मोबाइल नंबर: ${userInfo.mobile || 'अज्ञात'}
गांव: ${userInfo.village || 'अज्ञात'}
जिला: ${userInfo.district || 'अज्ञात'}
राज्य: ${userInfo.state || 'अज्ञात'}

खाता बनाया गया: ${userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('hi-IN') : 'अज्ञात'}
अंतिम लॉगिन: ${userInfo.lastLogin ? new Date(userInfo.lastLogin).toLocaleDateString('hi-IN') : 'अज्ञात'}

───────────────────────────────────────────────────────────────
सेवा उपयोग / SERVICE USAGE
───────────────────────────────────────────────────────────────

• सरकारी योजनाओं की जानकारी
• शिकायत प्रबंधन सेवा
• मौसम अपडेट सेवा
• ग्रामवाणी सेवा

───────────────────────────────────────────────────────────────
संपर्क जानकारी / CONTACT INFORMATION
───────────────────────────────────────────────────────────────

जन सहायक हेल्पलाइन: 1800-180-1551
ईमेल: support@jansahayak.gov.in

═══════════════════════════════════════════════════════════════
                        जन सहायक
                   डिजिटल इंडिया पहल
═══════════════════════════════════════════════════════════════
    `;
  }
}

export const downloadService = new DownloadService();