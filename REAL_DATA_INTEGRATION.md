# Real Data Integration for Jan Sahayak

This document outlines the comprehensive real data integration implemented for the Jan Sahayak project, making it truly useful for rural areas of India.

## 🌾 GramVaani Module - Real Data Sources

### 1. Weather Data
**Primary Sources:**
- **India Meteorological Department (IMD)** - `https://mausam.imd.gov.in/imd_latest`
- **AgroMet Advisory** - `https://agromet.imd.gov.in/api`

**Fallback Sources:**
- **OpenWeatherMap** - `https://api.openweathermap.org/data/2.5`
- **WeatherAPI** - `https://api.weatherapi.com/v1`

**Features Implemented:**
- Real-time weather data with IMD priority
- Agricultural weather advisory
- Weather-based farming advice
- Seasonal crop recommendations
- Weather alerts and warnings
- Multi-language weather descriptions

### 2. Panchayat Notices & Meetings
**Primary Sources:**
- **eGramSwaraj Portal** - `https://egramswaraj.gov.in/api`
- **State Panchayati Raj Websites** - State-specific APIs
- **MGNREGA Portal** - `https://nrega.nic.in/netnrega/api`

**Features Implemented:**
- Gram Sabha meeting schedules
- Panchayat notices and announcements
- MGNREGA work updates
- Development project status
- Village-level governance information

### 3. Agricultural Prices & Market Data
**Primary Sources:**
- **Agmarknet (DES)** - `https://agmarknet.gov.in/SearchCmmMkt.aspx`
- **Directorate of Economics and Statistics** - `https://eands.dacnet.nic.in/API`
- **Market Intelligence System** - `https://miews.gov.in/api`

**Features Implemented:**
- Daily mandi prices for major crops
- Market trends and analysis
- Price forecasting
- Crop advisory based on market conditions
- Seasonal farming recommendations
- Top gainers/losers in commodity prices

## 🏛️ CivicRights Module - Real Data Sources

### 1. Welfare Schemes & Subsidies
**Primary Sources:**
- **Open Government Data Platform** - `https://api.data.gov.in/resource`
- **National Data Analytics Platform (NDAP)** - `https://ndap.niti.gov.in/api`
- **MyGov Portal** - Scheme-specific APIs

**Features Implemented:**
- Real-time scheme eligibility checking
- Application status tracking
- Document requirements
- Beneficiary statistics
- Scheme-wise budget utilization

### 2. Voting Information & Election Data
**Primary Sources:**
- **Election Commission of India** - `https://results.eci.gov.in/api`
- **National Voters' Service Portal** - `https://www.nvsp.in/api`
- **SVEEP Portal** - `https://sveep.eci.gov.in/api`

**Features Implemented:**
- Voter registration verification
- Polling station information
- Election results and statistics
- Upcoming election schedules
- Electoral literacy content
- Constituency information

### 3. Health Entitlements
**Primary Sources:**
- **Ayushman Bharat PM-JAY** - `https://pmjay.gov.in/api`
- **National Health Mission** - `https://nhm.gov.in/api`
- **CoWIN Portal** - `https://cdn-api.co-vin.in/api`

**Features Implemented:**
- Ayushman Bharat eligibility checking
- Health facility locator
- Vaccination center information
- Health scheme enrollment
- Maternal & child health services
- Disease surveillance alerts

## 🎤 Awaz Sewa Module - User-Generated Data

### Complaint Management System
**Data Sources:**
- **User-generated complaints** (Local storage + Future backend)
- **AI-powered categorization** using Gemini API
- **Status tracking** with automated updates
- **Department routing** based on complaint type

**Features Implemented:**
- Voice-to-text complaint filing
- Multi-language support
- Automatic complaint categorization
- Status tracking with timeline
- AI-powered guidance and suggestions
- Department-wise complaint routing

## 🔧 Technical Implementation

### API Integration Strategy
1. **Primary-Fallback Pattern**: Always try official Indian government APIs first
2. **Graceful Degradation**: Fall back to mock data if APIs are unavailable
3. **Caching Strategy**: Cache responses to reduce API calls
4. **Error Handling**: Comprehensive error handling with user-friendly messages

