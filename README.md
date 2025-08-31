# 🇮🇳 Jan Sahayak - Digital Governance Platform for Rural India

<div align="center">

![Jan Sahayak Logo](https://img.shields.io/badge/Jan%20Sahayak-Digital%20India-orange?style=for-the-badge&logo=india)

**Empowering Rural Communities Through Voice-Powered Digital Governance**

[![React](https://img.shields.io/badge/React-18.0+-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-teal?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[�e Live](https://jan-sahayak.onrender.com) | [📖 Documentation](#) | [🤝 Contributing](#contributing) | [📞 Support](#support)

</div>

---

## 🌟 **Overview**

Jan Sahayak is a comprehensive digital governance platform designed specifically for rural India. It bridges the digital divide by providing voice-powered access to government services, real-time information, and civic engagement tools in multiple Indian languages.

### 🎯 **Mission**
To democratize access to government services and information for rural communities through innovative voice-first technology and multilingual support.

---

## ✨ **Key Features**

### 🎤 **Voice-Powered AI Assistant**
- **Multi-language support**: Hindi, English, Urdu
- **Natural conversation**: Powered by Google Gemini AI
- **Voice commands**: Navigate and interact using voice
- **Text-to-speech**: Responses in user's preferred language

### 🏛️ **Government Services Integration**
- **Scheme Information**: Real-time government scheme data
- **Eligibility Checking**: Check eligibility for various programs
- **Application Status**: Track government application status
- **Document Requirements**: Get required document lists

### 📢 **Complaint Management (Awaz Sewa)**
- **Voice Complaints**: File complaints using voice input
- **AI Categorization**: Automatic complaint categorization
- **Status Tracking**: Real-time complaint status updates
- **Multi-department Routing**: Automatic routing to relevant departments

### 🌾 **Rural Information Hub (GramVaani)**
- **Weather Updates**: Location-based weather information
- **Agricultural Prices**: Real-time mandi prices
- **Panchayat Notices**: Village-level announcements
- **Development Projects**: Local project status updates

### 🗳️ **Civic Rights & Participation**
- **Voter Information**: Polling station details and voter verification
- **Election Updates**: Real-time election results and schedules
- **Health Entitlements**: Ayushman Bharat and health scheme info
- **Educational Resources**: Civic education and awareness

### 📱 **User Experience**
- **Mobile-First Design**: Optimized for smartphones
- **Offline Capability**: Works with cached data
- **Low Bandwidth**: Optimized for slow internet connections
- **Accessibility**: Screen reader support and high contrast modes

---

## 🚀 **Quick Start**

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Modern web browser** with microphone access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jan-sahayak.git
   cd jan-sahayak
   ```

2. **Install dependencies**
   ```bash
   npm create vite@latest.
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   # Essential APIs (Get these first)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_OPENWEATHER_API_KEY=your_openweather_key
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_MURF_API_KEY=your_murf_api_key
   
   # Optional APIs (Enhance functionality)
   VITE_WEATHER_API_KEY=your_weather_api_key
   VITE_NEWSDATA_API_KEY=your_newsdata_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### 🎉 **That's it!** Your Jan Sahayak platform is now running locally.

---

## 🔑 **API Setup Guide**

### 🚀 **Essential APIs (Get these first - 15 minutes total)**

#### 1. **MURF API** (Required for STT/TTS)
- **Website**: [https://murf.ai/api/login]
- **Cost**: Free tier available
- **Setup**: 
  1. Go to MURF API
  2. Create API key/ Generate Api Key
  3. Login details
  4. Add to `.env`: `VITE_MURF_API_KEY=your_key`
 
#### 1. **Google Gemini AI** (Required for AI features)
- **Website**: https://makersuite.google.com/app/apikey
- **Cost**: Free tier available
- **Setup**: 
  1. Go to Google AI Studio
  2. Create API key
  3. Add to `.env`: `VITE_GEMINI_API_KEY=your_key`

#### 2. **OpenWeatherMap** (Required for weather)
- **Website**: https://openweathermap.org/api
- **Cost**: Free (1000 calls/day)
- **Setup**:
  1. Sign up and verify email
  2. Get API key from dashboard
  3. Add to `.env`: `VITE_OPENWEATHER_API_KEY=your_key`

#### 3. **NewsAPI** (Required for news)
- **Website**: https://newsapi.org/register
- **Cost**: Free (1000 requests/day)
- **Setup**:
  1. Register with email
  2. Verify and get API key
  3. Add to `.env`: `VITE_NEWS_API_KEY=your_key`

### 🌟 **Enhanced APIs (Optional but recommended)**

#### 4. **WeatherAPI.com** (Better weather for India)
- **Website**: https://www.weatherapi.com/signup.aspx
- **Cost**: Free (1M calls/month)
- **Benefits**: Better coverage for Indian locations

#### 5. **NewsData.io** (Multi-language news)
- **Website**: https://newsdata.io/register
- **Cost**: Free (200 requests/day)
- **Benefits**: Hindi and Urdu news support

### 🏛️ **Government APIs (Optional - Contact for access)**
- **Data.gov.in**: Official government data
- **Election Commission**: Voter and election data
- **Agmarknet**: Agricultural market prices

> **� Impnortant**: The app works perfectly without government APIs using realistic mock data!

---

## 🏗️ **Project Structure**

```
jan-sahayak/
├── 📁 src/
│   ├── 📁 components/          # React components
│   │   ├── 🏠 Dashboard.jsx    # Main dashboard
│   │   ├── 🎤 SamudayikAwaaz.jsx # Main app component
│   │   ├── 📝 ComplaintsManager.jsx # Complaint system
│   │   ├── 🏛️ GovernmentSchemes.jsx # Scheme information
│   │   ├── 📢 VillageVoice.jsx # Rural information hub
│   │   └── 🔐 AuthModal.jsx    # User authentication
│   │
│   ├── 📁 services/            # Data services
│   │   ├── 🤖 geminiService.js # AI assistant
│   │   ├── 🌤️ weatherService.js # Weather data
│   │   ├── 📰 newsService.js   # News aggregation
│   │   ├── 🗳️ electionDataService.js # Election data
│   │   ├── 🏥 healthDataService.js # Health services
│   │   ├── 🌾 agriculturalDataService.js # Agricultural data
│   │   ├── 📍 locationDataService.js # Location-based data
│   │   └── 📝 complaintService.js # Complaint management
│   │
│   ├── 📁 context/             # React context
│   │   └── AppContext.jsx      # Global state management
│   │
│   └── 📁 assets/              # Static assets
│
├── 📄 API_SETUP_GUIDE.md      # Detailed API setup guide
├── 📄 PROJECT_IMPROVEMENTS.md # Enhancement roadmap
├── 📄 REAL_DATA_INTEGRATION.md # Data integration details
└── 📄 README.md               # This file
```

---

## 🎯 **Core Modules**

### 🏠 **Dashboard**
- **User Overview**: Personal dashboard with quick stats
- **Quick Actions**: One-click access to common tasks
- **Location Info**: Village/district-specific information
- **Recent Activity**: Latest complaints and updates

### 🎤 **Awaz Sewa (Voice-Powered Complaints)**
- **Voice Input**: File complaints using voice
- **AI Processing**: Automatic categorization and routing
- **Status Tracking**: Real-time complaint status
- **Multi-language**: Support for Hindi, English, Urdu

### 📢 **GramVaani (Village Voice)**
- **Weather Updates**: Location-based weather information
- **Agricultural Prices**: Real-time mandi prices
- **Panchayat Notices**: Village announcements
- **Development News**: Local development updates

### 🏛️ **CivicRights**
- **Government Schemes**: Comprehensive scheme database
- **Eligibility Checker**: Check scheme eligibility
- **Voter Information**: Polling station and voter details
- **Health Services**: Ayushman Bharat and health schemes

---

## 🌐 **Multi-Language Support**

### Supported Languages
- **🇮🇳 Hindi (हिंदी)**: Primary language for rural users
- **🇬🇧 English**: Secondary language
- **🇵🇰 Urdu (اردو)**: Regional language support

### Language Features
- **Voice Recognition**: Multi-language voice input
- **Text-to-Speech**: Responses in user's language
- **UI Translation**: Complete interface translation
- **Content Localization**: Localized news and information

---

## 🛠️ **Technology Stack**

### Frontend
- **⚛️ React 18**: Modern React with hooks
- **⚡ Vite**: Fast build tool and dev server
- **🎨 Tailwind CSS**: Utility-first CSS framework
- **🎭 Lucide React**: Beautiful icon library

### AI & Voice
- **🤖 Google Gemini**: Advanced AI assistant
- **🎤 Web Speech API**: Browser-based speech recognition
- **🔊 Speech Synthesis**: Text-to-speech functionality
- **🎯 AssemblyAI**: Advanced speech processing

### Data & APIs
- **🌤️ OpenWeatherMap**: Weather data
- **📰 NewsAPI**: News aggregation
- **🏛️ Government APIs**: Official data sources
- **📍 Location Services**: GPS and location data

### Storage & State
- **💾 LocalStorage**: Client-side data persistence
- **🔄 React Context**: Global state management
- **📱 IndexedDB**: Advanced client-side database

---

## 📱 **Device Compatibility**

### Supported Devices
- **📱 Smartphones**: Android 8.0+, iOS 12.0+
- **💻 Tablets**: iPad, Android tablets
- **🖥️ Desktop**: Chrome, Firefox, Safari, Edge
- **📟 Feature Phones**: Basic browser support

### Performance Optimization
- **🚀 Fast Loading**: Optimized bundle size
- **📶 Low Bandwidth**: Works on 2G/3G networks
- **🔋 Battery Efficient**: Minimal resource usage
- **💾 Offline Support**: Cached data availability

---

## 🔒 **Security & Privacy**

### Data Protection
- **🔐 Local Storage**: User data stored locally
- **🛡️ API Security**: Secure API key management
- **🚫 No Tracking**: No user tracking or analytics
- **🔒 Encryption**: Sensitive data encryption

### Privacy Features
- **👤 Anonymous Usage**: No personal data collection
- **🏠 Local Processing**: Voice processing on device
- **🔄 Data Control**: Users control their data
- **🗑️ Easy Deletion**: Simple data removal

---

## 🚀 **Deployment**

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Production Deployment

#### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

#### **Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### **GitHub Pages**
```bash
npm run build
npm run deploy
```

### Environment Variables
```env
# Production environment
NODE_ENV=production
VITE_API_BASE_URL=https://api.jansahayak.gov.in
VITE_GEMINI_API_KEY=your_production_key
```

---

## 📊 **Features Overview**

| Feature | Status | Description |
|---------|--------|-------------|
| 🎤 Voice Assistant | ✅ Working | AI-powered voice interaction |
| 🌐 Multi-language | ✅ Working | Hindi, English, Urdu support |
| 📝 Complaints | ✅ Working | Voice-powered complaint system |
| 🏛️ Government Schemes | ✅ Working | Comprehensive scheme database |
| 🌤️ Weather | ✅ Working | Location-based weather data |
| 📰 News | ✅ Working | Location-relevant news |
| 🗳️ Election Info | ✅ Working | Voter and election data |
| 🏥 Health Services | ✅ Working | Health scheme information |
| 🌾 Agriculture | ✅ Working | Mandi prices and crop advisory |
| 📱 Mobile Responsive | ✅ Working | Optimized for all devices |
| 🔄 Offline Support | ✅ Working | Cached data availability |
| 🔐 User Authentication | ✅ Working | Secure login system |

---

## 🤝 **Contributing**

We welcome contributions from developers, designers, and domain experts!

### How to Contribute

1. **Fork the repository**
   ```bash
   git fork https://github.com/yourusername/jan-sahayak.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Contribution Guidelines
- **Code Quality**: Follow ESLint rules and best practices
- **Documentation**: Update README and comments
- **Testing**: Add tests for new functionality
- **Accessibility**: Ensure features are accessible
- **Localization**: Support multiple languages

### Areas for Contribution
- 🌐 **Localization**: Add support for more Indian languages
- 🎨 **UI/UX**: Improve design and user experience
- 🔧 **Features**: Add new government service integrations
- 🐛 **Bug Fixes**: Fix issues and improve stability
- 📚 **Documentation**: Improve guides and documentation
- 🧪 **Testing**: Add comprehensive test coverage

---

## 📞 **Support**

### Getting Help
- **📖 Documentation**: Check this README and guides
- **🐛 Issues**: Report bugs on GitHub Issues
- **💬 Discussions**: Join GitHub Discussions
- **📧 Email**: contact@jansahayak.gov.in

### Community
- **🐙 GitHub**: [github.com/yourusername/jan-sahayak](https://github.com/yourusername/jan-sahayak)
- **💬 Discord**: [Join our Discord server](#)
- **🐦 Twitter**: [@JanSahayakIndia](#)
- **📱 Telegram**: [t.me/jansahayak](#)

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Open Source Commitment
Jan Sahayak is committed to being open source to:
- 🌍 **Serve the Public**: Government technology should be transparent
- 🤝 **Enable Collaboration**: Allow community contributions
- 🔄 **Ensure Continuity**: Prevent vendor lock-in
- 📚 **Share Knowledge**: Help other civic tech projects

---

## 🙏 **Acknowledgments**

### Inspiration
- **Digital India Initiative**: Government of India's digital transformation vision
- **Rural Communities**: The real heroes who inspired this project
- **Open Source Community**: For providing amazing tools and libraries

### Technology Partners
- **Google**: Gemini AI and speech services
- **OpenWeather**: Weather data services
- **NewsAPI**: News aggregation services
- **Vercel**: Hosting and deployment platform

### Special Thanks
- **Government Officials**: For guidance on rural needs
- **Community Leaders**: For feedback and testing
- **Developers**: For contributions and improvements
- **Users**: For trust and valuable feedback

---

## 🎯 **Roadmap**

### 🚀 **Phase 1: Foundation** (Completed)
- ✅ Core voice assistant functionality
- ✅ Multi-language support
- ✅ Basic government service integration
- ✅ Mobile-responsive design

### 🌟 **Phase 2: Enhancement** (Current)
- 🔄 Real-time data integration
- 🔄 Advanced AI features
- 🔄 Offline functionality
- 🔄 Performance optimization

### 🚀 **Phase 3: Scale** (Upcoming)
- 📱 Mobile app development
- 🏛️ Government partnership
- 🌍 Multi-state deployment
- 📊 Analytics and insights

### 🌟 **Phase 4: Innovation** (Future)
- 🤖 Advanced AI capabilities
- 🌐 IoT integration
- 🎮 Gamification features
- 🔮 Predictive analytics

---

## 📈 **Impact**

### Target Beneficiaries
- **👥 Rural Population**: 65% of India's population
- **🏘️ Villages**: 600,000+ villages across India
- **📱 Mobile Users**: 750+ million smartphone users
- **🗣️ Language Speakers**: Hindi, English, Urdu speakers

### Expected Outcomes
- **📈 Digital Inclusion**: Bridge the digital divide
- **🏛️ Government Transparency**: Improve service delivery
- **🎤 Voice Accessibility**: Enable voice-first interaction
- **📚 Civic Education**: Increase awareness of rights and services

---

<div align="center">

## 🇮🇳 **Made with ❤️ for Rural India**

**Jan Sahayak - Empowering Every Voice, Connecting Every Village**

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/jan-sahayak?style=social)](https://github.com/yourusername/jan-sahayak)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/jan-sahayak?style=social)](https://github.com/yourusername/jan-sahayak)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/jan-sahayak)](https://github.com/yourusername/jan-sahayak/issues)
[![GitHub License](https://img.shields.io/github/license/yourusername/jan-sahayak)](https://github.com/yourusername/jan-sahayak/blob/main/LICENSE)

---

**⭐ If this project helps you, please give it a star! ⭐**

</div>
