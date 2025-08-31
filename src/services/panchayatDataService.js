class PanchayatDataService {
  constructor() {
    // Panchayat data endpoints
    this.endpoints = {
      // eGramSwaraj Portal
      eGramSwaraj: 'https://egramswaraj.gov.in/api',
      
      // State Panchayati Raj Websites
      upPanchayat: 'https://panchayatiraj.up.gov.in/api',
      
      // MGNREGA
      mgnrega: 'https://nrega.nic.in/netnrega/api',
      
      // Swachh Bharat Mission
      sbm: 'https://sbm.gov.in/api',
      
      // Pradhan Mantri Gram Sadak Yojana
      pmgsy: 'https://pmgsy.nic.in/api',
      
      // National Rural Drinking Water Programme
      nrdwp: 'https://jalshakti-ddws.gov.in/api'
    };

    this.apiKeys = {
      eGramSwaraj: import.meta.env.VITE_EGRAMSWARAJ_API_KEY || '',
      mgnrega: import.meta.env.VITE_MGNREGA_API_KEY || ''
    };
  }

  // ==================== PANCHAYAT NOTICES ====================
  
  async getPanchayatNotices(panchayatCode, district, state, language = 'hi') {
    try {
      // Try eGramSwaraj first
      let notices = await this.getEGramSwarajNotices(panchayatCode, district, state);
      
      if (!notices || notices.length === 0) {
        notices = await this.getStatePanchayatNotices(district, state);
      }
      
      return this.formatPanchayatNotices(notices, language);
    } catch (error) {
      console.error('Panchayat notices error:', error);
      return this.getMockPanchayatNotices(language);
    }
  }

  async getEGramSwarajNotices(panchayatCode, district, state) {
    try {
      const response = await fetch(
        `${this.endpoints.eGramSwaraj}/notices/${state}/${district}/${panchayatCode}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKeys.eGramSwaraj}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.notices || [];
      }
      return null;
    } catch (error) {
      console.error('eGramSwaraj API error:', error);
      return null;
    }
  }

  async getStatePanchayatNotices(district, state) {
    try {
      // State-specific API calls
      if (state.toLowerCase() === 'uttar pradesh') {
        return await this.getUPPanchayatNotices(district);
      }
      
      return null;
    } catch (error) {
      console.error('State panchayat API error:', error);
      return null;
    }
  }

  async getUPPanchayatNotices(district) {
    try {
      const response = await fetch(
        `${this.endpoints.upPanchayat}/notices/${district}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.notices || [];
      }
      return null;
    } catch (error) {
      console.error('UP Panchayat API error:', error);
      return null;
    }
  }

  // ==================== GRAM SABHA MEETINGS ====================
  
  async getGramSabhaMeetings(panchayatCode, district, state, language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.eGramSwaraj}/meetings/${state}/${district}/${panchayatCode}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKeys.eGramSwaraj}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatGramSabhaMeetings(data.meetings || [], language);
      }
      
      return this.getMockGramSabhaMeetings(language);
    } catch (error) {
      console.error('Gram Sabha meetings error:', error);
      return this.getMockGramSabhaMeetings(language);
    }
  }

  // ==================== MGNREGA DATA ====================
  
  async getMGNREGAData(panchayatCode, district, state, language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.mgnrega}/panchayat/${state}/${district}/${panchayatCode}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKeys.mgnrega}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatMGNREGAData(data, language);
      }
      
      return this.getMockMGNREGAData(language);
    } catch (error) {
      console.error('MGNREGA data error:', error);
      return this.getMockMGNREGAData(language);
    }
  }

  // ==================== DEVELOPMENT PROJECTS ====================
  
  async getDevelopmentProjects(panchayatCode, district, state, language = 'hi') {
    try {
      // Get projects from multiple sources
      const pmgsyProjects = await this.getPMGSYProjects(panchayatCode, district, state);
      const sbmProjects = await this.getSBMProjects(panchayatCode, district, state);
      const nrdwpProjects = await this.getNRDWPProjects(panchayatCode, district, state);
      
      return this.formatDevelopmentProjects({
        pmgsy: pmgsyProjects,
        sbm: sbmProjects,
        nrdwp: nrdwpProjects
      }, language);
    } catch (error) {
      console.error('Development projects error:', error);
      return this.getMockDevelopmentProjects(language);
    }
  }

  async getPMGSYProjects(panchayatCode, district, state) {
    try {
      const response = await fetch(
        `${this.endpoints.pmgsy}/projects/${state}/${district}/${panchayatCode}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.projects || [];
      }
      return [];
    } catch (error) {
      console.error('PMGSY API error:', error);
      return [];
    }
  }

  async getSBMProjects(panchayatCode, district, state) {
    try {
      const response = await fetch(
        `${this.endpoints.sbm}/projects/${state}/${district}/${panchayatCode}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.projects || [];
      }
      return [];
    } catch (error) {
      console.error('SBM API error:', error);
      return [];
    }
  }

  async getNRDWPProjects(panchayatCode, district, state) {
    try {
      const response = await fetch(
        `${this.endpoints.nrdwp}/projects/${state}/${district}/${panchayatCode}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.projects || [];
      }
      return [];
    } catch (error) {
      console.error('NRDWP API error:', error);
      return [];
    }
  }

  // ==================== FORMATTING FUNCTIONS ====================
  
  formatPanchayatNotices(notices, language) {
    const translations = {
      hi: {
        meeting: 'बैठक',
        announcement: 'घोषणा',
        scheme: 'योजना',
        development: 'विकास',
        high: 'उच्च',
        medium: 'मध्यम',
        low: 'निम्न'
      },
      en: {
        meeting: 'Meeting',
        announcement: 'Announcement',
        scheme: 'Scheme',
        development: 'Development',
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      ur: {
        meeting: 'میٹنگ',
        announcement: 'اعلان',
        scheme: 'اسکیم',
        development: 'ترقی',
        high: 'اعلیٰ',
        medium: 'درمیانہ',
        low: 'کم'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      notices: notices.map(notice => ({
        id: notice.id || `PN${Date.now()}`,
        title: notice.title,
        content: notice.content || notice.description,
        date: notice.publishedDate || notice.date || new Date().toISOString().split('T')[0],
        category: notice.category || 'announcement',
        priority: notice.priority || 'medium',
        attachments: notice.attachments || [],
        localizedCategory: t[notice.category] || notice.category,
        localizedPriority: t[notice.priority] || notice.priority
      })),
      totalCount: notices.length,
      lastUpdated: new Date().toISOString()
    };
  }

  formatGramSabhaMeetings(meetings, language) {
    const translations = {
      hi: {
        scheduled: 'निर्धारित',
        completed: 'पूर्ण',
        cancelled: 'रद्द',
        postponed: 'स्थगित'
      },
      en: {
        scheduled: 'Scheduled',
        completed: 'Completed',
        cancelled: 'Cancelled',
        postponed: 'Postponed'
      },
      ur: {
        scheduled: 'طے شدہ',
        completed: 'مکمل',
        cancelled: 'منسوخ',
        postponed: 'ملتوی'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      meetings: meetings.map(meeting => ({
        id: meeting.id || `GM${Date.now()}`,
        title: meeting.title || (language === 'hi' ? 'ग्राम सभा बैठक' : 'Gram Sabha Meeting'),
        date: meeting.date,
        time: meeting.time,
        venue: meeting.venue,
        agenda: meeting.agenda || [],
        status: meeting.status || 'scheduled',
        attendees: meeting.attendees || 0,
        decisions: meeting.decisions || [],
        localizedStatus: t[meeting.status] || meeting.status
      })),
      totalCount: meetings.length,
      lastUpdated: new Date().toISOString()
    };
  }

  formatMGNREGAData(data, language) {
    const translations = {
      hi: {
        active: 'सक्रिय',
        completed: 'पूर्ण',
        ongoing: 'चालू',
        pending: 'लंबित'
      },
      en: {
        active: 'Active',
        completed: 'Completed',
        ongoing: 'Ongoing',
        pending: 'Pending'
      },
      ur: {
        active: 'فعال',
        completed: 'مکمل',
        ongoing: 'جاری',
        pending: 'زیر التواء'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      jobCards: {
        total: data.jobCards?.total || 0,
        active: data.jobCards?.active || 0,
        issued: data.jobCards?.issued || 0
      },
      employment: {
        totalDaysProvided: data.employment?.totalDays || 0,
        averageDaysPerHousehold: data.employment?.avgDays || 0,
        wageRate: data.employment?.wageRate || 220,
        totalWagesPaid: data.employment?.totalWages || 0
      },
      works: {
        total: data.works?.total || 0,
        completed: data.works?.completed || 0,
        ongoing: data.works?.ongoing || 0,
        approved: data.works?.approved || 0
      },
      expenditure: {
        totalBudget: data.expenditure?.budget || 0,
        totalExpenditure: data.expenditure?.spent || 0,
        utilizationPercentage: data.expenditure?.utilization || 0
      },
      lastUpdated: new Date().toISOString()
    };
  }

  formatDevelopmentProjects(projects, language) {
    const translations = {
      hi: {
        road: 'सड़क',
        sanitation: 'स्वच्छता',
        water: 'पानी',
        planning: 'योजना',
        approved: 'स्वीकृत',
        ongoing: 'चालू',
        completed: 'पूर्ण'
      },
      en: {
        road: 'Road',
        sanitation: 'Sanitation',
        water: 'Water',
        planning: 'Planning',
        approved: 'Approved',
        ongoing: 'Ongoing',
        completed: 'Completed'
      },
      ur: {
        road: 'سڑک',
        sanitation: 'صفائی',
        water: 'پانی',
        planning: 'منصوبہ بندی',
        approved: 'منظور شدہ',
        ongoing: 'جاری',
        completed: 'مکمل'
      }
    };

    const t = translations[language] || translations.hi;

    const allProjects = [
      ...(projects.pmgsy || []).map(p => ({ ...p, scheme: 'PMGSY', type: 'road' })),
      ...(projects.sbm || []).map(p => ({ ...p, scheme: 'SBM', type: 'sanitation' })),
      ...(projects.nrdwp || []).map(p => ({ ...p, scheme: 'NRDWP', type: 'water' }))
    ];

    return {
      projects: allProjects.map(project => ({
        id: project.id || `DP${Date.now()}`,
        name: project.name || project.title,
        scheme: project.scheme,
        type: project.type,
        status: project.status || 'planning',
        budget: project.budget || 0,
        expenditure: project.expenditure || 0,
        startDate: project.startDate,
        expectedCompletion: project.expectedCompletion,
        contractor: project.contractor,
        description: project.description,
        localizedType: t[project.type] || project.type,
        localizedStatus: t[project.status] || project.status
      })),
      summary: {
        total: allProjects.length,
        byStatus: this.groupByStatus(allProjects),
        byScheme: this.groupByScheme(allProjects),
        totalBudget: allProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
        totalExpenditure: allProjects.reduce((sum, p) => sum + (p.expenditure || 0), 0)
      },
      lastUpdated: new Date().toISOString()
    };
  }

  // ==================== MOCK DATA FUNCTIONS ====================
  
  getMockPanchayatNotices(language) {
    const mockNotices = [
      {
        id: 'PN001',
        title: language === 'hi' ? 'ग्राम सभा की बैठक - 15 दिसंबर 2024' : 
              language === 'en' ? 'Gram Sabha Meeting - December 15, 2024' :
              'گرام سبھا میٹنگ - 15 دسمبر 2024',
        content: language === 'hi' ? 
          'सभी ग्रामवासियों को सूचित किया जाता है कि दिनांक 15 दिसंबर 2024 को प्रातः 10 बजे ग्राम सभा की बैठक आयोजित की जाएगी। सभी से उपस्थित होने का अनुरोध है।' :
          language === 'en' ?
          'All villagers are informed that Gram Sabha meeting will be held on December 15, 2024 at 10 AM. Everyone is requested to attend.' :
          'تمام گاؤں والوں کو اطلاع دی جاتی ہے کہ 15 دسمبر 2024 کو صبح 10 بجے گرام سبھا کی میٹنگ ہوگی۔ سب سے حاضری کی درخواست ہے۔',
        date: '2024-12-10',
        category: 'meeting',
        priority: 'high'
      },
      {
        id: 'PN002',
        title: language === 'hi' ? 'स्वच्छ भारत मिशन - शौचालय निर्माण' :
              language === 'en' ? 'Swachh Bharat Mission - Toilet Construction' :
              'سوچھ بھارت مشن - بیت الخلاء کی تعمیر',
        content: language === 'hi' ?
          'स्वच्छ भारत मिशन के तहत शौचालय निर्माण के लिए आवेदन आमंत्रित किए जाते हैं। पात्र परिवारों को ₹12,000 की सहायता प्रदान की जाएगी।' :
          language === 'en' ?
          'Applications invited for toilet construction under Swachh Bharat Mission. Eligible families will receive ₹12,000 assistance.' :
          'سوچھ بھارت مشن کے تحت بیت الخلاء کی تعمیر کے لیے درخواستیں مدعو ہیں۔ اہل خاندانوں کو ₹12,000 کی مدد فراہم کی جائے گی۔',
        date: '2024-12-08',
        category: 'scheme',
        priority: 'medium'
      },
      {
        id: 'PN003',
        title: language === 'hi' ? 'MGNREGA कार्य की शुरुआत' :
              language === 'en' ? 'MGNREGA Work Commencement' :
              'MGNREGA کام کی شروعات',
        content: language === 'hi' ?
          'गांव में तालाब की सफाई और मरम्मत का कार्य 20 दिसंबर से शुरू होगा। इच्छुक मजदूर अपना नाम दर्ज कराएं।' :
          language === 'en' ?
          'Pond cleaning and repair work will start from December 20. Interested workers should register their names.' :
          'تالاب کی صفائی اور مرمت کا کام 20 دسمبر سے شروع ہوگا۔ دلچسپی رکھنے والے مزدور اپنا نام درج کرائیں۔',
        date: '2024-12-05',
        category: 'development',
        priority: 'medium'
      }
    ];

    return this.formatPanchayatNotices(mockNotices, language);
  }

  getMockGramSabhaMeetings(language) {
    const mockMeetings = [
      {
        id: 'GM001',
        title: language === 'hi' ? 'मासिक ग्राम सभा बैठक' : 'Monthly Gram Sabha Meeting',
        date: '2024-12-15',
        time: '10:00 AM',
        venue: language === 'hi' ? 'पंचायत भवन' : 'Panchayat Bhawan',
        agenda: [
          language === 'hi' ? 'पिछली बैठक की कार्यवाही' : 'Previous meeting proceedings',
          language === 'hi' ? 'विकास कार्यों की समीक्षा' : 'Review of development works',
          language === 'hi' ? 'नई योजनाओं पर चर्चा' : 'Discussion on new schemes'
        ],
        status: 'scheduled',
        attendees: 0
      },
      {
        id: 'GM002',
        title: language === 'hi' ? 'बजट अनुमोदन बैठक' : 'Budget Approval Meeting',
        date: '2024-11-20',
        time: '11:00 AM',
        venue: language === 'hi' ? 'प्राथमिक विद्यालय' : 'Primary School',
        agenda: [
          language === 'hi' ? 'वार्षिक बजट प्रस्तुति' : 'Annual budget presentation',
          language === 'hi' ? 'व्यय की समीक्षा' : 'Expenditure review'
        ],
        status: 'completed',
        attendees: 45,
        decisions: [
          language === 'hi' ? 'बजट स्वीकृत' : 'Budget approved',
          language === 'hi' ? 'सड़क मरम्मत को प्राथमिकता' : 'Road repair prioritized'
        ]
      }
    ];

    return this.formatGramSabhaMeetings(mockMeetings, language);
  }

  getMockMGNREGAData(language) {
    const mockData = {
      jobCards: {
        total: 450,
        active: 380,
        issued: 420
      },
      employment: {
        totalDays: 8500,
        avgDays: 22,
        wageRate: 220,
        totalWages: 1870000
      },
      works: {
        total: 25,
        completed: 18,
        ongoing: 5,
        approved: 23
      },
      expenditure: {
        budget: 2500000,
        spent: 1870000,
        utilization: 74.8
      }
    };

    return this.formatMGNREGAData(mockData, language);
  }

  getMockDevelopmentProjects(language) {
    const mockProjects = {
      pmgsy: [
        {
          id: 'PMGSY001',
          name: language === 'hi' ? 'मुख्य सड़क का निर्माण' : 'Main Road Construction',
          status: 'ongoing',
          budget: 1500000,
          expenditure: 900000,
          startDate: '2024-06-01',
          expectedCompletion: '2024-12-31',
          contractor: language === 'hi' ? 'राज कंस्ट्रक्शन' : 'Raj Construction'
        }
      ],
      sbm: [
        {
          id: 'SBM001',
          name: language === 'hi' ? 'सामुदायिक शौचालय निर्माण' : 'Community Toilet Construction',
          status: 'completed',
          budget: 800000,
          expenditure: 780000,
          startDate: '2024-03-01',
          expectedCompletion: '2024-08-31',
          contractor: language === 'hi' ? 'स्वच्छता निर्माण कंपनी' : 'Sanitation Construction Company'
        }
      ],
      nrdwp: [
        {
          id: 'NRDWP001',
          name: language === 'hi' ? 'हैंडपंप स्थापना' : 'Hand Pump Installation',
          status: 'approved',
          budget: 300000,
          expenditure: 0,
          startDate: '2024-12-01',
          expectedCompletion: '2025-02-28',
          contractor: language === 'hi' ? 'जल संसाधन कंपनी' : 'Water Resources Company'
        }
      ]
    };

    return this.formatDevelopmentProjects(mockProjects, language);
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  groupByStatus(projects) {
    return projects.reduce((acc, project) => {
      const status = project.status || 'planning';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }

  groupByScheme(projects) {
    return projects.reduce((acc, project) => {
      const scheme = project.scheme || 'Other';
      acc[scheme] = (acc[scheme] || 0) + 1;
      return acc;
    }, {});
  }

  async testConnectivity() {
    const results = {
      eGramSwaraj: false,
      mgnrega: false,
      pmgsy: false,
      sbm: false,
      nrdwp: false
    };

    // Test each endpoint
    for (const [key, endpoint] of Object.entries(this.endpoints)) {
      try {
        const response = await fetch(`${endpoint}/health`, { 
          method: 'HEAD',
          timeout: 5000 
        });
        results[key] = response.ok;
      } catch (error) {
        console.error(`${key} connectivity test failed:`, error);
        results[key] = false;
      }
    }

    return results;
  }
}

export const panchayatDataService = new PanchayatDataService();
