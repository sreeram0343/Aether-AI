'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, Maximize2, Minimize2, Activity } from 'lucide-react';
import { useAetherStore } from '../store/useAetherStore';
import { CustomGraphNode } from './CustomGraphNode';

const nodeTypes = {
  agentNode: CustomGraphNode,
};

export const AgentGraphCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeId,
    setSelectedNodeId,
    isGraphExpanded,
    toggleGraphExpanded,
    pipelineState,
  } = useAetherStore();

  const formattedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
    })) as Node[];
  }, [nodes, selectedNodeId]);

  const formattedEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      style: {
        stroke: edge.animated ? '#22d3ee' : '#334155',
        strokeWidth: edge.animated ? 2.5 : 1.5,
      },
    })) as Edge[];
  }, [edges]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  return (
    <div
      className={`relative w-full border border-slate-800 rounded-2xl bg-slate-950/90 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isGraphExpanded ? 'h-[600px] z-40' : 'h-[280px]'
      }`}
    >
      {/* Header Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md">
          <Network className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold tracking-tight text-slate-200">
            LangGraph Agent Execution DAG
          </span>
          {(pipelineState === 'streaming' || pipelineState === 'dispatching') && (
            <span className="flex items-center space-x-1 font-mono text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/60">
              <Activity className="h-3 w-3 animate-spin" />
              <span>{pipelineState === 'dispatching' ? 'DISPATCHING...' : 'ACTIVE PIPELINE'}</span>
            </span>
          )}
          {pipelineState === 'paused' && (
            <span className="flex items-center space-x-1 font-mono text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/60">
              <span>PAUSED</span>
            </span>
          )}
        </div>

        <button
          onClick={toggleGraphExpanded}
          className="pointer-events-auto p-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl shadow-lg backdrop-blur-md transition-colors"
          title={isGraphExpanded ? 'Collapse Canvas' : 'Expand Canvas'}
        >
          {isGraphExpanded ? (
            <Minimize2 className="h-4 w-4 text-cyan-400" />
          ) : (
            <Maximize2 className="h-4 w-4 text-cyan-400" />
          )}
        </button>
      </div>

      {/* React Flow Viewport */}
      <ReactFlow
        nodes={formattedNodes}
        edges={formattedEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        className="bg-slate-950"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#334155"
          className="opacity-40"
        />
        <Controls className="!bg-slate-900 !border-slate-800 !fill-slate-300 !rounded-xl !shadow-xl" />
      </ReactFlow>
    </div>
  );
};
