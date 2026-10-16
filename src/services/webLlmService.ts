import { CreateMLCEngine, MLCEngine, InitProgressReport, ChatCompletionMessageParam } from '@mlc-ai/web-llm';

export interface LocalModelOption {
  id: string;
  name: string;
  family: 'Gemma' | 'Llama' | 'Qwen';
  tag: string;
  vram: string;
  description: string;
  recommended?: boolean;
}

export const SUPPORTED_LOCAL_MODELS: LocalModelOption[] = [
  {
    id: 'gemma-2-2b-it-q4f16_1-MLC',
    name: 'Google Gemma 2 (2B-IT 4-bit)',
    family: 'Gemma',
    tag: 'Gemma 2B',
    vram: '~1.4 GB VRAM',
    description: 'Official Google Gemma 2 2B Instruct quantized to 4-bit. High-speed SQL reasoning, 100% on-device WebGPU.',
    recommended: true,
  },
  {
    id: 'gemma-2-2b-it-q4f32_1-MLC',
    name: 'Google Gemma 2 (2B-IT fp32)',
    family: 'Gemma',
    tag: 'Gemma fp32',
    vram: '~1.8 GB VRAM',
    description: 'Full 32-bit float model for graphics cards without fp16 WebGPU support.',
  },
  {
    id: 'gemma-2b-it-q4f16_1-MLC',
    name: 'Google Gemma (2B Classic)',
    family: 'Gemma',
    tag: 'Gemma 1.0',
    vram: '~1.4 GB VRAM',
    description: 'First generation Google Gemma 2B instruction tuned model.',
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Meta Llama 3.2 (1B Instruct)',
    family: 'Llama',
    tag: 'Llama 1B',
    vram: '~0.9 GB VRAM',
    description: 'Ultra-lightweight Meta 1B model. Ideal for integrated GPUs and low-memory laptops.',
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 (1.5B Instruct)',
    family: 'Qwen',
    tag: 'Qwen 1.5B',
    vram: '~1.1 GB VRAM',
    description: 'High coding and SQL benchmark performance with low memory footprint.',
  },
];

export const DEFAULT_MODEL_ID = 'gemma-2-2b-it-q4f16_1-MLC';

export interface WebGpuStatus {
  supported: boolean;
  adapterName?: string;
  vendor?: string;
  error?: string;
}

export interface ModelLoadProgress {
  progress: number; // 0 to 100
  text: string;
  stage: 'idle' | 'downloading' | 'compiling' | 'ready' | 'error';
  modelId: string;
}

class WebLlmService {
  private engine: MLCEngine | null = null;
  private currentModelId: string | null = null;
  private isLoading = false;
  private abortController: AbortController | null = null;

  /**
   * Check if the user's browser & GPU hardware support WebGPU
   */
  async checkWebGpu(): Promise<WebGpuStatus> {
    if (typeof window === 'undefined') {
      return { supported: false, error: 'SSR environment' };
    }

    if (!('gpu' in navigator)) {
      return {
        supported: false,
        error: 'WebGPU is not available in your browser. Please use Chrome 113+, Microsoft Edge 113+, or enable WebGPU in flags.',
      };
    }

    try {
      const gpuNav = (navigator as any).gpu;
      const adapter = await gpuNav.requestAdapter({ powerPreference: 'high-performance' });

      if (!adapter) {
        return {
          supported: false,
          error: 'No compatible WebGPU hardware adapter found. Please ensure GPU drivers and hardware acceleration are enabled.',
        };
      }

      let adapterName = 'WebGPU Graphics Device';
      let vendor = '';

      if (adapter.info) {
        adapterName = adapter.info.description || adapter.info.device || adapter.info.architecture || adapterName;
        vendor = adapter.info.vendor || '';
      }

      return {
        supported: true,
        adapterName,
        vendor,
      };
    } catch (err: any) {
      return {
        supported: false,
        error: err?.message || 'Error checking WebGPU support',
      };
    }
  }

  /**
   * Load or switch model into WebGPU VRAM with progress updates
   */
  async loadModel(
    modelId: string = DEFAULT_MODEL_ID,
    onProgress?: (progress: ModelLoadProgress) => void
  ): Promise<MLCEngine> {
    if (this.engine && this.currentModelId === modelId) {
      onProgress?.({
        progress: 100,
        text: 'Model ready in WebGPU VRAM (Cached)',
        stage: 'ready',
        modelId,
      });
      return this.engine;
    }

    if (this.isLoading) {
      throw new Error('A model is currently loading into WebGPU memory. Please wait.');
    }

    this.isLoading = true;

    try {
      onProgress?.({
        progress: 5,
        text: `Initializing WebGPU engine for ${modelId}...`,
        stage: 'downloading',
        modelId,
      });

      const engine = await CreateMLCEngine(modelId, {
        initProgressCallback: (report: InitProgressReport) => {
          const rawPct = Math.min(100, Math.max(0, Math.round(report.progress * 100)));
          const stage: ModelLoadProgress['stage'] =
            rawPct >= 100
              ? 'ready'
              : report.text.toLowerCase().includes('compil')
              ? 'compiling'
              : 'downloading';

          onProgress?.({
            progress: rawPct,
            text: report.text,
            stage,
            modelId,
          });
        },
      });

      this.engine = engine;
      this.currentModelId = modelId;
      this.isLoading = false;

      onProgress?.({
        progress: 100,
        text: 'Model weights loaded & cached locally. WebGPU engine ready!',
        stage: 'ready',
        modelId,
      });

      return engine;
    } catch (err: any) {
      this.isLoading = false;
      onProgress?.({
        progress: 0,
        text: err?.message || 'Failed to load model into WebGPU',
        stage: 'error',
        modelId,
      });
      throw err;
    }
  }

