class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async generateResponse(prompt, language = 'hi', context = '') {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const languagePrompts = {
      hi: `आप एक सहायक AI असिस्टेंट हैं जो भारतीय नागरिकों की मदद करते हैं। कृपया हिंदी में जवाब दें। ${context}`,
      en: `You are a helpful AI assistant for Indian citizens. Please respond in English. ${context}`,
      ur: `آپ ایک مددگار AI اسسٹنٹ ہیں جو ہندوستانی شہریوں کی مدد کرتے ہیں۔ براہ کرم اردو میں جواب دیں۔ ${context}`
    };

    const systemPrompt = languagePrompts[language] || languagePrompts.hi;
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant:`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback responses
      const fallbackResponses = {
        hi: 'मुझे खुशी होगी आपकी मदद करने में। कृपया अपना सवाल दोबारा पूछें।',
        en: 'I would be happy to help you. Please ask your question again.',
        ur: 'مجھے آپ کی مدد کرنے میں خوشی ہوگی۔ براہ کرم اپنا سوال دوبارہ پوچھیں۔'
      };
      
      return fallbackResponses[language] || fallbackResponses.hi;
    }
  }

  async processVoiceCommand(transcript, language, userContext = {}) {
    const context = `
    User Context: 
    - Name: ${userContext.name || 'Unknown'}
    - Village: ${userContext.village || 'Unknown'}
    - Address: ${userContext.address || 'Unknown'}
    
    Available Services:
    - Government schemes information
    - Complaint filing
    - Weather updates
    - Agricultural prices
    - Village announcements
    
    Please provide helpful, accurate information relevant to rural Indian citizens.
    `;

    return await this.generateResponse(transcript, language, context);
  }
}

export const geminiService = new GeminiService();