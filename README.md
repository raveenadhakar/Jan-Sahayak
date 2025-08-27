# जन सहायक (Jan Sahayak) - Village Voice Platform

A comprehensive digital platform for rural Indian communities, providing voice-powered access to government services, schemes, and local information.

## 🌟 Features

### 🏠 **Dashboard (होम)**
- Personalized user dashboard
- Quick access to all services
- Recent activity tracking
- Voice-enabled navigation

### 📢 **GramVaani (ग्रामवाणी)**
- Real-time weather updates with forecasts
- Agricultural market prices (मंडी भाव)
- Panchayat announcements and notices
- Latest news relevant to rural communities
- Voice-powered information access

### ⚖️ **Civic Rights (अधिकार)**
- Government scheme information (PM-KISAN, Ayushman Bharat, etc.)
- Eligibility checker for various schemes
- Application process guidance
- Benefits and documentation details
- Multi-language support

### 📝 **Awaz Sewa (आवाज़ सेवा)**
- Voice-powered complaint filing system
- Track complaint status
- Priority-based complaint management
- Multi-language complaint support

## 🚀 Technology Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS with custom village-friendly themes
- **Icons**: Lucide React
- **Speech-to-Text**: AssemblyAI API
- **Text-to-Speech**: Murf API + Web Speech API fallback
- **AI Responses**: Google Gemini API
- **News**: Tavily API
- **Weather**: OpenWeatherMap API

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd jan-sahayak
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Copy `.env.example` to `.env` and add your API keys:
```bash
cp .env.example .env
```

4. **Configure API Keys**
Edit `.env` file with your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_MURF_API_KEY=your_murf_api_key_here
VITE_ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
VITE_TAVILY_API_KEY=your_tavily_api_key_here
VITE_WEATHER_API_KEY=your_weather_api_key_here
```

5. **Start Development Server**
```bash
npm run dev
```

## 🔑 API Keys Setup

### Required APIs:
1. **Google Gemini API** - For AI responses
2. **AssemblyAI** - For speech-to-text conversion
3. **Murf API** - For high-quality text-to-speech
4. **Tavily API** - For latest news and information
5. **OpenWeatherMap** (Optional) - For weather data

### Getting API Keys:

#### Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Create a new project
3. Generate API key
4. Add to `VITE_GEMINI_API_KEY`

#### AssemblyAI
1. Sign up at [AssemblyAI](https://www.assemblyai.com/)
2. Get your API key from dashboard
3. Add to `VITE_ASSEMBLYAI_API_KEY`

#### Murf API
1. Register at [Murf.ai](https://murf.ai/)
2. Get API credentials
3. Add to `VITE_MURF_API_KEY`

## 🌐 Language Support

- **Hindi (हिंदी)** - Primary language
- **English** - Secondary language  
- **Urdu (اردو)** - Regional support

## 📱 Features Overview

### Voice Interface
- Voice commands for navigation
- Speech-to-text for complaints
- Text-to-speech for all content
- Multi-language voice support

### Government Schemes
- PM-KISAN scheme details
- Ayushman Bharat health insurance
- Old age pension information
- Ration card services
- Housing schemes (PM Awas Yojana)
- Education programs

### Village Information
- Local weather forecasts
- Agricultural price updates
- Panchayat announcements
- Community statistics
- Important contact numbers

## 🎨 Design Philosophy

- **Village-Friendly UI**: Large buttons, clear icons, emoji usage
- **Accessibility**: High contrast, voice navigation, simple language
- **Responsive Design**: Works on all devices
- **Offline Fallback**: Mock data when APIs are unavailable

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
The built files in `dist/` folder can be deployed to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Weather data by [OpenWeatherMap](https://openweathermap.org/)
- News by [Tavily](https://tavily.com/)

---

**Made with ❤️ for Rural India** 🇮🇳