import React from 'react';
import { User, Brain, Settings, Clock } from 'lucide-react';
import { PersonaInstance } from '../types/api';
import { motion } from 'framer-motion';

interface PersonaDetailsProps {
  persona: PersonaInstance;
}

export const PersonaDetails: React.FC<PersonaDetailsProps> = ({ persona }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-6 h-6 text-aurora-400" />
        <h2 className="text-xl font-semibold">Active Persona Details</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-genesis-400" />
            <h3 className="font-medium">Blueprint Information</h3>
          </div>
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60">Blueprint ID:</span>
              <span className="text-white font-mono text-sm">{persona.blueprint_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Instance ID:</span>
              <span className="text-white font-mono text-sm">{persona.instance_id}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-5 h-5 text-aurora-400" />
            <h3 className="font-medium">State Vector</h3>
          </div>
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            {Object.entries(persona.current_state_vector).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-white/60 capitalize">{key}:</span>
                <span className="text-white">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-5 h-5 text-genesis-400" />
            <h3 className="font-medium">Session Context</h3>
          </div>
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            {Object.keys(persona.session_context).length > 0 ? (
              Object.entries(persona.session_context).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-white/60 capitalize">{key.replace('_', ' ')}:</span>
                  <span className="text-white">{String(value)}</span>
                </div>
              ))
            ) : (
              <div className="text-white/50 text-sm italic">No session context available</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};