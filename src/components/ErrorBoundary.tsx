import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ApexSQL ErrorBoundary] Caught render exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleResetCache = () => {
    try {
      // Selectively clear transient/corrupt state rather than wiping user profile & notes
      const transientKeys = [
        'apex_last_execution_result',
        'apex_last_execution_problem_id',
        'apex_current_sql',
        'apex_console_tab',
      ];
      transientKeys.forEach((key) => {
        try { localStorage.removeItem(key); } catch {}
        try { sessionStorage.removeItem(key); } catch {}
      });
      if (this.props.onReset) {
        this.props.onReset();
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] w-full flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-900/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mx-auto mb-3 text-rose-400 text-xl font-bold">
              !
            </div>
            <h1 className="text-base font-bold text-slate-100 mb-1.5">
              {this.props.fallbackTitle || 'Workspace Render Issue'}
            </h1>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              A temporary render error occurred. You can retry immediately or clear the workspace query cache.
            </p>
            {this.state.error && (
              <p className="text-[11px] font-mono text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-lg p-2 mb-4 text-left break-words">
                {this.state.error.message}
              </p>
            )}
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={this.handleResetCache}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs font-semibold rounded-xl border border-white/10 transition-all cursor-pointer"
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
