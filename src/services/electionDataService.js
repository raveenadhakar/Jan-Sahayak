class ElectionDataService {
  constructor() {
    // Election and civic data endpoints
    this.endpoints = {
      // Election Commission of India
      eci: 'https://results.eci.gov.in/api',
      eciVoter: 'https://voters.eci.gov.in/api',
      
      // National Voters' Service Portal
      nvsp: 'https://www.nvsp.in/api',
      
      // State Election Commission
      sec: 'https://sec.up.gov.in/api',
      
      // Systematic Voters' Education and Electoral Participation
      sveep: 'https://sveep.eci.gov.in/api',
      
      // Chief Electoral Officer
      ceo: 'https://ceouttarpradesh.nic.in/api'
    };

    this.apiKeys = {
      eci: import.meta.env.VITE_ECI_API_KEY || '',
      nvsp: import.meta.env.VITE_NVSP_API_KEY || ''
    };

    // Election types
    this.electionTypes = {
      hi: {
        'lok_sabha': 'लोक सभा',
        'vidhan_sabha': 'विधान सभा',
        'panchayat': 'पंचायत',
        'municipal': 'नगरपालिका',
        'rajya_sabha': 'राज्य सभा'
      },
      en: {
        'lok_sabha': 'Lok Sabha',
        'vidhan_sabha': 'Vidhan Sabha',
        'panchayat': 'Panchayat',
        'municipal': 'Municipal',
        'rajya_sabha': 'Rajya Sabha'
      },
      ur: {
        'lok_sabha': 'لوک سبھا',
        'vidhan_sabha': 'ودھان سبھا',
        'panchayat': 'پنچایت',
        'municipal': 'میونسپل',
        'rajya_sabha': 'راجیہ سبھا'
      }
    };
  }

  // ==================== VOTER INFORMATION ====================
  
  async getVoterInformation(voterId, language = 'hi') {
    try {
      // Try NVSP API first
      let voterData = await this.getNVSPVoterData(voterId);
      
      if (!voterData) {
        voterData = await this.getECIVoterData(voterId);
      }
      
      return this.formatVoterInformation(voterData, language);
    } catch (error) {
      console.error('Voter information error:', error);
      return this.getMockVoterInformation(language);
    }
  }

  async getNVSPVoterData(voterId) {
    try {
      const response = await fetch(
        `${this.endpoints.nvsp}/voter/${voterId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKeys.nvsp}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('NVSP API error:', error);
      return null;
    }
  }

  async getECIVoterData(voterId) {
    try {
      const response = await fetch(
        `${this.endpoints.eciVoter}/search/${voterId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKeys.eci}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('ECI Voter API error:', error);
      return null;
    }
  }

  // ==================== CONSTITUENCY INFORMATION ====================
  
  async getConstituencyInfo(constituencyCode, state, language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.eci}/constituency/${state}/${constituencyCode}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatConstituencyInfo(data, language);
      }
      
      return this.getMockConstituencyInfo(language);
    } catch (error) {
      console.error('Constituency info error:', error);
      return this.getMockConstituencyInfo(language);
    }
  }

  // ==================== ELECTION RESULTS ====================
  
  async getElectionResults(constituencyCode, electionType, year, language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.eci}/results/${electionType}/${year}/${constituencyCode}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatElectionResults(data, language);
      }
      
      return this.getMockElectionResults(electionType, language);
    } catch (error) {
      console.error('Election results error:', error);
      return this.getMockElectionResults(electionType, language);
    }
  }

  // ==================== UPCOMING ELECTIONS ====================
  
  async getUpcomingElections(state, district, language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.eci}/upcoming/${state}/${district}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatUpcomingElections(data, language);
      }
      
      return this.getMockUpcomingElections(language);
    } catch (error) {
      console.error('Upcoming elections error:', error);
      return this.getMockUpcomingElections(language);
    }
  }

  // ==================== POLLING STATION INFO ====================
  
  async getPollingStationInfo(voterId, language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.nvsp}/polling-station/${voterId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKeys.nvsp}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatPollingStationInfo(data, language);
      }
      
      return this.getMockPollingStationInfo(language);
    } catch (error) {
      console.error('Polling station info error:', error);
      return this.getMockPollingStationInfo(language);
    }
  }

  // ==================== VOTER REGISTRATION ====================
  
  async checkVoterRegistration(name, fatherName, age, address, language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.nvsp}/check-registration`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKeys.nvsp}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            fatherName,
            age,
            address
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatRegistrationStatus(data, language);
      }
      
      return this.getMockRegistrationStatus(language);
    } catch (error) {
      console.error('Voter registration check error:', error);
      return this.getMockRegistrationStatus(language);
    }
  }

  // ==================== ELECTORAL LITERACY ====================
  
  async getElectoralLiteracy(language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.sveep}/literacy-content/${language}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatElectoralLiteracy(data, language);
      }
      
      return this.getMockElectoralLiteracy(language);
    } catch (error) {
      console.error('Electoral literacy error:', error);
      return this.getMockElectoralLiteracy(language);
    }
  }

  // ==================== FORMATTING FUNCTIONS ====================
  
  formatVoterInformation(data, language) {
    if (!data) return this.getMockVoterInformation(language);

    const translations = {
      hi: {
        registered: 'पंजीकृत',
        not_registered: 'पंजीकृत नहीं',
        active: 'सक्रिय',
        inactive: 'निष्क्रिय',
        male: 'पुरुष',
        female: 'महिला',
        other: 'अन्य'
      },
      en: {
        registered: 'Registered',
        not_registered: 'Not Registered',
        active: 'Active',
        inactive: 'Inactive',
        male: 'Male',
        female: 'Female',
        other: 'Other'
      },
      ur: {
        registered: 'رجسٹرڈ',
        not_registered: 'رجسٹرڈ نہیں',
        active: 'فعال',
        inactive: 'غیر فعال',
        male: 'مرد',
        female: 'عورت',
        other: 'دیگر'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      voter: {
        id: data.voterId || data.voter_id,
        name: data.name,
        fatherName: data.fatherName || data.father_name,
        age: data.age,
        gender: data.gender,
        localizedGender: t[data.gender?.toLowerCase()] || data.gender,
        address: data.address,
        constituency: data.constituency,
        pollingStation: data.pollingStation || data.polling_station
      },
      status: {
        registered: data.isRegistered || data.is_registered || false,
        active: data.isActive || data.is_active || false,
        localizedStatus: data.isRegistered ? t.registered : t.not_registered
      },
      documents: {
        epicNumber: data.epicNumber || data.epic_number,
        issueDate: data.issueDate || data.issue_date,
        lastUpdated: data.lastUpdated || data.last_updated
      },
      lastUpdated: new Date().toISOString()
    };
  }

  formatConstituencyInfo(data, language) {
    const translations = {
      hi: {
        lok_sabha: 'लोक सभा',
        vidhan_sabha: 'विधान सभा',
        reserved: 'आरक्षित',
        general: 'सामान्य',
        sc: 'अनुसूचित जाति',
        st: 'अनुसूचित जनजाति'
      },
      en: {
        lok_sabha: 'Lok Sabha',
        vidhan_sabha: 'Vidhan Sabha',
        reserved: 'Reserved',
        general: 'General',
        sc: 'Scheduled Caste',
        st: 'Scheduled Tribe'
      },
      ur: {
        lok_sabha: 'لوک سبھا',
        vidhan_sabha: 'ودھان سبھا',
        reserved: 'محفوظ',
        general: 'عام',
        sc: 'شیڈولڈ کاسٹ',
        st: 'شیڈولڈ ٹرائب'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      constituency: {
        code: data.code,
        name: data.name,
        type: data.type,
        localizedType: t[data.type?.toLowerCase()] || data.type,
        category: data.category || 'general',
        localizedCategory: t[data.category?.toLowerCase()] || data.category,
        state: data.state,
        district: data.district
      },
      demographics: {
        totalVoters: data.totalVoters || data.total_voters || 0,
        maleVoters: data.maleVoters || data.male_voters || 0,
        femaleVoters: data.femaleVoters || data.female_voters || 0,
        pollingStations: data.pollingStations || data.polling_stations || 0
      },
      currentRepresentative: {
        name: data.currentMP || data.current_mp || data.currentMLA || data.current_mla,
        party: data.currentParty || data.current_party,
        electedYear: data.electedYear || data.elected_year
      },
      lastUpdated: new Date().toISOString()
    };
  }

  formatElectionResults(data, language) {
    const translations = {
      hi: {
        winner: 'विजेता',
        runner_up: 'उपविजेता',
        votes: 'मत',
        margin: 'अंतर',
        turnout: 'मतदान प्रतिशत'
      },
      en: {
        winner: 'Winner',
        runner_up: 'Runner Up',
        votes: 'Votes',
        margin: 'Margin',
        turnout: 'Turnout'
      },
      ur: {
        winner: 'فاتح',
        runner_up: 'دوسرے نمبر پر',
        votes: 'ووٹ',
        margin: 'فرق',
        turnout: 'ووٹنگ کی شرح'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      election: {
        type: data.electionType || data.election_type,
        year: data.year,
        constituency: data.constituency,
        totalVotes: data.totalVotes || data.total_votes || 0,
        validVotes: data.validVotes || data.valid_votes || 0,
        turnoutPercentage: data.turnoutPercentage || data.turnout_percentage || 0
      },
      results: (data.candidates || []).map((candidate, index) => ({
        rank: index + 1,
        name: candidate.name,
        party: candidate.party,
        votes: candidate.votes,
        percentage: candidate.percentage || ((candidate.votes / (data.validVotes || 1)) * 100).toFixed(2),
        status: index === 0 ? t.winner : (index === 1 ? t.runner_up : ''),
        margin: index === 1 ? (data.candidates[0].votes - candidate.votes) : null
      })),
      summary: {
        winner: data.candidates?.[0]?.name || '',
        winnerParty: data.candidates?.[0]?.party || '',
        winnerVotes: data.candidates?.[0]?.votes || 0,
        margin: data.candidates?.[1] ? (data.candidates[0].votes - data.candidates[1].votes) : 0,
        turnout: data.turnoutPercentage || 0
      },
      labels: t,
      lastUpdated: new Date().toISOString()
    };
  }

  formatUpcomingElections(data, language) {
    const translations = {
      hi: {
        scheduled: 'निर्धारित',
        notification_issued: 'अधिसूचना जारी',
        nomination_filing: 'नामांकन दाखिल',
        polling: 'मतदान',
        counting: 'मतगणना'
      },
      en: {
        scheduled: 'Scheduled',
        notification_issued: 'Notification Issued',
        nomination_filing: 'Nomination Filing',
        polling: 'Polling',
        counting: 'Counting'
      },
      ur: {
        scheduled: 'طے شدہ',
        notification_issued: 'نوٹیفکیشن جاری',
        nomination_filing: 'نامزدگی داخل',
        polling: 'ووٹنگ',
        counting: 'ووٹوں کی گنتی'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      elections: (data.elections || []).map(election => ({
        id: election.id,
        type: election.type,
        localizedType: this.electionTypes[language]?.[election.type] || election.type,
        constituency: election.constituency,
        state: election.state,
        district: election.district,
        status: election.status || 'scheduled',
        localizedStatus: t[election.status] || election.status,
        schedule: {
          notificationDate: election.notificationDate || election.notification_date,
          nominationStartDate: election.nominationStartDate || election.nomination_start_date,
          nominationEndDate: election.nominationEndDate || election.nomination_end_date,
          pollingDate: election.pollingDate || election.polling_date,
          countingDate: election.countingDate || election.counting_date
        },
        candidates: election.candidates || []
      })),
      totalElections: (data.elections || []).length,
      labels: t,
      lastUpdated: new Date().toISOString()
    };
  }

  formatPollingStationInfo(data, language) {
    return {
      pollingStation: {
        number: data.stationNumber || data.station_number,
        name: data.stationName || data.station_name,
        address: data.address,
        landmark: data.landmark,
        accessibility: data.accessibility || false,
        facilities: data.facilities || []
      },
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        distance: data.distance || 0,
        directions: data.directions || ''
      },
      timings: {
        openTime: data.openTime || data.open_time || '07:00',
        closeTime: data.closeTime || data.close_time || '18:00',
        specialTimings: data.specialTimings || data.special_timings || []
      },
      contact: {
        officer: data.presidingOfficer || data.presiding_officer,
        phone: data.contactNumber || data.contact_number,
        helpline: data.helpline || '1950'
      },
      lastUpdated: new Date().toISOString()
    };
  }

  formatRegistrationStatus(data, language) {
    const translations = {
      hi: {
        found: 'मिला',
        not_found: 'नहीं मिला',
        multiple_matches: 'कई मैच',
        pending: 'लंबित',
        approved: 'स्वीकृत',
        rejected: 'अस्वीकृत'
      },
      en: {
        found: 'Found',
        not_found: 'Not Found',
        multiple_matches: 'Multiple Matches',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected'
      },
      ur: {
        found: 'ملا',
        not_found: 'نہیں ملا',
        multiple_matches: 'کئی میچ',
        pending: 'زیر التواء',
        approved: 'منظور شدہ',
        rejected: 'مسترد'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      status: data.status || 'not_found',
      localizedStatus: t[data.status] || data.status,
      matches: (data.matches || []).map(match => ({
        voterId: match.voterId || match.voter_id,
        name: match.name,
        fatherName: match.fatherName || match.father_name,
        age: match.age,
        address: match.address,
        constituency: match.constituency,
        similarity: match.similarity || 0
      })),
      suggestions: data.suggestions || [],
      nextSteps: data.nextSteps || data.next_steps || [],
      lastUpdated: new Date().toISOString()
    };
  }

  formatElectoralLiteracy(data, language) {
    return {
      content: {
        basics: data.basics || [],
        rights: data.rights || [],
        process: data.process || [],
        faqs: data.faqs || []
      },
      resources: {
        videos: data.videos || [],
        documents: data.documents || [],
        infographics: data.infographics || []
      },
      quiz: data.quiz || [],
      lastUpdated: new Date().toISOString()
    };
  }

  // ==================== MOCK DATA FUNCTIONS ====================
  
  getMockVoterInformation(language) {
    const mockData = {
      voterId: 'ABC1234567',
      name: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
      fatherName: language === 'hi' ? 'श्याम लाल' : 'Shyam Lal',
      age: 35,
      gender: 'male',
      address: language === 'hi' ? 'गांव - रामपुर, मुजफ्फरनगर' : 'Village - Rampur, Muzaffarnagar',
      constituency: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
      pollingStation: language === 'hi' ? 'प्राथमिक विद्यालय, मुख्य बाजार' : 'Primary School, Main Market',
      isRegistered: true,
      isActive: true,
      epicNumber: 'ABC1234567',
      issueDate: '2019-03-15',
      lastUpdated: '2023-01-10'
    };

    return this.formatVoterInformation(mockData, language);
  }

  getMockConstituencyInfo(language) {
    const mockData = {
      code: 'PC03',
      name: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
      type: 'lok_sabha',
      category: 'general',
      state: language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh',
      district: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
      totalVoters: 1654321,
      maleVoters: 876543,
      femaleVoters: 777778,
      pollingStations: 1876,
      currentMP: language === 'hi' ? 'संजीव बालियान' : 'Sanjeev Balyan',
      currentParty: 'BJP',
      electedYear: 2019
    };

    return this.formatConstituencyInfo(mockData, language);
  }

  getMockElectionResults(electionType, language) {
    const mockData = {
      electionType: electionType,
      year: 2019,
      constituency: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
      totalVotes: 1200000,
      validVotes: 1150000,
      turnoutPercentage: 72.5,
      candidates: [
        {
          name: language === 'hi' ? 'संजीव बालियान' : 'Sanjeev Balyan',
          party: 'BJP',
          votes: 650000
        },
        {
          name: language === 'hi' ? 'हर्ष गोयल' : 'Harsh Goel',
          party: 'INC',
          votes: 450000
        },
        {
          name: language === 'hi' ? 'राजेश कुमार' : 'Rajesh Kumar',
          party: 'BSP',
          votes: 50000
        }
      ]
    };

    return this.formatElectionResults(mockData, language);
  }

  getMockUpcomingElections(language) {
    const mockData = {
      elections: [
        {
          id: 'UP_PANCHAYAT_2024',
          type: 'panchayat',
          constituency: language === 'hi' ? 'सभी पंचायतें' : 'All Panchayats',
          state: language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh',
          district: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
          status: 'scheduled',
          notificationDate: '2024-02-01',
          nominationStartDate: '2024-02-15',
          nominationEndDate: '2024-02-22',
          pollingDate: '2024-03-15',
          countingDate: '2024-03-18'
        }
      ]
    };

    return this.formatUpcomingElections(mockData, language);
  }

  getMockPollingStationInfo(language) {
    const mockData = {
      stationNumber: 'PS001',
      stationName: language === 'hi' ? 'प्राथमिक विद्यालय' : 'Primary School',
      address: language === 'hi' ? 'मुख्य बाजार, मुजफ्फरनगर' : 'Main Market, Muzaffarnagar',
      landmark: language === 'hi' ? 'पोस्ट ऑफिस के पास' : 'Near Post Office',
      accessibility: true,
      facilities: [
        language === 'hi' ? 'व्हीलचेयर सुविधा' : 'Wheelchair Access',
        language === 'hi' ? 'पार्किंग' : 'Parking',
        language === 'hi' ? 'पानी की सुविधा' : 'Water Facility'
      ],
      latitude: 29.4726,
      longitude: 77.7085,
      distance: 2.5,
      openTime: '07:00',
      closeTime: '18:00',
      presidingOfficer: language === 'hi' ? 'राजेश शर्मा' : 'Rajesh Sharma',
      contactNumber: '9876543210',
      helpline: '1950'
    };

    return this.formatPollingStationInfo(mockData, language);
  }

  getMockRegistrationStatus(language) {
    const mockData = {
      status: 'found',
      matches: [
        {
          voterId: 'ABC1234567',
          name: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
          fatherName: language === 'hi' ? 'श्याम लाल' : 'Shyam Lal',
          age: 35,
          address: language === 'hi' ? 'गांव - रामपुर' : 'Village - Rampur',
          constituency: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
          similarity: 95
        }
      ],
      suggestions: [],
      nextSteps: [
        language === 'hi' ? 'वोटर कार्ड डाउनलोड करें' : 'Download Voter Card',
        language === 'hi' ? 'पोलिंग स्टेशन की जानकारी देखें' : 'Check Polling Station Info'
      ]
    };

    return this.formatRegistrationStatus(mockData, language);
  }

  getMockElectoralLiteracy(language) {
    const mockData = {
      basics: [
        {
          title: language === 'hi' ? 'मतदान का अधिकार' : 'Right to Vote',
          content: language === 'hi' ? 
            '18 वर्ष की आयु पूरी करने वाला प्रत्येक भारतीय नागरिक मतदान कर सकता है।' :
            'Every Indian citizen who completes 18 years of age can vote.'
        },
        {
          title: language === 'hi' ? 'मतदान की प्रक्रिया' : 'Voting Process',
          content: language === 'hi' ? 
            'EVM मशीन का उपयोग करके अपने पसंदीदा उम्मीदवार को वोट दें।' :
            'Use EVM machine to vote for your preferred candidate.'
        }
      ],
      rights: [
        language === 'hi' ? 'गुप्त मतदान का अधिकार' : 'Right to Secret Ballot',
        language === 'hi' ? 'NOTA का विकल्प' : 'NOTA Option',
        language === 'hi' ? 'मतदान केंद्र पर सुविधाएं' : 'Facilities at Polling Station'
      ],
      process: [
        language === 'hi' ? 'वोटर कार्ड लेकर जाएं' : 'Carry Voter ID Card',
        language === 'hi' ? 'पहचान सत्यापन कराएं' : 'Get Identity Verified',
        language === 'hi' ? 'EVM पर वोट दें' : 'Vote on EVM',
        language === 'hi' ? 'VVPAT स्लिप देखें' : 'Check VVPAT Slip'
      ],
      faqs: [
        {
          question: language === 'hi' ? 'अगर वोटर कार्ड नहीं है तो क्या करें?' : 'What if I don\'t have Voter ID?',
          answer: language === 'hi' ? 
            'आधार कार्ड, पासपोर्ट, ड्राइविंग लाइसेंस जैसे वैकल्पिक दस्तावेज का उपयोग कर सकते हैं।' :
            'You can use alternative documents like Aadhaar Card, Passport, Driving License.'
        }
      ]
    };

    return this.formatElectoralLiteracy(mockData, language);
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  async testConnectivity() {
    const results = {
      eci: false,
      nvsp: false,
      sveep: false
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

  getElectionCalendar(year = new Date().getFullYear(), language = 'hi') {
    // Mock election calendar
    const calendar = [
      {
        month: 2,
        elections: [
          {
            type: 'panchayat',
            states: ['Uttar Pradesh'],
            phase: 1
          }
        ]
      },
      {
        month: 4,
        elections: [
          {
            type: 'lok_sabha',
            states: ['All States'],
            phase: 'Multiple'
          }
        ]
      }
    ];

    return {
      year,
      calendar,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const electionDataService = new ElectionDataService();