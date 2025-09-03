import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Bot, User, Loader2 } from 'lucide-react';
import type { PersonaInstance } from '../types/api';
import { orchestratorApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'persona';
  content: string;
  timestamp: Date;
  personaId?: string;
}

interface ChatInterfaceProps {
  activePersona: PersonaInstance | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ activePersona }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activePersona || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await orchestratorApi.chat({
        instance_id: activePersona.instance_id,
        message: inputMessage,
      });

      const personaMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'persona',
        content: response.response,
        timestamp: new Date(),
        personaId: activePersona.blueprint_id,
      };

      setMessages(prev => [...prev, personaMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'persona',
        content: `Error: ${error.response?.data?.detail || 'Failed to get response'}`,
        timestamp: new Date(),
        personaId: 'System',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="glass-panel p-6 genesis-glow h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-genesis-400" />
        <h2 className="text-xl font-semibold">Supernova Orchestrator</h2>
        {activePersona && (
          <div className="status-indicator status-active ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            {activePersona.blueprint_id}
          </div>
        )}
      </div>

      {!activePersona ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white/60">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Activate a persona to begin interaction</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-aurora-600 text-white'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.type === 'user' ? 'You' : message.personaId}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 text-white border border-white/20 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Persona is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="input-field flex-1"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary px-4"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};