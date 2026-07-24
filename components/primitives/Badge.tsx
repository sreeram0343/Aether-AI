import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'purple'
  | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded-md border transition-colors';

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[9px]',
    md: 'px-2 py-0.5 text-[10px]',
  };

  const variantStyles = {
    default: 'bg-slate-900 text-slate-300 border-slate-800',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
    error: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
    info: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
    purple: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
    outline: 'bg-transparent text-slate-400 border-slate-700',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
