# 🔑 API Setup Guide for Jan Sahayak

This guide will help you set up all the necessary API keys to make your Jan Sahayak project fully functional with real data.

## 🚀 **IMMEDIATE SETUP (Start with these)**

### 1. **NewsAPI** (Essential for Location-based News)
- **Website**: https://newsapi.org/register
- **Free Tier**: 1,000 requests/day
- **Setup Steps**:
  1. Go to https://newsapi.org/register
  2. Sign up with your email
  3. Verify your email
  4. Copy your API key
  5. Add to `.env`: `VITE_NEWS_API_KEY=your_key_here`

### 2. **WeatherAPI.com** (Better than OpenWeather for Indian locations)
- **Website**: https://www.weatherapi.com/signup.aspx
- **Free Tier**: 1 million calls/month
- **Setup Steps**:
  1. Go to https://www.weatherapi.com/signup.aspx
  2. Create account
  3. Go to dashboard and copy API key
  4. Add to `.env`: `VITE_WEATHER_API_KEY=your_key_here`

### 3. **NewsData.io** (Multi-language news support)
- **Website**: https://newsdata.io/register
- **Free Tier**: 200 requests/day
- **Setup Steps**:
  1. Register at https://newsdata.io/register
  2. Verify email and login
  3. Go to API section and copy key
  4. Add to `.env`: `VITE_NEWSDATA_API_KEY=your_key_here`

## 🏛️ **GOVERNMENT API KEYS (For Real Data)**

### 1. **Open Government Data Platform**
- **Website**: https://data.gov.in/help/how-use-datasets-apis
- **Free**: Yes, registration required
- **Setup Steps**:
  1. Go to https://data.gov.in/
  2. Click "Register" and create account
  3. Go to "API" section
  4. Generate API key
  5. Add to `.env`: `VITE_DATA_GOV_IN_API_KEY=your_key_here`

### 2. **CoWIN API** (Vaccination Data)
- **Website**: https://apisetu.gov.in/public/marketplace/api/cowin
- **Free**: Yes, most endpoints are public
- **Setup**: No key needed for basic features, just use the public endpoints

### 3. **Election Commission APIs**
- **Contact**: Contact ECI directly for API access
- **Email**: Write to webmaster@eci.gov.in
- **Purpose**: Mention you're building a civic engagement platform

## 📱 **ENHANCED FEATURES (Optional but Recommended)**

### 1. **OpenAI API** (Alternative to Gemini)
- **Website**: https://platform.openai.com/api-keys
- **Cost**: Pay-per-use (starts at $0.002/1K tokens)
- **Setup Steps**:
  1. Create OpenAI account
  2. Add payment method
  3. Generate API key
  4. Add to `.env`: `VITE_OPENAI_API_KEY=your_key_here`

## 🌾 **AGRICULTURAL DATA APIS**

### 1. **Agmarknet** (Market Prices)
- **Contact**: Contact Department of Agriculture & Cooperation
- **Email**: Write to agmarknet@gov.in
- **Purpose**: Request API access for agricultural price data

### 2. **ICAR AgroMet** (Weather Advisory)
- **Contact**: Contact ICAR directly
- **Website**: https://icar.org.in/
- **Purpose**: Request access to agricultural weather advisory APIs

## 🏥 **HEALTH DATA APIS**

### 1. **Ayushman Bharat**
- **Contact**: National Health Authority (NHA)
- **Email**: Write to info@nha.gov.in
- **Purpose**: Request API access for beneficiary verification

### 2. **National Health Mission**
- **Contact**: Your state NHM office
- **Purpose**: Request access to health facility data

## 📋 **CURRENT WORKING SETUP**

You already have these working API keys:

```env
# ✅ WORKING - AI & Speech
VITE_GEMINI_API_KEY=AIzaSyACpWXxV56fB_8DdldumDbX3PnZDPLfmi4
VITE_MURF_API_KEY=ap2_a3b42da9-d248-4774-ab97-2ad1fddf983e
VITE_ASSEMBLYAI_API_KEY=4ce6c54e58764c35a35b8b3822f017a2

# ✅ WORKING - News & Weather
VITE_TAVILY_API_KEY=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
VITE_OPENWEATHER_API_KEY=55c334856b91e36ac8f1ad9c098b14b1
```