  /**
   * Check if engine is initialized and ready
   */
  isReady(): boolean {
    return this.engine !== null && !this.isLoading;
  }

  /**
   * Get active model ID
   */
  getCurrentModelId(): string | null {
    return this.currentModelId;
  }

  /**
   * Cancel ongoing generation
   */
  cancelGeneration() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.engine) {
      this.engine.interruptGenerate();
    }
  }

  /**
   * Stream a chat completion from the local WebGPU model
   */
  async streamChat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    onDelta: (textChunk: string) => void,
    onComplete: (fullText: string) => void,
    onError: (err: any) => void
  ) {
    if (!this.engine) {
      onError(new Error('Local WebLLM engine is not initialized. Please load a Gemma model first.'));
      return;
    }

    this.abortController = new AbortController();
    let accumulated = '';

    try {
      const completion = await this.engine.chat.completions.create({
        messages: messages as ChatCompletionMessageParam[],
        stream: true,
        temperature: 0.2,
        top_p: 0.95,
      });

      for await (const chunk of completion) {
        if (this.abortController?.signal.aborted) {
          break;
        }
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          accumulated += delta;
          onDelta(delta);
        }
      }

      onComplete(accumulated);
    } catch (err: any) {
      if (this.abortController?.signal.aborted) {
        onComplete(accumulated);
        return;
      }
      onError(err);
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Generate an explanation of candidate's SQL query
   */
  async explainQuery(
    sqlQuery: string,
    problemTitle: string,
    dialect: string,
    onDelta: (chunk: string) => void,
    onComplete: (full: string) => void,
    onError: (err: any) => void
  ) {
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      {
        role: 'system',
        content: `You are an expert SQL Instructor running locally on the user's hardware via WebGPU Gemma.
Your job is to explain the user's SQL query clearly, concisely, and step-by-step.
- Point out clauses (SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, WINDOW, ORDER BY).
- Highlight table relationships, partition frames, or aggregation granularity.
- Explain the estimated execution flow.
- Format responses cleanly in markdown with short bullet points.`,
      },
      {
        role: 'user',
        content: `Explain this ${dialect} query for the problem "${problemTitle}":\n\n\`\`\`sql\n${sqlQuery}\n\`\`\``,
      },
    ];

    return this.streamChat(messages, onDelta, onComplete, onError);
  }

  /**
   * Generate Socratic hints & error explanation without spoiling the entire answer
   */
  async explainErrorWithoutSpoiling(
    sqlQuery: string,
    problemTitle: string,
    problemDescription: string,
    errorMessage: string,
    dialect: string,
    onDelta: (chunk: string) => void,
    onComplete: (full: string) => void,
    onError: (err: any) => void
  ) {
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      {
        role: 'system',
        content: `You are a Socratic SQL Interviewer and Coach running locally via WebGPU Gemma.
The candidate got a failure/mismatch on their query.
CRITICAL RULES:
1. NEVER write out the complete correct SQL solution.
2. Provide gentle, progressive hints (Tier 1: High level intuition, Tier 2: Specific clause or logic check).
3. Diagnose WHY the error occurred (e.g., using WHERE on aggregated alias instead of HAVING, missing JOIN condition causing cartesian product, wrong window function framing, off-by-one boundary, or NULL handling).
4. Keep the tone encouraging, concise, and structured.`,
      },
      {
        role: 'user',
        content: `Problem: "${problemTitle}"\nContext: ${problemDescription.slice(0, 400)}...\n\nCandidate's Query (${dialect}):\n\`\`\`sql\n${sqlQuery}\n\`\`\`\n\nExecution Failure / Diff:\n${errorMessage}\n\nPlease explain what went wrong and provide 2 Socratic hints without spoiling the full query.`,
      },
    ];

    return this.streamChat(messages, onDelta, onComplete, onError);
  }

  /**
   * Suggest performance optimizations, SARGable rewrites, and indexes
   */
  async suggestOptimization(
    sqlQuery: string,
    dialect: string,
    onDelta: (chunk: string) => void,
    onComplete: (full: string) => void,
    onError: (err: any) => void
  ) {
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      {
        role: 'system',
        content: `You are a Principal Database Administrator and SQL Performance Tuning Specialist running locally on WebGPU Gemma.
Analyze the provided SQL query for performance bottlenecks.
- Check SARGability (predicates on indexed columns, avoiding functions on columns in WHERE).
- Suggest index creation statements (B-Tree, Composite, Clustered/Partition key).
- Suggest CTE materialization, subquery pushdown, or window function rewrites if applicable.
- Provide a brief, actionable optimization summary.`,
      },
      {
        role: 'user',
        content: `Analyze and optimize this ${dialect} query:\n\n\`\`\`sql\n${sqlQuery}\n\`\`\``,
      },
    ];

    return this.streamChat(messages, onDelta, onComplete, onError);
  }
}

export const webLlmService = new WebLlmService();
