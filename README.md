# Aether AI — Enterprise Multi-Agent Research Platform

**Aether AI** is an enterprise-grade control center and orchestration engine for complex, autonomous research workflows. Built to support research analysts, AI engineers, and compliance officers, Aether AI provides real-time observability, deep state inspection, and robust safety telemetry across multi-agent execution graphs.

---

## Key Features

* **Real-Time Graph Observability:** Stream live agent execution states, node transitions, and decision loops via Server-Sent Events (SSE).
* **Dual-Layer Memory Inspection:** Inspect Short-Term Memory (STM / working context) and Long-Term Memory (LTM / vector, episodic, and semantic stores) in real time.
* **Enterprise Guardrail Telemetry:** Monitor input/output validation, safety checks, structural schema enforcement, and policy compliance on every agent boundary.
* **Model Evaluation & Benchmarking:** Track latency, token consumption, model variance, and accuracy across individual agent execution steps.
* **Role-Tailored Interfaces:** Distinct dashboard views optimized for **Research Analysts** (task spawning & reports), **AI Engineers** (graph debugging & memory traces), and **Compliance Officers** (audit trails & safety metrics).

---

## System Architecture

```
                       +-------------------------------+
                       |   Aether AI Frontend UI       |
                       |  (Control Center & SSE Hub)   |
                       +---------------+---------------+
                                       |
                       +---------------+---------------+
                       |  API Gateway & SSE Streamer   |
                       +---------------+---------------+
                                       |
         +-----------------------------+-----------------------------+
         |                             |                             |
+--------v-------+            +--------v-------+            +--------v-------+
|  Agent Graph   |            | Memory Engine  |            |  Guardrails &  |
|  Orchestrator  |            |  (STM / LTM)   |            |   Telemetry    |
+----------------+            +----------------+            +----------------+

```

---

## Core Workflows

### 1. Research Task Lifecycle

1. **Task Spawning:** Define research scope, target domains, tool constraints, and policy bounds.
2. **Graph Execution:** The orchestrator dispatches work across specialized nodes (e.g., *Query Expansion*, *Literature Synthesis*, *Verification*, *Formatting*).
3. **Live Streaming:** SSE pushes live execution frames to the control center without continuous polling.
4. **Human-in-the-Loop (HITL):** Pause execution graph nodes for explicit approval or context adjustments.

### 2. Memory & Guardrail Tracing

* **STM:** Tracks active tool outputs, scratchpads, and active conversation contexts.
* **LTM:** Surfaces vector similarity scores, retrieval provenance, and historical knowledge graphs.
* **Guardrails:** Flags real-time violations (e.g., hallucination bounds, toxicity, schema mismatch, unauthorized data egress).

---

## Getting Started

### Prerequisites

* **Node.js:** `v18.0.0` or higher
* **Package Manager:** `pnpm` (recommended), `npm`, or `yarn`
* **Aether AI Backend Service:** Running instance (for SSE endpoints and graph orchestration)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/aether-ai.git
cd aether-ai

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

```

### Environment Configuration

Configure your `.env.local` file with the relevant API endpoints and streaming tokens:

```env
NEXT_PUBLIC_AETHER_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SSE_STREAM_URL=http://localhost:8000/api/v1/stream
NEXT_PUBLIC_ENABLE_COMPLIANCE_MODE=true

```

### Development Server

```bash
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the control center.

---

## Deployment & Verification

```bash
# Type check and build for production
pnpm build

# Start production build locally
pnpm start

```

---

## Safety & Compliance

> **Important:** All agent memory states and tool calls are audited against configured policy guardrails before execution. Audit logs are persisted with cryptographic hashes to ensure non-repudiation for enterprise governance.
