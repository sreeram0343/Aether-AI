'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Search,
  FileText,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  Clock,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { AgentNodeData } from '../types/aether';

const ICON_MAP: Record<string, React.ReactNode> = {
  'Search Agent': <Search className="h-4 w-4 text-cyan-400" />,
  'Summarize Agent': <FileText className="h-4 w-4 text-indigo-400" />,
  'Verify Agent': <ShieldCheck className="h-4 w-4 text-emerald-400" />,
  'Writer Agent': <Edit3 className="h-4 w-4 text-purple-400" />,
};

interface CustomNodeProps {
  data: AgentNodeData;
  selected?: boolean;
}

export const CustomGraphNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  const isRunning = data.status === 'running';
  const isCompleted = data.status === 'completed';

  return (
    <div
      className={`relative min-w-[240px] max-w-[260px] rounded-xl bg-slate-900/95 border backdrop-blur-md p-3.5 transition-all duration-300 shadow-xl ${
        selected
          ? 'ring-2 ring-cyan-500/80 border-cyan-400 shadow-cyan-500/20'
          : isRunning
          ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-cyan-500/30 animate-pulse'
          : isCompleted
          ? 'border-emerald-500/60 shadow-emerald-950/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-slate-950 !-left-1.5"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            {ICON_MAP[data.label] || <Layers className="h-4 w-4 text-cyan-400" />}
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-100 tracking-tight">{data.label}</h4>
            <p className="text-[10px] font-mono text-slate-400">{data.role}</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div>
          {isRunning ? (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          ) : isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-slate-700 block"></span>
          )}
        </div>
      </div>

      {/* Node Body / Description */}
      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
        {data.description}
      </p>

      {/* Metrics Row */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-lg p-1.5 font-mono text-[10px] text-slate-400 mb-2">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-cyan-400" />
          <span>{data.latencyMs}ms</span>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="h-3 w-3 text-amber-400" />
          <span>{data.tokensUsed} tokens</span>
        </div>
      </div>

      {/* Memory Tags */}
      <div className="flex flex-wrap gap-1">
        {data.memoryTags.map((tag, i) => (
          <span
            key={i}
            className="px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 text-[9px] font-mono"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-950 !-right-1.5"
      />
    </div>
  );
};
