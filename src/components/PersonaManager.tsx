import React, { useState } from 'react';
import { User, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { PersonaInstance } from '../types/api';
import { personaApi } from '../services/api';

interface PersonaManagerProps {
  onPersonaActivated: (instance: PersonaInstance) => void;
}

export const PersonaManager: React.FC<PersonaManagerProps> = ({ onPersonaActivated }) => {
  const [personaId, setPersonaId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRehydrate = async () => {
    if (!personaId.trim()) return;

    setIsLoading(true);
    setLastResult(null);

    try {
      const instance = await personaApi.rehydratePersona(personaId);
      setLastResult({ success: true, message: `Persona "${personaId}" successfully activated` });
      onPersonaActivated(instance);
      setPersonaId('');
    } catch (error: any) {
      setLastResult({ 
        success: false, 
        message: error.response?.data?.detail || 'Failed to activate persona' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 aurora-glow">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-6 h-6 text-aurora-400" />
        <h2 className="text-xl font-semibold">Persona Management</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Persona Blueprint ID
          </label>
          <input
            type="text"
            value={personaId}
            onChange={(e) => setPersonaId(e.target.value)}
            placeholder="Enter persona ID (e.g., Jester_Pippin_v1.0)"
            className="input-field w-full"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleRehydrate}
          disabled={!personaId.trim() || isLoading}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Rehydrating Persona...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Activate Persona</span>
            </>
          )}
        </button>

        {lastResult && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            lastResult.success 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            {lastResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm ${lastResult.success ? 'text-green-300' : 'text-red-300'}`}>
              {lastResult.message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};