class AgriculturalDataService {
  constructor() {
    // Agricultural data endpoints
    this.endpoints = {
      // Agmarknet - Agricultural Marketing Division
      agmarknet: 'https://agmarknet.gov.in/SearchCmmMkt.aspx',
      
      // Directorate of Economics and Statistics (DES)
      des: 'https://eands.dacnet.nic.in/API',
      
      // National Sample Survey Office (NSSO)
      nsso: 'https://mospi.gov.in/web/mospi/download-tables-data',
      
      // Agricultural Statistics at a Glance
      agricStats: 'https://agricoop.nic.in/statistics',
      
      // Kisan Call Centre
      kisanCallCentre: 'https://mkisan.gov.in/api',
      
      // Weather based crop advisory
      cropAdvisory: 'https://icar.org.in/api/advisory',
      
      // Market Intelligence and Early Warning System
      miews: 'https://miews.gov.in/api'
    };

    this.apiKeys = {
      agmarknet: import.meta.env.VITE_AGMARKNET_API_KEY || '',
      des: import.meta.env.VITE_DES_API_KEY || '',
      weather: import.meta.env.VITE_WEATHER_API_KEY || ''
    };

    // Common crops in North India
    this.commonCrops = {
      hi: {
        'wheat': 'गेहूं',
        'rice': 'चावल',
        'sugarcane': 'गन्ना',
        'potato': 'आलू',
        'onion': 'प्याज',
        'mustard': 'सरसों',
        'barley': 'जौ',
        'gram': 'चना',
        'peas': 'मटर',
        'tomato': 'टमाटर'
      },
      en: {
        'wheat': 'Wheat',
        'rice': 'Rice',
        'sugarcane': 'Sugarcane',
        'potato': 'Potato',
        'onion': 'Onion',
        'mustard': 'Mustard',
        'barley': 'Barley',
        'gram': 'Gram',
        'peas': 'Peas',
        'tomato': 'Tomato'
      },
      ur: {
        'wheat': 'گندم',
        'rice': 'چاول',
        'sugarcane': 'گنا',
        'potato': 'آلو',
        'onion': 'پیاز',
        'mustard': 'سرسوں',
        'barley': 'جو',
        'gram': 'چنا',
        'peas': 'مٹر',
        'tomato': 'ٹماٹر'
      }
    };
  }

  // ==================== MANDI PRICES ====================
  
  async getMandiPrices(district = 'Muzaffarnagar', state = 'Uttar Pradesh', language = 'hi') {
    try {
      // Try Agmarknet API first
      let pricesData = await this.getAgmarknetPrices(district, state);
      
      if (!pricesData || pricesData.length === 0) {
        pricesData = await this.getDESPrices(district, state);
      }
      
      return this.formatMandiPrices(pricesData, language);
    } catch (error) {
      console.error('Mandi prices error:', error);
      return this.getMockMandiPrices(language);
    }
  }

