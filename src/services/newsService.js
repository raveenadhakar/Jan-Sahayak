// Enhanced News Service with real links and descriptions
class NewsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_NEWS_API_KEY;
    this.isEnabled = !!this.apiKey;
  }

  // Get location-based news
  async getLocationNews(state, district, language = 'hi') {
    try {
      if (this.isEnabled) {
        return await this.fetchRealNews(state, district, language);
      } else {
        return this.getMockNews(state, district, language);
      }
    } catch (error) {
      console.error('News fetch error:', error);
      return this.getMockNews(state, district, language);
    }
  }

  // Fetch real news from API
  async fetchRealNews(state, district, language) {
    const query = `${district} ${state} government schemes agriculture rural development`;
    const langCode = language === 'hi' ? 'hi' : 'en';
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${langCode}&sortBy=publishedAt&pageSize=10&apiKey=${this.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('News API error');
    }
    
    const data = await response.json();
    return this.formatNewsData(data.articles, language);
  }

  // Format news data
  formatNewsData(articles, language) {
    return articles.slice(0, 5).map((article, index) => ({
      id: `news_${Date.now()}_${index}`,
      title: article.title,
      description: article.description || article.content?.substring(0, 200) + '...',
      summary: this.generateSummary(article.description || article.content, language),
      source: article.source.name,
      publishedAt: new Date(article.publishedAt).toLocaleDateString('hi-IN'),
      url: article.url,
      urlToImage: article.urlToImage,
      category: this.categorizeNews(article.title + ' ' + article.description),
      priority: this.getPriority(article.title + ' ' + article.description),
      location: article.source.name.includes('local') ? 'local' : 'national',
      language: language,
      readingTime: Math.ceil((article.content?.length || 500) / 200) // Approx reading time
    }));
  }

  // Generate summary for news
  generateSummary(content, language) {
    if (!content) return '';
    
    const sentences = content.split('.').filter(s => s.trim().length > 10);
    const summary = sentences.slice(0, 2).join('. ') + '.';
    
    return summary.length > 150 ? summary.substring(0, 150) + '...' : summary;
  }

  // Categorize news
  categorizeNews(text) {
    const categories = {
      'government': ['government', 'सरकार', 'योजना', 'scheme', 'policy', 'नीति'],
      'agriculture': ['agriculture', 'कृषि', 'farmer', 'किसान', 'crop', 'फसल'],
      'weather': ['weather', 'मौसम', 'rain', 'बारिश', 'temperature', 'तापमान'],
      'health': ['health', 'स्वास्थ्य', 'hospital', 'अस्पताल', 'medical', 'चिकित्सा'],
      'education': ['education', 'शिक्षा', 'school', 'स्कूल', 'student', 'छात्र'],
      'infrastructure': ['infrastructure', 'बुनियादी', 'road', 'सड़क', 'water', 'पानी']
    };
    
    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  // Get priority based on content
  getPriority(text) {
    const highPriorityKeywords = ['emergency', 'alert', 'warning', 'चेतावनी', 'आपातकाल', 'urgent'];
    const mediumPriorityKeywords = ['scheme', 'योजना', 'benefit', 'लाभ', 'subsidy', 'सब्सिडी'];
    
    const lowerText = text.toLowerCase();
    
    if (highPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'high';
    } else if (mediumPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  // Mock news data with proper structure
  getMockNews(state, district, language) {
    const newsData = {
      'hi': [
        {
          id: 'news_1',
          title: 'PM-KISAN योजना में नए लाभार्थियों का पंजीकरण शुरू',
          description: 'प्रधानमंत्री किसान सम्मान निधि योजना के तहत नए किसानों का पंजीकरण शुरू हो गया है। इस योजना के अंतर्गत पात्र किसानों को प्रति वर्ष 6000 रुपये की आर्थिक सहायता तीन किस्तों में दी जाती है।',
          summary: 'PM-KISAN योजना में नए किसानों का पंजीकरण शुरू। प्रति वर्ष 6000 रुपये की सहायता।',
          source: 'कृषि मंत्रालय',
          publishedAt: new Date().toLocaleDateString('hi-IN'),
          url: 'https://pmkisan.gov.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=PM-KISAN',
          category: 'government',
          priority: 'high',
          location: 'national',
          language: 'hi',
          readingTime: 2
        },
        {
          id: 'news_2',
          title: `${district} में मौसम विभाग की चेतावनी - अगले 48 घंटों में भारी बारिश`,
          description: `मौसम विभाग ने ${district} और आसपास के क्षेत्रों में अगले 48 घंटों में भारी बारिश की संभावना जताई है। किसानों को सलाह दी गई है कि वे अपनी फसलों की सुरक्षा के लिए आवश्यक उपाय करें। खासकर धान और गन्ने की फसल को नुकसान से बचाने के लिए जल निकासी की व्यवस्था करें।`,
          summary: `${district} में भारी बारिश की चेतावनी। किसानों को फसल सुरक्षा की सलाह।`,
          source: 'मौसम विभाग',
          publishedAt: new Date().toLocaleDateString('hi-IN'),
          url: 'https://mausam.imd.gov.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=Weather+Alert',
          category: 'weather',
          priority: 'high',
          location: 'local',
          language: 'hi',
          readingTime: 3
        },
        {
          id: 'news_3',
          title: 'आयुष्मान भारत योजना में नई सुविधाएं जोड़ी गईं',
          description: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना में अब मानसिक स्वास्थ्य सेवाएं भी शामिल की गई हैं। इसके अलावा टेली-मेडिसिन सुविधा भी उपलब्ध कराई गई है जिससे ग्रामीण क्षेत्रों के लोग घर बैठे डॉक्टर से सलाह ले सकते हैं।',
          summary: 'आयुष्मान भारत में मानसिक स्वास्थ्य और टेली-मेडिसिन सुविधा जोड़ी गई।',
          source: 'स्वास्थ्य मंत्रालय',
          publishedAt: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN'),
          url: 'https://pmjay.gov.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=Ayushman+Bharat',
          category: 'health',
          priority: 'medium',
          location: 'national',
          language: 'hi',
          readingTime: 2
        },
        {
          id: 'news_4',
          title: `${state} में डिजिटल इंडिया मिशन के तहत नई सुविधाएं`,
          description: `${state} सरकार ने डिजिटल इंडिया मिशन के तहत ग्रामीण क्षेत्रों में इंटरनेट कनेक्टिविटी बढ़ाने के लिए नई योजना शुरू की है। इसके तहत हर गांव में कम से कम एक डिजिटल सेवा केंद्र स्थापित किया जाएगा।`,
          summary: `${state} में डिजिटल इंडिया के तहत हर गांव में डिजिटल सेवा केंद्र।`,
          source: 'डिजिटल इंडिया',
          publishedAt: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN'),
          url: 'https://digitalindia.gov.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=Digital+India',
          category: 'infrastructure',
          priority: 'medium',
          location: 'state',
          language: 'hi',
          readingTime: 2
        },
        {
          id: 'news_5',
          title: 'MGNREGA के तहत मजदूरी दरें बढ़ाई गईं',
          description: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (MGNREGA) के तहत मजदूरी दरें बढ़ाई गई हैं। अब प्रतिदिन 220 रुपये मजदूरी मिलेगी। यह वृद्धि महंगाई दर को देखते हुए की गई है।',
          summary: 'MGNREGA में मजदूरी दर बढ़कर 220 रुपये प्रतिदिन हुई।',
          source: 'ग्रामीण विकास मंत्रालय',
          publishedAt: new Date(Date.now() - 259200000).toLocaleDateString('hi-IN'),
          url: 'https://nrega.nic.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=MGNREGA',
          category: 'government',
          priority: 'medium',
          location: 'national',
          language: 'hi',
          readingTime: 1
        }
      ],
      'en': [
        {
          id: 'news_1_en',
          title: 'New Beneficiary Registration Opens for PM-KISAN Scheme',
          description: 'Registration for new farmers under the Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) scheme has commenced. Under this scheme, eligible farmers receive financial assistance of Rs 6000 per year in three installments.',
          summary: 'PM-KISAN scheme opens registration for new farmers. Rs 6000 annual assistance provided.',
          source: 'Ministry of Agriculture',
          publishedAt: new Date().toLocaleDateString('en-IN'),
          url: 'https://pmkisan.gov.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=PM-KISAN',
          category: 'government',
          priority: 'high',
          location: 'national',
          language: 'en',
          readingTime: 2
        },
        {
          id: 'news_2_en',
          title: `Weather Department Issues Heavy Rainfall Warning for ${district}`,
          description: `The Meteorological Department has predicted heavy rainfall in ${district} and surrounding areas over the next 48 hours. Farmers are advised to take necessary measures to protect their crops, especially rice and sugarcane, by ensuring proper drainage systems.`,
          summary: `Heavy rainfall warning issued for ${district}. Farmers advised to protect crops.`,
          source: 'Weather Department',
          publishedAt: new Date().toLocaleDateString('en-IN'),
          url: 'https://mausam.imd.gov.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=Weather+Alert',
          category: 'weather',
          priority: 'high',
          location: 'local',
          language: 'en',
          readingTime: 3
        },
        {
          id: 'news_3_en',
          title: 'New Services Added to Ayushman Bharat Scheme',
          description: 'Mental health services have been included in the Ayushman Bharat Pradhan Mantri Jan Arogya Yojana. Additionally, telemedicine facilities have been made available, allowing rural residents to consult doctors from home.',
          summary: 'Ayushman Bharat now includes mental health and telemedicine services.',
          source: 'Ministry of Health',
          publishedAt: new Date(Date.now() - 86400000).toLocaleDateString('en-IN'),
          url: 'https://pmjay.gov.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=Ayushman+Bharat',
          category: 'health',
          priority: 'medium',
          location: 'national',
          language: 'en',
          readingTime: 2
        },
        {
          id: 'news_4_en',
          title: `${state} Launches New Digital India Initiative`,
          description: `The ${state} government has launched a new scheme under Digital India Mission to enhance internet connectivity in rural areas. Under this initiative, at least one digital service center will be established in every village.`,
          summary: `${state} to establish digital service centers in every village under Digital India.`,
          source: 'Digital India',
          publishedAt: new Date(Date.now() - 172800000).toLocaleDateString('en-IN'),
          url: 'https://digitalindia.gov.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=Digital+India',
          category: 'infrastructure',
          priority: 'medium',
          location: 'state',
          language: 'en',
          readingTime: 2
        },
        {
          id: 'news_5_en',
          title: 'MGNREGA Wage Rates Increased',
          description: 'Wage rates under the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) have been increased. Workers will now receive Rs 220 per day. This increase has been made considering the inflation rate.',
          summary: 'MGNREGA daily wage increased to Rs 220 per day.',
          source: 'Ministry of Rural Development',
          publishedAt: new Date(Date.now() - 259200000).toLocaleDateString('en-IN'),
          url: 'https://nrega.nic.in/',
          urlToImage: 'https://via.placeholder.com/400x200?text=MGNREGA',
          category: 'government',
          priority: 'medium',
          location: 'national',
          language: 'en',
          readingTime: 1
        }
      ]
    };

    return newsData[language] || newsData['hi'];
  }

  // Get news by category
  async getNewsByCategory(category, language = 'hi') {
    const allNews = await this.getLocationNews('Uttar Pradesh', 'Muzaffarnagar', language);
    return allNews.filter(news => news.category === category);
  }

  // Search news
  async searchNews(query, language = 'hi') {
    const allNews = await this.getLocationNews('Uttar Pradesh', 'Muzaffarnagar', language);
    const lowerQuery = query.toLowerCase();
    
    return allNews.filter(news => 
      news.title.toLowerCase().includes(lowerQuery) ||
      news.description.toLowerCase().includes(lowerQuery) ||
      news.summary.toLowerCase().includes(lowerQuery)
    );
  }

  // Get trending news
  async getTrendingNews(language = 'hi') {
    const allNews = await this.getLocationNews('Uttar Pradesh', 'Muzaffarnagar', language);
    return allNews.filter(news => news.priority === 'high').slice(0, 3);
  }
}

export const newsService = new NewsService();