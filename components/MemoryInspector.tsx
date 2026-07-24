'use client';

import React, { useState } from 'react';
import { Database, Search, HardDrive } from 'lucide-react';
import { useAetherStore } from '../store/useAetherStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './primitives/Card';
import { Badge } from './primitives/Badge';
import { MemoryEntry } from './primitives/MemoryEntry';

export const MemoryInspector: React.FC = () => {
  const { memoryItems, isMemoryOpen } = useAetherStore();
  const [activeTab, setActiveTab] = useState<'STM' | 'LTM'>('STM');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isMemoryOpen) return null;

  const filteredItems = memoryItems.filter((item) => {
    const matchesTab = item.type === activeTab;
    const matchesSearch =
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <Card variant="glass" className="font-sans text-slate-100 flex flex-col h-full min-h-[300px]">
      {/* Header Bar */}
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Agent Memory Inspector</CardTitle>
            <CardDescription>STM & Vector LTM Working Memory</CardDescription>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl font-mono text-[11px]">
          <button
            onClick={() => setActiveTab('STM')}
            className={`px-3 py-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 ${
              activeTab === 'STM'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            STM ({memoryItems.filter((i) => i.type === 'STM').length})
          </button>
          <button
            onClick={() => setActiveTab('LTM')}
            className={`px-3 py-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 ${
              activeTab === 'LTM'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            LTM ({memoryItems.filter((i) => i.type === 'LTM').length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 flex flex-col">
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
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px]">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-mono">
              <HardDrive className="h-6 w-6 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>No memory items found in {activeTab}.</p>
            </div>
          ) : (
            filteredItems.map((item) => <MemoryEntry key={item.id} item={item} />)
          )}
        </div>
      </CardContent>
    </Card>
  );
};