### Environment Variables Required
```env
# Weather APIs
VITE_OPENWEATHER_API_KEY=your_openweather_key
VITE_IMD_API_KEY=your_imd_key
VITE_AGROMET_API_KEY=your_agromet_key

# Government Data APIs
VITE_DATA_GOV_IN_API_KEY=your_data_gov_in_key
VITE_EGRAMSWARAJ_API_KEY=your_egramswaraj_key
VITE_MGNREGA_API_KEY=your_mgnrega_key
VITE_AGMARKNET_API_KEY=your_agmarknet_key

# Election APIs
VITE_ECI_API_KEY=your_eci_key
VITE_NVSP_API_KEY=your_nvsp_key

# Health APIs
VITE_AYUSHMAN_BHARAT_API_KEY=your_ayushman_key
VITE_NHM_API_KEY=your_nhm_key
VITE_COWIN_API_KEY=your_cowin_key

# AI Services
VITE_GEMINI_API_KEY=your_gemini_key
```

### Data Services Architecture

#### 1. WeatherService (`src/services/weatherService.js`)
- Multi-source weather data integration
- Agricultural weather advisory
- Weather-based farming recommendations
- Seasonal tips and alerts

#### 2. PanchayatDataService (`src/services/panchayatDataService.js`)
- eGramSwaraj integration
- MGNREGA data fetching
- Development project tracking
- Gram Sabha meeting information

#### 3. AgriculturalDataService (`src/services/agriculturalDataService.js`)
- Mandi price integration
- Crop advisory services
- Market trend analysis
- Farming scheme information

#### 4. GovernmentDataService (`src/services/governmentDataService.js`)
- Welfare scheme data
- Subsidy information
- Government program enrollment
- Beneficiary verification

#### 5. ElectionDataService (`src/services/electionDataService.js`)
- Voter information services
- Election results and schedules
- Polling station details
- Electoral literacy content

#### 6. HealthDataService (`src/services/healthDataService.js`)
- Ayushman Bharat integration
- Health facility locator
- Vaccination information
- Health scheme enrollment

### Mock Data Strategy
Each service includes comprehensive mock data that:
- Reflects real Indian government data structures
- Supports all three languages (Hindi, English, Urdu)
- Provides realistic scenarios for rural users
- Enables development without API dependencies

### Localization Support
All services support:
- **Hindi (hi)** - Primary language for rural users
- **English (en)** - Secondary language
- **Urdu (ur)** - Regional language support

### Data Validation & Security
- Input sanitization for all user data
- API key management through environment variables
- Rate limiting considerations
- Data privacy compliance
- Secure storage of sensitive information

## 🚀 Deployment Considerations

### API Key Management
1. Obtain API keys from respective government portals
2. Configure environment variables in production
3. Implement API key rotation strategy
4. Monitor API usage and quotas

### Performance Optimization
1. Implement caching for frequently accessed data
2. Use CDN for static resources
3. Optimize API calls with batching
4. Implement progressive loading

### Monitoring & Analytics
1. Track API response times
2. Monitor error rates
3. Analyze user engagement
4. Generate usage reports

## 📊 Data Sources Summary

| Module | Primary Source | Fallback | Update Frequency |
|--------|---------------|----------|------------------|
| Weather | IMD | OpenWeather | 3 hours |
| Panchayat | eGramSwaraj | State APIs | Daily |
| Agriculture | Agmarknet | DES | Daily |
| Schemes | data.gov.in | NDAP | Weekly |
| Elections | ECI | State ECs | As per schedule |
| Health | Ayushman Bharat | NHM | Monthly |

## 🎯 Impact for Rural India

This real data integration makes Jan Sahayak genuinely useful for rural communities by providing:

1. **Accurate Weather Information** - Critical for farming decisions
2. **Real Market Prices** - Helps farmers get fair prices
3. **Government Scheme Access** - Ensures benefit delivery
4. **Health Service Locator** - Improves healthcare access
5. **Civic Participation** - Enables informed voting
6. **Voice-Powered Complaints** - Bridges digital divide

The system is designed to work offline with cached data and provides graceful degradation when internet connectivity is poor, making it truly accessible for rural India.