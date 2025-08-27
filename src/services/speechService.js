class SpeechService {
  constructor() {
    this.murfApiKey = import.meta.env.VITE_MURF_API_KEY || '';
    this.assemblyAiApiKey = import.meta.env.VITE_ASSEMBLYAI_API_KEY || '';
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.currentAudio = null;
  }

  // Helper method to get the correct language code for Web Speech API
  getLanguageCode(language) {
    const codes = {
      'en': 'en-IN', // Using Indian English as a default
      'hi': 'hi-IN', // Hindi (India)
      'ur': 'ur-PK' // Urdu (Pakistan)
    };
    return codes[language] || codes['en'];
  }

  // Helper method to get the correct language code for AssemblyAI API
  getAssemblyAiLanguageCode(language) {
    const codes = {
      'en': 'en_us', // Using US English as a default for AssemblyAI
      'hi': 'hi',
      'ur': 'ur'
    };
    return codes[language] || codes['en'];
  }

  // Web Speech API for speech recognition (fallback)
  async startSpeechRecognition(language = 'hi', onResult, onError) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = this.getLanguageCode(language);

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      onResult(finalTranscript || interimTranscript, event.results[event.results.length - 1].isFinal);
    };

    recognition.onerror = onError;
    recognition.start();

    return recognition;
  }

  // Record audio for Murf API
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      return new Promise((resolve) => {
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          resolve(audioBlob);
        };
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;

      // Stop all tracks
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  // Convert speech to text using AssemblyAI API
  async speechToText(audioBlob, language = 'hi') {
    if (!this.assemblyAiApiKey) {
      throw new Error('AssemblyAI API key not configured');
    }

    try {
      // First, upload the audio file
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': this.assemblyAiApiKey,
        },
        body: audioBlob
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const { upload_url } = await uploadResponse.json();

      // Then, request transcription
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': this.assemblyAiApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: upload_url,
          language_code: this.getAssemblyAiLanguageCode(language),
          punctuate: true,
          format_text: true
        })
      });

      if (!transcriptResponse.ok) {
        throw new Error(`Transcription request failed: ${transcriptResponse.status}`);
      }

      const { id } = await transcriptResponse.json();

      // Poll for completion
      return await this.pollTranscriptionResult(id);
    } catch (error) {
      console.error('AssemblyAI Error:', error);
      throw error;
    }
  }

  async pollTranscriptionResult(transcriptId) {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': this.assemblyAiApiKey,
        }
      });

      const result = await response.json();

      if (result.status === 'completed') {
        return result.text || '';
      } else if (result.status === 'error') {
        throw new Error(`Transcription failed: ${result.error}`);
      }

      // Wait 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Transcription timeout');
  }

  // Text to speech using Murf API
  async textToSpeech(text, language = 'hi', voice = null) {
    // Stop any currently playing audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    if (!this.murfApiKey) {
      // Fallback to Web Speech API
      return this.webSpeechTTS(text, language);
    }

    try {
      const voiceId = voice || this.getDefaultVoice(language);

      const response = await fetch('https://api.murf.ai/v1/speech/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.murfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceId: voiceId,
          style: 'Conversational',
          text: text,
          rate: 0,
          pitch: 0,
          sampleRate: 48000,
          format: 'MP3',
          channelType: 'MONO',
          pronunciationDictionary: {},
          encodeAsBase64: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.audioFile) {
        this.currentAudio = new Audio(data.audioFile);
        await this.currentAudio.play();
        return this.currentAudio;
      } else {
        throw new Error('No audio file in response');
      }
    } catch (error) {
      console.error('Murf TTS Error:', error);
      // Fallback to Web Speech API
      return this.webSpeechTTS(text, language);
    }
  }

  getDefaultVoice(language) {
    const voices = {
      'hi': 'hi-IN-madhur', // Hindi male voice
      'en': 'en-US-ken',    // English male voice
      'ur': 'ur-PK-asad'    // Urdu male voice
    };
    return voices[language] || voices['hi'];
  }

  // Fallback Web Speech API TTS
  webSpeechTTS(text, language) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any current speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      utterance.rate = 0.8;
      utterance.pitch = 1;

      utterance.onend = () => {
        resolve();
      };
      utterance.onerror = (event) => {
        reject(new Error(event.error));
      };

      speechSynthesis.speak(utterance);
    });
  }

  // Stop all speech
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();