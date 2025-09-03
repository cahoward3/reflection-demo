import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="glass-panel p-6 mb-8 aurora-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-aurora-400 animate-pulse-slow" />
            <Zap className="w-4 h-4 text-genesis-400 absolute -top-1 -right-1 animate-float" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-aurora-400 to-genesis-400 bg-clip-text text-transparent">
              Aurora Genesis Engine
            </h1>
            <p className="text-white/70 text-sm">
              Cloud-based IDE for Multi-Agent AI Systems
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="status-indicator status-active">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            System Online
          </div>
        </div>
      </div>
    </header>
  );
};