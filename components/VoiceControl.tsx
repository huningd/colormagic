import React, { useEffect, useState, useRef } from 'react';
import { Mic, Square, Loader2, Wand2 } from 'lucide-react';
import { GenerationState, SpeechRecognition, SpeechRecognitionEvent } from '../types';

interface VoiceControlProps {
  onTranscript: (text: string) => void;
  state: GenerationState;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onTranscript, state }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [manualInput, setManualInput] = useState('');

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        onTranscript(text);
        setIsListening(false);
      };

      recognition.onerror = (event: Event) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onTranscript(manualInput);
      setManualInput('');
    }
  };

  const isBusy = state.status === 'processing' || state.status === 'generating';

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      
      {/* Voice Button */}
      <div className="relative group">
        {isListening && (
          <div className="absolute inset-0 bg-magic-pink rounded-full blur-xl opacity-50 animate-pulse"></div>
        )}
        <button
          onClick={toggleListening}
          disabled={isBusy}
          className={`
            relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center
            transition-all duration-300 transform shadow-xl border-8
            ${isListening 
              ? 'bg-red-500 border-red-200 scale-110' 
              : 'bg-magic-blue border-blue-200 hover:scale-105 hover:bg-blue-600'
            }
            ${isBusy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isBusy ? (
            <Loader2 className="w-16 h-16 text-white animate-spin" />
          ) : isListening ? (
            <Square className="w-12 h-12 text-white fill-current" />
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </button>
      </div>

      {/* Status Text */}
      <div className="text-center min-h-[3rem]">
        {isListening ? (
          <p className="text-xl font-bold text-magic-pink animate-bounce">Listening...</p>
        ) : isBusy ? (
          <p className="text-xl font-bold text-magic-blue animate-pulse">
            {state.status === 'processing' ? 'Thinking...' : 'Painting magic...'}
          </p>
        ) : (
          <p className="text-lg md:text-xl text-slate-500 font-medium">
            Tap the mic and say something like<br/>
            <span className="text-slate-800 font-bold">"A happy dinosaur eating pizza"</span>
          </p>
        )}
      </div>

      {/* Manual Input Fallback */}
      <form onSubmit={handleManualSubmit} className="w-full flex gap-2">
        <input 
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Or type here..."
          disabled={isBusy}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-magic-purple focus:ring-2 focus:ring-purple-200 outline-none transition-all"
        />
        <button 
          type="submit"
          disabled={!manualInput.trim() || isBusy}
          className="bg-magic-purple text-white px-4 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Wand2 className="w-6 h-6" />
        </button>
      </form>

    </div>
  );
};

export default VoiceControl;