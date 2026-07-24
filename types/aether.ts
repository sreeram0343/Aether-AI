export type PipelineState = 'idle' | 'dispatching' | 'streaming' | 'paused' | 'complete' | 'error';

export type AgentNodeStatus = 'idle' | 'running' | 'completed' | 'error' | 'waiting';

export interface AgentNodeData {
  label: string;
  role: string;
  status: AgentNodeStatus;
  latencyMs: number;
  tokensUsed: number;
  description: string;
  memoryTags: string[];
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  currentStep?: string;
  iconName?: string;
}

export interface AgentNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: AgentNodeData;
}

export interface AgentEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface GuardrailTelemetry {
  piiMaskedCount: number;
  piiTypesDetected: string[];
  hallucinationScore: number; // Percentage 0-100 (lower is better/more grounded)
  promptInjectionBlocked: boolean;
  safetyStatus: 'PASSED' | 'WARNING' | 'FLAGGED';
  latencyOverheadMs: number;
  checksPassed: {
    toxicity: boolean;
    offTopic: boolean;
    secretLeakage: boolean;
    biasDetected: boolean;
  };
  lastCheckedTimestamp: string;
}

export interface MemoryItem {
  id: string;
  type: 'STM' | 'LTM';
  key: string;
  value: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  similarityScore?: number;
  vectorId?: string;
}

export interface Citation {
  id: number;
  title: string;
  url: string;
  snippet: string;
  confidence: number;
  agentNodeId: string;
  agentNodeName: string;
  publishedDate?: string;
}

export type StreamEventType =
  | 'pipeline_start'
  | 'node_start'
  | 'node_chunk'
  | 'guardrail_check'
  | 'memory_write'
  | 'citation_emitted'
  | 'node_end'
  | 'pipeline_complete';

export interface StreamEvent {
  type: StreamEventType;
  nodeId?: string;
  content?: string;
  citation?: Citation;
  guardrailUpdate?: Partial<GuardrailTelemetry>;
  memoryUpdate?: MemoryItem;
  tokensAdded?: number;
  latencyMs?: number;
  timestamp: number;
}

export type ModelOption = 'claude-3-5-sonnet' | 'gpt-4o' | 'llama-3-70b' | 'deepseek-r1';

export interface TokenMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  tokensPerSecond: number;
  totalLatencyMs: number;
}
