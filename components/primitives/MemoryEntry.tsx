import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MemoryItem } from '../../types/aether';
import { Badge } from './Badge';

interface MemoryEntryProps {
  item: MemoryItem;
  onCopy?: (id: string, text: string) => void;
  className?: string;
}

export const MemoryEntry: React.FC<MemoryEntryProps> = ({
  item,
  onCopy,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    const textToCopy = `${item.key}: ${item.value}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onCopy) onCopy(item.id, textToCopy);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-1.5 group font-mono text-xs ${className}`}
    >
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-indigo-300">{item.key}</span>
          <Badge variant={item.type === 'STM' ? 'purple' : 'info'} size="sm">
            {item.agentName}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {item.similarityScore !== undefined && (
            <span className="text-[10px] text-emerald-400 font-bold">
              Sim: {(item.similarityScore * 100).toFixed(0)}%
            </span>
          )}
          <span className="text-[10px] text-slate-500" suppressHydrationWarning>
            {item.timestamp}
          </span>
          <button
            onClick={handleCopyClick}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            title="Copy memory content"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 opacity-60 group-hover:opacity-100" />
            )}
          </button>
        </div>
      </div>

      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed break-words font-sans">
        {item.value}
      </div>
    </div>
  );
};
