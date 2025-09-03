import { useState } from 'react';
import { Header } from './components/Header';
import { PersonaManager } from './components/PersonaManager';
import { ChatInterface } from './components/ChatInterface';
import { ReflectionEngine } from './components/ReflectionEngine';
import { SystemStatus } from './components/SystemStatus';
import { PersonaDetails } from './components/PersonaDetails';
import type { PersonaInstance } from './types/api';

function App() {
  const [activePersonas, setActivePersonas] = useState<PersonaInstance[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<PersonaInstance | null>(null);

  const handlePersonaActivated = (instance: PersonaInstance) => {
    setActivePersonas(prev => {
      const updated = [...prev.filter(p => p.instance_id !== instance.instance_id), instance];
      return updated;
    });
    setSelectedPersona(instance);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <PersonaManager onPersonaActivated={handlePersonaActivated} />
            <SystemStatus activePersonas={activePersonas} />
            {selectedPersona && <PersonaDetails persona={selectedPersona} />}
          </div>

          {/* Middle Column - Chat Interface */}
          <div className="lg:col-span-1">
            <ChatInterface activePersona={selectedPersona} />
          </div>

          {/* Right Column - Reflection Engine */}
          <div>
            <ReflectionEngine activePersona={selectedPersona} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/50 text-sm">
          <p>Aurora Genesis Engine v1.0 - Multi-Agent AI System Management</p>
        </footer>
      </div>
    </div>
  );
}

export default App;