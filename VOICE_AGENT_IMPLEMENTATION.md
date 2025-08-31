# Voice Agent Implementation - Jan Sahayak

## Overview

This implementation transforms Jan Sahayak into a comprehensive voice-enabled platform for rural citizens, integrating advanced AI technologies including Murf AI for text-to-speech and Assembly AI for speech recognition, with real-time WebSocket communication.

## Key Features Implemented

### 1. Enhanced Voice Agent UI Component
- **Location**: `src/components/VoiceAgentUI.jsx`
- **Features**:
  - Prominent floating voice interface
  - Real-time speech recognition
  - Multi-language support (Hindi, English, Urdu)
  - Voice command shortcuts
  - Conversation history
  - Voice mode toggle
  - Integration with Murf AI and Assembly AI branding

### 2. Real Location-Based Weather Data
- **Location**: `src/services/weatherService.js`
- **Improvements**:
  - Uses OpenWeatherMap API with fallback to free services
  - Location-specific weather for user's village/district
  - Real-time weather conditions
  - Farming advice based on weather
  - Seasonal variations and realistic forecasts
  - Multiple location query formats for better accuracy

### 3. Fixed Government Schemes Visibility
- **Location**: `src/components/GovernmentSchemes.jsx`
- **Fixes**:
  - Schemes now visible regardless of login status
  - Personalized eligibility when logged in
  - Real application URLs for each scheme
  - Direct redirection to official government portals
  - Status check functionality with real URLs

### 4. Real-Time WebSocket Server
- **Location**: `voice-websocket-enhanced.js`
- **Features**:
  - Real-time voice command processing
  - Intent recognition for government services
  - Multi-language support
  - Connection management
  - Health monitoring
  - Ready for Murf AI and Assembly AI integration

### 5. Voice Command Integration
- **Enhanced voice commands in main component**
- **Real weather data integration**
- **Navigation through voice**
- **Multi-language voice responses**

## Technical Implementation

### Voice Agent Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   VoiceAgentUI  │◄──►│  WebSocket Server │◄──►│  AI Services    │
│   Component     │    │                  │    │  (Murf/Assembly)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Speech Services │    │ Intent Processing│    │ Response        │
│ Recognition/TTS │    │ Command Routing  │    │ Generation      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Real-Time Data Flow

1. **User speaks** → Speech Recognition (Web Speech API/Assembly AI)
2. **Transcription** → Intent Processing (Local/AI)
3. **Command Processing** → Action Execution
4. **Response Generation** → Text-to-Speech (Murf AI/Web Speech)
5. **UI Updates** → Real-time feedback

### Government Schemes Integration

```
User Profile → Location Service → Eligibility Check → Real Schemes Data
     │                │                 │                    │
     ▼                ▼                 ▼                    ▼
Login Status → District/State → Scheme Matching → Application URLs
```

## Installation and Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file with:
```env
VITE_WEATHER_API_KEY=your_openweather_api_key
VITE_WEBSOCKET_URL=ws://localhost:8080
VITE_MURF_API_KEY=your_murf_api_key
VITE_ASSEMBLY_API_KEY=your_assembly_api_key
```

### 3. Run the Application

#### Development Mode (Full Stack)
```bash
npm run dev:full
```
This runs both the voice WebSocket server and the React app.

#### Individual Services
```bash
# React App Only
npm run dev

# Voice Server Only
npm run voice-server
```

## Voice Commands Supported

### Hindi Commands
- `"मौसम बताओ"` - Get weather information
- `"योजना दिखाओ"` - Show government schemes
- `"शिकायत दर्ज करें"` - File a complaint
- `"ग्रामवाणी खोलें"` - Open village voice
- `"मदद चाहिए"` - Get help

### English Commands
- `"Weather update"` - Get weather information
- `"Show schemes"` - Show government schemes
- `"File complaint"` - File a complaint
- `"Village voice"` - Open village voice
- `"Help me"` - Get help

### Urdu Commands
- `"موسم بتائیں"` - Get weather information
- `"اسکیم دکھائیں"` - Show government schemes
- `"شکایت درج کریں"` - File a complaint
- `"گاؤں کی آواز"` - Open village voice
- `"مدد چاہیے"` - Get help

## Government Schemes with Real URLs

### Implemented Schemes
1. **PM-KISAN**
   - Application: https://pmkisan.gov.in/RegistrationForm.aspx
   - Status Check: https://pmkisan.gov.in/BeneficiaryStatus.aspx

2. **Ayushman Bharat**
   - Application: https://pmjay.gov.in/search/login
   - Status Check: https://pmjay.gov.in/search/login

