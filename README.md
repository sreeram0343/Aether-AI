# Aether AI - Enterprise Multi-Agent Research Platform

Aether AI is an enterprise-grade Multi-Agent AI Orchestration Console built with **Next.js 14 (App Router)**, **TypeScript**, **Zustand**, **Tailwind CSS (Dark OLED Palette)**, **`@xyflow/react` (React Flow)**, and **KaTeX Math**.

---

## 🏗️ Architecture & Component Hierarchy

```
app/
├── layout.tsx                  # Root Next.js layout (Fonts, Meta, Dark OLED styles)
├── page.tsx                    # Main 3-column Dashboard layout
└── globals.css                 # Tailwind CSS & KaTeX math stylesheet imports
components/
├── primitives/                 # Standardized Production UI Primitives
│   ├── Card.tsx                # Modular Card suite (Header, Title, Content, Footer)
│   ├── Badge.tsx               # Status & pill badge primitive
│   ├── StatusDot.tsx           # Status indicator dot with pulse animation
│   ├── MetricTile.tsx          # Standardized metric container with progress meters
│   └── MemoryEntry.tsx         # Componentized memory drawer entry card
├── Header.tsx                  # Top navigation bar (Model selector, TPS, controls)
├── AgentGraphCanvas.tsx        # React Flow DAG visualizer for LangGraph agents
├── CustomGraphNode.tsx         # Node component with latency timers & status dots
├── StreamingExecutionBoard.tsx # Sub-50ms Markdown + KaTeX canvas with ARIA live region
├── CitationModal.tsx           # Interactive citation detail popover
├── GuardrailTelemetry.tsx      # AWS Bedrock safety telemetry panel
└── MemoryInspector.tsx         # Dual-tab (STM/LTM) working memory drawer
lib/
└── sseClient.ts                # EventSource / SSE streaming client engine
store/
└── useAetherStore.ts           # Zustand global state manager
```

---

## ⚡ Centralized Pipeline State Machine

Aether AI drives all UI panels (Header controls, DAG canvas badges, streaming canvas throughput meters, memory counts) from a single shared state machine (`PipelineState` in `store/useAetherStore.ts`):

```
         [ Dispatch Query ]
   idle --------------------> dispatching
    ^                             |
    | (Reset)                     v (150ms tick)
    |                         streaming 🚀
    |                           |     ^
    |                    (Pause)|     |(Resume)
    |                           v     |
    +------------------------ paused ⏸️
    |                             
 complete <-----------------------+
 (Stream Finished)
```

### State Definitions:
- `idle`: Initial state. Canvas shows awaiting prompt state; Header displays "Run Pipeline".
- `dispatching`: Short initializing tick preparing multi-agent context; DAG badge displays `DISPATCHING...`.
- `streaming`: Incremental token streaming active. Blinking cursor visible, throughput velocity counter live, DAG nodes active.
- `paused`: Execution suspended. Primary button displays "Resume", Step button enabled.
- `complete`: Synthesis finished. Header displays "Run Pipeline", Markdown canvas displays `STREAM COMPLETE` with Export action.

---

## 📡 SSE Stream Engine & Backend API Contract

Streaming events are managed via `lib/sseClient.ts`. The interface supports both live Server-Sent Events (SSE) from FastAPI/LangGraph and high-fidelity local simulation.

### Swapping to a Live Backend
Set the environment variable in `.env.local`:
```env
NEXT_PUBLIC_AETHER_API_URL=https://api.aether.ai/v1/stream
```

### Server-Sent Event (SSE) Payload Schema
The backend emits Server-Sent Events (`text/event-stream`) in JSON format:

```json
{
  "type": "node_chunk",
  "nodeId": "writer",
  "content": "Logical error probability $P_L \\approx A \\cdot (p / p_{th})^{\\frac{d+1}{2}}$",
  "tokensAdded": 18,
  "latencyMs": 42,
  "timestamp": 1771960000
}
```

#### Event Types:
- `pipeline_start`: Triggered when query pipeline begins execution.
- `node_start`: Signals agent node status update to `running`.
- `node_chunk`: Streaming markdown text fragment with LaTeX or inline citations `[1]`.
- `guardrail_check`: Emits telemetry updates (PII masking count, hallucination score).
- `memory_write`: Writes key-value entries into Short-Term (STM) or Long-Term (LTM) memory.
- `node_end`: Signals agent node status update to `completed`.

---

## ♿ Accessibility (a11y) Features

- **ARIA Live Regions**: `StreamingExecutionBoard.tsx` contains `aria-live="polite"` to ensure screen readers announce incoming research text without disrupting navigation.
- **Focus Rings & Keyboard Navigation**: All buttons, model dropdowns, graph controls, and preset chips include explicit `focus-visible:ring-2 focus-visible:ring-cyan-400` styling.
- **High-Contrast OLED Theme**: Strict contrast ratios adhering to WCAG AA dark mode guidelines using Slate 950/Zinc dark palettes.

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