  async getAgmarknetPrices(district, state) {
    try {
      // Agmarknet API integration
      const response = await fetch(
        `${this.endpoints.agmarknet}/prices/${state}/${district}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKeys.agmarknet}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.prices || [];
      }
      return null;
    } catch (error) {
      console.error('Agmarknet API error:', error);
      return null;
    }
  }

  async getDESPrices(district, state) {
    try {
      // DES API integration
      const response = await fetch(
        `${this.endpoints.des}/market-prices/${state}/${district}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKeys.des}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.marketPrices || [];
      }
      return null;
    } catch (error) {
      console.error('DES API error:', error);
      return null;
    }
  }

  // ==================== CROP ADVISORY ====================
  
  async getCropAdvisory(district, state, cropType = 'wheat', language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.cropAdvisory}/${state}/${district}/${cropType}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatCropAdvisory(data, language);
      }
      
      return this.getMockCropAdvisory(cropType, language);
    } catch (error) {
      console.error('Crop advisory error:', error);
      return this.getMockCropAdvisory(cropType, language);
    }
  }

  // ==================== WEATHER-BASED FARMING ADVICE ====================
  
  async getWeatherBasedAdvice(district, state, language = 'hi') {
    try {
      // Get current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${district},${state},IN&appid=${this.apiKeys.weather}&units=metric`
      );

      let weatherData = null;
      if (weatherResponse.ok) {
        weatherData = await weatherResponse.json();
      }

      // Get farming advice based on weather
      const advice = await this.generateFarmingAdvice(weatherData, language);
      
      return this.formatWeatherBasedAdvice(advice, weatherData, language);
    } catch (error) {
      console.error('Weather-based advice error:', error);
      return this.getMockWeatherBasedAdvice(language);
    }
  }

  async generateFarmingAdvice(weatherData, language) {
    const advice = {
      hi: {
        rainy: {
          title: 'बारिश के मौसम की सलाह',
          tips: [
            'फसल में जल निकासी की व्यवस्था करें',
            'कवकनाशी का छिड़काव करें',
            'खरपतवार नियंत्रण पर ध्यान दें',
            'बीज भंडारण को नमी से बचाएं'
          ]
        },
        sunny: {
          title: 'धूप के मौसम की सलाह',
          tips: [
            'नियमित सिंचाई करें',
            'मल्चिंग का उपयोग करें',
            'दोपहर में छायादार जगह पर काम करें',
            'पशुओं के लिए पानी की व्यवस्था करें'
          ]
        },
        cloudy: {
          title: 'बादल के मौसम की सलाह',
          tips: [
            'कटाई-बुआई का काम करें',
            'खाद-उर्वरक का प्रयोग करें',
            'पौधों की देखभाल करें',
            'मशीनों की सफाई करें'
          ]
        }
      },
      en: {
        rainy: {
          title: 'Rainy Season Advice',
          tips: [
            'Ensure proper drainage in fields',
            'Apply fungicide spray',
            'Focus on weed control',
            'Protect seed storage from moisture'
          ]
        },
        sunny: {
          title: 'Sunny Weather Advice',
          tips: [
            'Maintain regular irrigation',
            'Use mulching techniques',
            'Work in shade during afternoon',
            'Arrange water for livestock'
          ]
        },
        cloudy: {
          title: 'Cloudy Weather Advice',
          tips: [
            'Conduct harvesting and sowing',
            'Apply fertilizers',
            'Take care of plants',
            'Clean farming equipment'
          ]
        }
      },
      ur: {
        rainy: {
          title: 'بارش کے موسم کی صلاح',
          tips: [
            'کھیتوں میں پانی کی نکاسی کا انتظام کریں',
            'فنگی سائیڈ کا چھڑکاؤ کریں',
            'جھاڑ جھنکار کنٹرول پر توجہ دیں',
            'بیج کو نمی سے بچائیں'
          ]
        },
        sunny: {
          title: 'دھوپ کے موسم کی صلاح',
          tips: [
            'باقاعدگی سے آبپاشی کریں',
            'ملچنگ کا استعمال کریں',
            'دوپہر میں سائے میں کام کریں',
            'مویشیوں کے لیے پانی کا انتظام کریں'
          ]
        },
        cloudy: {
          title: 'بادل کے موسم کی صلاح',
          tips: [
            'کٹائی اور بوائی کا کام کریں',
            'کھاد کا استعمال کریں',
            'پودوں کی دیکھ بھال کریں',
            'مشینوں کی صفائی کریں'
          ]
        }
      }
    };

    if (!weatherData) return advice[language]?.cloudy || advice.hi.cloudy;

    const condition = weatherData.weather?.[0]?.main?.toLowerCase();
    
    if (condition?.includes('rain') || condition?.includes('drizzle')) {
      return advice[language]?.rainy || advice.hi.rainy;
    } else if (condition?.includes('clear') || condition?.includes('sun')) {
      return advice[language]?.sunny || advice.hi.sunny;
    } else {
      return advice[language]?.cloudy || advice.hi.cloudy;
    }
  }

  // ==================== MARKET TRENDS ====================
  
  async getMarketTrends(commodity = 'wheat', period = '30days', language = 'hi') {
    try {
      const response = await fetch(
        `${this.endpoints.miews}/trends/${commodity}/${period}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatMarketTrends(data, language);
      }
      
      return this.getMockMarketTrends(commodity, language);
    } catch (error) {
      console.error('Market trends error:', error);
      return this.getMockMarketTrends(commodity, language);
    }
  }

  // ==================== GOVERNMENT SCHEMES FOR FARMERS ====================
  
  async getFarmerSchemes(state, district, language = 'hi') {
    try {
      // This would integrate with government scheme APIs
      const schemes = await this.getFarmerSchemesData(state, district);
      return this.formatFarmerSchemes(schemes, language);
    } catch (error) {
      console.error('Farmer schemes error:', error);
      return this.getMockFarmerSchemes(language);
    }
  }

  async getFarmerSchemesData(state, district) {
    // Mock implementation - would integrate with actual APIs
    return [
      {
        id: 'PM_KISAN',
        name: 'PM-KISAN',
        type: 'income_support',
        amount: 6000,
        frequency: 'annual'
      },
      {
        id: 'CROP_INSURANCE',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        type: 'insurance',
        coverage: 'crop_loss'
      }
    ];
  }

  // ==================== FORMATTING FUNCTIONS ====================
  
  formatMandiPrices(prices, language) {
    const translations = {
      hi: {
        quintal: 'क्विंटल',
        minimum: 'न्यूनतम',
        maximum: 'अधिकतम',
        modal: 'औसत',
        market: 'मंडी',
        variety: 'किस्म'
      },
      en: {
        quintal: 'Quintal',
        minimum: 'Minimum',
        maximum: 'Maximum',
        modal: 'Modal',
        market: 'Market',
        variety: 'Variety'
      },
      ur: {
        quintal: 'کوئنٹل',
        minimum: 'کم سے کم',
        maximum: 'زیادہ سے زیادہ',
        modal: 'اوسط',
        market: 'منڈی',
        variety: 'قسم'
      }
    };

    const t = translations[language] || translations.hi;
    const crops = this.commonCrops[language] || this.commonCrops.hi;

    return {
      prices: prices.map(price => ({
        commodity: crops[price.commodity?.toLowerCase()] || price.commodity,
        variety: price.variety,
        market: price.market,
        minPrice: price.minPrice || price.min_price,
        maxPrice: price.maxPrice || price.max_price,
        modalPrice: price.modalPrice || price.modal_price,
        date: price.date || new Date().toISOString().split('T')[0],
        unit: `${t.quintal}`,
        trend: this.calculateTrend(price),
        priceChange: price.priceChange || 0
      })),
      summary: {
        totalCommodities: prices.length,
        avgPriceIncrease: this.calculateAvgIncrease(prices),
        topGainers: this.getTopGainers(prices, 3),
        topLosers: this.getTopLosers(prices, 3)
      },
      labels: t,
      lastUpdated: new Date().toISOString()
    };
  }

  formatCropAdvisory(data, language) {
    return {
      advisory: {
        crop: data.crop,
        stage: data.currentStage,
        recommendations: data.recommendations || [],
        fertilizers: data.fertilizers || [],
        pesticides: data.pesticides || [],
        irrigation: data.irrigation || {},
        weather_impact: data.weatherImpact || ''
      },
      schedule: {
        sowing: data.sowingSchedule || {},
        harvesting: data.harvestingSchedule || {},
        fertilization: data.fertilizationSchedule || []
      },
      alerts: data.alerts || [],
      lastUpdated: new Date().toISOString()
    };
  }

  formatWeatherBasedAdvice(advice, weatherData, language) {
    return {
      currentWeather: {
        temperature: weatherData?.main?.temp || 25,
        humidity: weatherData?.main?.humidity || 65,
        condition: weatherData?.weather?.[0]?.main || 'Clear',
        description: weatherData?.weather?.[0]?.description || 'Clear sky'
      },
      advice: {
        title: advice.title,
        tips: advice.tips,
        priority: 'medium',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      seasonalTips: this.getSeasonalTips(language),
      lastUpdated: new Date().toISOString()
    };
  }

  formatMarketTrends(data, language) {
    return {
      commodity: data.commodity,
      trends: {
        current: data.currentPrice || 0,
        weekAgo: data.weekAgoPrice || 0,
        monthAgo: data.monthAgoPrice || 0,
        yearAgo: data.yearAgoPrice || 0
      },
      analysis: {
        weeklyChange: data.weeklyChange || 0,
        monthlyChange: data.monthlyChange || 0,
        yearlyChange: data.yearlyChange || 0,
        volatility: data.volatility || 'low'
      },
      forecast: {
        nextWeek: data.nextWeekForecast || 0,
        nextMonth: data.nextMonthForecast || 0,
        confidence: data.confidence || 'medium'
      },
      lastUpdated: new Date().toISOString()
    };
  }

  formatFarmerSchemes(schemes, language) {
    const translations = {
      hi: {
        income_support: 'आय सहायता',
        insurance: 'बीमा',
        subsidy: 'सब्सिडी',
        loan: 'ऋण',
        active: 'सक्रिय',
        pending: 'लंबित',
        closed: 'बंद'
      },
      en: {
        income_support: 'Income Support',
        insurance: 'Insurance',
        subsidy: 'Subsidy',
        loan: 'Loan',
        active: 'Active',
        pending: 'Pending',
        closed: 'Closed'
      },
      ur: {
        income_support: 'آمدنی کی مدد',
        insurance: 'انشورنس',
        subsidy: 'سبسڈی',
        loan: 'قرض',
        active: 'فعال',
        pending: 'زیر التواء',
        closed: 'بند'
      }
    };

    const t = translations[language] || translations.hi;

    return {
      schemes: schemes.map(scheme => ({
        id: scheme.id,
        name: scheme.name,
        type: scheme.type,
        localizedType: t[scheme.type] || scheme.type,
        amount: scheme.amount || 0,
        frequency: scheme.frequency || 'one-time',
        eligibility: scheme.eligibility || [],
        documents: scheme.documents || [],
        applicationProcess: scheme.applicationProcess || '',
        status: scheme.status || 'active',
        localizedStatus: t[scheme.status] || scheme.status
      })),
      totalSchemes: schemes.length,
      categories: Object.keys(t).filter(key => !['active', 'pending', 'closed'].includes(key)),
      lastUpdated: new Date().toISOString()
    };
  }

  // ==================== MOCK DATA FUNCTIONS ====================
  
  getMockMandiPrices(language) {
    const mockPrices = [
      {
        commodity: 'wheat',
        variety: 'HD-2967',
        market: language === 'hi' ? 'मुजफ्फरनगर मंडी' : 'Muzaffarnagar Mandi',
        minPrice: 2100,
        maxPrice: 2150,
        modalPrice: 2125,
        date: new Date().toISOString().split('T')[0],
        priceChange: 25
      },
      {
        commodity: 'rice',
        variety: 'Basmati 1121',
        market: language === 'hi' ? 'मुजफ्फरनगर मंडी' : 'Muzaffarnagar Mandi',
        minPrice: 3800,
        maxPrice: 4200,
        modalPrice: 4000,
        date: new Date().toISOString().split('T')[0],
        priceChange: -50
      },
      {
        commodity: 'sugarcane',
        variety: 'Co-0238',
        market: language === 'hi' ? 'मुजफ्फरनगर मंडी' : 'Muzaffarnagar Mandi',
        minPrice: 340,
        maxPrice: 360,
        modalPrice: 350,
        date: new Date().toISOString().split('T')[0],
        priceChange: 10
      },
      {
        commodity: 'potato',
        variety: 'Kufri Jyoti',
        market: language === 'hi' ? 'मुजफ्फरनगर मंडी' : 'Muzaffarnagar Mandi',
        minPrice: 800,
        maxPrice: 1200,
        modalPrice: 1000,
        date: new Date().toISOString().split('T')[0],
        priceChange: 100
      },
      {
        commodity: 'onion',
        variety: 'Nasik Red',
        market: language === 'hi' ? 'मुजफ्फरनगर मंडी' : 'Muzaffarnagar Mandi',
        minPrice: 1500,
        maxPrice: 2000,
        modalPrice: 1750,
        date: new Date().toISOString().split('T')[0],
        priceChange: -200
      }
    ];

    return this.formatMandiPrices(mockPrices, language);
  }

  getMockCropAdvisory(cropType, language) {
    const advisories = {
      wheat: {
        hi: {
          crop: 'गेहूं',
          currentStage: 'बुआई का समय',
          recommendations: [
            'बीज दर: 100-125 किग्रा प्रति हेक्टेयर',
            'बुआई की गहराई: 3-5 सेमी',
            'पंक्ति से पंक्ति की दूरी: 20-23 सेमी'
          ],
          fertilizers: [
            'नाइट्रोजन: 120 किग्रा/हेक्टेयर',
            'फास्फोरस: 60 किग्रा/हेक्टेयर',
            'पोटाश: 40 किग्रा/हेक्टेयर'
          ],
          irrigation: {
            frequency: 'आवश्यकतानुसार',
            critical_stages: ['बुआई के बाद', 'फूल आने पर', 'दाना भरने पर']
          }
        },
        en: {
          crop: 'Wheat',
          currentStage: 'Sowing Time',
          recommendations: [
            'Seed rate: 100-125 kg per hectare',
            'Sowing depth: 3-5 cm',
            'Row to row spacing: 20-23 cm'
          ],
          fertilizers: [
            'Nitrogen: 120 kg/hectare',
            'Phosphorus: 60 kg/hectare',
            'Potash: 40 kg/hectare'
          ],
          irrigation: {
            frequency: 'As required',
            critical_stages: ['After sowing', 'At flowering', 'Grain filling']
          }
        }
      }
    };

    const advisory = advisories[cropType]?.[language] || advisories.wheat[language] || advisories.wheat.hi;
    return this.formatCropAdvisory(advisory, language);
  }

  getMockWeatherBasedAdvice(language) {
    const advice = {
      title: language === 'hi' ? 'आज के मौसम की सलाह' : 'Today\'s Weather Advice',
      tips: language === 'hi' ? [
        'मौसम साफ है, सिंचाई का काम करें',
        'खरपतवार नियंत्रण पर ध्यान दें',
        'फसल की निगरानी करें'
      ] : [
        'Weather is clear, do irrigation work',
        'Focus on weed control',
        'Monitor crop condition'
      ]
    };

    return this.formatWeatherBasedAdvice(advice, null, language);
  }

  getMockMarketTrends(commodity, language) {
    const mockData = {
      commodity: commodity,
      currentPrice: 2125,
      weekAgoPrice: 2100,
      monthAgoPrice: 2050,
      yearAgoPrice: 1950,
      weeklyChange: 1.2,
      monthlyChange: 3.7,
      yearlyChange: 9.0,
      volatility: 'medium',
      nextWeekForecast: 2150,
      nextMonthForecast: 2200,
      confidence: 'medium'
    };

    return this.formatMarketTrends(mockData, language);
  }

  getMockFarmerSchemes(language) {
    const mockSchemes = [
      {
        id: 'PM_KISAN',
        name: language === 'hi' ? 'प्रधानमंत्री किसान सम्मान निधि' : 'PM Kisan Samman Nidhi',
        type: 'income_support',
        amount: 6000,
        frequency: 'annual',
        status: 'active'
      },
      {
        id: 'CROP_INSURANCE',
        name: language === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना' : 'PM Fasal Bima Yojana',
        type: 'insurance',
        coverage: 'crop_loss',
        status: 'active'
      },
      {
        id: 'KCC',
        name: language === 'hi' ? 'किसान क्रेडिट कार्ड' : 'Kisan Credit Card',
        type: 'loan',
        amount: 300000,
        frequency: 'as_needed',
        status: 'active'
      }
    ];

    return this.formatFarmerSchemes(mockSchemes, language);
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  calculateTrend(price) {
    const change = price.priceChange || 0;
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'stable';
  }

  calculateAvgIncrease(prices) {
    const changes = prices.map(p => p.priceChange || 0);
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
  }

  getTopGainers(prices, count) {
    return prices
      .filter(p => (p.priceChange || 0) > 0)
      .sort((a, b) => (b.priceChange || 0) - (a.priceChange || 0))
      .slice(0, count);
  }

  getTopLosers(prices, count) {
    return prices
      .filter(p => (p.priceChange || 0) < 0)
      .sort((a, b) => (a.priceChange || 0) - (b.priceChange || 0))
      .slice(0, count);
  }

  getSeasonalTips(language) {
    const currentMonth = new Date().getMonth();
    const season = this.getCurrentSeason(currentMonth);
    
    const tips = {
      winter: {
        hi: [
          'रबी फसलों की बुआई का समय',
          'गेहूं, जौ, चना की खेती करें',
          'ठंड से फसल की सुरक्षा करें'
        ],
        en: [
          'Time for Rabi crop sowing',
          'Cultivate wheat, barley, gram',
          'Protect crops from cold'
        ]
      },
      summer: {
        hi: [
          'जायद फसलों की तैयारी',
          'सिंचाई की व्यवस्था करें',
          'गर्मी से बचाव के उपाय करें'
        ],
        en: [
          'Prepare for Zaid crops',
          'Arrange irrigation',
          'Take measures against heat'
        ]
      },
      monsoon: {
        hi: [
          'खरीफ फसलों की बुआई',
          'धान, मक्का, कपास की खेती',
          'जल निकासी की व्यवस्था करें'
        ],
        en: [
          'Kharif crop sowing',
          'Cultivate rice, maize, cotton',
          'Arrange proper drainage'
        ]
      }
    };

    return tips[season]?.[language] || tips[season]?.hi || [];
  }

  getCurrentSeason(month) {
    if (month >= 10 || month <= 2) return 'winter';  // Oct-Feb
    if (month >= 3 && month <= 5) return 'summer';   // Mar-May
    return 'monsoon';  // Jun-Sep
  }

  async testConnectivity() {
    const results = {
      agmarknet: false,
      des: false,
      weather: false,
      cropAdvisory: false
    };

    // Test weather API
    if (this.apiKeys.weather) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Delhi,IN&appid=${this.apiKeys.weather}`
        );
        results.weather = response.ok;
      } catch (error) {
        console.error('Weather API test failed:', error);
      }
    }

    // Test other APIs similarly...
    
    return results;
  }
}

export const agriculturalDataService = new AgriculturalDataService();