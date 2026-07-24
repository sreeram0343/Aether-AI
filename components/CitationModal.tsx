'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, BookOpen, Layers, Calendar, Award } from 'lucide-react';
import { useAetherStore } from '../store/useAetherStore';

export const CitationModal: React.FC = () => {
  const { activeCitation, setActiveCitation } = useAetherStore();

  if (!activeCitation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                CITATION RECORD [{activeCitation.id}]
              </span>
              <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{activeCitation.title}</h3>
            </div>
          </div>
          <button
            onClick={() => setActiveCitation(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
            <Award className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400">Grounding Confidence</p>
              <p className="font-bold text-amber-300">{(activeCitation.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
            <Layers className="h-4 w-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400">Agent Node</p>
              <p className="font-bold text-indigo-200">{activeCitation.agentNodeName}</p>
            </div>
          </div>
        </div>

        {/* Text Snippet */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Verified Extract Snippet
          </label>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans italic">
            &quot;{activeCitation.snippet}&quot;
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span>Indexed: {activeCitation.publishedDate || '2026-02-15'}</span>
          </span>

          <a
            href={activeCitation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <span>Open Source Paper</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
