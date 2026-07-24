'use client';

import React, { useState } from 'react';
import { Database, Search, HardDrive, Cpu, Copy, Check, Sparkles, Filter } from 'lucide-react';
import { useAetherStore } from '../store/useAetherStore';

export const MemoryInspector: React.FC = () => {
  const { memoryItems, isMemoryOpen, selectedNodeId } = useAetherStore();
  const [activeTab, setActiveTab] = useState<'STM' | 'LTM'>('STM');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isMemoryOpen) return null;

  const filteredItems = memoryItems.filter((item) => {
    const matchesTab = item.type === activeTab;
    const matchesSearch =
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-950/90 backdrop-blur-xl p-4 shadow-2xl space-y-4 font-sans text-slate-100 flex flex-col h-full min-h-[300px]">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight text-slate-100">
              Agent Memory Inspector
            </h3>
            <p className="text-[10px] font-mono text-slate-400">STM & Vector LTM Working Memory</p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl font-mono text-[11px]">
          <button
            onClick={() => setActiveTab('STM')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'STM'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            STM ({memoryItems.filter((i) => i.type === 'STM').length})
          </button>
          <button
            onClick={() => setActiveTab('LTM')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'LTM'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            LTM ({memoryItems.filter((i) => i.type === 'LTM').length})
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter memory by key, agent, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Memory List Content */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px] font-mono text-xs">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            <HardDrive className="h-6 w-6 text-slate-600 mx-auto mb-2 opacity-50" />
            <p>No memory items found in {activeTab}.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-1.5 group"
            >
              {/* Item Header */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-300">{item.key}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 text-[9px] border border-slate-800">
                    {item.agentName}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {item.similarityScore && (
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Sim: {(item.similarityScore * 100).toFixed(0)}%
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                  <button
                    onClick={() => handleCopy(item.id, `${item.key}: ${item.value}`)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-opacity"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Value Text */}
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed break-words font-sans">
                {item.value}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
