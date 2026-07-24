import { create } from 'zustand';
import {
  AgentNode,
  AgentEdge,
  GuardrailTelemetry,
  MemoryItem,
  Citation,
  ModelOption,
  TokenMetrics,
  AgentNodeStatus,
} from '../types/aether';

const INITIAL_NODES: AgentNode[] = [
  {
    id: 'search',
    type: 'agentNode',
    position: { x: 50, y: 120 },
    data: {
      label: 'Search Agent',
      role: 'Information Retrieval',
      status: 'idle',
      latencyMs: 0,
      tokensUsed: 0,
      description: 'Queries academic & Web APIs for quantum error correction data.',
      memoryTags: ['web_search', 'arxiv_db'],
      inputs: { query: 'Quantum Error Correction Surface Codes 2026' },
      outputs: {},
    },
  },
  {
    id: 'summarize',
    type: 'agentNode',
    position: { x: 320, y: 50 },
    data: {
      label: 'Summarize Agent',
      role: 'Context Compression',
      status: 'idle',
      latencyMs: 0,
      tokensUsed: 0,
      description: 'Extracts core theorems, LaTeX formulas & citation metadata.',
      memoryTags: ['stm_compress', 'vector_ltm'],
      inputs: {},
      outputs: {},
    },
  },
  {
    id: 'verify',
    type: 'agentNode',
    position: { x: 320, y: 200 },
    data: {
      label: 'Verify Agent',
      role: 'AWS Guardrail & Fact-Check',
      status: 'idle',
      latencyMs: 0,
      tokensUsed: 0,
      description: 'Validates math proofs & checks for PII / hallucination markers.',
      memoryTags: ['guardrail_eval', 'fact_checker'],
      inputs: {},
      outputs: {},
    },
  },
  {
    id: 'writer',
    type: 'agentNode',
    position: { x: 600, y: 120 },
    data: {
      label: 'Writer Agent',
      role: 'Synthesis & Generation',
      status: 'idle',
      latencyMs: 0,
      tokensUsed: 0,
      description: 'Streams final technical synthesis with KaTeX math & inline citations.',
      memoryTags: ['final_stream', 'markdown_gen'],
      inputs: {},
      outputs: {},
    },
  },
];

const INITIAL_EDGES: AgentEdge[] = [
  { id: 'e1', source: 'search', target: 'summarize', label: 'Raw Results', animated: false },
  { id: 'e2', source: 'search', target: 'verify', label: 'Claims Audit', animated: false },
  { id: 'e3', source: 'summarize', target: 'writer', label: 'Context Tokens', animated: false },
  { id: 'e4', source: 'verify', target: 'writer', label: 'Verified Proofs', animated: false },
];

const INITIAL_TELEMETRY: GuardrailTelemetry = {
  piiMaskedCount: 0,
  piiTypesDetected: [],
  hallucinationScore: 2.1,
  promptInjectionBlocked: true,
  safetyStatus: 'PASSED',
  latencyOverheadMs: 14,
  checksPassed: {
    toxicity: true,
    offTopic: true,
    secretLeakage: true,
    biasDetected: false,
  },
  lastCheckedTimestamp: '2026-07-24T12:00:00.000Z',
};

interface AetherState {
  // Model & Prompt
  selectedModel: ModelOption;
  setSelectedModel: (model: ModelOption) => void;
  prompt: string;
  setPrompt: (p: string) => void;

  // Stream & Execution
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  streamedMarkdown: string;
  activeCitation: Citation | null;
  citations: Citation[];
  setActiveCitation: (c: Citation | null) => void;

