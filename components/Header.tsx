'use client';

import React from 'react';
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Database,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAetherStore } from '../store/useAetherStore';
import { ModelOption } from '../types/aether';
import { Badge } from './primitives/Badge';

const MODEL_OPTIONS: { id: ModelOption; label: string; badge: string }[] = [
  { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', badge: 'Fastest' },
  { id: 'gpt-4o', label: 'GPT-4o Omnis', badge: 'Multimodal' },
  { id: 'llama-3-70b', label: 'Llama 3 70B (Groq)', badge: 'Sub-30ms' },
  { id: 'deepseek-r1', label: 'DeepSeek R1 Reasoning', badge: 'Reasoning' },
];

export const Header: React.FC = () => {
  const {
    selectedModel,
    setSelectedModel,
    isRunning,
    isPaused,
    startExecution,
    pauseExecution,
    stepExecution,
    resetExecution,
    telemetry,
    tokenMetrics,
    isGuardrailOpen,
    toggleGuardrail,
    isMemoryOpen,
    toggleMemory,
  } = useAetherStore();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center justify-between z-30 sticky top-0 text-slate-100 select-none">
      {/* Brand & Platform Identity */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-cyan-100 to-indigo-300 bg-clip-text text-transparent">
                AETHER<span className="text-cyan-400">.AI</span>
              </span>
              <Badge variant="info" size="sm">
                v2.4-PROD
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
              <span>LangGraph Engine • Sub-50ms SSE</span>
            </p>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />

        {/* Model Selector Dropdown */}
        <div className="relative group hidden lg:block">
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-1.5 cursor-pointer transition-colors">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <select
              aria-label="Select AI Model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelOption)}
              className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer pr-4 appearance-none"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                  {m.label} ({m.badge})
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Center Execution Playback Controls */}
      <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 p-1 rounded-xl shadow-inner">
        {!isRunning || isPaused ? (
          <button
            onClick={startExecution}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span>{isPaused ? 'Resume' : 'Run Pipeline'}</span>
          </button>
        ) : (
          <button
            onClick={pauseExecution}
            className="flex items-center space-x-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg text-xs transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Pause className="h-3.5 w-3.5 fill-amber-300" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={stepExecution}
          disabled={isRunning && !isPaused}
          className="flex items-center space-x-1 text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          title="Execute Single LangGraph Step"
        >
          <StepForward className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Step</span>
        </button>

        <button
          onClick={resetExecution}
          className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          title="Reset Graph State"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Right Stats & Telemetry Quick Actions */}
      <div className="flex items-center space-x-3">
        {/* Token Counter & Latency Meter */}
        <div className="hidden xl:flex items-center space-x-3 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-lg font-mono text-[11px]">
          <div className="flex items-center space-x-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">TPS:</span>
            <span className="text-amber-300 font-bold">{tokenMetrics.tokensPerSecond}</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center space-x-1.5">
            <Activity className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-400">Tokens:</span>
            <span className="text-indigo-200 font-semibold">{tokenMetrics.totalTokens.toLocaleString()}</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Latency:</span>
            <span className="text-emerald-400">{tokenMetrics.totalLatencyMs}ms</span>
          </div>
        </div>

        {/* AWS Guardrail Live Badge */}
        <div
          onClick={toggleGuardrail}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Badge variant={telemetry.safetyStatus === 'PASSED' ? 'success' : 'warning'}>
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            AWS GUARDRAIL: {telemetry.safetyStatus}
          </Badge>
        </div>

        {/* Memory Inspector Drawer Toggle */}
        <button
          onClick={toggleMemory}
          className={`p-2 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            isMemoryOpen
              ? 'bg-indigo-950/70 border-indigo-700 text-indigo-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Toggle Memory Inspector (STM/LTM)"
        >
          <Database className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
