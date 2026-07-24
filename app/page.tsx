'use client';

import React from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { AgentGraphCanvas } from '../components/AgentGraphCanvas';
import { StreamingExecutionBoard } from '../components/StreamingExecutionBoard';
import { GuardrailTelemetry } from '../components/GuardrailTelemetry';
import { MemoryInspector } from '../components/MemoryInspector';
import { CitationModal } from '../components/CitationModal';
import { useAetherStore } from '../store/useAetherStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/primitives/Card';

const PRESET_QUERIES = [
  'Analyze Fault-Tolerant Surface Codes for d=7 in sub-100ns regimes.',
  'Evaluate Quantum Error Correction thresholds under anisotropic Pauli noise.',
  'Synthesize sub-50ms decoder feedback algorithms for 10k logical qubits.',
];

export default function AetherDashboard() {
  const { prompt, setPrompt, isRunning, startExecution } = useAetherStore();

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    startExecution();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Top Header Navigation */}
      <Header />

      {/* Main 3-Column Studio Dashboard Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1920px] mx-auto w-full">
        {/* LEFT COLUMN: Agent Graph DAG Visualizer & Prompt Control (Cols 1-4 on LG) */}
        <section className="lg:col-span-4 flex flex-col space-y-4">
          {/* Prompt Console Card */}
          <Card variant="glass" className="space-y-3">
            <CardHeader className="border-b-0 pb-0">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <CardTitle className="uppercase tracking-wider">
                  Multi-Agent Research Console
                </CardTitle>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                ⌘ + Enter
              </span>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              <form onSubmit={handlePromptSubmit} className="space-y-3">
                <div className="relative">
                  <textarea
                    aria-label="Research Query Prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter research query, math proof request, or agent pipeline task..."
                    rows={3}
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/80 rounded-xl p-3 text-xs font-sans text-slate-200 placeholder-slate-500 outline-none resize-none transition-colors focus-visible:ring-1 focus-visible:ring-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 overflow-x-auto text-[10px] font-mono text-slate-400">
                    <span className="shrink-0 text-slate-500">Presets:</span>
                    {PRESET_QUERIES.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPrompt(q)}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 truncate max-w-[140px] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                        title={q}
                      >
                        Preset #{idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isRunning || !prompt.trim()}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>Dispatch</span>
                    <Send className="h-3.5 w-3.5 fill-slate-950" />
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* LangGraph Agent DAG Execution Visualizer */}
          <AgentGraphCanvas />
        </section>

        {/* CENTER COLUMN: Real-Time Streaming Output Canvas (Cols 5-8 on LG) */}
        <section className="lg:col-span-5 flex flex-col h-[760px] lg:h-auto">
          <StreamingExecutionBoard />
        </section>

        {/* RIGHT COLUMN: Observer Widgets & Memory Inspector (Cols 9-12 on LG) */}
        <section className="lg:col-span-3 flex flex-col space-y-4">
          {/* AWS Guardrail Telemetry Widget */}
          <GuardrailTelemetry />

          {/* Dual-Tab Memory Inspector */}
          <MemoryInspector />
        </section>
      </main>

      {/* Global Interactive Citation Overlay Modal */}
      <CitationModal />
    </div>
  );
}