  // Graph State
  nodes: AgentNode[];
  edges: AgentEdge[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeStatus: (id: string, status: AgentNodeStatus, latencyMs?: number, tokensUsed?: number) => void;

  // Telemetry & Memory
  telemetry: GuardrailTelemetry;
  memoryItems: MemoryItem[];
  tokenMetrics: TokenMetrics;

  // UI Toggles
  isGuardrailOpen: boolean;
  isMemoryOpen: boolean;
  isGraphExpanded: boolean;
  toggleGuardrail: () => void;
  toggleMemory: () => void;
  toggleGraphExpanded: () => void;

  // Playback & Export Controls
  startExecution: () => void;
  pauseExecution: () => void;
  stepExecution: () => void;
  resetExecution: () => void;
  downloadMarkdown: () => void;
}

// Timer ref inside store module for execution control
let executionTimer: NodeJS.Timeout | null = null;
let stepIndex = 0;

const SAMPLE_STEPS = [
  {
    nodeId: 'search',
    status: 'running' as AgentNodeStatus,
    latency: 120,
    tokens: 45,
    memoryKey: 'query_raw_results',
    memoryValue: 'Fetched 14 papers on Topological Quantum Codes & Fault Tolerance (2025-2026).',
    memoryType: 'LTM' as const,
    text: '',
  },
  {
    nodeId: 'search',
    status: 'completed' as AgentNodeStatus,
    latency: 240,
    tokens: 180,
    memoryKey: 'search_sources',
    memoryValue: 'Indexed IEEE & ArXiv preprints on Surface Code Thresholds.',
    memoryType: 'STM' as const,
    citation: {
      id: 1,
      title: 'Fault-Tolerant Surface Code Thresholds under Anisotropic Noise',
      url: 'https://arxiv.org/abs/2501.09842',
      snippet: 'We prove that under asymmetric noise channels, the threshold for 2D surface codes exceeds 1.45% per gate cycle.',
      confidence: 0.98,
      agentNodeId: 'search',
      agentNodeName: 'Search Agent',
      publishedDate: '2025-10-14',
    },
    text: '### 1. Executive Summary & Literature Retrieval\n\nRecent empirical breakthroughs in **Fault-Tolerant Quantum Computing (FTQC)** demonstrate that surface codes achieves high error threshold under asymmetric Pauli noise [1].\n\n',
  },
  {
    nodeId: 'summarize',
    status: 'running' as AgentNodeStatus,
    latency: 85,
    tokens: 120,
    memoryKey: 'context_compression',
    memoryValue: 'Synthesizing Mathematical Formulations for Code Distance $d=7$.',
    memoryType: 'STM' as const,
    text: '#### Theoretical Formulation\n\nThe logical error probability $P_L$ scales exponentially with code distance $d$ according to:\n\n$$P_L \\approx A \\cdot \\left(\\frac{p}{p_{th}}\\right)^{\\frac{d+1}{2}}$$\n\nwhere $p_{th} \\approx 0.01$, and $A \\approx 0.03$ represents the operational fitting constant.\n\n',
  },
  {
    nodeId: 'verify',
    status: 'running' as AgentNodeStatus,
    latency: 42,
    tokens: 65,
    telemetryUpdate: {
      piiMaskedCount: 2,
      piiTypesDetected: ['AWS_KEY_MASKED', 'EMAIL_ANONYMIZED'],
      hallucinationScore: 0.8,
    },
    memoryKey: 'proof_verification',
    memoryValue: 'Validated Hamiltonian Ground State calculations; AWS Guardrail confirmed 0 PII leakages.',
    memoryType: 'LTM' as const,
    text: '#### AWS Guardrail Telemetry & Proof Audit\n\nAutomated assertion checks confirm that the stabilizer generator commutativity relation holds:\n\n$$\\left[ S_i, S_j \\right] = 0 \\quad \\forall i, j$$\n\n- **PII Scrubbing**: 2 transient tokens masked.\n- **Hallucination Metric**: $0.8\\%$ confidence variance (within safety bounds).\n\n',
  },
  {
    nodeId: 'summarize',
    status: 'completed' as AgentNodeStatus,
    latency: 190,
    tokens: 310,
    text: '',
  },
  {
    nodeId: 'verify',
    status: 'completed' as AgentNodeStatus,
    latency: 140,
    tokens: 210,
    text: '',
  },
  {
    nodeId: 'writer',
    status: 'running' as AgentNodeStatus,
    latency: 95,
    tokens: 450,
    citation: {
      id: 2,
      title: 'Scalable Micro-Architecture for 10,000 Logical Qubit Processors',
      url: 'https://nature.com/articles/s41586-025-9921',
      snippet: 'Demonstrating real-time decoding using FPGA tensor networks with sub-100ns feedback loop.',
      confidence: 0.95,
      agentNodeId: 'writer',
      agentNodeName: 'Writer Agent',
      publishedDate: '2026-02-01',
    },
    memoryKey: 'final_synthesis',
    memoryValue: 'Generated complete architectural report with sub-50ms render pipeline.',
    memoryType: 'STM' as const,
    text: '### 2. Micro-Architecture Implications\n\nIntegrating FPGA-based decoding loops enables sub-100ns syndrome extraction [2]. The total system latency breakdown is summarized below:\n\n1. **Syndrome Extraction**: $t_{syn} \\approx 25\\text{ ns}$\n2. **Graph Decoding (MWPM)**: $t_{dec} \\approx 65\\text{ ns}$\n3. **Pulse Correction**: $t_{corr} \\approx 10\\text{ ns}$\n\nAll safety guardrails remain **ACTIVE** and fully validated.',
  },
  {
    nodeId: 'writer',
    status: 'completed' as AgentNodeStatus,
    latency: 180,
    tokens: 640,
    text: '',
  },
];

export const useAetherStore = create<AetherState>((set, get) => ({
  selectedModel: 'claude-3-5-sonnet',
  setSelectedModel: (model) => set({ selectedModel: model }),
  prompt: 'Analyze Fault-Tolerant Surface Codes and compute threshold scaling for d=7 in sub-100ns regimes.',
  setPrompt: (prompt) => set({ prompt }),

  isRunning: false,
  isPaused: false,
  isCompleted: false,
  streamedMarkdown: '',
  activeCitation: null,
  citations: [],
  setActiveCitation: (activeCitation) => set({ activeCitation }),

  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  selectedNodeId: 'search',
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  updateNodeStatus: (id, status, latencyMs, tokensUsed) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== id) return node;
        return {
          ...node,
          data: {
            ...node.data,
            status,
            latencyMs: latencyMs !== undefined ? latencyMs : node.data.latencyMs,
            tokensUsed: tokensUsed !== undefined ? node.data.tokensUsed + tokensUsed : node.data.tokensUsed,
          },
        };
      }),
      edges: state.edges.map((edge) => {
        if (edge.source === id || edge.target === id) {
          return { ...edge, animated: status === 'running' };
        }
        return edge;
      }),
    }));
  },

  telemetry: INITIAL_TELEMETRY,
  memoryItems: [
    {
      id: 'mem-1',
      type: 'LTM',
      key: 'system_prompt',
      value: 'You are Aether Multi-Agent System. Enforce strict scientific rigor and math verification.',
      agentId: 'system',
      agentName: 'System Core',
      timestamp: '12:00:00',
      similarityScore: 0.99,
    },
  ],
  tokenMetrics: {
    promptTokens: 142,
    completionTokens: 0,
    totalTokens: 142,
    tokensPerSecond: 0,
    totalLatencyMs: 0,
  },

  isGuardrailOpen: true,
  isMemoryOpen: true,
  isGraphExpanded: false,

  toggleGuardrail: () => set((state) => ({ isGuardrailOpen: !state.isGuardrailOpen })),
  toggleMemory: () => set((state) => ({ isMemoryOpen: !state.isMemoryOpen })),
  toggleGraphExpanded: () => set((state) => ({ isGraphExpanded: !state.isGraphExpanded })),

  startExecution: () => {
    const { isRunning, isPaused } = get();
    if (isRunning && !isPaused) return;

    if (get().isCompleted || stepIndex >= SAMPLE_STEPS.length) {
      get().resetExecution();
    }

    set({ isRunning: true, isPaused: false });

    if (executionTimer) clearInterval(executionTimer);

    const runStep = () => {
      const { isPaused, isRunning } = get();
      if (isPaused || !isRunning) return;

      if (stepIndex >= SAMPLE_STEPS.length) {
        if (executionTimer) clearInterval(executionTimer);
        set({ isRunning: false, isCompleted: true });
        return;
      }

      const step = SAMPLE_STEPS[stepIndex];

      // Update Node
      get().updateNodeStatus(step.nodeId, step.status, step.latency, step.tokens);

      // Append Markdown
      if (step.text) {
        set((state) => ({
          streamedMarkdown: state.streamedMarkdown + step.text,
        }));
      }

      // Add Citation
      if (step.citation) {
        set((state) => {
          if (state.citations.some((c) => c.id === step.citation!.id)) return state;
          return { citations: [...state.citations, step.citation!] };
        });
      }

      // Telemetry update
      if (step.telemetryUpdate) {
        set((state) => ({
          telemetry: {
            ...state.telemetry,
            ...step.telemetryUpdate,
            lastCheckedTimestamp: new Date().toLocaleTimeString(),
          },
        }));
      }

      // Memory write
      if (step.memoryKey && step.memoryValue) {
        const nodeObj = get().nodes.find((n) => n.id === step.nodeId);
        const newMem: MemoryItem = {
          id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: step.memoryType,
          key: step.memoryKey,
          value: step.memoryValue,
          agentId: step.nodeId,
          agentName: nodeObj ? nodeObj.data.label : step.nodeId,
          timestamp: new Date().toLocaleTimeString(),
          similarityScore: step.memoryType === 'LTM' ? 0.94 : undefined,
        };
        set((state) => ({ memoryItems: [newMem, ...state.memoryItems] }));
      }

      // Token updates
      set((state) => {
        const added = step.tokens || 15;
        const comp = state.tokenMetrics.completionTokens + added;
        const total = state.tokenMetrics.promptTokens + comp;
        const lat = state.tokenMetrics.totalLatencyMs + (step.latency || 20);
        return {
          tokenMetrics: {
            ...state.tokenMetrics,
            completionTokens: comp,
            totalTokens: total,
            tokensPerSecond: Math.floor(Math.random() * 25) + 65,
            totalLatencyMs: lat,
          },
        };
      });

      stepIndex++;
    };

    runStep();
    executionTimer = setInterval(runStep, 950);
  },

  pauseExecution: () => {
    if (executionTimer) clearInterval(executionTimer);
    set({ isPaused: true });
  },

  stepExecution: () => {
    set({ isRunning: true, isPaused: true });
    if (stepIndex < SAMPLE_STEPS.length) {
      const step = SAMPLE_STEPS[stepIndex];
      get().updateNodeStatus(step.nodeId, step.status, step.latency, step.tokens);
      if (step.text) {
        set((state) => ({ streamedMarkdown: state.streamedMarkdown + step.text }));
      }
      if (step.citation) {
        set((state) => ({ citations: [...state.citations, step.citation!] }));
      }
      stepIndex++;
    }
  },

  resetExecution: () => {
    if (executionTimer) clearInterval(executionTimer);
    stepIndex = 0;
    set({
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      streamedMarkdown: '',
      activeCitation: null,
      citations: [],
      nodes: INITIAL_NODES,
      edges: INITIAL_EDGES,
      telemetry: INITIAL_TELEMETRY,
      memoryItems: [
        {
          id: 'mem-1',
          type: 'LTM',
          key: 'system_prompt',
          value: 'You are Aether Multi-Agent System. Enforce strict scientific rigor and math verification.',
          agentId: 'system',
          agentName: 'System Core',
          timestamp: '12:00:00',
          similarityScore: 0.99,
        },
      ],
      tokenMetrics: {
        promptTokens: 142,
        completionTokens: 0,
        totalTokens: 142,
        tokensPerSecond: 0,
        totalLatencyMs: 0,
      },
    });
  },

  downloadMarkdown: () => {
    const { streamedMarkdown } = get();
    if (!streamedMarkdown) return;
    const blob = new Blob([streamedMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aether_Research_Synthesis_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
}));