3. **Old Age Pension**
   - Application: https://nsap.nic.in/user/login
   - Status Check: https://nsap.nic.in/user/login

4. **Ration Card**
   - Application: https://nfsa.gov.in/portal/ration-card-details
   - Status Check: https://nfsa.gov.in/portal/ration-card-details

5. **PM Awas Yojana**
   - Application: https://pmayg.nic.in/netiay/home.aspx
   - Status Check: https://pmayg.nic.in/netiay/Benificiary.aspx

6. **Sarva Shiksha Abhiyan**
   - Application: https://ssa.nic.in/admissions
   - Status Check: https://ssa.nic.in/student-status

## Weather Service Features

### Real Data Sources
1. **Primary**: OpenWeatherMap API
2. **Fallback**: wttr.in free service
3. **Mock**: Location-based realistic data

### Weather Information Provided
- Current temperature and conditions
- Humidity and wind speed
- Weather alerts and warnings
- Farming advice based on conditions
- Sunrise/sunset times
- 3-day forecast

## WebSocket Server Features

### Connection Management
- Automatic connection cleanup
- Health monitoring
- Multi-client support
- Language preference per client

### Intent Recognition
- Government service queries
- Weather information requests
- Complaint filing assistance
- Scheme eligibility checks
- Agricultural advice

### Real-Time Features
- Instant voice command processing
- Live transcription feedback
- Immediate response generation
- Action routing to UI components

## Integration with Murf AI

### Text-to-Speech Enhancement
```javascript
// Enhanced TTS with Murf AI integration
const getMurfAudioResponse = async (text, voice) => {
  const response = await fetch('/api/murf/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      voice: voice,
      language: currentLanguage
    })
  });
  return response.json();
};
```

### Voice Quality Features
- High-quality voice synthesis
- Natural-sounding speech
- Multi-language support
- Emotional tone adjustment
- Speed and pitch control

## Integration with Assembly AI

### Speech Recognition Enhancement
```javascript
// Enhanced STT with Assembly AI
const processAudioWithAssembly = async (audioData) => {
  const response = await fetch('/api/assembly/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audio_data: audioData,
      language_code: currentLanguage
    })
  });
  return response.json();
};
```

### Recognition Features
- High accuracy transcription
- Real-time processing
- Multi-language support
- Noise reduction
- Confidence scoring

## Performance Optimizations

### Voice Processing
- Chunked audio streaming
- Debounced command processing
- Cached responses
- Optimized WebSocket communication

### UI Responsiveness
- Lazy loading of voice components
- Efficient state management
- Minimal re-renders
- Progressive enhancement

## Security Considerations

### Data Protection
- No audio data storage
- Encrypted WebSocket connections
- User consent for voice features
- Privacy-first design

### API Security
- Rate limiting on voice commands
- Input validation and sanitization
- Secure API key management
- CORS protection

## Future Enhancements

### Planned Features
1. **Advanced AI Integration**
   - GPT-4 for complex queries
   - Sentiment analysis
   - Context-aware responses

2. **Enhanced Voice Features**
   - Voice biometrics
   - Speaker identification
   - Emotion detection

3. **Offline Capabilities**
   - Local speech recognition
   - Cached responses
   - Progressive web app features

4. **Analytics and Insights**
   - Usage patterns
   - Popular commands
   - User satisfaction metrics

## Troubleshooting

### Common Issues

1. **Voice Recognition Not Working**
   - Check microphone permissions
   - Ensure HTTPS connection
   - Verify browser compatibility

2. **WebSocket Connection Failed**
   - Check server is running on port 8080
   - Verify firewall settings
   - Ensure WebSocket URL is correct

3. **Weather Data Not Loading**
   - Check API key configuration
   - Verify internet connection
   - Check rate limits

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('voiceDebug', 'true');
```

## Contributing

### Development Guidelines
1. Follow existing code patterns
2. Add comprehensive comments
3. Test voice commands thoroughly
4. Ensure multi-language support
5. Maintain accessibility standards

### Testing Voice Features
1. Test with different accents
2. Verify multi-language support
3. Check error handling
4. Test WebSocket reconnection
5. Validate real-time performance

## License and Credits

This implementation is part of the Jan Sahayak project for the Murf AI Challenge, focusing on creating accessible voice-enabled government services for rural communities.

### Technologies Used
- React.js for UI components
- WebSocket for real-time communication
- Web Speech API for browser-based recognition
- Murf AI for high-quality text-to-speech
- Assembly AI for accurate speech recognition
- OpenWeatherMap API for weather data
- Government of India APIs for scheme data