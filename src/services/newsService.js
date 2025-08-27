class NewsService {
  constructor() {
    this.tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY || '';
    this.baseUrl = 'https://api.tavily.com/search';
  } // <-- Missing closing brace was here

  async getLatestNews(query = 'भारत समाचार', language = 'hi', maxResults = 5) {
    if (!this.tavilyApiKey) {
      console.warn('Tavily API key not configured, using mock data');
      return this.getMockNews(language);
    }

    try {
      const searchQuery = this.getLocalizedQuery(query, language);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.tavilyApiKey,
          query: searchQuery,
          search_depth: 'basic',
          include_answer: true,
          include_images: false,
          include_raw_content: false,
          max_results: maxResults,
          include_domains: this.getReliableDomains(language),
          exclude_domains: ['facebook.com', 'twitter.com', 'instagram.com']
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatNewsResults(data.results || [], language);
    } catch (error) {
      console.error('Tavily API Error:', error);
      return this.getMockNews(language);
    }
  }

  async getGovernmentNews(language = 'hi') {
    const queries = {
      hi: 'सरकारी योजना नई घोषणा भारत',
      en: 'government scheme announcement India',
      ur: 'حکومتی اسکیم اعلان بھارت'
    };

    return await this.getLatestNews(queries[language] || queries.hi, language, 3);
  }

  async getWeatherNews(location = 'उत्तर प्रदेश', language = 'hi') {
    const queries = {
      hi: `मौसम ${location} बारिश तापमान`,
      en: `weather ${location} rain temperature`,
      ur: `موسم ${location} بارش درجہ حرارت`
    };

    return await this.getLatestNews(queries[language] || queries.hi, language, 2);
  }

  async getAgricultureNews(language = 'hi') {
    const queries = {
      hi: 'कृषि मंडी भाव फसल किसान',
      en: 'agriculture market price crop farmer',
      ur: 'زراعت منڈی بھاؤ فصل کسان'
    };

    return await this.getLatestNews(queries[language] || queries.hi, language, 3);
  }

  getLocalizedQuery(query, language) {
    const locationSuffix = {
      hi: ' भारत उत्तर प्रदेश',
      en: ' India Uttar Pradesh',
      ur: ' بھارت اتر پردیش'
    };

    return query + (locationSuffix[language] || locationSuffix.hi);
  }

  getReliableDomains(language) {
    const domains = {
      hi: [
        'aajtak.in',
        'ndtv.com',
        'zeenews.india.com',
        'jagran.com',
        'bhaskar.com',
        'amarujala.com',
        'pib.gov.in'
      ],
      en: [
        'timesofindia.indiatimes.com',
        'hindustantimes.com',
        'indianexpress.com',
        'ndtv.com',
        'news18.com',
        'pib.gov.in'
      ],
      ur: [
        'urdu.ndtv.com',
        'bbc.com/urdu',
        'dw.com/ur',
        'pib.gov.in'
      ]
    };

    return domains[language] || domains.hi;
  }

  formatNewsResults(results, language) {
    return results.map((item, index) => ({
      id: index + 1,
      title: item.title || 'समाचार',
      description: item.content || item.snippet || '',
      url: item.url || '',
      publishedAt: new Date().toISOString(),
      source: this.extractDomain(item.url || ''),
      category: this.categorizeNews(item.title + ' ' + item.content, language),
      priority: this.getPriority(item.title + ' ' + item.content, language)
    }));
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'समाचार स्रोत';
    }
  }

  categorizeNews(content, language) {
    const keywords = {
      government: ['सरकार', 'योजना', 'government', 'scheme', 'حکومت', 'اسکیم'],
      weather: ['मौसम', 'बारिश', 'weather', 'rain', 'موسم', 'بارش'],
      agriculture: ['कृषि', 'किसान', 'फसल', 'agriculture', 'farmer', 'crop', 'زراعت', 'کسان'],
      health: ['स्वास्थ्य', 'अस्पताल', 'health', 'hospital', 'صحت', 'ہسپتال'],
      education: ['शिक्षा', 'स्कूल', 'education', 'school', 'تعلیم', 'اسکول']
    };

    const lowerContent = content.toLowerCase();

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerContent.includes(word.toLowerCase()))) {
        return category;
      }
    }

    return 'general';
  }

  getPriority(content, language) {
    const highPriorityKeywords = [
      'आपातकाल', 'चेतावनी', 'तत्काल', 'emergency', 'warning', 'urgent', 'فوری', 'انتباہ'
    ];

    const lowerContent = content.toLowerCase();

    if (highPriorityKeywords.some(word => lowerContent.includes(word.toLowerCase()))) {
      return 'high';
    }

    return 'medium';
  }

  getMockNews(language) {
    const mockData = {
      hi: [
        {
          id: 1,
          title: 'PM-KISAN योजना में नया अपडेट',
          description: 'प्रधानमंत्री किसान सम्मान निधि योजना के तहत अब किसानों को अधिक लाभ मिलेगा। नई घोषणा के अनुसार राशि बढ़ाई जा सकती है।',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'सरकारी समाचार',
          category: 'government',
          priority: 'high'
        },
        {
          id: 2,
          title: 'मौसम विभाग की चेतावनी',
          description: 'अगले 48 घंटों में उत्तर प्रदेश के कई जिलों में भारी बारिश की संभावना। किसानों को सलाह दी गई है कि वे अपनी फसल की सुरक्षा करें।',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'मौसम विभाग',
          category: 'weather',
          priority: 'high'
        },
        {
          id: 3,
          title: 'गेहूं की कीमतों में वृद्धि',
          description: 'स्थानीय मंडियों में गेहूं के भाव में 50 रुपये प्रति क्विंटल की बढ़ोतरी दर्ज की गई है। यह किसानों के लिए अच्छी खबर है।',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'कृषि समाचार',
          category: 'agriculture',
          priority: 'medium'
        }
      ],
      en: [
        {
          id: 1,
          title: 'PM-KISAN Scheme Update',
          description: 'New benefits announced under PM-KISAN scheme for farmers. The government is considering increasing the amount.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Government News',
          category: 'government',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Weather Department Warning',
          description: 'Heavy rainfall expected in several districts of Uttar Pradesh in next 48 hours. Farmers advised to protect crops.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Weather Department',
          category: 'weather',
          priority: 'high'
        }
      ],
      ur: [
        {
          id: 1,
          title: 'پی ایم کسان اسکیم میں اپڈیٹ',
          description: 'کسانوں کے لیے پی ایم کسان اسکیم کے تحت نئے فوائد کا اعلان۔ حکومت رقم بڑھانے پر غور کر رہی ہے۔',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'سرکاری خبریں',
          category: 'government',
          priority: 'high'
        }
      ]
    };

    return mockData[language] || mockData.hi;
  }
}

export const newsService = new NewsService();