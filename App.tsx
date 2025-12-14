import React, { useState, useCallback, useEffect } from 'react';
import { Key, Sparkles, ExternalLink } from 'lucide-react';
import Header from './components/Header';
import VoiceControl from './components/VoiceControl';
import ResultDisplay from './components/ResultDisplay';
import { generateColoringPageImage } from './services/geminiService';
import { GenerationState } from './types';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);

  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    transcript: '',
    imageUrl: null,
    error: null,
  });

  // Check for existing API key on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // Fallback for environments without the aistudio object (e.g. local dev if not injected)
        // We assume false to force selection if object exists, or true if we can't check
        setHasApiKey(false);
      }
      setCheckingKey(false);
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success after closing dialog to handle race conditions
      setHasApiKey(true);
    }
  };

  const handleTranscript = useCallback(async (text: string) => {
    if (!text) return;

    setState(prev => ({ 
      ...prev, 
      status: 'generating', 
      transcript: text,
      error: null 
    }));

    try {
      const imageUrl = await generateColoringPageImage(text);
      setState(prev => ({
        ...prev,
        status: 'success',
        imageUrl: imageUrl,
      }));
    } catch (error: any) {
      // Handle "Requested entity was not found" by resetting key state
      if (error.message && error.message.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setState(prev => ({
          ...prev,
          status: 'idle',
          error: "Session expired. Please reconnect your API key."
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : "Failed to generate image",
      }));
    }
  }, []);

  const handleReset = useCallback(() => {
    setState({
      status: 'idle',
      transcript: '',
      imageUrl: null,
      error: null,
    });
  }, []);

  if (checkingKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magic-purple"></div>
      </div>
    );
  }

  // API Key Selection Screen
  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-100 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-magic-purple/10 rounded-full flex items-center justify-center mb-2">
               <Sparkles className="w-10 h-10 text-magic-purple animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-800">Welcome to ColorMagic!</h2>
            
            <p className="text-slate-600 text-lg leading-relaxed">
              To create magical coloring pages with our advanced AI, please connect your Google Cloud account.
            </p>

            <button 
              onClick={handleConnectKey}
              className="w-full py-4 px-6 bg-magic-purple hover:bg-purple-700 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Key className="w-6 h-6" />
              Connect API Key
            </button>

            <div className="pt-4 border-t border-slate-100">
               <p className="text-sm text-slate-400 mb-2">Requires a paid Google Cloud project.</p>
               <a 
                 href="https://ai.google.dev/gemini-api/docs/billing" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-1 text-sm text-magic-blue hover:text-blue-700 font-semibold"
               >
                 Billing Information <ExternalLink className="w-3 h-3" />
               </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center gap-12">
          
          {/* Main Content Area */}
          <div className="w-full transition-all duration-500">
            {state.status === 'idle' || state.status === 'processing' || state.status === 'generating' ? (
              <div className="animate-in fade-in zoom-in duration-500">
                 <div className="text-center mb-10 space-y-2">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 drop-shadow-sm">
                      What do you want to <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-purple to-magic-pink">color today?</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">Use your voice to create a unique coloring page!</p>
                 </div>
                 <VoiceControl onTranscript={handleTranscript} state={state} />
              </div>
            ) : null}

            {/* Results Area */}
            <ResultDisplay state={state} onReset={handleReset} />
          </div>
          
        </div>
      </main>

      <footer className="p-6 text-center text-slate-400 text-sm font-medium">
        <p>© {new Date().getFullYear()} ColorMagic. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
