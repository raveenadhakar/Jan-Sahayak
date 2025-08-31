// Enhanced Weather Service with location-based data
class WeatherService {
  constructor() {
    this.apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.isEnabled = !!this.apiKey;
  }

  // Get weather for user's location
  async getLocationWeather(state, district, village) {
    if (!this.isEnabled) {
      return this.getMockWeatherData(district || 'Muzaffarnagar');
    }

    try {
      // First get coordinates for the location
      const location = `${village}, ${district}, ${state}, India`;
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${this.apiKey}`
      );
      
      if (!geoResponse.ok) {
        throw new Error('Location not found');
      }
      
      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        throw new Error('Location coordinates not found');
      }

      const { lat, lon } = geoData[0];

      // Get current weather
      const weatherResponse = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=hi`
      );

      if (!weatherResponse.ok) {
        throw new Error('Weather data not available');
      }

      const weatherData = await weatherResponse.json();

      // Get forecast
      const forecastResponse = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=hi`
      );

      const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;

      return this.formatWeatherData(weatherData, forecastData, district);
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getMockWeatherData(district || 'Muzaffarnagar');
    }
  }

  // Format weather data for display
  formatWeatherData(current, forecast, location) {
    const weatherConditions = {
      'clear sky': { hi: 'साफ आसमान', icon: '☀️', advice: 'खेती के लिए अच्छा दिन है।' },
      'few clouds': { hi: 'हल्के बादल', icon: '🌤️', advice: 'मौसम सुहावना है।' },
      'scattered clouds': { hi: 'बिखरे बादल', icon: '⛅', advice: 'बादल छाए हुए हैं।' },
      'broken clouds': { hi: 'घने बादल', icon: '☁️', advice: 'बारिश की संभावना है।' },
      'shower rain': { hi: 'बौछारें', icon: '🌦️', advice: 'फसलों को पानी मिलेगा।' },
      'rain': { hi: 'बारिश', icon: '🌧️', advice: 'बारिश हो रही है, सावधान रहें।' },
      'thunderstorm': { hi: 'तूफान', icon: '⛈️', advice: 'तूफान की चेतावनी, घर में रहें।' },
      'snow': { hi: 'बर्फ', icon: '❄️', advice: 'ठंड से बचाव करें।' },
      'mist': { hi: 'कोहरा', icon: '🌫️', advice: 'धुंध है, सावधानी से चलें।' }
    };

    const condition = current.weather[0].description.toLowerCase();
    const weatherInfo = weatherConditions[condition] || {
      hi: current.weather[0].description,
      icon: '🌤️',
      advice: 'मौसम की जानकारी देखें।'
    };

    return {
      location: location,
      current: {
        temperature: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
        pressure: current.main.pressure,
        visibility: current.visibility ? Math.round(current.visibility / 1000) : null,
        condition: weatherInfo.hi,
        conditionEn: current.weather[0].description,
        icon: weatherInfo.icon,
        advice: weatherInfo.advice,
        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('hi-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('hi-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      },
      forecast: forecast ? this.formatForecast(forecast.list.slice(0, 5)) : [],
      alerts: this.generateWeatherAlerts(current),
      farmingAdvice: this.getFarmingAdvice(current, location)
    };
  }

  // Format forecast data
  formatForecast(forecastList) {
    return forecastList.map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('hi-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].description,
      icon: this.getWeatherIcon(item.weather[0].main),
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6)
    }));
  }

  // Generate weather alerts
  generateWeatherAlerts(current) {
    const alerts = [];
    
    if (current.main.temp > 40) {
      alerts.push({
        type: 'heat',
        message: 'अत्यधिक गर्मी की चेतावनी - पानी पिएं और छाया में रहें',
        priority: 'high',
        icon: '🔥'
      });
    }
    
    if (current.main.temp < 5) {
      alerts.push({
        type: 'cold',
        message: 'ठंड की चेतावनी - गर्म कपड़े पहनें',
        priority: 'high',
        icon: '🥶'
      });
    }
    
    if (current.wind.speed > 10) {
      alerts.push({
        type: 'wind',
        message: 'तेज़ हवा चल रही है - सावधान रहें',
        priority: 'medium',
        icon: '💨'
      });
    }
    
    if (current.main.humidity > 80) {
      alerts.push({
        type: 'humidity',
        message: 'उमस भरा मौसम - पानी पिएं',
        priority: 'low',
        icon: '💧'
      });
    }

    return alerts;
  }

  // Get farming advice based on weather
  getFarmingAdvice(current, location) {
    const temp = current.main.temp;
    const humidity = current.main.humidity;
    const condition = current.weather[0].main.toLowerCase();
    
    let advice = [];
    
    if (condition.includes('rain')) {
      advice.push('🌧️ बारिश हो रही है - फसल की कटाई स्थगित करें');
      advice.push('💧 पानी भराव से बचाव करें');
    } else if (temp > 35) {
      advice.push('☀️ अधिक गर्मी - फसलों को पानी दें');
      advice.push('🌾 दोपहर में खेत में काम न करें');
    } else if (temp < 15) {
      advice.push('❄️ ठंड - फसलों को ढकें');
      advice.push('🔥 पाला से बचाव करें');
    } else {
      advice.push('🌱 खेती के लिए अच्छा मौसम है');
      advice.push('🚜 खेत के काम कर सकते हैं');
    }
    
    if (humidity > 70) {
      advice.push('🦠 नमी अधिक - फसल में बीमारी का खतरा');
    }
    
    return advice;
  }

  // Get weather icon
  getWeatherIcon(condition) {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return icons[condition] || '🌤️';
  }

  // Mock weather data for fallback
  getMockWeatherData(location) {
    const mockData = {
      'Muzaffarnagar': {
        temp: 28, humidity: 65, wind: 12, condition: 'साफ आसमान',
        advice: 'खेती के लिए अच्छा दिन है।'
      },
      'Shamli': {
        temp: 26, humidity: 70, wind: 8, condition: 'हल्के बादल',
        advice: 'मौसम सुहावना है।'
      },
      'Baghpat': {
        temp: 29, humidity: 60, wind: 10, condition: 'साफ आसमान',
        advice: 'खेत के काम कर सकते हैं।'
      },
      'Meerut': {
        temp: 31, humidity: 55, wind: 15, condition: 'धूप',
        advice: 'गर्मी से बचाव करें।'
      }
    };

    const data = mockData[location] || mockData['Muzaffarnagar'];
    
    return {
      location: location,
      current: {
        temperature: data.temp,
        feelsLike: data.temp + 2,
        humidity: data.humidity,
        windSpeed: data.wind,
        pressure: 1013,
        condition: data.condition,
        conditionEn: 'Clear',
        icon: '☀️',
        advice: data.advice,
        sunrise: '06:30',
        sunset: '18:45'
      },
      forecast: [
        { time: '12:00', temperature: data.temp + 3, condition: data.condition, icon: '☀️' },
        { time: '15:00', temperature: data.temp + 5, condition: data.condition, icon: '☀️' },
        { time: '18:00', temperature: data.temp + 1, condition: data.condition, icon: '🌤️' },
        { time: '21:00', temperature: data.temp - 2, condition: 'साफ', icon: '🌙' }
      ],
      alerts: data.temp > 35 ? [{
        type: 'heat',
        message: 'गर्मी की चेतावनी',
        priority: 'medium',
        icon: '🔥'
      }] : [],
      farmingAdvice: [data.advice, '🌾 फसल की देखभाल करें']
    };
  }
}

export const weatherService = new WeatherService();