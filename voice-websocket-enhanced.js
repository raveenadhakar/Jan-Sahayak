const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server for serving static files
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Simple health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Default response
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Jan Sahayak Voice WebSocket Server is running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active connections
const connections = new Map();
let connectionId = 0;

// Voice command processing
class VoiceCommandProcessor {
  constructor() {
    this.intents = {
      // Government Services
      scheme_inquiry: {
        patterns: [/योजना|स्कीम|scheme|benefit|लाभ/i],
        response: {
          hi: 'सरकारी योजनाओं की जानकारी दे रहा हूं। आप PM-KISAN, आयुष्मान भारत जैसी योजनाओं के लिए पात्र हो सकते हैं।',
          en: 'Providing government scheme information. You may be eligible for schemes like PM-KISAN, Ayushman Bharat.',
          ur: 'سرکاری اسکیموں کی معلومات فراہم کر رہا ہوں۔ آپ پی ایم کسان، آیوشمان بھارت جیسی اسکیموں کے لیے اہل ہو سکتے ہیں۔'
        },
        action: 'navigate_schemes'
      },
      complaint: {
        patterns: [/शिकायत|complaint|समस्या|problem/i],
        response: {
          hi: 'आपकी शिकायत दर्ज करने में मदद कर रहा हूं। आप आवाज़ में भी अपनी समस्या बता सकते हैं।',
          en: 'Helping you file a complaint. You can also describe your problem using voice.',
          ur: 'آپ کی شکایت درج کرنے میں مدد کر رہا ہوں۔ آپ آواز میں بھی اپنی شکایت بیان کر سکتے ہیں۔'
        },
        action: 'navigate_complaints'
      },
      weather: {
        patterns: [/मौसम|weather|बारिश|rain|तापमान/i],
        response: {
          hi: 'मौसम की जानकारी दे रहा हूं। आज का तापमान और बारिश की संभावना देख सकते हैं।',
          en: 'Providing weather information. You can check today\'s temperature and rain forecast.',
          ur: 'موسم کی معلومات فراہم کر رہا ہوں۔ آج کا درجہ حرارت اور بارش کا امکان دیکھ سکتے ہیں۔'
        },
        action: 'show_weather'
      },
      agriculture: {
        patterns: [/फसल|crop|खेती|farming|कीड़े|pest|बीज|seed/i],
        response: {
          hi: 'कृषि सलाह दे रहा हूं। फसल की देखभाल, बीज, और कीट नियंत्रण की जानकारी मिलेगी।',
          en: 'Providing agricultural advice. You\'ll get information about crop care, seeds, and pest control.',
          ur: 'زرعی مشورہ فراہم کر رہا ہوں۔ فصل کی دیکھ بھال، بیج، اور کیڑوں کے کنٹرول کی معلومات ملیں گی۔'
        },
        action: 'show_agriculture'
      },
      greeting: {
        patterns: [/नमस्ते|hello|हाय|hi|प्रणाम|السلام علیکم/i],
        response: {
          hi: 'नमस्ते! मैं जन सहायक हूं। मैं आपकी सरकारी सेवाओं, योजनाओं, और शिकायतों में मदद कर सकता हूं।',
          en: 'Hello! I am Jan Sahayak. I can help you with government services, schemes, and complaints.',
          ur: 'السلام علیکم! میں جن سہایک ہوں۔ میں آپ کی سرکاری خدمات، اسکیموں، اور شکایات میں مدد کر سکتا ہوں۔'
        },
        action: 'show_help'
      }
    };
  }

  processCommand(text, language = 'hi', userContext = {}) {
    const lowerText = text.toLowerCase();
    
    for (const [intentName, intent] of Object.entries(this.intents)) {
      for (const pattern of intent.patterns) {
        if (pattern.test(lowerText)) {
          return {
            intent: intentName,
            confidence: 0.9,
            response: intent.response[language] || intent.response.hi,
            action: intent.action,
            originalText: text,
            language: language,
            timestamp: new Date().toISOString()
          };
        }
      }
    }

    // Default response for unrecognized commands
    const defaultResponses = {
      hi: 'मुझे समझने में समस्या हुई। कृपया "मदद" कहें या सरल शब्दों में पूछें। आप मौसम, योजना, या शिकायत के बारे में पूछ सकते हैं।',
      en: 'I had trouble understanding. Please say "help" or ask in simple words. You can ask about weather, schemes, or complaints.',
      ur: 'مجھے سمجھنے میں مسئلہ ہوا۔ براہ کرم "مدد" کہیں یا آسان الفاظ میں پوچھیں۔ آپ موسم، اسکیم، یا شکایت کے بارے میں پوچھ سکتے ہیں۔'
    };

    return {
      intent: 'unknown',
      confidence: 0.3,
      response: defaultResponses[language] || defaultResponses.hi,
      action: 'show_help',
      originalText: text,
      language: language,
      timestamp: new Date().toISOString()
    };
  }
}

