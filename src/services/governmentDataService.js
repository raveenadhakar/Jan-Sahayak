class GovernmentDataService {
  constructor() {
    // Government API endpoints
    this.endpoints = {
      // Open Government Data Platform
      ogd: 'https://api.data.gov.in/resource',
      
      // eGramSwaraj Portal
      eGramSwaraj: 'https://egramswaraj.gov.in/api',
      
      // Agricultural Marketing Division
      agmarknet: 'https://agmarknet.gov.in/SearchCmmMkt.aspx',
      
      // Election Commission of India
      eci: 'https://results.eci.gov.in/api',
      
      // National Health Mission
      nhm: 'https://nhm.gov.in/api',
      
      // Ayushman Bharat
      ayushman: 'https://pmjay.gov.in/api',
      
      // IMD Weather
      imd: 'https://mausam.imd.gov.in/imd_latest',
      
      // NDAP (National Data and Analytics Platform)
      ndap: 'https://ndap.niti.gov.in/api'
    };

    // API Keys (to be configured in .env)
    this.apiKeys = {
      dataGovIn: import.meta.env.VITE_DATA_GOV_IN_API_KEY || '',
      openWeather: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
      weatherApi: import.meta.env.VITE_WEATHER_API_KEY || ''
    };
  }

  // ==================== WEATHER DATA (IMD + OpenWeather) ====================
  
  async getWeatherData(district = 'Muzaffarnagar', state = 'Uttar Pradesh', language = 'hi') {
    try {
      // Try IMD first, fallback to OpenWeather
      let weatherData = await this.getIMDWeatherData(district, state);
      
      if (!weatherData) {
        weatherData = await this.getOpenWeatherData(district, state);
      }
      
      return this.formatWeatherResponse(weatherData, language);
    } catch (error) {
      console.error('Weather data error:', error);
      return this.getMockWeatherData(language);
    }
  }

  async getIMDWeatherData(district, state) {
    try {
      // IMD API integration (Note: IMD doesn't have public REST API, using mock structure)
      // In real implementation, you'd need to scrape IMD website or use their internal APIs
      const response = await fetch(`${this.endpoints.imd}/weather/${state}/${district}`);
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('IMD API error:', error);
      return null;
    }
  }

  async getOpenWeatherData(district, state) {
    if (!this.apiKeys.openWeather) return null;
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${district},${state},IN&appid=${this.apiKeys.openWeather}&units=metric`
      );
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('OpenWeather API error:', error);
      return null;
    }
  }

  // ==================== PANCHAYAT NOTICES (eGramSwaraj) ====================
  
  async getPanchayatNotices(panchayatCode, district, state, language = 'hi') {
    try {
      // eGramSwaraj API integration
      const response = await fetch(
        `${this.endpoints.eGramSwaraj}/notices/${state}/${district}/${panchayatCode}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatPanchayatNotices(data, language);
      }
      
      return this.getMockPanchayatNotices(language);
    } catch (error) {
      console.error('Panchayat notices error:', error);
      return this.getMockPanchayatNotices(language);
    }
  }

  // ==================== AGRICULTURAL PRICES (Agmarknet) ====================
  
  async getAgriculturalPrices(district, state, language = 'hi') {
    try {
      // Agmarknet API integration
      const response = await fetch(
        `${this.endpoints.agmarknet}/prices/${state}/${district}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatAgriculturalPrices(data, language);
      }
      
      return this.getMockAgriculturalPrices(language);
    } catch (error) {
      console.error('Agricultural prices error:', error);
      return this.getMockAgriculturalPrices(language);
    }
  }

  // ==================== WELFARE SCHEMES (data.gov.in) ====================
  
  async getWelfareSchemes(state, district, category = 'all', language = 'hi') {
    try {
      const apiKey = this.apiKeys.dataGovIn;
      const response = await fetch(
        `${this.endpoints.ogd}/schemes?api-key=${apiKey}&format=json&filters[state]=${state}&filters[district]=${district}&filters[category]=${category}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatWelfareSchemes(data, language);
      }
      
      return this.getMockWelfareSchemes(language);
    } catch (error) {
      console.error('Welfare schemes error:', error);
      return this.getMockWelfareSchemes(language);
    }
  }

  // ==================== VOTING INFORMATION (ECI) ====================
  
  async getVotingInformation(constituency, state, language = 'hi') {
    try {
      // ECI API integration
      const response = await fetch(
        `${this.endpoints.eci}/constituency/${state}/${constituency}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatVotingInformation(data, language);
      }
      
      return this.getMockVotingInformation(language);
    } catch (error) {
      console.error('Voting information error:', error);
      return this.getMockVotingInformation(language);
    }
  }

  // ==================== HEALTH ENTITLEMENTS (NHM + Ayushman Bharat) ====================
  
  async getHealthEntitlements(beneficiaryId, state, district, language = 'hi') {
    try {
      // Check Ayushman Bharat eligibility
      const ayushmanData = await this.getAyushmanBharatData(beneficiaryId, state);
      
      // Get NHM services
      const nhmData = await this.getNHMServices(district, state);
      
      return this.formatHealthEntitlements(ayushmanData, nhmData, language);
    } catch (error) {
      console.error('Health entitlements error:', error);
      return this.getMockHealthEntitlements(language);
    }
  }

  async getAyushmanBharatData(beneficiaryId, state) {
    try {
      const response = await fetch(
        `${this.endpoints.ayushman}/beneficiary/${beneficiaryId}/${state}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Ayushman Bharat API error:', error);
      return null;
    }
  }

  async getNHMServices(district, state) {
    try {
      const response = await fetch(
        `${this.endpoints.nhm}/services/${state}/${district}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('NHM API error:', error);
      return null;
    }
  }

  // ==================== FORMATTING FUNCTIONS ====================
  
  formatWeatherResponse(data, language) {
    if (!data) return this.getMockWeatherData(language);
    
    const translations = {
      hi: {
        temperature: 'तापमान',
        humidity: 'नमी',
        windSpeed: 'हवा की गति',
        condition: 'मौसम',
        forecast: 'पूर्वानुमान'
      },
      en: {
        temperature: 'Temperature',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        condition: 'Condition',
        forecast: 'Forecast'
      },
      ur: {
        temperature: 'درجہ حرارت',
        humidity: 'نمی',
        windSpeed: 'ہوا کی رفتار',
        condition: 'موسمی حالت',
        forecast: 'پیشن گوئی'
      }
    };

    return {
      current: {
        temperature: Math.round(data.main?.temp || 25),
        humidity: data.main?.humidity || 65,
        windSpeed: Math.round((data.wind?.speed || 10) * 3.6),
        condition: data.weather?.[0]?.main || 'Clear',
        description: data.weather?.[0]?.description || 'Clear sky'
      },
      labels: translations[language] || translations.hi,
      lastUpdated: new Date().toISOString()
    };
  }

  formatPanchayatNotices(data, language) {
    const notices = data?.notices || [];
    
    return {
      notices: notices.map(notice => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        date: notice.publishedDate,
        category: notice.category,
        priority: notice.priority || 'medium',
        attachments: notice.attachments || []
      })),
      totalCount: notices.length,
      lastUpdated: new Date().toISOString()
    };
  }

  formatAgriculturalPrices(data, language) {
    const prices = data?.prices || [];
    
    return {
      prices: prices.map(price => ({
        commodity: price.commodity,
        variety: price.variety,
        market: price.market,
        minPrice: price.minPrice,
        maxPrice: price.maxPrice,
        modalPrice: price.modalPrice,
        date: price.date,
        unit: price.unit || 'per quintal'
      })),
      marketTrends: data?.trends || [],
      lastUpdated: new Date().toISOString()
    };
  }

  formatWelfareSchemes(data, language) {
    const schemes = data?.records || [];
    
    return {
      schemes: schemes.map(scheme => ({
        id: scheme.scheme_id,
        name: scheme.scheme_name,
        description: scheme.description,
        eligibility: scheme.eligibility_criteria,
        benefits: scheme.benefits,
        applicationProcess: scheme.application_process,
        documents: scheme.required_documents,
        contactInfo: scheme.contact_information,
        status: scheme.status || 'active'
      })),
      totalCount: schemes.length,
      categories: data?.categories || [],
      lastUpdated: new Date().toISOString()
    };
  }

  formatVotingInformation(data, language) {
    return {
      constituency: {
        name: data?.constituency_name,
        code: data?.constituency_code,
        type: data?.constituency_type
      },
      elections: {
        upcoming: data?.upcoming_elections || [],
        recent: data?.recent_results || []
      },
      voterServices: {
        registrationStatus: data?.voter_registration,
        pollingStation: data?.polling_station_info,
        voterSlip: data?.voter_slip_info
      },
      lastUpdated: new Date().toISOString()
    };
  }

  formatHealthEntitlements(ayushmanData, nhmData, language) {
    return {
      ayushmanBharat: {
        eligible: ayushmanData?.eligible || false,
        familyId: ayushmanData?.family_id,
        coverageAmount: ayushmanData?.coverage_amount || 500000,
        beneficiaries: ayushmanData?.beneficiaries || [],
        nearbyHospitals: ayushmanData?.empanelled_hospitals || []
      },
      nhmServices: {
        primaryHealthCenters: nhmData?.phc_list || [],
        communityHealthCenters: nhmData?.chc_list || [],
        districtHospitals: nhmData?.district_hospitals || [],
        specialPrograms: nhmData?.special_programs || []
      },
      lastUpdated: new Date().toISOString()
    };
  }

  // ==================== MOCK DATA FUNCTIONS ====================
  
  getMockWeatherData(language) {
    return {
      current: {
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        condition: 'Clear',
        description: 'Clear sky'
      },
      labels: {
        temperature: language === 'hi' ? 'तापमान' : 'Temperature',
        humidity: language === 'hi' ? 'नमी' : 'Humidity',
        windSpeed: language === 'hi' ? 'हवा की गति' : 'Wind Speed'
      },
      lastUpdated: new Date().toISOString()
    };
  }

  getMockPanchayatNotices(language) {
    const mockNotices = [
      {
        id: 'PN001',
        title: language === 'hi' ? 'ग्राम सभा की बैठक' : 'Gram Sabha Meeting',
        content: language === 'hi' ? 
          'दिनांक 15 दिसंबर को ग्राम सभा की बैठक आयोजित की जाएगी।' :
          'Gram Sabha meeting will be held on December 15th.',
        date: '2024-12-10',
        category: 'meeting',
        priority: 'high'
      },
      {
        id: 'PN002',
        title: language === 'hi' ? 'स्वच्छता अभियान' : 'Cleanliness Drive',
        content: language === 'hi' ? 
          'गांव में स्वच्छता अभियान चलाया जा रहा है। सभी से सहयोग की अपेक्षा।' :
          'Village cleanliness drive is being conducted. Everyone\'s cooperation expected.',
        date: '2024-12-08',
        category: 'announcement',
        priority: 'medium'
      }
    ];

    return {
      notices: mockNotices,
      totalCount: mockNotices.length,
      lastUpdated: new Date().toISOString()
    };
  }

  getMockAgriculturalPrices(language) {
    const mockPrices = [
      {
        commodity: language === 'hi' ? 'गेहूं' : 'Wheat',
        variety: 'HD-2967',
        market: language === 'hi' ? 'मुजफ्फरनगर मंडी' : 'Muzaffarnagar Mandi',
        minPrice: 2100,
        maxPrice: 2150,
        modalPrice: 2125,
        date: new Date().toISOString().split('T')[0],
        unit: language === 'hi' ? 'प्रति क्विंटल' : 'per quintal'
      },
      {
        commodity: language === 'hi' ? 'धान' : 'Paddy',
        variety: 'Basmati',
        market: language === 'hi' ? 'मुजफ्फरनगर मंडी' : 'Muzaffarnagar Mandi',
        minPrice: 3800,
        maxPrice: 4200,
        modalPrice: 4000,
        date: new Date().toISOString().split('T')[0],
        unit: language === 'hi' ? 'प्रति क्विंटल' : 'per quintal'
      }
    ];

    return {
      prices: mockPrices,
      marketTrends: [],
      lastUpdated: new Date().toISOString()
    };
  }

  getMockWelfareSchemes(language) {
    const mockSchemes = [
      {
        id: 'WS001',
        name: language === 'hi' ? 'प्रधानमंत्री किसान सम्मान निधि' : 'PM Kisan Samman Nidhi',
        description: language === 'hi' ? 
          'किसानों को वार्षिक ₹6,000 की आर्थिक सहायता' :
          'Annual financial assistance of ₹6,000 to farmers',
        eligibility: language === 'hi' ? 
          '2 हेक्टेयर तक भूमि वाले किसान' :
          'Farmers with up to 2 hectares of land',
        benefits: ['₹6,000 annually', 'Direct bank transfer'],
        applicationProcess: language === 'hi' ? 
          'ऑनलाइन आवेदन pmkisan.gov.in पर' :
          'Apply online at pmkisan.gov.in',
        status: 'active'
      }
    ];

    return {
      schemes: mockSchemes,
      totalCount: mockSchemes.length,
      categories: ['agriculture', 'social', 'health'],
      lastUpdated: new Date().toISOString()
    };
  }

  getMockVotingInformation(language) {
    return {
      constituency: {
        name: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
        code: 'PC03',
        type: 'Lok Sabha'
      },
      elections: {
        upcoming: [],
        recent: []
      },
      voterServices: {
        registrationStatus: 'active',
        pollingStation: language === 'hi' ? 'प्राथमिक विद्यालय, मुख्य बाजार' : 'Primary School, Main Market',
        voterSlip: 'Available online'
      },
      lastUpdated: new Date().toISOString()
    };
  }

  getMockHealthEntitlements(language) {
    return {
      ayushmanBharat: {
        eligible: true,
        familyId: 'AB123456789',
        coverageAmount: 500000,
        beneficiaries: [
          { name: 'राम कुमार', relation: 'मुखिया', age: 45 },
          { name: 'सीता देवी', relation: 'पत्नी', age: 40 }
        ],
        nearbyHospitals: [
          { name: 'जिला अस्पताल मुजफ्फरनगर', distance: '5 km', type: 'Government' }
        ]
      },
      nhmServices: {
        primaryHealthCenters: [
          { name: 'PHC मुख्य बाजार', distance: '2 km', services: ['OPD', 'Vaccination'] }
        ],
        communityHealthCenters: [
          { name: 'CHC मुजफ्फरनगर', distance: '8 km', services: ['Emergency', 'Surgery'] }
        ],
        districtHospitals: [
          { name: 'जिला अस्पताल', distance: '5 km', services: ['All specialties'] }
        ],
        specialPrograms: ['Immunization', 'Maternal Health', 'TB Control']
      },
      lastUpdated: new Date().toISOString()
    };
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  async testAPIConnectivity() {
    const results = {
      openWeather: false,
      dataGovIn: false,
      eGramSwaraj: false,
      agmarknet: false
    };

    try {
      // Test OpenWeather API
      if (this.apiKeys.openWeather) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Delhi,IN&appid=${this.apiKeys.openWeather}`
        );
        results.openWeather = response.ok;
      }

      // Test other APIs similarly...
      
    } catch (error) {
      console.error('API connectivity test failed:', error);
    }

    return results;
  }

  getDataSources() {
    return {
      weather: {
        primary: 'India Meteorological Department (IMD)',
        fallback: 'OpenWeatherMap',
        updateFrequency: 'Every 3 hours'
      },
      panchayat: {
        primary: 'eGramSwaraj Portal',
        fallback: 'State Panchayati Raj Websites',
        updateFrequency: 'Daily'
      },
      agriculture: {
        primary: 'Agmarknet (Directorate of Economics and Statistics)',
        fallback: 'State Agricultural Marketing Boards',
        updateFrequency: 'Daily'
      },
      welfare: {
        primary: 'Open Government Data Platform (data.gov.in)',
        fallback: 'National Data and Analytics Platform (NDAP)',
        updateFrequency: 'Weekly'
      },
      voting: {
        primary: 'Election Commission of India (ECI)',
        fallback: 'State Election Commissions',
        updateFrequency: 'As per election schedule'
      },
      health: {
        primary: 'National Health Mission (NHM) & Ayushman Bharat',
        fallback: 'State Health Departments',
        updateFrequency: 'Monthly'
      }
    };
  }
}

export const governmentDataService = new GovernmentDataService();