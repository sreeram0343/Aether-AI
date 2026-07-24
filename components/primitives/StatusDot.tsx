import React from 'react';

export type StatusType = 'idle' | 'running' | 'completed' | 'error' | 'waiting';

interface StatusDotProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  size = 'md',
  className = '',
  pulse = true,
}) => {
  const sizeMap = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  };

  const statusColors: Record<StatusType, { bg: string; ring: string }> = {
    idle: { bg: 'bg-slate-600', ring: 'bg-slate-400' },
    running: { bg: 'bg-cyan-400', ring: 'bg-cyan-500' },
    completed: { bg: 'bg-emerald-400', ring: 'bg-emerald-500' },
    error: { bg: 'bg-rose-500', ring: 'bg-rose-600' },
    waiting: { bg: 'bg-amber-400', ring: 'bg-amber-500' },
  };

  const isPulsing = pulse && status === 'running';

  return (
    <span className={`relative inline-flex ${sizeMap[size]} ${className}`}>
      {isPulsing && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusColors[status].ring}`}
        />
      )}
      <span
        className={`relative inline-flex rounded-full ${sizeMap[size]} ${statusColors[status].bg}`}
      />
    </span>
  );
};