const voiceProcessor = new VoiceCommandProcessor();

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const clientId = ++connectionId;
  const clientInfo = {
    id: clientId,
    ws: ws,
    connectedAt: new Date(),
    lastActivity: new Date(),
    language: 'hi',
    userContext: {}
  };
  
  connections.set(clientId, clientInfo);
  
  console.log(`[${new Date().toISOString()}] Client ${clientId} connected from ${req.socket.remoteAddress}`);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection_established',
    clientId: clientId,
    message: 'Connected to Jan Sahayak Voice Assistant',
    timestamp: new Date().toISOString(),
    capabilities: [
      'voice_recognition',
      'intent_processing',
      'multilingual_support',
      'government_services',
      'real_time_responses'
    ]
  }));

  // Handle incoming messages
  ws.on('message', async (data) => {
    try {
      clientInfo.lastActivity = new Date();
      
      let message;
      try {
        message = JSON.parse(data.toString());
      } catch (parseError) {
        console.error(`[${clientId}] Invalid JSON received:`, parseError);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      console.log(`[${clientId}] Received:`, message.type);

      switch (message.type) {
        case 'voice_command':
          await handleVoiceCommand(clientId, message);
          break;
          
        case 'audio_chunk':
          await handleAudioChunk(clientId, message);
          break;
          
        case 'set_language':
          clientInfo.language = message.language || 'hi';
          ws.send(JSON.stringify({
            type: 'language_updated',
            language: clientInfo.language,
            timestamp: new Date().toISOString()
          }));
          break;
          
        case 'set_user_context':
          clientInfo.userContext = { ...clientInfo.userContext, ...message.context };
          ws.send(JSON.stringify({
            type: 'context_updated',
            timestamp: new Date().toISOString()
          }));
          break;
          
        case 'ping':
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
          break;
          
        default:
          console.log(`[${clientId}] Unknown message type: ${message.type}`);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type',
            timestamp: new Date().toISOString()
          }));
      }
    } catch (error) {
      console.error(`[${clientId}] Error processing message:`, error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      }));
    }
  });

  // Handle connection close
  ws.on('close', (code, reason) => {
    console.log(`[${new Date().toISOString()}] Client ${clientId} disconnected: ${code} ${reason}`);
    connections.delete(clientId);
  });

  // Handle connection errors
  ws.on('error', (error) => {
    console.error(`[${clientId}] WebSocket error:`, error);
    connections.delete(clientId);
  });
});

// Handle voice commands
async function handleVoiceCommand(clientId, message) {
  const client = connections.get(clientId);
  if (!client) return;

  const { text, language = 'hi', context = {} } = message;
  
  // Process the command
  const result = voiceProcessor.processCommand(text, language, context);
  
  // Send processing acknowledgment
  client.ws.send(JSON.stringify({
    type: 'command_received',
    originalText: text,
    timestamp: new Date().toISOString()
  }));

  // Simulate processing delay for realistic experience
  setTimeout(() => {
    // Send processed response
    client.ws.send(JSON.stringify({
      type: 'intent_processed',
      response: result,
      timestamp: new Date().toISOString()
    }));

    // Send action if needed
    if (result.action) {
      client.ws.send(JSON.stringify({
        type: 'action_required',
        action: result.action,
        intent: result.intent,
        timestamp: new Date().toISOString()
      }));
    }

    // Log the interaction
    console.log(`[${clientId}] Processed command: "${text}" -> Intent: ${result.intent} (${result.confidence})`);
  }, 500 + Math.random() * 1000); // 0.5-1.5 second delay
}

// Handle audio chunks (placeholder for future Assembly AI integration)
async function handleAudioChunk(clientId, message) {
  const client = connections.get(clientId);
  if (!client) return;

  // For now, just acknowledge receipt
  // In production, this would be sent to Assembly AI for transcription
  client.ws.send(JSON.stringify({
    type: 'audio_received',
    chunkSize: message.data ? message.data.length : 0,
    timestamp: new Date().toISOString()
  }));

  // Simulate transcription (in real implementation, use Assembly AI)
  if (Math.random() > 0.7) { // Randomly simulate transcription completion
    const mockTranscriptions = {
      hi: ['मौसम कैसा है', 'योजना दिखाओ', 'शिकायत दर्ज करें', 'मदद चाहिए'],
      en: ['how is the weather', 'show schemes', 'file complaint', 'need help'],
      ur: ['موسم کیسا ہے', 'اسکیم دکھائیں', 'شکایت درج کریں', 'مدد چاہیے']
    };
    
    const transcriptions = mockTranscriptions[client.language] || mockTranscriptions.hi;
    const randomTranscription = transcriptions[Math.floor(Math.random() * transcriptions.length)];
    
    client.ws.send(JSON.stringify({
      type: 'transcription',
      text: randomTranscription,
      confidence: 0.85 + Math.random() * 0.15,
      language: client.language,
      timestamp: new Date().toISOString()
    }));
  }
}

// Cleanup inactive connections
setInterval(() => {
  const now = new Date();
  const timeout = 30 * 60 * 1000; // 30 minutes

  for (const [clientId, client] of connections.entries()) {
    if (now - client.lastActivity > timeout) {
      console.log(`[${new Date().toISOString()}] Cleaning up inactive client ${clientId}`);
      client.ws.terminate();
      connections.delete(clientId);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes

// Server status logging
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Server status: ${connections.size} active connections`);
}, 10 * 60 * 1000); // Log every 10 minutes

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Jan Sahayak Voice WebSocket Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('Features:');
  console.log('- Real-time voice command processing');
  console.log('- Multi-language support (Hindi, English, Urdu)');
  console.log('- Intent recognition for government services');
  console.log('- WebSocket-based communication');
  console.log('- Ready for Murf AI and Assembly AI integration');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  
  // Close all WebSocket connections
  for (const [clientId, client] of connections.entries()) {
    client.ws.close(1001, 'Server shutting down');
  }
  
  // Close the server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  
  // Close all WebSocket connections
  for (const [clientId, client] of connections.entries()) {
    client.ws.close(1001, 'Server shutting down');
  }
  
  // Close the server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { server, wss, voiceProcessor };