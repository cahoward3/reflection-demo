import React, { useState } from 'react';
import { Flame, Play, FileText, Download, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import type { PersonaInstance, BurnReport } from '../types/api';
import { areApi } from '../services/api';
import { motion } from 'framer-motion';

interface ReflectionEngineProps {
  activePersona: PersonaInstance | null;
}

export const ReflectionEngine: React.FC<ReflectionEngineProps> = ({ activePersona }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastReport, setLastReport] = useState<BurnReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunBurn = async () => {
    if (!activePersona) return;

    setIsRunning(true);
    setError(null);
    setLastReport(null);

    try {
      const report = await areApi.runBurn(activePersona.instance_id);
      setLastReport(report);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to run Controlled Burn');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-400';
      case 'partial_pass': return 'text-yellow-400';
      case 'fail': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'partial_pass': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'fail': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="glass-panel p-6 aurora-glow">
      <div className="flex items-center space-x-3 mb-6">
        <Flame className="w-6 h-6 text-orange-400" />
        <h2 className="text-xl font-semibold">Aurora Reflection Engine</h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-white/70 text-sm mb-4">
            Run validation and stress tests on active persona instances to analyze emergent behaviors
            and ensure protocol compliance.
          </p>

          <button
            onClick={handleRunBurn}
            disabled={!activePersona || isRunning}
            className={`btn-primary w-full flex items-center justify-center space-x-2 ${
              !activePersona ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Controlled Burn...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Controlled Burn</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          </motion.div>
        )}

        {lastReport && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Burn Report</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(lastReport.status)}
                  <span className={`text-sm font-medium ${getStatusColor(lastReport.status)}`}>
                    {lastReport.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Backend:</span>
                  <span className="ml-2 text-white">{lastReport.backend_used || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-white/60">Timestamp:</span>
                  <span className="ml-2 text-white">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {(lastReport.mrj_report_path || lastReport.markdown_report_path) && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <h4 className="text-sm font-medium mb-2">Generated Artifacts</h4>
                  <div className="space-y-2">
                    {lastReport.mrj_report_path && (
                      <div className="flex items-center justify-between bg-white/5 rounded p-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-aurora-400" />
                          <span className="text-sm">MRJ Report</span>
                        </div>
                        <button className="btn-secondary text-xs px-3 py-1">
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {lastReport.markdown_report_path && (
                      <div className="flex items-center justify-between bg-white/5 rounded p-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-genesis-400" />
                          <span className="text-sm">Markdown Report</span>
                        </div>
                        <button className="btn-secondary text-xs px-3 py-1">
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};