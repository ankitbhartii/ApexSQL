/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Table,
  Key,
  Link2,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Code2,
  FileCode,
  CheckCircle2,
  Eye,
  Plus
} from 'lucide-react';
import alasql from 'alasql';
import { TableSchema } from '../types';
import { validateSafeSqlQuery, capQueryResults } from '../utils/sqlSanitizer';
import { secureRandomInt } from '../utils/cryptoUtils';

interface DatabaseStudioPageProps {
  currentSchemas?: TableSchema[];
  onBackToSandbox: () => void;
}

interface StudioSchemaPreset {
  id: string;
  name: string;
  description: string;
  tables: {
    name: string;
    description: string;
    columns: { name: string; type: string; isPk?: boolean; isFk?: boolean; ref?: string }[];
    sampleRows: Record<string, any>[];
  }[];
}

const PRESET_SCHEMAS: StudioSchemaPreset[] = [
  {
    id: 'ecommerce',
    name: '🛍️ E-Commerce & Logistics Warehouse',
    description: 'Orders, users, products, and inventory transactions tracking.',
    tables: [
      {
        name: 'users',
        description: 'Customer account records and registration metadata',
        columns: [
          { name: 'user_id', type: 'INT', isPk: true },
          { name: 'email', type: 'VARCHAR(255)' },
          { name: 'country', type: 'VARCHAR(50)' },
          { name: 'created_at', type: 'TIMESTAMP' },
          { name: 'is_premium', type: 'BOOLEAN' },
        ],
        sampleRows: [
          { user_id: 101, email: 'alice@gmail.com', country: 'US', created_at: '2025-01-15 08:30:00', is_premium: true },
          { user_id: 102, email: 'bob@apple.com', country: 'CA', created_at: '2025-01-18 14:12:00', is_premium: false },
          { user_id: 103, email: 'carol@meta.com', country: 'UK', created_at: '2025-02-01 09:45:00', is_premium: true },
          { user_id: 104, email: 'david@amazon.com', country: 'US', created_at: '2025-02-10 16:20:00', is_premium: false },
        ]
      },
      {
        name: 'orders',
        description: 'Purchases placed by registered customers',
        columns: [
          { name: 'order_id', type: 'INT', isPk: true },
          { name: 'user_id', type: 'INT', isFk: true, ref: 'users.user_id' },
          { name: 'order_date', type: 'DATE' },
          { name: 'total_amount', type: 'DECIMAL(10,2)' },
          { name: 'status', type: 'VARCHAR(30)' },
        ],
        sampleRows: [
          { order_id: 5001, user_id: 101, order_date: '2025-02-01', total_amount: 149.99, status: 'COMPLETED' },
          { order_id: 5002, user_id: 101, order_date: '2025-02-14', total_amount: 89.50, status: 'COMPLETED' },
          { order_id: 5003, user_id: 102, order_date: '2025-02-15', total_amount: 299.00, status: 'SHIPPED' },
          { order_id: 5004, user_id: 103, order_date: '2025-02-20', total_amount: 45.00, status: 'PENDING' },
        ]
      },
      {
        name: 'order_items',
        description: 'Line item product details per customer order',
        columns: [
          { name: 'item_id', type: 'INT', isPk: true },
          { name: 'order_id', type: 'INT', isFk: true, ref: 'orders.order_id' },
          { name: 'product_name', type: 'VARCHAR(100)' },
          { name: 'unit_price', type: 'DECIMAL(10,2)' },
          { name: 'quantity', type: 'INT' },
        ],
        sampleRows: [
          { item_id: 1, order_id: 5001, product_name: 'Wireless Noise-Canceling Headphones', unit_price: 149.99, quantity: 1 },
          { item_id: 2, order_id: 5002, product_name: 'Mechanical Keyboard RGB', unit_price: 89.50, quantity: 1 },
          { item_id: 3, order_id: 5003, product_name: 'Ultra-Wide 4K Gaming Monitor', unit_price: 299.00, quantity: 1 },
          { item_id: 4, order_id: 5004, product_name: 'Ergonomic Desk Mat', unit_price: 45.00, quantity: 1 },
        ]
      }
    ]
  },
  {
    id: 'social',
    name: '💬 Social Network & Feed Graph',
    description: 'User engagement, posts, reactions, and follower relationships.',
    tables: [
      {
        name: 'posts',
        description: 'User authored posts and media content',
        columns: [
          { name: 'post_id', type: 'INT', isPk: true },
          { name: 'author_id', type: 'INT' },
          { name: 'caption', type: 'TEXT' },
          { name: 'like_count', type: 'INT' },
          { name: 'published_at', type: 'TIMESTAMP' },
        ],
        sampleRows: [
          { post_id: 1, author_id: 101, caption: 'Just landed my dream SQL engineer role at Meta! 🚀', like_count: 1420, published_at: '2025-03-01 10:00:00' },
          { post_id: 2, author_id: 102, caption: 'Window functions are the secret weapon for data analytics.', like_count: 890, published_at: '2025-03-02 12:30:00' },
          { post_id: 3, author_id: 103, caption: 'Comparing Snowflake clustering keys vs BigQuery partition filters.', like_count: 654, published_at: '2025-03-03 15:45:00' },
        ]
      },
      {
        name: 'follows',
        description: 'Directional social graph connections between users',
        columns: [
          { name: 'follower_id', type: 'INT', isPk: true },
          { name: 'followee_id', type: 'INT', isPk: true },
          { name: 'followed_at', type: 'DATE' },
        ],
        sampleRows: [
          { follower_id: 101, followee_id: 102, followed_at: '2025-01-10' },
          { follower_id: 101, followee_id: 103, followed_at: '2025-01-12' },
          { follower_id: 102, followee_id: 103, followed_at: '2025-01-15' },
          { follower_id: 103, followee_id: 101, followed_at: '2025-01-20' },
        ]
      }
    ]
  }
];

