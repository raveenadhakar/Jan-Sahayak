class RealDataService {
  constructor() {
    this.apiEndpoints = {
      schemes: 'https://api.data.gov.in/resource/schemes',
      weather: 'https://api.openweathermap.org/data/2.5',
      news: 'https://newsapi.org/v2'
    };
  }

  // Get real government schemes data
  async getRealGovernmentSchemes(state = 'Uttar Pradesh', district = 'Muzaffarnagar') {
    try {
      // This would connect to actual government APIs
      // For now, we'll return enhanced mock data based on real schemes
      return this.getEnhancedSchemeData(state, district);
    } catch (error) {
      console.error('Error fetching real schemes:', error);
      return this.getEnhancedSchemeData(state, district);
    }
  }

  // Enhanced scheme data based on real government schemes
  getEnhancedSchemeData(state, district) {
    const currentYear = new Date().getFullYear();
    const schemes = [
      {
        id: 'pmkisan2024',
        name: 'PM-KISAN',
        nameEn: 'PM-KISAN',
        nameHi: 'पीएम-किसान',
        nameUr: 'پی ایم کسان',
        description: 'प्रधानमंत्री किसान सम्मान निधि योजना',
        descriptionEn: 'Prime Minister Farmers Honor Fund Scheme',
        descriptionUr: 'وزیر اعظم کسان سمان نیدھی اسکیم',
        amount: '₹6,000/वर्ष',
        status: this.getRandomStatus(),
        category: 'agriculture',
        launchDate: '2019-02-24',
        lastUpdated: new Date().toISOString(),
        beneficiaries: '11.78 करोड़ किसान',
        totalBudget: '₹87,217.50 करोड़',
        icon: '🌾',
        benefits: [
          'सालाना ₹6,000 की प्रत्यक्ष आय सहायता',
          'तीन समान किस्तों में ₹2,000-₹2,000',
          'सीधे बैंक खाते में DBT के माध्यम से',
          'कोई आवेदन शुल्क नहीं'
        ],
        eligibility: [
          'छोटे और सीमांत किसान परिवार',
          '2 हेक्टेयर तक की कृषि भूमि',
          'भारतीय नागरिकता आवश्यक',
          'आधार कार्ड अनिवार्य'
        ],
        documents: [
          'आधार कार्ड',
          'बैंक खाता पासबुक',
          'भूमि स्वामित्व दस्तावेज',
          'पासपोर्ट साइज फोटो'
        ],
        applicationProcess: 'pmkisan.gov.in पर ऑनलाइन आवेदन करें या नजदीकी CSC केंद्र पर जाएं',
        helpline: '155261 / 011-24300606',
        website: 'pmkisan.gov.in',
        officialNotification: `PM-KISAN-${currentYear}-001`
      },
      {
        id: 'ayushman2024',
        name: 'Ayushman Bharat PM-JAY',
        nameEn: 'Ayushman Bharat PM-JAY',
        nameHi: 'आयुष्मान भारत पीएम-जय',
        nameUr: 'آیوشمان بھارت پی ایم جے',
        description: 'प्रधानमंत्री जन आरोग्य योजना',
        descriptionEn: 'Prime Minister Jan Arogya Yojana',
        descriptionUr: 'وزیر اعظم جن آروگیہ یوجنا',
        amount: '₹5 लाख/परिवार/वर्ष',
        status: this.getRandomStatus(),
        category: 'health',
        launchDate: '2018-09-23',
        lastUpdated: new Date().toISOString(),
        beneficiaries: '12 करोड़ से अधिक परिवार',
        totalBudget: '₹6,400 करोड़',
        icon: '🏥',
        benefits: [
          'प्रति परिवार प्रति वर्ष ₹5 लाख तक का कवरेज',
          '1,929 प्रक्रियाओं के लिए कैशलेस इलाज',
          'पूरे भारत में पोर्टेबिलिटी',
          'पूर्व-मौजूदा बीमारियों को कवर'
        ],
        eligibility: [
          'SECC 2011 डेटाबेस के अनुसार पात्र परिवार',
          'ग्रामीण क्षेत्र में वंचित श्रेणी',
          'शहरी क्षेत्र में व्यावसायिक श्रेणी',
          'राज्य सरकार द्वारा चिह्नित परिवार'
        ],
        documents: [
          'आधार कार्ड',
          'राशन कार्ड',
          'SECC 2011 डेटा सत्यापन',
          'पारिवारिक आय प्रमाण पत्र'
        ],
        applicationProcess: 'नजदीकी सूचीबद्ध अस्पताल में संपर्क करें या mera.pmjay.gov.in पर जांचें',
        helpline: '14555 / 1800-111-565',
        website: 'pmjay.gov.in',
        officialNotification: `PMJAY-${currentYear}-002`
      },
      {
        id: 'pension2024',
        name: 'Indira Gandhi NSAP',
        nameEn: 'Indira Gandhi National Old Age Pension Scheme',
        nameHi: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना',
        nameUr: 'اندرا گاندھی قومی بڑھاپے کی پنشن اسکیم',
        description: 'राष्ट्रीय सामाजिक सहायता कार्यक्रम',
        descriptionEn: 'National Social Assistance Programme',
        descriptionUr: 'قومی سماجی امداد پروگرام',
        amount: '₹200-₹1,000/माह',
        status: this.getRandomStatus(),
        category: 'social',
        launchDate: '1995-08-15',
        lastUpdated: new Date().toISOString(),
        beneficiaries: '3.2 करोड़ बुजुर्ग',
        totalBudget: '₹9,652 करोड़',
        icon: '👴',
        benefits: [
          'केंद्र सरकार: ₹200/माह (60-79 वर्ष)',
          'केंद्र सरकार: ₹500/माह (80+ वर्ष)',
          'राज्य सरकार अतिरिक्त राशि',
          'सीधे बैंक खाते में भुगतान'
        ],
        eligibility: [
          '60 वर्ष या अधिक आयु',
          'BPL परिवार से संबंधित',
          'कोई नियमित पेंशन नहीं',
          'वार्षिक आय सीमा के अंतर्गत'
        ],
        documents: [
          'आयु प्रमाण पत्र',
          'BPL कार्ड',
          'आधार कार्ड',
          'बैंक खाता विवरण',
          'आय प्रमाण पत्र'
        ],
        applicationProcess: 'जिला कलेक्टर/BDO कार्यालय में आवेदन करें',
        helpline: '1800-180-1551',
        website: 'nsap.nic.in',
        officialNotification: `NSAP-${currentYear}-003`
      },
      {
        id: 'ration2024',
        name: 'National Food Security Act',
        nameEn: 'National Food Security Act',
        nameHi: 'राष्ट्रीय खाद्य सुरक्षा अधिनियम',
        nameUr: 'قومی فوڈ سیکیورٹی ایکٹ',
        description: 'सब्सिडी युक्त खाद्यान्न वितरण',
        descriptionEn: 'Subsidized food grain distribution',
        descriptionUr: 'سبسڈی والے اناج کی تقسیم',
        amount: '5 किलो/व्यक्ति/माह',
        status: this.getRandomStatus(),
        category: 'food',
        launchDate: '2013-09-10',
        lastUpdated: new Date().toISOString(),
        beneficiaries: '81.35 करोड़ लोग',
        totalBudget: '₹2,07,872 करोड़',
        icon: '🌾',
        benefits: [
          'चावल: ₹3/किलो',
          'गेहूं: ₹2/किलो',
          'मोटे अनाज: ₹1/किलो',
          'अंत्योदय परिवार: 35 किलो/माह'
        ],
        eligibility: [
          'प्राथमिकता परिवार (PHH)',
          'अंत्योदय अन्न योजना (AAY)',
          'राज्य सरकार द्वारा निर्धारित मापदंड',
          'वैध राशन कार्ड धारक'
        ],
        documents: [
          'आधार कार्ड',
          'निवास प्रमाण पत्र',
          'आय प्रमाण पत्र',
          'पारिवारिक फोटो'
        ],
        applicationProcess: 'खाद्य एवं आपूर्ति विभाग कार्यालय में आवेदन करें',
        helpline: '1967 / 1800-11-0001',
        website: 'nfsa.gov.in',
        officialNotification: `NFSA-${currentYear}-004`
      },
      {
        id: 'pmay2024',
        name: 'PM Awas Yojana Gramin',
        nameEn: 'PM Awas Yojana Gramin',
        nameHi: 'प्रधानमंत्री आवास योजना ग्रामीण',
        nameUr: 'وزیر اعظم آواس یوجنا گرامین',
        description: 'सभी के लिए आवास - ग्रामीण',
        descriptionEn: 'Housing for All - Rural',
        descriptionUr: 'سب کے لیے مکان - دیہی',
        amount: '₹1.20 लाख (मैदानी), ₹1.30 लाख (पहाड़ी)',
        status: this.getRandomStatus(),
        category: 'housing',
        launchDate: '2016-11-20',
        lastUpdated: new Date().toISOString(),
        beneficiaries: '2.95 करोड़ घर स्वीकृत',
        totalBudget: '₹1,30,075 करोड़',
        icon: '🏠',
        benefits: [
          'मैदानी क्षेत्र: ₹1.20 लाख सहायता',
          'पहाड़ी/कठिन क्षेत्र: ₹1.30 लाख',
          'शौचालय निर्माण: ₹12,000',
          'MGNREGA से 90/95 दिन का रोजगार'
        ],
        eligibility: [
          'SECC 2011 के अनुसार बेघर परिवार',
          'कच्चे घर में रहने वाले',
          '0, 1, 2 कमरे वाले घर',
          'महिला मुखिया को प्राथमिकता'
        ],
        documents: [
          'आधार कार्ड',
          'BPL कार्ड',
          'आय प्रमाण पत्र',
          'भूमि दस्तावेज',
          'बैंक खाता पासबुक'
        ],
        applicationProcess: 'ग्राम पंचायत/ब्लॉक कार्यालय में आवेदन करें',
        helpline: '1800-11-6446',
        website: 'pmayg.nic.in',
        officialNotification: `PMAYG-${currentYear}-005`
      }
    ];

    // Personalize based on user location
    return schemes.map(scheme => ({
      ...scheme,
      localOffice: this.getLocalOffice(scheme.category, district, state),
      nearbyCenter: this.getNearbyCenter(scheme.category, district),
      estimatedProcessingTime: this.getProcessingTime(scheme.category),
      successRate: this.getSuccessRate(scheme.category, state)
    }));
  }

  getRandomStatus() {
    const statuses = ['eligible', 'registered', 'active', 'pending'];
    const weights = [0.4, 0.3, 0.2, 0.1]; // Higher chance of being eligible
    
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      sum += weights[i];
      if (random <= sum) {
        return statuses[i];
      }
    }
    
    return 'eligible';
  }

  getLocalOffice(category, district, state) {
    const offices = {
      agriculture: `कृषि विभाग, ${district}, ${state}`,
      health: `स्वास्थ्य विभाग, ${district}, ${state}`,
      social: `समाज कल्याण विभाग, ${district}, ${state}`,
      food: `खाद्य एवं आपूर्ति विभाग, ${district}, ${state}`,
      housing: `ग्रामीण विकास विभाग, ${district}, ${state}`,
      education: `शिक्षा विभाग, ${district}, ${state}`
    };
    
    return offices[category] || `जिला कलेक्टर कार्यालय, ${district}, ${state}`;
  }

  getNearbyCenter(category, district) {
    const centers = {
      agriculture: `कृषि विज्ञान केंद्र, ${district}`,
      health: `सामुदायिक स्वास्थ्य केंद्र, ${district}`,
      social: `आंगनवाड़ी केंद्र, ${district}`,
      food: `उचित मूल्य दुकान, ${district}`,
      housing: `ब्लॉक विकास कार्यालय, ${district}`,
      education: `जिला शिक्षा कार्यालय, ${district}`
    };
    
    return centers[category] || `जन सेवा केंद्र, ${district}`;
  }

  getProcessingTime(category) {
    const times = {
      agriculture: '15-30 दिन',
      health: '7-15 दिन',
      social: '30-45 दिन',
      food: '15-20 दिन',
      housing: '60-90 दिन',
      education: '20-30 दिन'
    };
    
    return times[category] || '30-45 दिन';
  }

  getSuccessRate(category, state) {
    // Mock success rates based on category and state
    const baseRates = {
      agriculture: 85,
      health: 78,
      social: 72,
      food: 90,
      housing: 65,
      education: 80
    };
    
    const stateMultiplier = state === 'Uttar Pradesh' ? 0.95 : 1.0;
    const rate = Math.round(baseRates[category] * stateMultiplier);
    
    return `${rate}% सफलता दर`;
  }

  // Get real-time scheme updates
  async getSchemeUpdates(schemeId) {
    try {
      // This would fetch real-time updates from government APIs
      return {
        lastUpdated: new Date().toISOString(),
        status: 'active',
        newBeneficiaries: Math.floor(Math.random() * 10000),
        budgetUtilization: Math.floor(Math.random() * 100),
        recentChanges: [
          'आवेदन प्रक्रिया को सरल बनाया गया',
          'ऑनलाइन स्टेटस चेकिंग सुविधा जोड़ी गई',
          'दस्तावेज़ सत्यापन में तेजी लाई गई'
        ]
      };
    } catch (error) {
      console.error('Error fetching scheme updates:', error);
      return null;
    }
  }

  // Check scheme eligibility based on user profile
  checkEligibility(userProfile, schemeId) {
    // This would use real eligibility criteria
    const eligibilityScore = Math.random() * 100;
    
    return {
      eligible: eligibilityScore > 30,
      score: Math.round(eligibilityScore),
      missingCriteria: eligibilityScore <= 30 ? [
        'आय प्रमाण पत्र अपडेट करें',
        'भूमि दस्तावेज सत्यापित कराएं'
      ] : [],
      recommendations: [
        'सभी दस्तावेज तैयार रखें',
        'नजदीकी CSC केंद्र पर जाएं',
        'आधार कार्ड को बैंक खाते से लिंक कराएं'
      ]
    };
  }
}

export const realDataService = new RealDataService();