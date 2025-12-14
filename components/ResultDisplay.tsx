import React from 'react';
import { Download, Printer, RefreshCw, AlertCircle } from 'lucide-react';
import { GenerationState } from '../types';

interface ResultDisplayProps {
  state: GenerationState;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ state, onReset }) => {
  const handlePrint = () => {
    if (!state.imageUrl) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Coloring Page - ColorMagic</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
              @media print { @page { size: auto; margin: 0mm; } body { margin: 1cm; } }
            </style>
          </head>
          <body>
            <img src="${state.imageUrl}" onload="window.print();window.close()" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (state.status === 'error') {
    return (
      <div className="mt-8 p-6 bg-red-50 border-2 border-red-100 rounded-3xl max-w-lg w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h3>
        <p className="text-red-500 mb-6">{state.error || "The magic faded momentarily. Please try again."}</p>
        <button 
          onClick={onReset}
          className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (state.status === 'success' && state.imageUrl) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Paper Container */}
        <div className="relative bg-white p-4 md:p-8 rounded-sm shadow-2xl rotate-1 transition-transform hover:rotate-0 duration-300 border border-slate-200">
          <div className="aspect-[3/4] w-full max-w-md bg-white border-2 border-slate-100 overflow-hidden relative">
            <img 
              src={state.imageUrl} 
              alt="Generated coloring page" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Decorative tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-magic-yellow/30 rotate-1"></div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Printer className="w-5 h-5" />
            Print Page
          </button>
          
          <a 
            href={state.imageUrl} 
            download={`coloring-page-${Date.now()}.png`}
            className="flex items-center gap-2 bg-magic-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Download className="w-5 h-5" />
            Download
          </a>

          <button 
            onClick={onReset}
            className="flex items-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
          >
            <RefreshCw className="w-5 h-5" />
            New Picture
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultDisplay;
