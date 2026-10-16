/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import alasql from 'alasql';

// ============================================================================
// SQL KEYWORDS & FUNCTIONS DICTIONARIES
// ============================================================================
export const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE', 'ILIKE', 'BETWEEN', 'EXISTS',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'NATURAL', 'ON', 'USING',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'TOP',
  'UNION', 'ALL', 'INTERSECT', 'EXCEPT', 'MINUS',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'VIEW', 'INDEX', 'DROP', 'ALTER',
  'WITH', 'RECURSIVE', 'AS', 'DISTINCT',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'OVER', 'PARTITION', 'WINDOW', 'ROWS', 'RANGE', 'PRECEDING', 'FOLLOWING', 'UNBOUNDED', 'CURRENT', 'ROW',
  'CAST', 'CONVERT', 'TRUE', 'FALSE',
  'FOR', 'FETCH', 'NEXT', 'ONLY', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CHECK', 'DEFAULT', 'CONSTRAINT',
  'SHOW', 'DESCRIBE', 'EXPLAIN', 'PRAGMA', 'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION'
]);

export const SQL_FUNCTIONS = new Set([
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'COALESCE', 'NULLIF', 'IFNULL', 'NVL', 'ROUND', 'FLOOR', 'CEIL', 'CEILING', 'ABS', 'MOD', 'POWER', 'SQRT',
  'CONCAT', 'CONCAT_WS', 'SUBSTRING', 'SUBSTR', 'LENGTH', 'LEN', 'LOWER', 'UPPER', 'TRIM', 'LTRIM', 'RTRIM', 'REPLACE', 'INSTR', 'POSITION',
  'DATE', 'TIME', 'TIMESTAMP', 'NOW', 'CURRENT_DATE', 'CURRENT_TIMESTAMP', 'CURRENT_TIME',
  'DATE_ADD', 'DATE_SUB', 'DATEDIFF', 'DATE_TRUNC', 'EXTRACT', 'YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND',
  'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'NTILE', 'LEAD', 'LAG', 'FIRST_VALUE', 'LAST_VALUE', 'PERCENT_RANK', 'CUME_DIST',
  'GROUP_CONCAT', 'STRING_AGG', 'ARRAY_AGG', 'JSON_EXTRACT'
]);

export interface SyntaxDiagnostic {
  isValid: boolean;
  message?: string;
  line?: number;
  column?: number;
}

// Tokenize SQL query into colored tokens for the overlay
export interface SqlToken {
  type: 'keyword' | 'function' | 'string' | 'number' | 'comment' | 'operator' | 'punctuation' | 'identifier' | 'whitespace';
  text: string;
}

export function tokenizeSql(sql: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  const regex = /(--[^\n]*|\/\*[\s\S]*?\*\/|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`|\[[^\]]*\]|\b\d+(?:\.\d+)?\b|[a-zA-Z_][a-zA-Z0-9_]*|!=|<=|>=|<>|\|\||[+*\-\/%<>=,;().]|\s+|[^\s\w])/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(sql)) !== null) {
    const text = match[0];

    if (/^--|^\/\*/.test(text)) {
      tokens.push({ type: 'comment', text });
    } else if (/^['"]/.test(text)) {
      tokens.push({ type: 'string', text });
    } else if (/^\d/.test(text)) {
      tokens.push({ type: 'number', text });
    } else if (/^\s+$/.test(text)) {
      tokens.push({ type: 'whitespace', text });
    } else if (/^[`\[]/.test(text)) {
      tokens.push({ type: 'identifier', text });
    } else if (/^[+*\-\/%<>=!|]/.test(text)) {
      tokens.push({ type: 'operator', text });
    } else if (/^[(),;.]/.test(text)) {
      tokens.push({ type: 'punctuation', text });
    } else {
      const upper = text.toUpperCase();
      if (SQL_KEYWORDS.has(upper)) {
        tokens.push({ type: 'keyword', text });
      } else if (SQL_FUNCTIONS.has(upper)) {
        tokens.push({ type: 'function', text });
      } else {
        tokens.push({ type: 'identifier', text });
      }
    }
  }

  return tokens;
}

