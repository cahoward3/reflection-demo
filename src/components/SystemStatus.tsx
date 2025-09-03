import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Zap, RefreshCw } from 'lucide-react';
import { healthApi } from '../services/api';
import type { PersonaInstance } from '../types/api';

interface SystemStatusProps {
  activePersonas: PersonaInstance[];
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ activePersonas }) => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    setApiStatus('checking');
    try {
      await healthApi.checkHealth();
      setApiStatus('online');
      setLastCheck(new Date());
    } catch (error) {
      setApiStatus('offline');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>;
      case 'offline':
        return <div className="w-3 h-3 bg-red-400 rounded-full"></div>;
      case 'checking':
        return <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold">System Status</h2>
        </div>
        <button
          onClick={checkApiHealth}
          className="btn-secondary px-3 py-2 text-sm"
          disabled={apiStatus === 'checking'}
        >
          <RefreshCw className={`w-4 h-4 ${apiStatus === 'checking' ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <Server className="w-5 h-5 text-aurora-400" />
            <span className="text-sm">API Backend</span>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIndicator(apiStatus)}
            <span className={`text-sm capitalize ${
              apiStatus === 'online' ? 'text-green-400' : 
              apiStatus === 'offline' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {apiStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-genesis-400" />
            <span className="text-sm">Active Personas</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white">{activePersonas.length}</span>
            <div className={`w-3 h-3 rounded-full ${
              activePersonas.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`}></div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">A.R.E. Engine</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-yellow-400">Ready</span>
          </div>
        </div>

        {lastCheck && (
          <div className="text-xs text-white/50 text-center pt-2">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};