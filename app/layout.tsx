import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aether AI - Multi-Agent Research Platform',
  description: 'Enterprise Multi-Agent AI Platform built with Next.js 14, LangGraph, React Flow, KaTeX Math & AWS Guardrails.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
