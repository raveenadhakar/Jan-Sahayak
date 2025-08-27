class TextToSpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentUtterance = null;
    this.isPlaying = false;
    
    // Load voices
    this.loadVoices();
    
    // Handle voice changes
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
  }

  getVoiceForLanguage(language) {
    const voiceMap = {
      'hi': ['hi-IN', 'Hindi'],
      'en': ['en-US', 'en-GB', 'English'],
      'ur': ['ur-PK', 'ur-IN', 'Urdu']
    };

    const preferredVoices = voiceMap[language] || ['en-US'];
    
    for (const preferred of preferredVoices) {
      const voice = this.voices.find(v => 
        v.lang.includes(preferred) || v.name.includes(preferred)
      );
      if (voice) return voice;
    }
    
    // Fallback to default voice
    return this.voices[0] || null;
  }

  speak(text, language = 'hi', options = {}) {
    return new Promise((resolve, reject) => {
      if (!text) {
        reject(new Error('No text provided'));
        return;
      }

      // Stop any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.getVoiceForLanguage(language);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onstart = () => {
        this.isPlaying = true;
        this.currentUtterance = utterance;
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isPlaying = false;
        this.currentUtterance = null;
        reject(event.error);
      };

      this.synth.speak(utterance);
    });
  }

  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.currentUtterance = null;
  }

  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }
}

export const ttsService = new TextToSpeechService();