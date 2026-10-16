import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Zap,
  Sparkles,
  Play,
  Square,
  RefreshCw,
  Send,
  X,
  ChevronDown,
  ShieldCheck,
  HardDrive,
  Code2,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Copy,
  Check,
  Trash2,
  Terminal,
} from 'lucide-react';
import {
  webLlmService,
  SUPPORTED_LOCAL_MODELS,
  DEFAULT_MODEL_ID,
  ModelLoadProgress,
  WebGpuStatus,
} from '../services/webLlmService';
import { SqlProblem } from '../types';

interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface LocalGemmaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentSqlCode: string;
  problem: SqlProblem;
  dialect: string;
  lastExecutionError?: string | null;
  triggerAction?: 'explain' | 'error_hint' | 'optimize' | null;
  onResetTrigger?: () => void;
}

export const LocalGemmaAssistant: React.FC<LocalGemmaAssistantProps> = ({
  isOpen,
  onClose,
  currentSqlCode,
  problem,
  dialect,
  lastExecutionError,
  triggerAction,
  onResetTrigger,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    return localStorage.getItem('apex_local_ai_model') || DEFAULT_MODEL_ID;
  });

  const [webGpuStatus, setWebGpuStatus] = useState<WebGpuStatus | null>(null);
  const [loadProgress, setLoadProgress] = useState<ModelLoadProgress>({
    progress: 0,
    text: '',
    stage: 'idle',
    modelId: selectedModelId,
  });

  const [isEngineReady, setIsEngineReady] = useState(webLlmService.isReady());
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('apex_local_gemma_chat');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `👋 **Welcome to Local Gemma AI!**\n\nI run **100% locally on your computer's GPU via WebGPU** using quantized open-source models.\n\n- 🛡️ **Zero Server Cost**: No remote APIs or API keys required.\n- 🔒 **100% Private**: Your SQL queries and datasets never leave your browser.\n- ⚡ **Offline Capable**: Once downloaded, weights stay cached locally in your browser storage.`,
        timestamp: Date.now(),
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check WebGPU availability on mount
  useEffect(() => {
    let isMounted = true;
    webLlmService.checkWebGpu().then((status) => {
      if (isMounted) setWebGpuStatus(status);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apex_local_gemma_chat', JSON.stringify(chatMessages.slice(-20)));
    } catch {
      // Ignore quota errors
    }
  }, [chatMessages]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen, loadProgress]);

  // Trigger automated actions if prompted from parent
  useEffect(() => {
    if (!isOpen || !triggerAction) return;

    if (triggerAction === 'explain') {
      handleExplainQuery();
    } else if (triggerAction === 'error_hint') {
      handleExplainError();
    } else if (triggerAction === 'optimize') {
      handleOptimizeQuery();
    }

    if (onResetTrigger) {
      onResetTrigger();
    }
  }, [isOpen, triggerAction]);

  // Handle Model Loading into GPU
  const handleLoadModel = async (modelIdToLoad?: string) => {
    const targetModel = modelIdToLoad || selectedModelId;
    try {
      await webLlmService.loadModel(targetModel, (progress) => {
        setLoadProgress(progress);
        if (progress.stage === 'ready') {
          setIsEngineReady(true);
        }
      });
    } catch (err: any) {
      console.error('WebLLM load error:', err);
    }
  };

  // Ensure engine is loaded before inference
  const ensureReady = async (): Promise<boolean> => {
    if (webLlmService.isReady()) {
      setIsEngineReady(true);
      return true;
    }
    try {
      await handleLoadModel();
      return true;
    } catch {
      return false;
    }
  };

  // Send Custom User Message
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isGenerating) return;

    setInputPrompt('');

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const assistantMsgId = `msg_a_${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsGenerating(true);

    const ready = await ensureReady();
    if (!ready) {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: '⚠️ Could not load the local Gemma model. Please ensure WebGPU is enabled on your browser.' }
            : m
        )
      );
      setIsGenerating(false);
      return;
    }

    const conversationContext = [
      {
        role: 'system' as const,
        content: `You are an expert SQL Mentor running locally on the user's browser GPU via WebGPU Gemma.
