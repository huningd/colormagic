import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center p-6 bg-white shadow-sm border-b-4 border-magic-purple/20">
      <div className="flex items-center gap-3 animate-float">
        <div className="bg-magic-yellow p-3 rounded-2xl shadow-lg transform -rotate-6">
          <Palette className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
          <span className="text-magic-pink">Color</span>
          <span className="text-magic-blue">Magic</span>
        </h1>
        <Sparkles className="w-6 h-6 text-magic-yellow fill-current animate-pulse" />
      </div>
    </header>
  );
};

export default Header;
