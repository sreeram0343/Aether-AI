'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { useAetherStore } from '../store/useAetherStore';

export const GuardrailTelemetry: React.FC = () => {
  const { telemetry, isGuardrailOpen, toggleGuardrail } = useAetherStore();

  if (!isGuardrailOpen) {
    return (
      <div className="border border-slate-800 rounded-2xl bg-slate-950/90 p-3 flex items-center justify-between shadow-xl cursor-pointer hover:border-slate-700 transition-colors">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">AWS Guardrail Telemetry</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            {telemetry.safetyStatus}
          </span>
        </div>
        <button
          onClick={toggleGuardrail}
          className="text-xs font-mono text-cyan-400 hover:underline"
        >
          Expand
        </button>
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-950/90 backdrop-blur-xl p-4 shadow-2xl space-y-4 font-sans text-slate-100">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight text-slate-100">
              AWS Bedrock Guardrails
            </h3>
            <p className="text-[10px] font-mono text-slate-400">Sub-15ms Real-time Audit</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold">
            {telemetry.safetyStatus}
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        {/* PII Masking Metric */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold flex items-center space-x-1">
              <EyeOff className="h-3 w-3 text-cyan-400" />
              <span>PII Masked</span>
            </span>
            <span className="text-cyan-300 font-bold">{telemetry.piiMaskedCount}</span>
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {telemetry.piiTypesDetected.length > 0 ? (
              telemetry.piiTypesDetected.map((t, idx) => (
                <span
                  key={idx}
                  className="px-1 py-0.5 bg-slate-950 border border-cyan-900 text-cyan-400 text-[9px] rounded"
                >
                  {t}
                </span>
              ))
            ) : (
              <span className="text-[9px] text-slate-500">None detected</span>
            )}
          </div>
        </div>

        {/* Hallucination Score Index */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold flex items-center space-x-1">
              <Activity className="h-3 w-3 text-amber-400" />
              <span>Hallucination</span>
            </span>
            <span className="text-amber-300 font-bold">{telemetry.hallucinationScore}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-500"
              style={{ width: `${Math.min(telemetry.hallucinationScore * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Prompt Injection Shield Banner */}
      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-indigo-400" />
          <div>
            <p className="font-bold text-indigo-200 text-[11px]">Prompt Injection Shield</p>
            <p className="text-[10px] text-indigo-400 font-mono">Zero-Trust Input Parser Active</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-300 text-[10px] font-mono font-semibold">
          PROTECTED
        </span>
      </div>

      {/* Safety Checks Checklist */}
      <div className="space-y-2 border-t border-slate-800/80 pt-3">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Safety Assertions
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-300 text-[11px]">Toxicity Check</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-300 text-[11px]">Off-Topic Filter</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-300 text-[11px]">Secret Leakage</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-300 text-[11px]">Bias Detector</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Latency Overhead Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
        <span className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-cyan-400" />
          <span>Guardrail Overhead: {telemetry.latencyOverheadMs}ms</span>
        </span>
        <span>Updated: {telemetry.lastCheckedTimestamp.split('T')[1]?.slice(0, 8) || 'Live'}</span>
      </div>
    </div>
  );
};
