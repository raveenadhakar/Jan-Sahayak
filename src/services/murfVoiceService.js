// Murf Voice API Integration Service
class MurfVoiceService {
  constructor() {
    this.apiKey = import.meta.env.VITE_MURF_API_KEY;
    this.baseUrl = 'https://api.murf.ai/v1';
    this.isEnabled = !!this.apiKey;
  }

  // Text to Speech with Murf API
  async textToSpeech(text, language = 'hi', voiceId = null) {
    if (!this.isEnabled) {
      console.warn('Murf API key not configured, falling back to browser TTS');
      return this.fallbackTTS(text, language);
    }

    try {
      const voice = this.getVoiceForLanguage(language, voiceId);
      
      const response = await fetch(`${this.baseUrl}/speech/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceId: voice.id,
          style: voice.style,
          text: text,
          rate: voice.rate,
          pitch: voice.pitch,
          format: 'mp3',
          sampleRate: 22050
        })
      });

      if (!response.ok) {
        throw new Error(`Murf API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Play the generated audio
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        await audio.play();
        return { success: true, audioUrl: audio.src };
      }
      
      throw new Error('No audio content received');
    } catch (error) {
      console.error('Murf TTS error:', error);
      return this.fallbackTTS(text, language);
    }
  }

  // Voice changer functionality
  async changeVoice(audioBlob, targetVoiceId, language = 'hi') {
    if (!this.isEnabled) {
      console.warn('Murf API not available for voice changing');
      return { success: false, error: 'Voice changing not available' };
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('targetVoiceId', targetVoiceId);
      formData.append('language', language);

      const response = await fetch(`${this.baseUrl}/voice/change`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Voice change error: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, audioUrl: data.audioUrl };
    } catch (error) {
      console.error('Voice change error:', error);
      return { success: false, error: error.message };
    }
  }

  // Translation with voice output
  async translateAndSpeak(text, fromLang, toLang, voiceId = null) {
    try {
      // First translate the text
      const translatedText = await this.translateText(text, fromLang, toLang);
      
      // Then convert to speech
      const audioResult = await this.textToSpeech(translatedText, toLang, voiceId);
      
      return {
        success: true,
        originalText: text,
        translatedText: translatedText,
        audioUrl: audioResult.audioUrl
      };
    } catch (error) {
      console.error('Translate and speak error:', error);
      return { success: false, error: error.message };
    }
  }

  // Text translation
  async translateText(text, fromLang, toLang) {
    // Using a simple translation service or Google Translate API
    // For demo purposes, using basic translations
    const translations = {
      'en-hi': {
        'Hello': 'नमस्ते',
        'Thank you': 'धन्यवाद',
        'Good morning': 'सुप्रभात',
        'How are you?': 'आप कैसे हैं?',
        'Weather': 'मौसम',
        'News': 'समाचार',
        'Complaint': 'शिकायत',
        'Scheme': 'योजना'
      },
      'hi-en': {
        'नमस्ते': 'Hello',
        'धन्यवाद': 'Thank you',
        'सुप्रभात': 'Good morning',
        'मौसम': 'Weather',
        'समाचार': 'News',
        'शिकायत': 'Complaint',
        'योजना': 'Scheme'
      }
    };

    const translationKey = `${fromLang}-${toLang}`;
    const translationMap = translations[translationKey];
    
    if (translationMap && translationMap[text]) {
      return translationMap[text];
    }

    // Fallback to original text if no translation found
    return text;
  }

  // Get appropriate voice for language
  getVoiceForLanguage(language, voiceId = null) {
    const voices = {
      'hi': {
        id: voiceId || 'hi-IN-male-1',
        style: 'conversational',
        rate: 1.0,
        pitch: 1.0,
        name: 'राज (Raj)'
      },
      'en': {
        id: voiceId || 'en-IN-male-1',
        style: 'conversational',
        rate: 1.0,
        pitch: 1.0,
        name: 'Arjun'
      },
      'ur': {
        id: voiceId || 'ur-PK-male-1',
        style: 'conversational',
        rate: 1.0,
        pitch: 1.0,
        name: 'احمد (Ahmad)'
      }
    };

    return voices[language] || voices['hi'];
  }

  // Available voices for each language
  getAvailableVoices(language) {
    const voiceOptions = {
      'hi': [
        { id: 'hi-IN-male-1', name: 'राज (Raj)', gender: 'male', style: 'conversational' },
        { id: 'hi-IN-female-1', name: 'प्रिया (Priya)', gender: 'female', style: 'conversational' },
        { id: 'hi-IN-male-2', name: 'अमित (Amit)', gender: 'male', style: 'news' },
        { id: 'hi-IN-female-2', name: 'सुनीता (Sunita)', gender: 'female', style: 'friendly' }
      ],
      'en': [
        { id: 'en-IN-male-1', name: 'Arjun', gender: 'male', style: 'conversational' },
        { id: 'en-IN-female-1', name: 'Kavya', gender: 'female', style: 'conversational' },
        { id: 'en-IN-male-2', name: 'Ravi', gender: 'male', style: 'news' },
        { id: 'en-IN-female-2', name: 'Meera', gender: 'female', style: 'friendly' }
      ],
      'ur': [
        { id: 'ur-PK-male-1', name: 'احمد (Ahmad)', gender: 'male', style: 'conversational' },
        { id: 'ur-PK-female-1', name: 'فاطمہ (Fatima)', gender: 'female', style: 'conversational' }
      ]
    };

    return voiceOptions[language] || voiceOptions['hi'];
  }

  // Fallback to browser TTS
  async fallbackTTS(text, language) {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getBrowserLangCode(language);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a voice for the language
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(utterance.lang));
        if (voice) {
          utterance.voice = voice;
        }

        speechSynthesis.speak(utterance);
        return { success: true, method: 'browser' };
      }
      throw new Error('Speech synthesis not supported');
    } catch (error) {
      console.error('Fallback TTS error:', error);
      return { success: false, error: error.message };
    }
  }

  // Convert language codes for browser TTS
  getBrowserLangCode(language) {
    const langCodes = {
      'hi': 'hi-IN',
      'en': 'en-IN',
      'ur': 'ur-PK'
    };
    return langCodes[language] || 'hi-IN';
  }

  // Debug voice functionality
  async debugVoice() {
    const testText = {
      'hi': 'नमस्ते, यह आवाज़ परीक्षण है।',
      'en': 'Hello, this is a voice test.',
      'ur': 'السلام علیکم، یہ آواز کا ٹیسٹ ہے۔'
    };

    const results = {};
    
    for (const [lang, text] of Object.entries(testText)) {
      console.log(`Testing ${lang}: ${text}`);
      try {
        const result = await this.textToSpeech(text, lang);
        results[lang] = { success: result.success, method: result.method || 'murf' };
      } catch (error) {
        results[lang] = { success: false, error: error.message };
      }
    }

    return results;
  }

  // Voice command processing with better recognition
  async processVoiceCommand(audioBlob, language = 'hi') {
    // This would integrate with speech recognition APIs
    // For now, returning a mock response
    return {
      success: true,
      transcript: 'मौसम की जानकारी दिखाएं',
      confidence: 0.95,
      language: language
    };
  }
}

export const murfVoiceService = new MurfVoiceService();