## 🎯 **PRIORITY SETUP ORDER**

### **Phase 1: Basic Functionality** (Do this first)
1. ✅ Gemini API (You have this)
2. ✅ OpenWeather API (You have this)
3. 🔄 **NewsAPI** - Get this for location-based news
4. 🔄 **WeatherAPI** - Better weather data for India

### **Phase 2: Enhanced Features**
1. 🔄 **NewsData.io** - Multi-language news
2. 🔄 **Data.gov.in** - Government schemes data
3. 🔄 **OpenAI** - Backup AI service

### **Phase 3: Government Integration**
1. 🔄 **CoWIN** - Vaccination data
2. 🔄 **ECI APIs** - Election data
3. 🔄 **Agmarknet** - Agricultural prices

## 🛠️ **SETUP INSTRUCTIONS**

### 1. **Copy Environment File**
```bash
cp .env.example .env
```

### 2. **Add Your API Keys**
Edit the `.env` file and add your API keys:

```env
# Add the new keys you obtain
VITE_NEWS_API_KEY=your_actual_news_api_key
VITE_WEATHER_API_KEY=your_actual_weather_api_key
VITE_NEWSDATA_API_KEY=your_actual_newsdata_key
```

### 3. **Test the Setup**
```bash
npm run dev
```

## 📊 **API USAGE MONITORING**

### **Free Tier Limits**
- **NewsAPI**: 1,000 requests/day
- **WeatherAPI**: 1,000,000 requests/month
- **NewsData.io**: 200 requests/day
- **OpenWeather**: 1,000 requests/day

### **Cost Optimization Tips**
1. **Cache responses** - Don't call APIs repeatedly for same data
2. **Use fallbacks** - If one API fails, use another
3. **Batch requests** - Combine multiple data needs in single calls
4. **Monitor usage** - Track your API usage to avoid limits

## 🚨 **IMPORTANT NOTES**

### **Security**
- ⚠️ **Never commit API keys to GitHub**
- ✅ Always use `.env` files
- ✅ Add `.env` to `.gitignore`

### **Government APIs**
- 🏛️ Most government APIs require **official requests**
- 📧 Write professional emails explaining your civic tech project
- 🕐 Government API approval can take **2-4 weeks**
- 💡 Start with **mock data** and integrate real APIs later

### **Fallback Strategy**
The app is designed to work with **mock data** if APIs are unavailable:
- ✅ All features work without API keys
- ✅ Real data enhances the experience
- ✅ Graceful degradation when APIs fail

## 📞 **SUPPORT CONTACTS**

### **Technical Issues**
- **NewsAPI**: support@newsapi.org
- **WeatherAPI**: support@weatherapi.com
- **OpenAI**: help@openai.com

### **Government APIs**
- **Data.gov.in**: data-help@gov.in
- **ECI**: webmaster@eci.gov.in
- **NHA**: info@nha.gov.in

## 🎉 **QUICK START**

**Want to get started immediately?** Just get these 2 API keys:

1. **NewsAPI** (5 minutes): https://newsapi.org/register
2. **WeatherAPI** (5 minutes): https://www.weatherapi.com/signup.aspx

Add them to your `.env` file and you'll have **80% of the enhanced functionality** working!

## 📈 **PROJECT IMPROVEMENTS**

With real APIs, your project will have:

### **✅ Location-Based Features**
- Real weather for user's district
- Local news from user's area
- District-specific government schemes
- Village-level announcements

### **✅ Real-Time Data**
- Live mandi prices
- Current weather conditions
- Latest government notifications
- Election updates

### **✅ Personalized Experience**
- User's village/district data
- Relevant news and updates
- Local government contacts
- Area-specific advisories

---

**🚀 Ready to make your Jan Sahayak project truly useful for rural India!**