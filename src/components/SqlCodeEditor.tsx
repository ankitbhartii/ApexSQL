/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import alasql from 'alasql';
import {
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Trash2,
  Code2
} from 'lucide-react';

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

  // 3. Check incomplete clauses at tail
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

export interface SqlCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  placeholder?: string;
  height?: string;
  dialect?: string;
  schemas?: { tableName: string; columns: { name: string; type: string }[] }[];
  onReset?: () => void;
}

export function formatSqlQuery(sql: string): string {
  const keywords = [
    'WITH', 'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT',
    'UNION ALL', 'UNION', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN',
    'JOIN', 'ON', 'AND', 'OR', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  ];
  let cleaned = sql.replace(/\s+/g, ' ').trim();
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    cleaned = cleaned.replace(regex, `\n${kw}`);
  });
  return cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

export const SqlCodeEditor: React.FC<SqlCodeEditorProps> = ({
  value,
  onChange,
  onRun,
  onSubmit,
  placeholder = '-- Write your SQL query here...',
  height = 'h-72',
  dialect = 'PostgreSQL',
  schemas = [],
  onReset,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const onRunRef = useRef(onRun);
  const onSubmitRef = useRef(onSubmit);
  const schemasRef = useRef(schemas);

  useEffect(() => {
    onRunRef.current = onRun;
    onSubmitRef.current = onSubmit;
    schemasRef.current = schemas;
  });

  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [syntaxCheck, setSyntaxCheck] = useState<SyntaxDiagnostic>({ isValid: true, message: 'Valid SQL Syntax' });

  // Update syntax checking and Monaco error squiggles
  const validateSyntax = useCallback((code: string) => {
    const diagnostic = checkSqlSyntax(code);
    setSyntaxCheck(diagnostic);

    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      if (!model) return;

      if (!diagnostic.isValid && diagnostic.line) {
        monacoRef.current.editor.setModelMarkers(model, 'alasql', [
          {
            startLineNumber: Math.max(1, diagnostic.line),
            startColumn: 1,
            endLineNumber: Math.max(1, diagnostic.line),
            endColumn: model.getLineMaxColumn(Math.max(1, diagnostic.line)),
            message: diagnostic.message || 'SQL Syntax Error',
            severity: monacoRef.current.MarkerSeverity.Error,
          },
        ]);
      } else {
        monacoRef.current.editor.setModelMarkers(model, 'alasql', []);
      }
    }
  }, []);

  // Debounced syntax validation
  useEffect(() => {
    const timer = setTimeout(() => {
      validateSyntax(value);
    }, 250);
    return () => clearTimeout(timer);
  }, [value, validateSyntax]);

  // Monaco onMount configuration
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define 100% LeetCode Dark theme
    monaco.editor.defineTheme('leetcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword.sql', foreground: '38bdf8', fontStyle: 'bold' },
        { token: 'predefined.sql', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'string.sql', foreground: '4ade80' },
        { token: 'number.sql', foreground: 'fb923c' },
        { token: 'comment.sql', foreground: '64748b', fontStyle: 'italic' },
        { token: 'operator.sql', foreground: '94a3b8' },
        { token: 'delimiter.sql', foreground: '94a3b8' },
        { token: 'identifier.sql', foreground: 'e2e8f0' },
      ],
      colors: {
        'editor.background': '#070b14',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#0f172a50',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#38bdf8',
        'editorCursor.foreground': '#38bdf8',
        'editor.selectionBackground': '#4338ca55',
        'editor.inactiveSelectionBackground': '#312e8140',
        'editorIndentGuide.background1': '#1e293b',
        'editorIndentGuide.activeBackground1': '#38bdf840',
        'editorBracketMatch.background': '#1e293b',
        'editorBracketMatch.border': '#38bdf8',
      },
    });

    monaco.editor.setTheme('leetcode-dark');

    // Register LeetCode keyboard shortcuts (Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmitRef.current();
    });

    // Track cursor line & column
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });

    // Register Document Formatting Provider (Shift+Alt+F)
    monaco.languages.registerDocumentFormattingEditProvider('sql', {
      provideDocumentFormattingEdits: (model: any) => {
        const formatted = formatSqlQuery(model.getValue());
        return [
          {
            range: model.getFullModelRange(),
            text: formatted,
          },
        ];
      },
    });

    // Register Custom SQL IntelliSense Autocomplete
    monaco.languages.registerCompletionItemProvider('sql', {
      triggerCharacters: [' ', '.', '(', ','],
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: any[] = [];

        // 1. SQL Keywords with Snippets
        const keywordsList = [
          { label: 'SELECT', insertText: 'SELECT ${1:*}\nFROM ${2:table_name};', detail: 'SELECT query snippet', isSnippet: true },
          { label: 'FROM', insertText: 'FROM ', detail: 'FROM clause' },
          { label: 'WHERE', insertText: 'WHERE ', detail: 'WHERE predicate' },
          { label: 'JOIN', insertText: 'JOIN ${1:table} ON ${2:condition}', detail: 'INNER JOIN clause', isSnippet: true },
          { label: 'LEFT JOIN', insertText: 'LEFT JOIN ${1:table} ON ${2:condition}', detail: 'LEFT OUTER JOIN clause', isSnippet: true },
          { label: 'GROUP BY', insertText: 'GROUP BY ', detail: 'GROUP BY clause' },
          { label: 'ORDER BY', insertText: 'ORDER BY ${1:column} ${2|ASC,DESC|}', detail: 'ORDER BY clause', isSnippet: true },
          { label: 'HAVING', insertText: 'HAVING ', detail: 'HAVING aggregate filter' },
          { label: 'LIMIT', insertText: 'LIMIT ', detail: 'LIMIT clause' },
          { label: 'WITH', insertText: 'WITH ${1:cte_name} AS (\n  ${2:SELECT * FROM table}\n)\nSELECT * FROM ${1:cte_name};', detail: 'Common Table Expression (CTE)', isSnippet: true },
          { label: 'CASE WHEN', insertText: 'CASE\n  WHEN ${1:condition} THEN ${2:result}\n  ELSE ${3:fallback}\nEND', detail: 'CASE conditional expression', isSnippet: true },
          { label: 'OVER (PARTITION BY)', insertText: 'OVER (\n  PARTITION BY ${1:column}\n  ORDER BY ${2:column}\n)', detail: 'Window function OVER clause', isSnippet: true },
          { label: 'UNION ALL', insertText: 'UNION ALL\n', detail: 'UNION ALL combinator' },
          { label: 'DISTINCT', insertText: 'DISTINCT ', detail: 'DISTINCT qualifier' },
        ];

        keywordsList.forEach((kw) => {
          suggestions.push({
            label: kw.label,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw.insertText,
            insertTextRules: kw.isSnippet ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet : undefined,
            detail: kw.detail,
            range,
          });
        });

        // 2. Built-in SQL Functions
        const functionsList = [
          { label: 'COUNT()', insertText: 'COUNT(${1:*})', detail: 'Count aggregate function' },
          { label: 'SUM()', insertText: 'SUM(${1:column})', detail: 'Sum aggregate function' },
          { label: 'AVG()', insertText: 'AVG(${1:column})', detail: 'Average aggregate function' },
          { label: 'ROUND()', insertText: 'ROUND(${1:val}, ${2:2})', detail: 'Round numeric value' },
          { label: 'COALESCE()', insertText: 'COALESCE(${1:val}, ${2:default_val})', detail: 'First non-null value' },
          { label: 'ROW_NUMBER()', insertText: 'ROW_NUMBER() OVER (ORDER BY ${1:col})', detail: 'Window row number ranking' },
          { label: 'DENSE_RANK()', insertText: 'DENSE_RANK() OVER (ORDER BY ${1:col})', detail: 'Window dense rank without gaps' },
          { label: 'RANK()', insertText: 'RANK() OVER (ORDER BY ${1:col})', detail: 'Window rank with rank gaps' },
          { label: 'LAG()', insertText: 'LAG(${1:col}) OVER (ORDER BY ${2:col})', detail: 'Value from preceding row' },
          { label: 'LEAD()', insertText: 'LEAD(${1:col}) OVER (ORDER BY ${2:col})', detail: 'Value from following row' },
          { label: 'DATEDIFF()', insertText: 'DATEDIFF(${1:date1}, ${2:date2})', detail: 'Difference between two dates' },
          { label: 'CONCAT()', insertText: 'CONCAT(${1:str1}, ${2:str2})', detail: 'Concatenate strings' },
        ];

        functionsList.forEach((fn) => {
          suggestions.push({
            label: fn.label,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: fn.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: fn.detail,
            range,
          });
        });

        // 3. Schema-Aware Table & Column IntelliSense for current problem
        const currentSchemas = schemasRef.current || [];
        currentSchemas.forEach((t) => {
          suggestions.push({
            label: t.tableName,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: t.tableName,
            detail: `Table (${t.columns.length} columns)`,
            documentation: `Columns: ${t.columns.map((c) => `${c.name} (${c.type})`).join(', ')}`,
            range,
          });

          t.columns.forEach((col) => {
            suggestions.push({
              label: col.name,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: col.name,
              detail: `${t.tableName}.${col.name} : ${col.type}`,
              range,
            });
          });
        });

        return { suggestions };
      },
    });

    // Run initial syntax validation
    validateSyntax(value);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const formatted = formatSqlQuery(model.getValue());
        editorRef.current.executeEdits('sql-formatter', [
          {
            range: model.getFullModelRange(),
            text: formatted,
            forceMoveMarkers: true,
          },
        ]);
        onChange(formatted);
      }
    }
  };

  const handleClear = () => {
    onChange('');
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#070b14] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : ''
      }`}
    >
      {/* 1. LeetCode IDE Top Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2 apple-glass border-b border-white/10 text-xs select-none sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-cyan-300 font-bold text-[11px] shadow-xs">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{dialect}</span>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* Format Query Button */}
          <button
            onClick={handleFormatCode}
            className="px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Format SQL query"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Reset to starter code */}
          {onReset && (
            <button
              onClick={onReset}
              className="px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Reset query to starter code"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Clear editor contents"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Right Toolbar Actions: Copy, Fullscreen */}
        <div className="flex items-center gap-1.5">

          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Copy SQL code to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title={isExpanded ? 'Exit Fullscreen' : 'Expand Editor to Fullscreen'}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Monaco Editor Container */}
      <div className={`relative ${isExpanded ? 'flex-1' : height} min-h-[200px] w-full`}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          language="sql"
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme="leetcode-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
            fontLigatures: false,
            lineHeight: 24,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            cursorStyle: 'line',
            cursorWidth: 2,
            tabSize: 2,
            insertSpaces: true,
            padding: { top: 12, bottom: 12 },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
              preview: true,
            },
            quickSuggestions: { other: true, comments: false, strings: false },
            contextmenu: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-[#070b14] text-slate-500 font-mono text-xs gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Loading Monaco SQL Engine...</span>
            </div>
          }
        />
      </div>

      {/* 3. LeetCode Editor Status Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#090d18] border-t border-slate-800 text-[11px] text-slate-400 shrink-0 select-none">
        {/* Left: Syntax Diagnostic Indicator */}
        <div className="flex items-center gap-2 overflow-hidden">
          {syntaxCheck.isValid ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Valid SQL Syntax</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-400 font-medium truncate" title={syntaxCheck.message}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span className="truncate">{syntaxCheck.message}</span>
            </div>
          )}
        </div>

        {/* Right: Line / Col, Indentation, Shortcut Badges */}
        <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
          <span className="text-slate-400 hidden sm:inline">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-500 hidden md:inline">Spaces: 2</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd>
            <span className="text-slate-500">Run</span>
          </span>
        </div>
      </div>
    </div>
  );
};
