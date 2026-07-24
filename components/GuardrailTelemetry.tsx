'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  CheckCircle2,
  Clock,
  Activity,
} from 'lucide-react';
import { useAetherStore } from '../store/useAetherStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './primitives/Card';
import { Badge } from './primitives/Badge';
import { MetricTile } from './primitives/MetricTile';

export const GuardrailTelemetry: React.FC = () => {
  const { telemetry, isGuardrailOpen, toggleGuardrail } = useAetherStore();

  if (!isGuardrailOpen) {
    return (
      <Card
        variant="interactive"
        onClick={toggleGuardrail}
        className="p-3 flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">AWS Guardrail Telemetry</span>
          <Badge variant={telemetry.safetyStatus === 'PASSED' ? 'success' : 'warning'}>
            {telemetry.safetyStatus}
          </Badge>
        </div>
        <button className="text-xs font-mono text-cyan-400 hover:underline">Expand</button>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="font-sans text-slate-100">
      {/* Widget Header */}
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>AWS Bedrock Guardrails</CardTitle>
            <CardDescription>Sub-15ms Real-time Audit</CardDescription>
          </div>
        </div>

        <Badge variant={telemetry.safetyStatus === 'PASSED' ? 'success' : 'warning'}>
          {telemetry.safetyStatus}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {/* PII Masking Metric */}
          <MetricTile
            label="PII Masked"
            value={telemetry.piiMaskedCount}
            icon={<EyeOff className="h-3 w-3 text-cyan-400" />}
            subtext={
              telemetry.piiTypesDetected.length > 0
                ? telemetry.piiTypesDetected.join(', ')
                : 'Zero PII detected'
            }
            valueColor="text-cyan-300"
          />

          {/* Hallucination Score Index */}
          <MetricTile
            label="Hallucination"
            value={`${telemetry.hallucinationScore}%`}
            icon={<Activity className="h-3 w-3 text-amber-400" />}
            progressValue={telemetry.hallucinationScore * 10}
            subtext="Variance safety threshold: <5%"
            valueColor="text-amber-300"
          />
        </div>

        {/* Prompt Injection Shield Banner */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-indigo-400" />
            <div>
              <p className="font-bold text-indigo-200 text-[11px]">Prompt Injection Shield</p>
              <p className="text-[10px] text-indigo-400">Zero-Trust Input Parser Active</p>
            </div>
          </div>
          <Badge variant="purple">PROTECTED</Badge>
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
      </CardContent>

      {/* Latency Overhead Footer */}
      <CardFooter>
        <span className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-cyan-400" />
          <span>Guardrail Overhead: {telemetry.latencyOverheadMs}ms</span>
        </span>
        <span suppressHydrationWarning>
          Updated: {telemetry.lastCheckedTimestamp.split('T')[1]?.slice(0, 8) || 'Live'}
        </span>
      </CardFooter>
    </Card>
  );
};
