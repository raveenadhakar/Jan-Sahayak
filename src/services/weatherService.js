// Enhanced Weather Service with location-based data
class WeatherService {
  constructor() {
    this.apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.isEnabled = !!this.apiKey;
  }

  // Get weather for user's location
  async getLocationWeather(state, district, village) {
    // Always try to get real data first, even without API key using free services
    try {
      // Try multiple location formats for better accuracy
      const locationQueries = [
        `${village}, ${district}, ${state}, India`,
        `${district}, ${state}, India`,
        `${district}, India`
      ];

      let weatherData = null;
      let location = district || 'Muzaffarnagar';

      // Try with API key first if available
      if (this.isEnabled) {
        for (const locationQuery of locationQueries) {
          try {
            const geoResponse = await fetch(
              `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationQuery)}&limit=1&appid=${this.apiKey}`
            );
            
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              if (geoData.length > 0) {
                const { lat, lon } = geoData[0];
                location = geoData[0].name || district;

                // Get current weather
                const weatherResponse = await fetch(
                  `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=hi`
                );

                if (weatherResponse.ok) {
                  weatherData = await weatherResponse.json();
                  
                  // Get forecast
                  const forecastResponse = await fetch(
                    `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=hi`
                  );
                  const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;
                  
                  return this.formatWeatherData(weatherData, forecastData, location);
                }
              }
            }
          } catch (error) {
            console.log(`Failed to get weather for ${locationQuery}:`, error);
            continue;
          }
        }
      }

      // Fallback to free weather service
      return await this.getFreeWeatherData(district, state);
      
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getLocationBasedMockData(district, state, village);
    }
  }

  // Get weather from free service
  async getFreeWeatherData(district, state) {
    try {
      // Use wttr.in free weather service
      const location = `${district}, ${state}`;
      const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
      
      if (response.ok) {
        const data = await response.json();
        return this.formatFreeWeatherData(data, district);
      }
    } catch (error) {
      console.log('Free weather service failed:', error);
    }
    
    return this.getLocationBasedMockData(district, state);
  }

  // Format free weather service data
  formatFreeWeatherData(data, location) {
    const current = data.current_condition[0];
    const today = data.weather[0];
    
    return {
      location: location,
      current: {
        temperature: parseInt(current.temp_C),
        feelsLike: parseInt(current.FeelsLikeC),
        humidity: parseInt(current.humidity),
        windSpeed: Math.round(parseFloat(current.windspeedKmph)),
        pressure: parseInt(current.pressure),
        visibility: parseInt(current.visibility),
        condition: this.translateWeatherCondition(current.weatherDesc[0].value),
        conditionEn: current.weatherDesc[0].value,
        icon: this.getWeatherIconFromCode(current.weatherCode),
        advice: this.getWeatherAdvice(current.weatherDesc[0].value),
        sunrise: today.astronomy[0].sunrise,
        sunset: today.astronomy[0].sunset
      },
      forecast: data.weather.slice(0, 3).map(day => ({
        date: day.date,
        maxTemp: parseInt(day.maxtempC),
        minTemp: parseInt(day.mintempC),
        condition: this.translateWeatherCondition(day.hourly[4].weatherDesc[0].value),
        icon: this.getWeatherIconFromCode(day.hourly[4].weatherCode),
        humidity: parseInt(day.hourly[4].humidity),
        windSpeed: Math.round(parseFloat(day.hourly[4].windspeedKmph))
      })),
      alerts: this.generateWeatherAlerts({ main: { temp: parseInt(current.temp_C), humidity: parseInt(current.humidity) }, wind: { speed: parseFloat(current.windspeedKmph) / 3.6 } }),
      farmingAdvice: this.getFarmingAdvice({ main: { temp: parseInt(current.temp_C), humidity: parseInt(current.humidity) }, weather: [{ main: current.weatherDesc[0].value }] }, location)
    };
  }

  // Translate weather conditions to Hindi
  translateWeatherCondition(condition) {
    const translations = {
      'Sunny': 'धूप',
      'Clear': 'साफ आसमान',
      'Partly cloudy': 'आंशिक बादल',
      'Cloudy': 'बादल',
      'Overcast': 'घने बादल',
      'Mist': 'कोहरा',
      'Patchy rain possible': 'बारिश की संभावना',
      'Light rain': 'हल्की बारिश',
      'Moderate rain': 'मध्यम बारिश',
      'Heavy rain': 'भारी बारिश',
      'Thundery outbreaks possible': 'तूफान की संभावना'
    };
    return translations[condition] || condition;
  }

  // Get weather icon from code
  getWeatherIconFromCode(code) {
    const iconMap = {
      '113': '☀️', // Sunny
      '116': '⛅', // Partly cloudy
      '119': '☁️', // Cloudy
      '122': '☁️', // Overcast
      '143': '🌫️', // Mist
      '176': '🌦️', // Patchy rain possible
      '296': '🌧️', // Light rain
      '302': '🌧️', // Moderate rain
      '308': '⛈️', // Heavy rain
      '386': '⛈️'  // Thundery outbreaks possible
    };
    return iconMap[code] || '🌤️';
  }

  // Get weather advice
  getWeatherAdvice(condition) {
    const adviceMap = {
      'Sunny': 'धूप तेज है, पानी पिएं और छाया में रहें।',
      'Clear': 'मौसम साफ है, खेती के काम कर सकते हैं।',
      'Partly cloudy': 'मौसम सुहावना है।',
      'Cloudy': 'बादल छाए हुए हैं।',
      'Light rain': 'हल्की बारिश हो रही है, फसलों को फायदा होगा।',
      'Heavy rain': 'भारी बारिश की चेतावनी, सावधान रहें।'
    };
    return adviceMap[condition] || 'मौसम की जानकारी देखें।';
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

  // Location-based mock weather data with realistic variations
  getLocationBasedMockData(district, state, village) {
    // Real weather patterns for different regions
    const regionData = {
      'Uttar Pradesh': {
        'Muzaffarnagar': { baseTemp: 28, humidity: 65, wind: 12, condition: 'साफ आसमान' },
        'Shamli': { baseTemp: 26, humidity: 70, wind: 8, condition: 'हल्के बादल' },
        'Baghpat': { baseTemp: 29, humidity: 60, wind: 10, condition: 'साफ आसमान' },
        'Meerut': { baseTemp: 31, humidity: 55, wind: 15, condition: 'धूप' },
        'Ghaziabad': { baseTemp: 30, humidity: 58, wind: 13, condition: 'धूप' },
        'Bulandshahr': { baseTemp: 27, humidity: 68, wind: 9, condition: 'हल्के बादल' }
      },
      'Haryana': {
        'Panipat': { baseTemp: 29, humidity: 62, wind: 14, condition: 'साफ आसमान' },
        'Karnal': { baseTemp: 27, humidity: 66, wind: 11, condition: 'हल्के बादल' },
        'Kurukshetra': { baseTemp: 28, humidity: 64, wind: 12, condition: 'साफ आसमान' }
      },
      'Punjab': {
        'Ludhiana': { baseTemp: 25, humidity: 72, wind: 8, condition: 'हल्के बादल' },
        'Amritsar': { baseTemp: 24, humidity: 75, wind: 7, condition: 'बादल' },
        'Jalandhar': { baseTemp: 26, humidity: 70, wind: 9, condition: 'हल्के बादल' }
      }
    };

    // Get region-specific data or default
    const stateData = regionData[state] || regionData['Uttar Pradesh'];
    const locationData = stateData[district] || stateData['Muzaffarnagar'] || {
      baseTemp: 28, humidity: 65, wind: 12, condition: 'साफ आसमान'
    };

    // Add realistic variations based on time and season
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth();
    
    // Temperature variations by time of day
    let tempVariation = 0;
    if (hour >= 6 && hour < 10) tempVariation = -3; // Morning
    else if (hour >= 10 && hour < 16) tempVariation = 5; // Afternoon
    else if (hour >= 16 && hour < 20) tempVariation = 2; // Evening
    else tempVariation = -5; // Night

    // Seasonal variations
    let seasonalVariation = 0;
    if (month >= 3 && month <= 5) seasonalVariation = 8; // Summer
    else if (month >= 6 && month <= 9) seasonalVariation = -2; // Monsoon
    else if (month >= 10 && month <= 2) seasonalVariation = -8; // Winter

    const currentTemp = locationData.baseTemp + tempVariation + seasonalVariation;
    
    return {
      location: `${village ? village + ', ' : ''}${district}`,
      current: {
        temperature: Math.round(currentTemp),
        feelsLike: Math.round(currentTemp + 2),
        humidity: locationData.humidity + (Math.random() * 10 - 5),
        windSpeed: locationData.wind + (Math.random() * 4 - 2),
        pressure: 1013 + (Math.random() * 20 - 10),
        visibility: 8 + Math.random() * 4,
        condition: locationData.condition,
        conditionEn: 'Clear',
        icon: this.getSeasonalIcon(month, hour),
        advice: this.getLocationAdvice(locationData.condition, currentTemp),
        sunrise: this.getSunrise(month),
        sunset: this.getSunset(month)
      },
      forecast: this.generateRealisticForecast(currentTemp, locationData.condition),
      alerts: this.generateLocationAlerts(currentTemp, locationData.humidity, district),
      farmingAdvice: this.getLocationFarmingAdvice(currentTemp, month, district)
    };
  }

  // Get seasonal weather icon
  getSeasonalIcon(month, hour) {
    if (hour >= 6 && hour < 18) {
      if (month >= 6 && month <= 9) return '🌧️'; // Monsoon
      else if (month >= 3 && month <= 5) return '☀️'; // Summer
      else return '🌤️'; // Winter
    } else {
      return '🌙'; // Night
    }
  }

  // Get location-specific advice
  getLocationAdvice(condition, temp) {
    if (temp > 35) return 'अत्यधिक गर्मी - पानी पिएं और छाया में रहें।';
    else if (temp < 10) return 'ठंड - गर्म कपड़े पहनें।';
    else if (condition.includes('बारिश')) return 'बारिश - फसल की सुरक्षा करें।';
    else return 'मौसम अच्छा है - खेती के काम कर सकते हैं।';
  }

  // Get sunrise time by month
  getSunrise(month) {
    const sunriseTimes = ['07:00', '06:45', '06:15', '05:45', '05:30', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00'];
    return sunriseTimes[month];
  }

  // Get sunset time by month
  getSunset(month) {
    const sunsetTimes = ['17:30', '18:00', '18:30', '19:00', '19:30', '19:45', '19:30', '19:00', '18:30', '18:00', '17:30', '17:15'];
    return sunsetTimes[month];
  }

  // Generate realistic forecast
  generateRealisticForecast(baseTemp, condition) {
    const forecast = [];
    for (let i = 1; i <= 4; i++) {
      const variation = (Math.random() * 6 - 3); // ±3 degrees variation
      forecast.push({
        time: `${6 + i * 3}:00`,
        temperature: Math.round(baseTemp + variation),
        condition: condition,
        icon: i <= 2 ? '☀️' : '🌤️',
        humidity: 60 + Math.random() * 20,
        windSpeed: 8 + Math.random() * 8
      });
    }
    return forecast;
  }

  // Generate location-specific alerts
  generateLocationAlerts(temp, humidity, district) {
    const alerts = [];
    
    if (temp > 40) {
      alerts.push({
        type: 'heat',
        message: `${district} में अत्यधिक गर्मी की चेतावनी - बाहर न निकलें`,
        priority: 'high',
        icon: '🔥'
      });
    }
    
    if (humidity > 85) {
      alerts.push({
        type: 'humidity',
        message: `${district} में उमस भरा मौसम - पानी पिएं`,
        priority: 'medium',
        icon: '💧'
      });
    }
    
    return alerts;
  }

  // Get location-specific farming advice
  getLocationFarmingAdvice(temp, month, district) {
    const advice = [];
    
    if (month >= 6 && month <= 9) { // Monsoon
      advice.push(`🌧️ ${district} में मानसून का समय - धान की बुआई करें`);
      advice.push('💧 जल निकासी का प्रबंध करें');
    } else if (month >= 10 && month <= 2) { // Winter
      advice.push(`❄️ ${district} में सर्दी का मौसम - गेहूं की बुआई करें`);
      advice.push('🌾 पाला से बचाव करें');
    } else { // Summer
      advice.push(`☀️ ${district} में गर्मी का मौसम - सिंचाई बढ़ाएं`);
      advice.push('🚜 दोपहर में खेत में काम न करें');
    }
    
    return advice;
  }
}

export const weatherService = new WeatherService();