// Real-time syntax validation
export function checkSqlSyntax(code: string): SyntaxDiagnostic {
  const trimmed = code.trim();
  if (!trimmed) {
    return { isValid: true };
  }

  // 1. Check unbalanced parentheses
  let openParens = 0;
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if (char === '(') openParens++;
    else if (char === ')') {
      openParens--;
      if (openParens < 0) {
        return {
          isValid: false,
          message: 'Syntax error: Unexpected closing parenthesis ")"',
        };
      }
    }
  }
  if (openParens > 0) {
    return {
      isValid: false,
      message: `Syntax error: ${openParens} unclosed parenthesis "(" detected`,
    };
  }

  // 2. Check unclosed quotes
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const prev = i > 0 ? code[i - 1] : '';
    if (char === "'" && prev !== '\\' && !inDouble) inSingle = !inSingle;
    else if (char === '"' && prev !== '\\' && !inSingle) inDouble = !inDouble;
  }
  if (inSingle) {
    return { isValid: false, message: "Syntax error: Unclosed string literal (missing closing ')" };
  }
  if (inDouble) {
    return { isValid: false, message: 'Syntax error: Unclosed identifier/string (missing closing ")' };
  }

  // 3. Check incomplete clauses at tail (e.g. `SELECT * FOR`, `SELECT * FROM`, `WHERE`, `ORDER BY`)
  const cleanTail = code.replace(/--[^\n]*/g, '').replace(/;?\s*$/, '').trim();
  const trailingKeywordMatch = cleanTail.match(/\b(SELECT|FROM|WHERE|JOIN|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|FOR|SET|INTO|VALUES|AND|OR)\s*$/i);
  if (trailingKeywordMatch) {
    const kw = trailingKeywordMatch[1].toUpperCase();
    return {
      isValid: false,
      message: `Incomplete SQL clause: near "${kw}" (expression or table identifier expected)`,
    };
  }

  // 4. AlaSQL parser validation
  try {
    const sanitized = cleanTail.replace(/`([^`]+)`/g, '[$1]');
    (alasql as any).parse(sanitized);
  } catch (err: any) {
    const errMsg = err?.message || 'SQL parse error';
    // Format error message to be concise and readable
    const matchLine = errMsg.match(/line\s+(\d+)/i);
    const lineNum = matchLine ? parseInt(matchLine[1], 10) : undefined;
    return {
      isValid: false,
      message: errMsg.replace(/Parse error on line \d+:\s*/, 'Parse error: '),
      line: lineNum,
    };
  }

  return { isValid: true, message: 'Valid SQL Syntax' };
}

interface SqlCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  placeholder?: string;
  height?: string;
  dialect?: string;
}

// Shared pixel-perfect font metrics between transparent textarea and highlighted pre/code layer
const EDITOR_FONT_STYLE: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', Consolas, ui-monospace, monospace",
  fontSize: '13px',
  lineHeight: '24px',
  letterSpacing: '0px',
  wordSpacing: '0px',
  tabSize: 2,
  fontVariantLigatures: 'none',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  boxSizing: 'border-box',
  padding: '12px',
  margin: '0px',
  border: '0px',
};

export const SqlCodeEditor: React.FC<SqlCodeEditorProps> = ({
  value,
  onChange,
  onRun,
  onSubmit,
  placeholder = '-- Write your SQL query here...',
  height = 'h-72',
  dialect = 'PostgreSQL',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const [cursorLine, setCursorLine] = useState<number>(1);

  // Synchronize scrolling between textarea, pre highlighter, and line numbers
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  // Update cursor line for active line highlighting
  const updateCursorLine = () => {
    if (!textareaRef.current) return;
    const textUpToCursor = value.substring(0, textareaRef.current.selectionStart);
    const currentLine = textUpToCursor.split('\n').length;
    setCursorLine(currentLine);
  };

  // Generate line numbers array
  const lineCount = useMemo(() => {
    const count = value.split('\n').length;
    return Math.max(count, 8);
  }, [value]);

  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  }, [lineCount]);

  // Real-time syntax tokens for color rendering
  const tokens = useMemo(() => {
    return tokenizeSql(value);
  }, [value]);

  // Real-time syntax check
  const syntaxCheck = useMemo(() => {
    return checkSqlSyntax(value);
  }, [value]);

  // Keydown handler: Tab indentation, auto-pairing brackets, shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Ctrl+Enter or Cmd+Enter -> Run Query (LeetCode shortcut)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onSubmit();
      } else {
        onRun();
      }
      return;
    }

    // Tab key -> Insert 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (!e.shiftKey) {
        // Indent
        const updated = value.substring(0, start) + '  ' + value.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      } else {
        // Shift+Tab -> Dedent current line
        const beforeCursor = value.substring(0, start);
        const lastNewline = beforeCursor.lastIndexOf('\n');
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
        const lineText = value.substring(lineStart, start);

        if (lineText.startsWith('  ')) {
          const updated = value.substring(0, lineStart) + value.substring(lineStart + 2);
          onChange(updated);
          setTimeout(() => {
            textarea.setSelectionRange(Math.max(lineStart, start - 2), Math.max(lineStart, end - 2));
          }, 0);
        }
      }
      return;
    }

    // Auto-close brackets & quotes
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      "'": "'",
      '"': '"',
      '`': '`',
    };

    if (pairs[e.key]) {
      const closing = pairs[e.key];
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // If user selected text, wrap it with pair
      if (start !== end) {
        e.preventDefault();
        const selected = value.substring(start, end);
        const updated = value.substring(0, start) + e.key + selected + closing + value.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.setSelectionRange(start + 1, end + 1);
        }, 0);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col bg-[#070b14] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Editor Body: Line Numbers + Overlay Tokenizer */}
      <div className={`relative flex ${height} min-h-[180px] overflow-hidden`}>
        {/* Line Numbers Column (Clean dark gray, synced scroll) */}
        <div
          ref={lineNumbersRef}
          style={{
            fontFamily: "'JetBrains Mono', Consolas, ui-monospace, monospace",
            fontSize: '13px',
            lineHeight: '24px',
            boxSizing: 'border-box',
            paddingTop: '12px',
            paddingBottom: '12px',
          }}
          className="w-11 bg-[#090d18] text-slate-600 select-none px-2 text-right border-r border-slate-800/80 overflow-hidden shrink-0"
        >
          {lineNumbers.map((num) => (
            <div
              key={num}
              style={{ lineHeight: '24px' }}
              className={`transition-colors ${
                num === cursorLine ? 'text-cyan-400 font-bold' : 'text-slate-600'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Editor Stage: Underlying Syntax Highlighter + Transparent Textarea */}
        <div className="relative flex-1 overflow-hidden">
          {/* Active Line Highlight Indicator */}
          <div
            className="absolute left-0 right-0 pointer-events-none bg-slate-800/25 border-y border-cyan-500/10 transition-all duration-75"
            style={{
              top: `${(cursorLine - 1) * 24 + 12}px`,
              height: '24px',
            }}
          />

          {/* Real-time Syntax Highlight Layer (<pre><code>) */}
          <pre
            ref={preRef}
            aria-hidden="true"
            style={EDITOR_FONT_STYLE}
            className="absolute inset-0 pointer-events-none select-none overflow-hidden whitespace-pre z-10 text-slate-100"
          >
            <code style={{ fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', letterSpacing: 'inherit', wordSpacing: 'inherit', fontVariantLigatures: 'none' }}>
              {value ? (
                tokens.map((token, idx) => {
                  switch (token.type) {
                    case 'keyword':
                      // Exact sky-blue/cyan matching the user's uploaded screenshot (#38bdf8)
                      return (
                        <span key={idx} className="text-[#38bdf8] font-bold">
                          {token.text}
                        </span>
                      );
                    case 'function':
                      return (
                        <span key={idx} className="text-[#c084fc] font-semibold">
                          {token.text}
                        </span>
                      );
                    case 'string':
                      return (
                        <span key={idx} className="text-[#4ade80]">
                          {token.text}
                        </span>
                      );
                    case 'number':
                      return (
                        <span key={idx} className="text-[#fb923c] font-semibold">
                          {token.text}
                        </span>
                      );
                    case 'comment':
                      return (
                        <span key={idx} className="text-slate-500 italic">
                          {token.text}
                        </span>
                      );
                    case 'operator':
                      return (
                        <span key={idx} className="text-slate-300">
                          {token.text}
                        </span>
                      );
                    case 'punctuation':
                      return (
                        <span key={idx} className="text-slate-400">
                          {token.text}
                        </span>
                      );
                    default:
                      return <span key={idx}>{token.text}</span>;
                  }
                })
              ) : (
                <span className="text-slate-600 italic">{placeholder}</span>
              )}
            </code>
          </pre>

          {/* Interactive Textarea (Transparent text, visible caret) */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorLine();
            }}
            onKeyDown={handleKeyDown}
            onClick={updateCursorLine}
            onKeyUp={updateCursorLine}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            style={EDITOR_FONT_STYLE}
            className="absolute inset-0 w-full h-full bg-transparent resize-none focus:outline-none focus:ring-0 z-20 selection:bg-indigo-600/40 selection:text-transparent overflow-y-auto overflow-x-auto whitespace-pre text-transparent caret-cyan-400"
            placeholder=""
          />
        </div>
      </div>

      {/* Editor Status Footer: Real-time Syntax Diagnostic + Keyboard Shortcut Pills */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#090d18] border-t border-slate-800 text-[11px] text-slate-400 shrink-0 select-none">
        {/* Left: Syntax Diagnostic */}
        <div className="flex items-center gap-2 overflow-hidden">
          {syntaxCheck.isValid ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Valid SQL Syntax</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-400 font-medium truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span className="truncate">{syntaxCheck.message}</span>
            </div>
          )}
        </div>

        {/* Right: Line / Char Count & Run Shortcut */}
        <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
          <span className="text-slate-500 hidden sm:inline">
            Ln {cursorLine}, Col {(textareaRef.current?.selectionStart || 0) + 1}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd>
            <span className="text-slate-500">to Run</span>
          </span>
        </div>
      </div>
    </div>
  );
};
