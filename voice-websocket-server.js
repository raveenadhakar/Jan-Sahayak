// WebSocket Server for Real-time Voice Processing
// This server integrates Assembly AI, Murf AI, and provides real-time voice processing

const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const { AssemblyAI } = require('assemblyai');
const axios = require('axios');

class VoiceWebSocketServer {
  constructor(options = {}) {
    this.port = options.port || 8080;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    // Initialize AI services
    this.assemblyAI = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_AI_API_KEY
    });
    
    this.murfApiKey = process.env.MURF_AI_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    
    // Active sessions
    this.activeSessions = new Map();
    
    this.setupMiddleware();
    this.setupWebSocketHandlers();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static('public'));
    
    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, req) => {
      const sessionId = this.generateSessionId();
      console.log(`New voice session connected: ${sessionId}`);
      
      // Initialize session
      const session = {
        id: sessionId,
        ws: ws,
        language: 'hi',
        context: {},
        conversation: [],
        isRecording: false,
        audioBuffer: []
      };
      
      this.activeSessions.set(sessionId, session);
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'session_started',
        sessionId: sessionId,
        message: 'Voice session initialized'
      }));

      // Handle incoming messages
      ws.on('message', async (data) => {
        try {
          await this.handleWebSocketMessage(sessionId, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            error: error.message
          }));
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        console.log(`Voice session disconnected: ${sessionId}`);
        this.activeSessions.delete(sessionId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for session ${sessionId}:`, error);
      });
    });
  }

  async handleWebSocketMessage(sessionId, data) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    let message;
    try {
      message = JSON.parse(data);
    } catch (error) {
      // Handle binary audio data
      if (session.isRecording) {
        session.audioBuffer.push(data);
        return;
      }
      throw new Error('Invalid message format');
    }

    switch (message.type) {
      case 'start_recording':
        await this.startRecording(session);
        break;
        
      case 'stop_recording':
        await this.stopRecording(session);
        break;
        
      case 'audio_chunk':
        await this.processAudioChunk(session, message.data);
        break;
        
      case 'voice_command':
        await this.processVoiceCommand(session, message);
        break;
        
      case 'set_language':
        session.language = message.language;
        break;
        
      case 'set_context':
        session.context = { ...session.context, ...message.context };
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  async startRecording(session) {
    session.isRecording = true;
    session.audioBuffer = [];
    
    session.ws.send(JSON.stringify({
      type: 'recording_started',
      message: 'Started recording audio'
    }));
  }

  async stopRecording(session) {
    session.isRecording = false;
    
    if (session.audioBuffer.length > 0) {
      // Combine audio chunks
      const audioData = Buffer.concat(session.audioBuffer);
      await this.transcribeAudio(session, audioData);
    }
    
    session.ws.send(JSON.stringify({
      type: 'recording_stopped',
      message: 'Stopped recording audio'
    }));
  }

  async processAudioChunk(session, audioData) {
    // For real-time processing, you might want to implement streaming transcription
    // For now, we'll buffer the audio and process when recording stops
    if (session.isRecording) {
      session.audioBuffer.push(Buffer.from(audioData, 'base64'));
    }
  }

  async transcribeAudio(session, audioData) {
    try {
      // Upload audio to Assembly AI for transcription
      const uploadResponse = await this.assemblyAI.files.upload(audioData);
      
      const transcriptResponse = await this.assemblyAI.transcripts.transcribe({
        audio_url: uploadResponse.upload_url,
        language_code: this.getAssemblyLanguageCode(session.language)
      });
      
      if (transcriptResponse.status === 'completed') {
        const transcription = transcriptResponse.text;
        
        // Send transcription to client
        session.ws.send(JSON.stringify({
          type: 'transcription',
          text: transcription,
          confidence: transcriptResponse.confidence,
          language: session.language
        }));
        
        // Process the transcribed text
        await this.processVoiceCommand(session, {
          text: transcription,
          language: session.language,
          context: session.context
        });
      }
    } catch (error) {
      console.error('Transcription error:', error);
      session.ws.send(JSON.stringify({
        type: 'error',
        error: 'Transcription failed: ' + error.message
      }));
    }
  }

  async processVoiceCommand(session, command) {
    try {
      // Classify intent
      const intent = await this.classifyIntent(command.text, command.language);
      
      // Generate response based on intent
      const response = await this.generateResponse(intent, session.context, command.language);
      
      // Add to conversation history
      session.conversation.push({
        user: command.text,
        assistant: response.text,
        intent: intent.intent,
        timestamp: new Date().toISOString()
      });
      
      // Send response to client
      session.ws.send(JSON.stringify({
        type: 'intent_processed',
        response: response,
        intent: intent
      }));
      
      // Generate audio response using Murf AI
      if (response.text) {
        await this.generateAudioResponse(session, response.text, command.language);
      }
      
    } catch (error) {
      console.error('Command processing error:', error);
      session.ws.send(JSON.stringify({
        type: 'error',
        error: 'Command processing failed: ' + error.message
      }));
    }
  }

  async classifyIntent(text, language) {
    // Use Gemini AI for intent classification
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: `Classify the intent of this ${language} text for a rural Indian government services platform: "${text}". 
              
              Possible intents:
              - scheme_inquiry: asking about government schemes
              - complaint: filing a complaint
              - document_status: checking document status
              - crop_advisory: agricultural advice
              - weather: weather information
              - market_price: market prices
              - health: health services
              - hospital: hospital information
              - greeting: greetings
              - help: asking for help
              - unknown: unclear intent
              
              Respond with JSON: {"intent": "intent_name", "confidence": 0.8, "entities": []}`
            }]
          }]
        }
      );
      
      const result = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(result.replace(/```json\n?|\n?```/g, ''));
      
    } catch (error) {
      console.error('Intent classification error:', error);
      return {
        intent: 'unknown',
        confidence: 0.3,
        entities: []
      };
    }
  }

  async generateResponse(intent, context, language) {
    const responses = {
      hi: {
        scheme_inquiry: 'मैं आपको सरकारी योजनाओं की जानकारी दे सकता हूँ। कौन सी योजना के बारे में जानना चाहते हैं?',
        complaint: 'मैं आपकी शिकायत दर्ज करने में मदद करूंगा। कृपया अपनी समस्या बताएं।',
        document_status: 'मैं आपके दस्तावेज़ की स्थिति जांच सकता हूँ। कृपया अपना आवेदन नंबर बताएं।',
        crop_advisory: 'मैं कृषि सलाह दे सकता हूँ। आपकी फसल में क्या समस्या है?',
        weather: 'मैं मौसम की जानकारी दे सकता हूँ। आपका स्थान बताएं।',
        market_price: 'मैं मंडी भाव बता सकता हूँ। कौन सी फसल का भाव जानना चाहते हैं?',
        health: 'मैं स्वास्थ्य सेवाओं की जानकारी दे सकता हूँ। क्या जानना चाहते हैं?',
        hospital: 'मैं नजदीकी अस्पताल की जानकारी दे सकता हूँ। आपका स्थान बताएं।',
        greeting: 'नमस्ते! मैं आपकी सहायता के लिए यहाँ हूँ। कैसे मदद कर सकता हूँ?',
        help: 'मैं सरकारी सेवाओं, कृषि, स्वास्थ्य और अन्य जानकारी में आपकी मदद कर सकता हूँ।',
        unknown: 'मुझे समझ नहीं आया। कृपया दोबारा कहें या मदद के लिए "मदद" कहें।'
      },
      en: {
        scheme_inquiry: 'I can help you with government scheme information. Which scheme would you like to know about?',
        complaint: 'I will help you file a complaint. Please describe your problem.',
        document_status: 'I can check your document status. Please provide your application number.',
        crop_advisory: 'I can provide agricultural advice. What is the problem with your crop?',
        weather: 'I can provide weather information. Please tell me your location.',
        market_price: 'I can tell you market prices. Which crop price do you want to know?',
        health: 'I can provide health service information. What would you like to know?',
        hospital: 'I can find nearby hospitals. Please tell me your location.',
        greeting: 'Hello! I am here to assist you. How can I help?',
        help: 'I can help with government services, agriculture, health, and other information.',
        unknown: 'I did not understand. Please say again or say "help" for assistance.'
      }
    };
    
    const langResponses = responses[language] || responses['en'];
    const responseText = langResponses[intent.intent] || langResponses['unknown'];
    
    return {
      text: responseText,
      intent: intent.intent,
      confidence: intent.confidence,
      language: language,
      timestamp: new Date().toISOString()
    };
  }

  async generateAudioResponse(session, text, language) {
    try {
      // Use Murf AI for high-quality TTS
      const audioUrl = await this.synthesizeWithMurf(text, language);
      
      session.ws.send(JSON.stringify({
        type: 'audio_response',
        audioUrl: audioUrl,
        text: text,
        language: language
      }));
      
    } catch (error) {
      console.error('Audio synthesis error:', error);
      // Fallback to basic TTS or skip audio
    }
  }

  async synthesizeWithMurf(text, language) {
    try {
      // Murf AI API integration
      const response = await axios.post('https://api.murf.ai/v1/speech/generate', {
        text: text,
        voice_id: this.getMurfVoiceId(language),
        output_format: 'mp3',
        sample_rate: 22050
      }, {
        headers: {
          'Authorization': `Bearer ${this.murfApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.audio_url;
      
    } catch (error) {
      console.error('Murf AI synthesis error:', error);
      throw error;
    }
  }

  getMurfVoiceId(language) {
    // Map languages to Murf AI voice IDs
    const voiceMap = {
      'hi': 'hindi_female_1', // Replace with actual Murf voice IDs
      'en': 'indian_english_female_1',
      'ur': 'urdu_female_1'
    };
    return voiceMap[language] || voiceMap['hi'];
  }

  getAssemblyLanguageCode(language) {
    const langMap = {
      'hi': 'hi',
      'en': 'en_us',
      'ur': 'ur'
    };
    return langMap[language] || 'hi';
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        activeSessions: this.activeSessions.size,
        timestamp: new Date().toISOString()
      });
    });

    // Murf AI synthesis endpoint (fallback)
    this.app.post('/api/murf/synthesize', async (req, res) => {
      try {
        const { text, voice, language } = req.body;
        const audioUrl = await this.synthesizeWithMurf(text, language);
        
        res.json({
          success: true,
          audioUrl: audioUrl,
          text: text,
          language: language
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Session management endpoints
    this.app.get('/api/sessions', (req, res) => {
      const sessions = Array.from(this.activeSessions.values()).map(session => ({
        id: session.id,
        language: session.language,
        conversationLength: session.conversation.length,
        isRecording: session.isRecording
      }));
      
      res.json({ sessions });
    });
  }

  generateSessionId() {
    return 'voice_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Voice WebSocket Server running on port ${this.port}`);
      console.log(`WebSocket endpoint: ws://localhost:${this.port}`);
      console.log(`HTTP endpoint: http://localhost:${this.port}`);
    });
  }

  stop() {
    this.wss.close();
    this.server.close();
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new VoiceWebSocketServer({
    port: process.env.PORT || 8080
  });
  
  server.start();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down voice server...');
    server.stop();
    process.exit(0);
  });
}

module.exports = VoiceWebSocketServer;