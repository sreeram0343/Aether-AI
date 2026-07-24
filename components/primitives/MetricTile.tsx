import React from 'react';

interface MetricTileProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  progressValue?: number; // 0 to 100
  valueColor?: string;
  className?: string;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  subtext,
  icon,
  progressValue,
  valueColor = 'text-slate-100',
  className = '',
}) => {
  return (
    <div
      className={`p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1.5 font-mono text-xs ${className}`}
    >
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1">
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{label}</span>
        </span>
        <span className={`font-bold ${valueColor}`}>{value}</span>
      </div>

      {progressValue !== undefined && (
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${Math.min(Math.max(progressValue, 0), 100)}%` }}
          />
        </div>
      )}

      {subtext && <p className="text-[9px] text-slate-500 truncate">{subtext}</p>}
    </div>
  );
};
