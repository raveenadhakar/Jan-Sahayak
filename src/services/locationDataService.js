class LocationDataService {
  constructor() {
    // News APIs for location-based news
    this.newsEndpoints = {
      newsApi: 'https://newsapi.org/v2',
      newsData: 'https://newsdata.io/api/1',
      indianExpress: 'https://indianexpress.com/api',
      hindustanTimes: 'https://www.hindustantimes.com/api'
    };

    this.apiKeys = {
      newsApi: import.meta.env.VITE_NEWS_API_KEY || '',
      newsData: import.meta.env.VITE_NEWSDATA_API_KEY || '',
      openWeather: import.meta.env.VITE_OPENWEATHER_API_KEY || ''
    };

    // Indian states and their major districts
    this.stateDistricts = {
      'uttar pradesh': [
        'agra', 'aligarh', 'allahabad', 'ambedkar nagar', 'amethi', 'amroha', 'auraiya', 'azamgarh',
        'baghpat', 'bahraich', 'ballia', 'balrampur', 'banda', 'barabanki', 'bareilly', 'basti',
        'bhadohi', 'bijnor', 'budaun', 'bulandshahr', 'chandauli', 'chitrakoot', 'deoria',
        'etah', 'etawah', 'faizabad', 'farrukhabad', 'fatehpur', 'firozabad', 'gautam buddha nagar',
        'ghaziabad', 'ghazipur', 'gonda', 'gorakhpur', 'hamirpur', 'hapur', 'hardoi', 'hathras',
        'jalaun', 'jaunpur', 'jhansi', 'kannauj', 'kanpur dehat', 'kanpur nagar', 'kasganj',
        'kaushambi', 'kheri', 'kushinagar', 'lalitpur', 'lucknow', 'maharajganj', 'mahoba',
        'mainpuri', 'mathura', 'mau', 'meerut', 'mirzapur', 'moradabad', 'muzaffarnagar',
        'pilibhit', 'pratapgarh', 'raebareli', 'rampur', 'saharanpur', 'sambhal', 'sant kabir nagar',
        'shahjahanpur', 'shamli', 'shravasti', 'siddharthnagar', 'sitapur', 'sonbhadra',
        'sultanpur', 'unnao', 'varanasi'
      ],
      'bihar': [
        'araria', 'arwal', 'aurangabad', 'banka', 'begusarai', 'bhagalpur', 'bhojpur', 'buxar',
        'darbhanga', 'east champaran', 'gaya', 'gopalganj', 'jamui', 'jehanabad', 'kaimur',
        'katihar', 'khagaria', 'kishanganj', 'lakhisarai', 'madhepura', 'madhubani', 'munger',
        'muzaffarpur', 'nalanda', 'nawada', 'patna', 'purnia', 'rohtas', 'saharsa', 'samastipur',
        'saran', 'sheikhpura', 'sheohar', 'sitamarhi', 'siwan', 'supaul', 'vaishali', 'west champaran'
      ],
      'haryana': [
        'ambala', 'bhiwani', 'charkhi dadri', 'faridabad', 'fatehabad', 'gurugram', 'hisar',
        'jhajjar', 'jind', 'kaithal', 'karnal', 'kurukshetra', 'mahendragarh', 'nuh', 'palwal',
        'panchkula', 'panipat', 'rewari', 'rohtak', 'sirsa', 'sonipat', 'yamunanagar'
      ],
      'punjab': [
        'amritsar', 'barnala', 'bathinda', 'faridkot', 'fatehgarh sahib', 'fazilka', 'firozpur',
        'gurdaspur', 'hoshiarpur', 'jalandhar', 'kapurthala', 'ludhiana', 'mansa', 'moga',
        'mohali', 'muktsar', 'pathankot', 'patiala', 'rupnagar', 'sangrur', 'shaheed bhagat singh nagar', 'tarn taran'
      ]
    };

    // Major cities for news filtering
    this.majorCities = [
      'delhi', 'mumbai', 'kolkata', 'chennai', 'bangalore', 'hyderabad', 'pune', 'ahmedabad',
      'surat', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam',
      'pimpri chinchwad', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik',
      'faridabad', 'meerut', 'rajkot', 'kalyan dombivali', 'vasai virar', 'varanasi', 'srinagar',
      'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'ranchi', 'howrah',
      'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai', 'raipur',
      'kota', 'chandigarh', 'guwahati', 'solapur', 'hubli dharwad', 'bareilly', 'moradabad',
      'mysore', 'gurgaon', 'aligarh', 'jalandhar', 'tiruchirappalli', 'bhubaneswar', 'salem',
      'mira bhayandar', 'warangal', 'guntur', 'bhiwandi', 'saharanpur', 'gorakhpur', 'bikaner',
      'amravati', 'noida', 'jamshedpur', 'bhilai nagar', 'cuttack', 'firozabad', 'kochi',
      'bhavnagar', 'dehradun', 'durgapur', 'asansol', 'nanded waghala', 'kolhapur', 'ajmer',
      'akola', 'gulbarga', 'jamnagar', 'ujjain', 'loni', 'siliguri', 'jhansi', 'ulhasnagar',
      'nellore', 'jammu', 'sangli miraj kupwad', 'belgaum', 'mangalore', 'ambattur', 'tirunelveli',
      'malegaon', 'gaya', 'jalgaon', 'udaipur', 'maheshtala', 'muzaffarnagar'
    ];
  }

  // ==================== LOCATION-BASED NEWS ====================
  
  async getLocationBasedNews(userLocation, language = 'hi') {
    const { village, district, state } = userLocation;
    
    try {
      // Try multiple news sources
      let news = await this.getNewsFromMultipleSources(district, state, language);
      
      if (!news || news.length === 0) {
        news = await this.getRegionalNews(state, language);
      }
      
      return this.formatLocationNews(news, userLocation, language);
    } catch (error) {
      console.error('Location-based news error:', error);
      return this.getMockLocationNews(userLocation, language);
    }
  }

  async getNewsFromMultipleSources(district, state, language) {
    const newsPromises = [];

    // NewsAPI - English news
    if (this.apiKeys.newsApi) {
      newsPromises.push(this.getNewsAPIData(district, state));
    }

    // NewsData.io - Multi-language support
    if (this.apiKeys.newsData) {
      newsPromises.push(this.getNewsDataAPI(district, state, language));
    }

    // Try all sources and combine results
    const results = await Promise.allSettled(newsPromises);
    const allNews = [];

    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        allNews.push(...result.value);
      }
    });

    return allNews;
  }

  async getNewsAPIData(district, state) {
    try {
      // Search for news related to district and state
      const queries = [
        `${district} ${state}`,
        `${state} news`,
        `${district} government`,
        `${state} development`
      ];

      const allArticles = [];

      for (const query of queries) {
        const response = await fetch(
          `${this.newsEndpoints.newsApi}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${this.apiKeys.newsApi}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.articles) {
            allArticles.push(...data.articles);
          }
        }
      }

      return allArticles.slice(0, 20); // Limit to 20 articles
    } catch (error) {
      console.error('NewsAPI error:', error);
      return [];
    }
  }

  async getNewsDataAPI(district, state, language) {
    try {
      const langCode = this.getNewsLanguageCode(language);
      const queries = [
        `${district}`,
        `${state}`,
        `${district} ${state}`
      ];

      const allArticles = [];

      for (const query of queries) {
        const response = await fetch(
          `${this.newsEndpoints.newsData}/news?apikey=${this.apiKeys.newsData}&q=${encodeURIComponent(query)}&country=in&language=${langCode}&size=10`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.results) {
            allArticles.push(...data.results);
          }
        }
      }

      return allArticles.slice(0, 20);
    } catch (error) {
      console.error('NewsData API error:', error);
      return [];
    }
  }

  async getRegionalNews(state, language) {
    try {
      // Get general state-level news
      const langCode = this.getNewsLanguageCode(language);
      
      if (this.apiKeys.newsData) {
        const response = await fetch(
          `${this.newsEndpoints.newsData}/news?apikey=${this.apiKeys.newsData}&q=${encodeURIComponent(state)}&country=in&language=${langCode}&category=politics,top&size=15`
        );

        if (response.ok) {
          const data = await response.json();
          return data.results || [];
        }
      }

      return [];
    } catch (error) {
      console.error('Regional news error:', error);
      return [];
    }
  }

  // ==================== LOCATION-BASED WEATHER ====================
  
  async getLocationWeather(userLocation, language = 'hi') {
    const { district, state } = userLocation;
    
    try {
      if (!this.apiKeys.openWeather) {
        return this.getMockLocationWeather(userLocation, language);
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${district},${state},IN&appid=${this.apiKeys.openWeather}&units=metric&lang=${this.getWeatherLang(language)}`
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatLocationWeather(data, userLocation, language);
      }
      
      return this.getMockLocationWeather(userLocation, language);
    } catch (error) {
      console.error('Location weather error:', error);
      return this.getMockLocationWeather(userLocation, language);
    }
  }

  // ==================== LOCATION-BASED GOVERNMENT DATA ====================
  
  async getLocationGovernmentData(userLocation, language = 'hi') {
    const { district, state } = userLocation;
    
    try {
      // This would integrate with state-specific government APIs
      const govData = await this.getStateGovernmentData(state, district);
      return this.formatGovernmentData(govData, userLocation, language);
    } catch (error) {
      console.error('Government data error:', error);
      return this.getMockGovernmentData(userLocation, language);
    }
  }

  async getStateGovernmentData(state, district) {
    // Mock implementation - would integrate with actual state APIs
    const stateAPIs = {
      'uttar pradesh': 'https://up.gov.in/api',
      'bihar': 'https://bihar.gov.in/api',
      'haryana': 'https://haryana.gov.in/api',
      'punjab': 'https://punjab.gov.in/api'
    };

    const apiUrl = stateAPIs[state.toLowerCase()];
    if (!apiUrl) return null;

    try {
      // This would be actual API calls to state government portals
      const response = await fetch(`${apiUrl}/district/${district}/data`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('State API error:', error);
    }

    return null;
  }

  // ==================== FORMATTING FUNCTIONS ====================
  
  formatLocationNews(articles, userLocation, language) {
    const { village, district, state } = userLocation;
    
    return {
      location: {
        village,
        district,
        state
      },
      news: articles.map(article => ({
        id: article.id || this.generateId(),
        title: article.title,
        description: article.description || article.content,
        url: article.url || article.link,
        source: article.source?.name || article.source_id,
        publishedAt: article.publishedAt || article.pubDate,
        imageUrl: article.urlToImage || article.image_url,
        category: article.category || 'general',
        relevanceScore: this.calculateRelevanceScore(article, userLocation),
        language: language
      }))
      .filter(article => article.relevanceScore > 0.3) // Filter relevant articles
      .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
      .slice(0, 15), // Limit to 15 most relevant articles
      totalArticles: articles.length,
      lastUpdated: new Date().toISOString()
    };
  }

  formatLocationWeather(data, userLocation, language) {
    return {
      location: userLocation,
      weather: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        localizedCondition: this.getLocalizedWeatherCondition(data.weather[0].main, language)
      },
      forecast: [], // Would be populated with forecast data
      lastUpdated: new Date().toISOString()
    };
  }

  formatGovernmentData(data, userLocation, language) {
    return {
      location: userLocation,
      schemes: data?.schemes || [],
      notices: data?.notices || [],
      projects: data?.projects || [],
      officials: data?.officials || [],
      lastUpdated: new Date().toISOString()
    };
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  calculateRelevanceScore(article, userLocation) {
    const { village, district, state } = userLocation;
    const title = (article.title || '').toLowerCase();
    const description = (article.description || '').toLowerCase();
    const content = title + ' ' + description;

    let score = 0;

    // Exact village match (highest priority)
    if (content.includes(village.toLowerCase())) {
      score += 1.0;
    }

    // District match
    if (content.includes(district.toLowerCase())) {
      score += 0.8;
    }

    // State match
    if (content.includes(state.toLowerCase())) {
      score += 0.6;
    }

    // Government/development keywords
    const govKeywords = ['government', 'scheme', 'development', 'project', 'minister', 'cm', 'pm', 'सरकार', 'योजना', 'विकास'];
    govKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        score += 0.2;
      }
    });

    // Rural/agriculture keywords
    const ruralKeywords = ['rural', 'agriculture', 'farmer', 'village', 'panchayat', 'ग्रामीण', 'कृषि', 'किसान', 'गांव', 'पंचायत'];
    ruralKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        score += 0.3;
      }
    });

    return Math.min(score, 1.0); // Cap at 1.0
  }

  getNewsLanguageCode(language) {
    const langMap = {
      'hi': 'hi',
      'en': 'en',
      'ur': 'ur'
    };
    return langMap[language] || 'hi';
  }

  getWeatherLang(language) {
    const langMap = {
      'hi': 'hi',
      'en': 'en',
      'ur': 'ur'
    };
    return langMap[language] || 'hi';
  }

  getLocalizedWeatherCondition(condition, language) {
    const conditions = {
      Clear: { hi: 'साफ', en: 'Clear', ur: 'صاف' },
      Clouds: { hi: 'बादल', en: 'Cloudy', ur: 'بادل' },
      Rain: { hi: 'बारिश', en: 'Rain', ur: 'بارش' },
      Thunderstorm: { hi: 'तूफान', en: 'Thunderstorm', ur: 'طوفان' },
      Snow: { hi: 'बर्फ', en: 'Snow', ur: 'برف' },
      Mist: { hi: 'कोहरा', en: 'Mist', ur: 'دھند' }
    };

    return conditions[condition]?.[language] || conditions[condition]?.hi || condition;
  }

  generateId() {
    return 'news_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // ==================== MOCK DATA FUNCTIONS ====================
  
  getMockLocationNews(userLocation, language) {
    const { village, district, state } = userLocation;
    
    const mockArticles = [
      {
        id: 'news_001',
        title: language === 'hi' ? 
          `${district} में नई सड़क परियोजना की शुरुआत` :
          language === 'en' ?
          `New road project launched in ${district}` :
          `${district} میں نئے روڈ پروجیکٹ کا آغاز`,
        description: language === 'hi' ?
          `${state} सरकार ने ${district} जिले में ग्रामीण सड़क विकास के लिए नई परियोजना की घोषणा की है।` :
          language === 'en' ?
          `${state} government announces new project for rural road development in ${district} district.` :
          `${state} حکومت نے ${district} ضلع میں دیہی سڑک کی ترقی کے لیے نئے منصوبے کا اعلان کیا ہے۔`,
        source: language === 'hi' ? 'दैनिक जागरण' : 'Dainik Jagran',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'development',
        relevanceScore: 0.9
      },
      {
        id: 'news_002',
        title: language === 'hi' ?
          `${state} में किसानों के लिए नई योजना` :
          language === 'en' ?
          `New scheme for farmers in ${state}` :
          `${state} میں کسانوں کے لیے نئی اسکیم`,
        description: language === 'hi' ?
          `राज्य सरकार ने किसानों की आय बढ़ाने के लिए नई सब्सिडी योजना की घोषणा की है।` :
          language === 'en' ?
          `State government announces new subsidy scheme to increase farmers' income.` :
          `ریاستی حکومت نے کسانوں کی آمدنی بڑھانے کے لیے نئی سبسڈی اسکیم کا اعلان کیا ہے۔`,
        source: language === 'hi' ? 'अमर उजाला' : 'Amar Ujala',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: 'agriculture',
        relevanceScore: 0.8
      },
      {
        id: 'news_003',
        title: language === 'hi' ?
          `${district} में स्वास्थ्य सेवाओं का विस्तार` :
          language === 'en' ?
          `Healthcare services expansion in ${district}` :
          `${district} میں صحت کی خدمات کی توسیع`,
        description: language === 'hi' ?
          `जिले में नए प्राथमिक स्वास्थ्य केंद्र खोले जाएंगे और मौजूदा सुविधाओं का उन्नयन किया जाएगा।` :
          language === 'en' ?
          `New primary health centers will be opened in the district and existing facilities will be upgraded.` :
          `ضلع میں نئے بنیادی صحت مراکز کھولے جائیں گے اور موجودہ سہولات کو بہتر بنایا جائے گا۔`,
        source: language === 'hi' ? 'हिंदुस्तान' : 'Hindustan',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        category: 'health',
        relevanceScore: 0.7
      }
    ];

    return this.formatLocationNews(mockArticles, userLocation, language);
  }

  getMockLocationWeather(userLocation, language) {
    const mockWeatherData = {
      main: {
        temp: 25 + Math.random() * 10,
        feels_like: 28 + Math.random() * 8,
        humidity: 60 + Math.random() * 20,
        pressure: 1010 + Math.random() * 20
      },
      wind: {
        speed: 2 + Math.random() * 3
      },
      weather: [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }]
    };

    return this.formatLocationWeather(mockWeatherData, userLocation, language);
  }

  getMockGovernmentData(userLocation, language) {
    const { district, state } = userLocation;
    
    return {
      location: userLocation,
      schemes: [
        {
          id: 'scheme_001',
          name: language === 'hi' ? 'प्रधानमंत्री आवास योजना' : 'PM Awas Yojana',
          status: 'active',
          beneficiaries: 1250
        }
      ],
      notices: [
        {
          id: 'notice_001',
          title: language === 'hi' ? 'ग्राम सभा बैठक की सूचना' : 'Gram Sabha Meeting Notice',
          date: new Date().toISOString().split('T')[0]
        }
      ],
      projects: [
        {
          id: 'project_001',
          name: language === 'hi' ? `${district} में सड़क निर्माण` : `Road Construction in ${district}`,
          status: 'ongoing',
          completion: 65
        }
      ],
      officials: [
        {
          name: language === 'hi' ? 'जिला कलेक्टर' : 'District Collector',
          designation: language === 'hi' ? `${district} जिला कलेक्टर` : `District Collector, ${district}`,
          phone: '0131-2345678',
          email: `collector.${district.toLowerCase()}@${state.toLowerCase().replace(' ', '')}.gov.in`
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  // ==================== VALIDATION FUNCTIONS ====================
  
  validateUserLocation(userLocation) {
    const { village, district, state } = userLocation;
    
    if (!village || !district || !state) {
      return {
        valid: false,
        error: 'All location fields (village, district, state) are required'
      };
    }

    // Check if state exists in our database
    const normalizedState = state.toLowerCase();
    if (!this.stateDistricts[normalizedState]) {
      return {
        valid: false,
        error: `State '${state}' not found in database`
      };
    }

    // Check if district exists in the state
    const normalizedDistrict = district.toLowerCase();
    if (!this.stateDistricts[normalizedState].includes(normalizedDistrict)) {
      return {
        valid: false,
        error: `District '${district}' not found in ${state}`
      };
    }

    return {
      valid: true,
      normalized: {
        village: village.trim(),
        district: normalizedDistrict,
        state: normalizedState
      }
    };
  }

  getSuggestedDistricts(state) {
    const normalizedState = state.toLowerCase();
    return this.stateDistricts[normalizedState] || [];
  }

  getAllStates() {
    return Object.keys(this.stateDistricts).map(state => 
      state.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    );
  }
}

export const locationDataService = new LocationDataService();