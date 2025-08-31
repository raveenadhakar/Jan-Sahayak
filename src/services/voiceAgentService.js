// Voice Agent Service - Integrating Murf AI, Assembly AI, and WebSockets
class VoiceAgentService {
  constructor() {
    this.isListening = false;
    this.websocket = null;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.currentLanguage = 'hi'; // Default to Hindi
    
    // Initialize WebSocket connection
    this.initializeWebSocket();
  }

  // Initialize WebSocket for real-time communication
  initializeWebSocket() {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
    this.websocket = new WebSocket(wsUrl);
    
    this.websocket.onopen = () => {
      console.log('Voice Agent WebSocket connected');
    };
    
    this.websocket.onmessage = (event) => {
      this.handleWebSocketMessage(event);
    };
    
    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Handle incoming WebSocket messages
  handleWebSocketMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'transcription':
          this.handleTranscription(data.text);
          break;
        case 'audio_response':
          this.playAudioResponse(data.audioUrl);
          break;
        case 'intent_processed':
          this.handleIntentResponse(data.response);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // Start voice listening
  async startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      this.isListening = true;
      this.setupMediaRecorder(stream);
      
      return { success: true, message: 'Voice listening started' };
    } catch (error) {
      console.error('Error starting voice listening:', error);
      return { success: false, error: error.message };
    }
  }

  // Setup MediaRecorder for audio streaming
  setupMediaRecorder(stream) {
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && this.websocket.readyState === WebSocket.OPEN) {
        // Send audio data to server for processing
        this.websocket.send(JSON.stringify({
          type: 'audio_chunk',
          data: event.data,
          language: this.currentLanguage,
          timestamp: Date.now()
        }));
      }
    };
    
    this.mediaRecorder.start(100); // Send chunks every 100ms
  }

  // Stop voice listening
  stopListening() {
    this.isListening = false;
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    return { success: true, message: 'Voice listening stopped' };
  }

  // Process voice command with intent recognition
  async processVoiceCommand(text, context = {}) {
    const command = {
      type: 'voice_command',
      text: text,
      language: this.currentLanguage,
      context: {
        location: context.location,
        userProfile: context.userProfile,
        timestamp: Date.now(),
        sessionId: this.generateSessionId()
      }
    };
    
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(command));
    }
    
    return this.classifyIntent(text);
  }

  // Classify user intent from voice input
  classifyIntent(text) {
    const intents = {
      // Government Services
      scheme_inquiry: /योजना|स्कीम|scheme|benefit|लाभ/i,
      complaint: /शिकायत|complaint|समस्या|problem/i,
      document_status: /स्टेटस|status|कब मिलेगा|when will/i,
      
      // Agriculture
      crop_advisory: /फसल|crop|खेती|farming|कीड़े|pest/i,
      weather: /मौसम|weather|बारिश|rain|तापमान/i,
      market_price: /भाव|price|मंडी|market|दाम/i,
      
      // Healthcare
      health: /स्वास्थ्य|health|बीमारी|disease|दवा|medicine/i,
      hospital: /अस्पताल|hospital|डॉक्टर|doctor/i,
      
      // General
      greeting: /नमस्ते|hello|हाय|hi|प्रणाम/i,
      help: /मदद|help|सहायता|assistance/i
    };
    
    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(text)) {
        return {
          intent: intent,
          confidence: 0.8,
          text: text,
          language: this.currentLanguage
        };
      }
    }
    
    return {
      intent: 'unknown',
      confidence: 0.3,
      text: text,
      language: this.currentLanguage
    };
  }

  // Handle transcription from Assembly AI
  handleTranscription(text) {
    console.log('Transcription received:', text);
    
    // Trigger UI update
    if (this.onTranscriptionReceived) {
      this.onTranscriptionReceived(text);
    }
    
    // Process the command
    this.processVoiceCommand(text);
  }

  // Handle intent processing response
  handleIntentResponse(response) {
    console.log('Intent response:', response);
    
    // Trigger UI update
    if (this.onResponseReceived) {
      this.onResponseReceived(response);
    }
  }

  // Play audio response from Murf AI
  async playAudioResponse(audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      audio.play();
      
      // Trigger UI update
      if (this.onAudioPlaying) {
        this.onAudioPlaying(true);
      }
      
      audio.onended = () => {
        if (this.onAudioPlaying) {
          this.onAudioPlaying(false);
        }
      };
      
    } catch (error) {
      console.error('Error playing audio response:', error);
    }
  }

  // Text-to-Speech using Murf AI (fallback to Web Speech API)
  async speak(text, voice = 'hi-IN') {
    try {
      // Try Murf AI first
      const murfResponse = await this.getMurfAudioResponse(text, voice);
      if (murfResponse.success) {
        this.playAudioResponse(murfResponse.audioUrl);
        return;
      }
    } catch (error) {
      console.log('Murf AI not available, using Web Speech API');
    }
    
    // Fallback to Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voice;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
    }
  }

  // Get audio response from Murf AI
  async getMurfAudioResponse(text, voice) {
    try {
      const response = await fetch('/api/murf/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          language: this.currentLanguage
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Murf AI synthesis error:', error);
      return { success: false, error: error.message };
    }
  }

  // Set language for voice processing
  setLanguage(language) {
    this.currentLanguage = language;
  }

  // Generate unique session ID
  generateSessionId() {
    return 'voice_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Voice command shortcuts for rural users
  getVoiceShortcuts() {
    return {
      hindi: {
        'मेरी शिकायत': () => this.navigateToComplaints(),
        'मौसम बताओ': () => this.getWeatherInfo(),
        'योजना दिखाओ': () => this.showSchemes(),
        'भाव बताओ': () => this.getMarketPrices(),
        'अस्पताल कहाँ है': () => this.findNearbyHospital(),
        'मदद चाहिए': () => this.showHelp()
      },
      english: {
        'file complaint': () => this.navigateToComplaints(),
        'weather update': () => this.getWeatherInfo(),
        'show schemes': () => this.showSchemes(),
        'market prices': () => this.getMarketPrices(),
        'find hospital': () => this.findNearbyHospital(),
        'help me': () => this.showHelp()
      }
    };
  }

  // Navigation helpers
  navigateToComplaints() {
    if (this.onNavigate) {
      this.onNavigate('/complaints');
    }
  }

  getWeatherInfo() {
    if (this.onNavigate) {
      this.onNavigate('/weather');
    }
  }

  showSchemes() {
    if (this.onNavigate) {
      this.onNavigate('/schemes');
    }
  }

  getMarketPrices() {
    if (this.onNavigate) {
      this.onNavigate('/market-prices');
    }
  }

  findNearbyHospital() {
    if (this.onNavigate) {
      this.onNavigate('/hospitals');
    }
  }

  showHelp() {
    if (this.onNavigate) {
      this.onNavigate('/help');
    }
  }

  // Event handlers (to be set by components)
  onTranscriptionReceived = null;
  onResponseReceived = null;
  onAudioPlaying = null;
  onNavigate = null;
}

export default VoiceAgentService;