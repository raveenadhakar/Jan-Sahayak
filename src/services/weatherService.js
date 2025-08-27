class WeatherService {
  constructor() {
    this.tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY || '';
    this.baseUrl = 'https://api.tavily.com/search';
  }

  async getCurrentWeather(city = 'Muzaffarnagar', language = 'hi') {
    if (!this.apiKey) {
      console.warn('Weather API key not configured, using mock data');
      return this.getMockWeather(language);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${city},IN&appid=${this.apiKey}&units=metric&lang=${this.getWeatherLang(language)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatWeatherData(data, language);
    } catch (error) {
      console.error('Weather API Error:', error);
      return this.getMockWeather(language);
    }
  }

  async getWeatherForecast(city = 'Muzaffarnagar', language = 'hi') {
    if (!this.apiKey) {
      return this.getMockForecast(language);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?q=${city},IN&appid=${this.apiKey}&units=metric&lang=${this.getWeatherLang(language)}&cnt=24`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatForecastData(data, language);
    } catch (error) {
      console.error('Weather Forecast Error:', error);
      return this.getMockForecast(language);
    }
  }

  formatWeatherData(data, language) {
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000, // Convert to km
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      city: data.name,
      country: data.sys.country,
      localizedCondition: this.getLocalizedCondition(data.weather[0].main, language),
      localizedDescription: this.getLocalizedDescription(data.weather[0].description, language)
    };
  }

  formatForecastData(data, language) {
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: date,
          temps: [],
          conditions: [],
          humidity: [],
          windSpeed: []
        };
      }
      
      dailyForecasts[dateKey].temps.push(item.main.temp);
      dailyForecasts[dateKey].conditions.push(item.weather[0].main);
      dailyForecasts[dateKey].humidity.push(item.main.humidity);
      dailyForecasts[dateKey].windSpeed.push(item.wind.speed * 3.6);
    });

    return Object.values(dailyForecasts).slice(0, 5).map(day => ({
      date: day.date,
      dayName: this.getDayName(day.date, language),
      maxTemp: Math.round(Math.max(...day.temps)),
      minTemp: Math.round(Math.min(...day.temps)),
      avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
      avgWindSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length),
      condition: this.getMostFrequent(day.conditions),
      localizedCondition: this.getLocalizedCondition(this.getMostFrequent(day.conditions), language)
    }));
  }

  getMostFrequent(arr) {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  }

  getDayName(date, language) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    if (date.toDateString() === today.toDateString()) {
      return language === 'hi' ? 'आज' : language === 'en' ? 'Today' : 'آج';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return language === 'hi' ? 'कल' : language === 'en' ? 'Tomorrow' : 'کل';
    } else if (date.toDateString() === dayAfter.toDateString()) {
      return language === 'hi' ? 'परसों' : language === 'en' ? 'Day After' : 'پرسوں';
    }

    const days = {
      hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ur: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ']
    };

    return days[language][date.getDay()] || days.hi[date.getDay()];
  }

  getLocalizedCondition(condition, language) {
    const conditions = {
      Clear: {
        hi: 'साफ',
        en: 'Clear',
        ur: 'صاف'
      },
      Clouds: {
        hi: 'बादल',
        en: 'Cloudy',
        ur: 'بادل'
      },
      Rain: {
        hi: 'बारिश',
        en: 'Rain',
        ur: 'بارش'
      },
      Drizzle: {
        hi: 'हल्की बारिश',
        en: 'Drizzle',
        ur: 'ہلکی بارش'
      },
      Thunderstorm: {
        hi: 'तूफान',
        en: 'Thunderstorm',
        ur: 'طوفان'
      },
      Snow: {
        hi: 'बर्फ',
        en: 'Snow',
        ur: 'برف'
      },
      Mist: {
        hi: 'कोहरा',
        en: 'Mist',
        ur: 'دھند'
      },
      Fog: {
        hi: 'घना कोहरा',
        en: 'Fog',
        ur: 'گھنا دھند'
      }
    };

    return conditions[condition]?.[language] || conditions[condition]?.hi || condition;
  }

  getLocalizedDescription(description, language) {
    // This would ideally use the API's localized descriptions
    // For now, we'll use the condition mapping
    return this.getLocalizedCondition(description, language);
  }

  getWeatherLang(language) {
    const langMap = {
      hi: 'hi',
      en: 'en',
      ur: 'ur'
    };
    return langMap[language] || 'hi';
  }

  getMockWeather(language) {
    return {
      temperature: 28,
      feelsLike: 32,
      humidity: 65,
      pressure: 1013,
      windSpeed: 12,
      windDirection: 180,
      visibility: 10,
      condition: 'Clouds',
      description: 'scattered clouds',
      icon: '03d',
      sunrise: new Date(),
      sunset: new Date(),
      city: 'Muzaffarnagar',
      country: 'IN',
      localizedCondition: this.getLocalizedCondition('Clouds', language),
      localizedDescription: this.getLocalizedCondition('Clouds', language)
    };
  }

  getMockForecast(language) {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      return {
        date: date,
        dayName: this.getDayName(date, language),
        maxTemp: 28 + Math.floor(Math.random() * 6),
        minTemp: 18 + Math.floor(Math.random() * 4),
        avgHumidity: 60 + Math.floor(Math.random() * 20),
        avgWindSpeed: 10 + Math.floor(Math.random() * 10),
        condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
        localizedCondition: this.getLocalizedCondition(['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)], language)
      };
    });
  }

  getWeatherAdvice(weatherData, language) {
    const advice = {
      hi: {
        Rain: 'बारिश हो सकती है। छाता साथ रखें और फसल की सुरक्षा करें।',
        Clear: 'मौसम साफ है। खेती के काम के लिए अच्छा दिन है।',
        Clouds: 'बादल छाए हैं। बारिश की तैयारी रखें।',
        Thunderstorm: 'तूफान की चेतावनी। घर के अंदर रहें और सुरक्षित रहें।'
      },
      en: {
        Rain: 'Rain expected. Carry umbrella and protect crops.',
        Clear: 'Clear weather. Good day for farming activities.',
        Clouds: 'Cloudy skies. Be prepared for rain.',
        Thunderstorm: 'Thunderstorm warning. Stay indoors and be safe.'
      },
      ur: {
        Rain: 'بارش کا امکان۔ چھتری ساتھ رکھیں اور فصل کی حفاظت کریں۔',
        Clear: 'صاف موسم۔ کھیتی کے کام کے لیے اچھا دن۔',
        Clouds: 'بادل چھائے ہیں۔ بارش کی تیاری رکھیں۔',
        Thunderstorm: 'طوفان کی وارننگ۔ گھر کے اندر رہیں اور محفوظ رہیں۔'
      }
    };

    return advice[language]?.[weatherData.condition] || advice.hi[weatherData.condition] || '';
  }
}

export const weatherService = new WeatherService();