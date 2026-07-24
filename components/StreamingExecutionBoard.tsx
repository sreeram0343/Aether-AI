'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import {
  Terminal,
  Copy,
  Check,
  ArrowDown,
  Sparkles,
  ExternalLink,
  BookOpen,
  Activity,
} from 'lucide-react';
import { useAetherStore } from '../store/useAetherStore';

export const StreamingExecutionBoard: React.FC = () => {
  const {
    streamedMarkdown,
    isRunning,
    isCompleted,
    citations,
    setActiveCitation,
    tokenMetrics,
  } = useAetherStore();

  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic to stay pinned to bottom during live streaming
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamedMarkdown, autoScroll]);

  const handleCopy = () => {
    navigator.clipboard.writeText(streamedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse citations in text and turn [1], [2] into interactive buttons
  const renderFormattedContent = (content: string) => {
    if (!content) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 font-mono text-xs text-center">
          <Sparkles className="h-8 w-8 text-slate-600 mb-3 animate-pulse" />
          <p>Awaiting user query or pipeline execution...</p>
          <p className="text-[11px] text-slate-600 mt-1">
            Click &quot;Run Pipeline&quot; above to watch real-time multi-agent execution.
          </p>
        </div>
      );
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2 my-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold text-cyan-300 mt-5 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-semibold text-indigo-300 mt-4 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm font-semibold text-slate-200 mt-3 mb-1" {...props} />
          ),
          p: ({ node, children, ...props }) => {
            // Process text elements to make inline citations clickable
            return (
              <p className="text-sm text-slate-300 leading-relaxed mb-4" {...props}>
                {React.Children.map(children, (child) => {
                  if (typeof child === 'string') {
                    const parts = child.split(/(\[\d+\])/g);
                    return parts.map((part, idx) => {
                      const match = part.match(/\[(\d+)\]/);
                      if (match) {
                        const citId = parseInt(match[1], 10);
                        const citation = citations.find((c) => c.id === citId);
                        return (
                          <button
                            key={idx}
                            onClick={() => citation && setActiveCitation(citation)}
                            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 text-[11px] font-mono font-bold transition-all shadow-sm active:scale-95"
                            title={citation ? `Source: ${citation.title}` : `Citation [${citId}]`}
                          >
                            <BookOpen className="h-3 w-3 mr-0.5" />
                            [{citId}]
                          </button>
                        );
                      }
                      return part;
                    });
                  }
                  return child;
                })}
              </p>
            );
          },
          code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
              <code className="bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs px-1.5 py-0.5 rounded" {...props}>
                {children}
              </code>
            ) : (
              <pre className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto my-4 shadow-inner">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-full border border-slate-800 rounded-2xl bg-slate-950/90 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center space-x-2.5">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200 tracking-tight">
            Real-Time Streaming Markdown Canvas
          </span>

          {isRunning && (
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px] font-mono animate-pulse">
              <Activity className="h-3 w-3" />
              <span>STREAMING ({tokenMetrics.tokensPerSecond} t/s)</span>
            </span>
          )}
          {isCompleted && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono">
              STREAM COMPLETE
            </span>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
              autoScroll
                ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Auto-Scroll"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleCopy}
            disabled={!streamedMarkdown}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 disabled:opacity-40 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto font-sans scroll-smooth">
        {renderFormattedContent(streamedMarkdown)}
        {isRunning && (
          <div className="inline-block h-4 w-2 bg-cyan-400 animate-pulse ml-1 align-middle"></div>
        )}
      </div>

      {/* Footer Citations Bar if citations present */}
      {citations.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/40 flex items-center space-x-3 overflow-x-auto text-xs font-mono">
          <span className="text-slate-400 font-semibold flex items-center space-x-1 shrink-0">
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span>Active Citations ({citations.length}):</span>
          </span>
          <div className="flex items-center space-x-2">
            {citations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCitation(c)}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-700 text-cyan-300 text-[11px] truncate max-w-[200px] flex items-center space-x-1 transition-all"
              >
                <span>[{c.id}]</span>
                <span className="truncate">{c.title}</span>
                <ExternalLink className="h-3 w-3 shrink-0 ml-1 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