export const DatabaseStudioPage: React.FC<DatabaseStudioPageProps> = ({
  currentSchemas,
  onBackToSandbox
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ecommerce');
  const [selectedTableIndex, setSelectedTableIndex] = useState<number>(0);
  const [scratchQuery, setScratchQuery] = useState<string>(
    'SELECT u.country, COUNT(o.order_id) as total_orders, ROUND(SUM(o.total_amount), 2) as gmv\nFROM users u\nLEFT JOIN orders o ON u.user_id = o.user_id\nGROUP BY u.country\nORDER BY gmv DESC;'
  );
  const [scratchResult, setScratchResult] = useState<any[] | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const activePreset = useMemo(() => {
    return PRESET_SCHEMAS.find((p) => p.id === selectedPresetId) || PRESET_SCHEMAS[0];
  }, [selectedPresetId]);

  const activeTable = activePreset.tables[selectedTableIndex] || activePreset.tables[0];

  // Initialize preset tables in in-memory alasql database on mount or preset switch
  useEffect(() => {
    try {
      activePreset.tables.forEach((tbl) => {
        const safeTableName = tbl.name.replace(/[^a-zA-Z0-9_]/g, '_');
        alasql(`DROP TABLE IF EXISTS [${tbl.name}]`);
        if (safeTableName !== tbl.name) {
          try { alasql(`DROP TABLE IF EXISTS [${safeTableName}]`); } catch {}
        }

        const colDefs = tbl.columns.map((c) => `[${c.name}] STRING`).join(', ');
        alasql(`CREATE TABLE [${tbl.name}] (${colDefs})`);

        if (Array.isArray(tbl.sampleRows) && tbl.sampleRows.length > 0) {
          alasql(`INSERT INTO [${tbl.name}] SELECT * FROM ?`, [tbl.sampleRows]);
        }
      });
      // Initial query execution
      executeScratchQuery();
    } catch (e) {}
  }, [selectedPresetId]);

  const executeScratchQuery = () => {
    setIsExecuting(true);
    const start = performance.now();
    try {
      const validation = validateSafeSqlQuery(scratchQuery, { allowDml: true, maxLen: 10000 });
      if (!validation.isSafe) {
        setScratchResult([{ error: validation.reason || 'Query contains prohibited or dangerous commands.' }]);
        setExecutionTime(0);
        setIsExecuting(false);
        return;
      }

      const res = alasql(validation.sanitizedSql);
      const elapsed = Math.round((performance.now() - start) * 100) / 100;
      const rawRows = Array.isArray(res) ? res : [res];
      const capped = capQueryResults(rawRows);
      setScratchResult(capped.rows);
      setExecutionTime(elapsed || 1.2);
    } catch (e: any) {
      setScratchResult([{ error: e.message || 'Execution error' }]);
      setExecutionTime(0);
    } finally {
      setTimeout(() => setIsExecuting(false), 150);
    }
  };

  const handleGenerateSyntheticRow = () => {
    const tbl = activeTable;
    const newId = secureRandomInt(1000, 9999);
    const newRow: Record<string, any> = {};

    tbl.columns.forEach((col) => {
      if (col.isPk) {
        newRow[col.name] = newId;
      } else if (col.name.includes('date')) {
        newRow[col.name] = new Date().toISOString().slice(0, 10);
      } else if (col.name.includes('amount') || col.name.includes('price')) {
        newRow[col.name] = (secureRandomInt(1000, 20000) / 100).toFixed(2);
      } else if (col.name.includes('email')) {
        newRow[col.name] = `candidate_${newId}@apexsql.dev`;
      } else {
        newRow[col.name] = `sample_${newId}`;
      }
    });

    tbl.sampleRows.push(newRow);

    try {
      alasql(`INSERT INTO [${tbl.name}] SELECT * FROM ?`, [[newRow]]);
      executeScratchQuery();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-indigo-600/30 selection:text-indigo-200">
      {/* Top Banner */}
      <div className="border-b border-white/8 bg-[#090d18]/90 backdrop-blur-xl sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSandbox}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <span>←</span>
              <span>Back to Sandbox</span>
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>🗄️ Database Schema & ER Visualizer</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Interactive Studio
                </span>
              </h1>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Active Schema:</span>
            <div className="relative inline-flex p-0.5 apple-pill-bar">
              {PRESET_SCHEMAS.map((p) => {
                const isActive = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPresetId(p.id);
                      setSelectedTableIndex(0);
                    }}
                    className={`relative z-10 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer select-none ${
                      isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                    {isActive && (
                      <motion.div
                        layoutId="activeStudioSchemaPill"
                        className="absolute inset-0 rounded-full apple-pill-active -z-10"
                        transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Schema Overview Description */}
        <div className="apple-card p-5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>{activePreset.name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {activePreset.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Total Tables: <strong className="text-cyan-300">{activePreset.tables.length}</strong>
            </span>
          </div>
        </div>

        {/* 1. VISUAL ENTITY RELATIONSHIP (ER) CARDS */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Entity Relationship Tables</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePreset.tables.map((tbl, idx) => {
              const isSelected = selectedTableIndex === idx;
              return (
                <motion.div
                  key={tbl.name}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTableIndex(idx)}
                  className={`apple-card p-5 border cursor-pointer transition-all rounded-2xl flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-xl bg-slate-900/90'
                      : 'border-white/8 hover:border-white/16'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-bold text-white font-mono">
                          {tbl.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                        {tbl.sampleRows.length} rows
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {tbl.description}
                    </p>

                    {/* Columns List */}
                    <div className="divide-y divide-white/5 border-t border-white/8 pt-2">
                      {tbl.columns.map((c) => (
                        <div key={c.name} className="py-1 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            {c.isPk && <span title="Primary Key" className="text-amber-400 text-[10px]">🔑</span>}
                            {c.isFk && <span title="Foreign Key" className="text-indigo-400 text-[10px]">🔗</span>}
                            <span className={c.isPk ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                              {c.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{c.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                    <span>Inspect Raw Records</span>
                    <span>→</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 2. LIVE SAMPLE DATA INSPECTOR */}
        <div className="apple-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 apple-glass border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">Inspecting Table:</span>
              <span className="text-white font-bold bg-white/10 px-2.5 py-0.5 rounded-md">
                {activeTable.name}
              </span>
              <span className="text-slate-500">({activeTable.sampleRows.length} active records)</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGenerateSyntheticRow}
              className="apple-btn-secondary px-3 py-1 text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none text-cyan-300 hover:text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Inject Synthetic Record</span>
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  {activeTable.columns.map((col) => (
                    <th key={col.name} className="px-4 py-2.5 font-bold text-slate-300">
                      <div className="flex items-center gap-1">
                        {col.isPk && <span className="text-amber-400">🔑</span>}
                        {col.isFk && <span className="text-indigo-400">🔗</span>}
                        <span>{col.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#080d1a]/60">
                {activeTable.sampleRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.04] transition-colors">
                    {activeTable.columns.map((col) => {
                      const val = row[col.name];
                      return (
                        <td key={col.name} className="px-4 py-2.5 text-slate-300">
                          {typeof val === 'boolean' ? (
                            <span className={val ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                              {String(val)}
                            </span>
                          ) : typeof val === 'number' ? (
                            <span className="text-cyan-300 font-semibold">{val}</span>
                          ) : (
                            String(val ?? 'NULL')
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. INTERACTIVE SQL SCRATCHPAD */}
        <div className="apple-card p-5 border border-white/10 rounded-2xl shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Live Schema Query Scratchpad
              </h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={executeScratchQuery}
              disabled={isExecuting}
              className="apple-btn-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 select-none shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Running...' : 'Execute Scratchpad Query'}</span>
            </motion.button>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden bg-black/60">
            <textarea
              value={scratchQuery}
              onChange={(e) => setScratchQuery(e.target.value)}
              rows={4}
              className="w-full bg-transparent p-4 font-mono text-xs text-cyan-300 focus:outline-hidden leading-relaxed resize-y selection:bg-indigo-600/40"
              placeholder="Write SQL query against active tables..."
            />
          </div>

          {scratchResult && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Output Table</span>
                </span>
                <span>
                  Rows: <strong className="text-white">{scratchResult.length}</strong> • Time: <strong className="text-cyan-300">{executionTime} ms</strong>
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      {Object.keys(scratchResult[0] || {}).map((col) => (
                        <th key={col} className="px-3.5 py-2 font-bold text-slate-300">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {scratchResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2 text-slate-200">
                            {typeof val === 'number' ? val.toLocaleString() : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