Current Problem: "${problem.title}"
SQL Dialect: ${dialect}
Provide concise, accurate, and structured answers in markdown. Keep queries clear and standard-compliant.`,
      },
      ...chatMessages.slice(-6).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: textToSend },
    ];

    let fullOutput = '';

    await webLlmService.streamChat(
      conversationContext,
      (delta) => {
        fullOutput += delta;
        setChatMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: fullOutput } : m))
        );
      },
      (finalText) => {
        setIsGenerating(false);
        setChatMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: finalText } : m))
        );
      },
      (err) => {
        setIsGenerating(false);
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `⚠️ Error during local WebGPU inference: ${err?.message || 'Unknown error'}` }
              : m
          )
        );
      }
    );
  };

  // Quick Action: Explain My Query
  const handleExplainQuery = async () => {
    if (!currentSqlCode.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: `Explain my current SQL query for "${problem.title}".`,
      timestamp: Date.now(),
    };

    const assistantMsgId = `msg_a_${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: 'Analyzing your query with local WebGPU Gemma...',
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsGenerating(true);

    const ready = await ensureReady();
    if (!ready) {
      setIsGenerating(false);
      return;
    }

    let fullOutput = '';
    await webLlmService.explainQuery(
      currentSqlCode,
      problem.title,
      dialect,
      (delta) => {
        fullOutput += delta;
        setChatMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: fullOutput } : m))
        );
      },
      (finalText) => {
        setIsGenerating(false);
        setChatMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: finalText } : m))
        );
      },
      (err) => {
        setIsGenerating(false);
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `⚠️ Explanation error: ${err?.message || 'Unknown error'}` }
              : m
          )
        );
      }
    );
  };

  // Quick Action: Explain Error Without Spoilers
  const handleExplainError = async () => {
    if (isGenerating) return;

    const errorContext =
      lastExecutionError || 'The query returned output mismatch or rows did not match expected specification.';

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: `Explain why my query failed and give me 2 Socratic hints (no spoilers please).`,
      timestamp: Date.now(),
    };

    const assistantMsgId = `msg_a_${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: 'Diagnosing execution failure locally with Gemma...',
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsGenerating(true);

    const ready = await ensureReady();
    if (!ready) {
      setIsGenerating(false);
      return;
    }

    let fullOutput = '';
    await webLlmService.explainErrorWithoutSpoiling(
      currentSqlCode,
      problem.title,
      problem.businessScenario || problem.requirements?.join('. ') || '',
      errorContext,
      dialect,
      (delta) => {
        fullOutput += delta;
        setChatMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: fullOutput } : m))
        );
      },
      (finalText) => {
        setIsGenerating(false);
        setChatMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: finalText } : m))
        );
      },
      (err) => {
        setIsGenerating(false);
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `⚠️ Diagnostic error: ${err?.message || 'Unknown error'}` }
              : m
          )
        );
      }
    );
  };

  // Quick Action: Optimize Query & Indexes
  const handleOptimizeQuery = async () => {
    if (!currentSqlCode.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: `Analyze this query for performance, SARGability, and index recommendations.`,
      timestamp: Date.now(),
    };

    const assistantMsgId = `msg_a_${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: 'Evaluating query execution plan with local Gemma...',
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsGenerating(true);

    const ready = await ensureReady();
    if (!ready) {
      setIsGenerating(false);
      return;
    }

    let fullOutput = '';
    await webLlmService.suggestOptimization(
      currentSqlCode,
      dialect,
      (delta) => {
        fullOutput += delta;
        setChatMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: fullOutput } : m))
        );
      },
      (finalText) => {
        setIsGenerating(false);
        setChatMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: finalText } : m))
        );
      },
      (err) => {
        setIsGenerating(false);
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `⚠️ Optimization error: ${err?.message || 'Unknown error'}` }
              : m
          )
        );
      }
    );
  };

  // Copy code snippet / response
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-[#0c1322] border-l border-slate-800/90 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-800/80 bg-[#090d16]/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0b1120] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-wide">Local Gemma AI</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-emerald-400" /> WebGPU
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>0 Server Cost</span>
              <span>•</span>
              <span className="text-cyan-400 font-medium">100% On-Device</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatMessages([])}
            title="Clear Chat History"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hardware & Model Selector Banner */}
      <div className="px-4 py-2.5 bg-[#0e1628] border-b border-slate-800/60 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium text-slate-400">Device GPU:</span>
            <span className="text-slate-200 truncate max-w-[220px]" title={webGpuStatus?.adapterName}>
              {webGpuStatus?.supported ? webGpuStatus.adapterName || 'WebGPU Enabled' : 'Not Supported'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            {isEngineReady ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                GPU Loaded
              </span>
            ) : loadProgress.stage === 'downloading' || loadProgress.stage === 'compiling' ? (
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Loading {loadProgress.progress}%
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">Not in VRAM</span>
            )}
          </div>
        </div>

        {/* Model dropdown & Load Button */}
        <div className="flex items-center gap-2">
          <select
            value={selectedModelId}
            disabled={isGenerating || loadProgress.stage === 'downloading' || loadProgress.stage === 'compiling'}
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedModelId(newId);
              localStorage.setItem('apex_local_ai_model', newId);
              setIsEngineReady(false);
            }}
            className="flex-1 bg-[#131d33] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium cursor-pointer"
          >
            {SUPPORTED_LOCAL_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.vram}) {m.recommended ? '★ Recommended' : ''}
              </option>
            ))}
          </select>

          {!isEngineReady && (
            <button
              onClick={() => handleLoadModel()}
              disabled={loadProgress.stage === 'downloading' || loadProgress.stage === 'compiling'}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              {loadProgress.stage === 'downloading' || loadProgress.stage === 'compiling' ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Loading</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Load into GPU</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Loading Progress Bar */}
        {(loadProgress.stage === 'downloading' || loadProgress.stage === 'compiling') && (
          <div className="mt-1 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate pr-2">{loadProgress.text}</span>
              <span className="font-mono text-cyan-400 font-bold">{loadProgress.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${loadProgress.progress}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 italic">
              Weights are downloaded once and cached locally in browser storage for instant offline boots.
            </span>
          </div>
        )}
      </div>

      {/* Quick Action Badges */}
      <div className="px-4 py-2 bg-[#090e1c] border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={handleExplainQuery}
          disabled={isGenerating || !currentSqlCode.trim()}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 hover:text-cyan-400 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-40"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Explain My Query</span>
        </button>

        <button
          onClick={handleExplainError}
          disabled={isGenerating}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 hover:text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-40"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Hint Without Spoilers</span>
        </button>

        <button
          onClick={handleOptimizeQuery}
          disabled={isGenerating || !currentSqlCode.trim()}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 hover:text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-40"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Optimize Query</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                {isUser ? (
                  <span>You</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span className="font-semibold text-slate-300">Local Gemma</span>
                    <span className="text-[10px] text-cyan-400 font-mono">WebGPU</span>
                  </>
                )}
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div
                className={`group relative max-w-[92%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                    : 'bg-[#121a2c] text-slate-200 border border-slate-800/90 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans space-y-1">
                  {msg.content}
                </div>

                {!isUser && msg.content && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.content)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white bg-[#0e1524] rounded border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-950/20 border border-cyan-800/30 px-3 py-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Gemma is generating streaming answer on local GPU...</span>
            <button
              onClick={() => webLlmService.cancelGeneration()}
              className="ml-auto text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-medium flex items-center gap-1"
            >
              <Square className="w-3 h-3" /> Stop
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#0a0f1d] border-t border-slate-800/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isEngineReady
                ? `Ask Local Gemma about ${problem.title} or SQL... (Enter to send)`
                : `Click "Load into GPU" or ask a question to initialize WebGPU...`
            }
            className="flex-1 bg-[#12192a] border border-slate-700/80 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
          />

          <button
            type="submit"
            disabled={isGenerating || !inputPrompt.trim()}
            className="h-10 px-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl font-medium text-xs flex items-center justify-center transition-all shadow-md shrink-0"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            100% Client-Side Private • No server requests
          </span>
          <span className="font-mono">WebGPU • Gemma 2B Q4</span>
        </div>
      </div>
    </div>
  );
};
