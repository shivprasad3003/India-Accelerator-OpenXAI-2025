// File: app/chat/page.tsx
"use client";

/**
 * app/chat/page.tsx
 *
 * Enhanced Personal Finance Assistant with beautiful UI, attractive colors, and improved interactivity
 * - Modern gradient backgrounds and glassmorphism effects
 * - Enhanced color palettes with vibrant combinations
 * - Improved animations and micro-interactions
 * - Better dark mode support with rich contrasts
 * - Interactive hover effects and transitions
 * - Enhanced visual hierarchy and spacing
 * - Beautiful card designs with shadows and borders
 * - Improved typography and iconography
 *
 * All original features preserved:
 * - Sidebar with New Chat, Search, Chat History, profile/settings
 * - Main chat panel with message list, streaming-aware responses, quick prompts
 * - Right panel with analytics (expense charts), assistant settings, export tools
 * - LocalStorage-backed multi-chat history (each chat has messages)
 * - Themes, palettes, tones, system prompt editor
 * - Many small UX niceties and accessibility touches
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

// Use shadcn components if present; otherwise they are simple wrappers
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// lucide-react icons
import {
  Sparkles,
  Settings,
  Sun,
  Moon,
  Search,
  Plus,
  Trash2,
  Download,
  Copy,
  Loader2,
  Bot,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  FileText,
  Edit3,
  Bell,
  Database,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Star,
  Heart,
  Bookmark,
  Share,
  MoreVertical,
  Filter,
  SortAsc,
  RefreshCw,
  Eye,
  EyeOff,
  MessageCircle,
  Send,
  Mic,
  Image,
  Paperclip,
  Smile,
  Calendar,
  Clock,
  Globe,
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
} from "lucide-react";

/* ============================
   Types and Constants
   ============================ */

type Role = "user" | "assistant" | "system";
type Message = { id: string; role: Role; content: string; ts: string; pinned?: boolean };
type Chat = { id: string; title: string; createdAt: string; messages: Message[] };

type Expense = { id: string | number; category: string; amount: number; date: string };

const STORAGE_CHATS = "pa_chats_v1";
const STORAGE_SETTINGS = "pa_settings_v1";
const STORAGE_UI = "pa_ui_v1";

const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful personal finance assistant. Be concise, practical and actionable. Offer steps, budgets and simple rules the user can follow.";

// Enhanced color palettes with beautiful combinations
const COLOR_PALETTES: string[][] = [
  // Vibrant Ocean Sunset
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA726", "#AB47BC"],
  // Purple Paradise
  ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"],
  // Emerald Dreams
  ["#11998e", "#38ef7d", "#20bf6b", "#0fb9b1", "#a8edea"],
  // Fire & Ice
  ["#ff9a9e", "#fecfef", "#fecfef", "#a8e6cf", "#88d8c0"],
  // Cosmic Gradient
  ["#fa709a", "#fee140", "#fa709a", "#43e97b", "#38f9d7"],
  // Neon Nights
  ["#ff006e", "#8338ec", "#3a86ff", "#06ffa5", "#ffbe0b"],
  // Sunset Glow
  ["#ff7730", "#fc4a1a", "#f093fb", "#f5576c", "#4facfe"],
  // Aurora Borealis
  ["#00f5ff", "#00d9ff", "#a8e6cf", "#dcedc8", "#f8bbd9"],
];

const QUICK_PROMPTS = [
  "What's my total spending this month?",
  "Give me 3 ways to reduce food expenses.",
  "Suggest a 50/30/20 plan for monthly income ₹50,000",
  "Which category should I cut back on?",
  "Give a one-month savings plan to save ₹5,000",
  "How can I build an emergency fund?",
  "Best investment options for beginners?",
  "Create a budget for ₹30,000 salary",
];

const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  bounce: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
};

const GEN_ID = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
const nowISO = () => new Date().toISOString();
const fmtINR = (n = 0) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/* ============================
   Enhanced UI helper components
   ============================ */

function GradientBadge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "info" }) {
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-purple-600",
    success: "bg-gradient-to-r from-green-400 to-emerald-500",
    warning: "bg-gradient-to-r from-yellow-400 to-orange-500",
    info: "bg-gradient-to-r from-cyan-400 to-blue-500",
  };
  
  return (
    <motion.span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-lg ${variants[variant]}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  );
}

function GlassmorphismCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-2xl ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}

function IconButton({ 
  title, 
  onClick, 
  children, 
  variant = "default",
  size = "md",
  disabled = false 
}: { 
  title?: string; 
  onClick?: () => void; 
  children: React.ReactNode;
  variant?: "default" | "primary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}) {
  const variants = {
    default: "hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-600 dark:text-slate-300",
    primary: "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    danger: "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400",
    success: "hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400",
  };

  const sizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  return (
    <motion.button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${sizes[size]} rounded-xl transition-all duration-200 ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={title}
      type="button"
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
}

function FloatingActionButton({ onClick, children, className = "" }: { onClick?: () => void; children: React.ReactNode; className?: string }) {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.button>
  );
}

/* ============================
   LocalStorage helpers (unchanged)
   ============================ */

function loadChatsFromStorage(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_CHATS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Chat[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveChatsToStorage(chats: Chat[]) {
  try {
    localStorage.setItem(STORAGE_CHATS, JSON.stringify(chats));
  } catch {}
}

function loadSettingsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSettingsToStorage(s: any) {
  try {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(s));
  } catch {}
}

/* ============================
   Mock / seed data (enhanced)
   ============================ */

function createSeedChats(): Chat[] {
  const c1: Chat = {
    id: GEN_ID(),
    title: "Monthly expenses analysis",
    createdAt: nowISO(),
    messages: [
      { id: GEN_ID(), role: "system", content: DEFAULT_SYSTEM_PROMPT, ts: nowISO() },
      {
        id: GEN_ID(),
        role: "user",
        content: "I spent 12000 on Food, 4000 on Transport, 6000 on Shopping this month. Give a quick summary and 3 saving tips.",
        ts: nowISO(),
      },
      {
        id: GEN_ID(),
        role: "assistant",
        content: "Summary: You spent most on Food (₹12,000). Tips: 1) Cook at home more 2) Set a weekly food budget 3) Use grocery lists and discounts. Consider 50/30/20.",
        ts: nowISO(),
      },
    ],
  };

  const c2: Chat = {
    id: GEN_ID(),
    title: "SIP vs RD advice",
    createdAt: nowISO(),
    messages: [
      { id: GEN_ID(), role: "system", content: DEFAULT_SYSTEM_PROMPT, ts: nowISO() },
      {
        id: GEN_ID(),
        role: "user",
        content: "Should I start a SIP with ₹3000 per month or put in recurring deposit? I'm risk-averse.",
        ts: nowISO(),
      },
      {
        id: GEN_ID(),
        role: "assistant",
        content: "If you're risk-averse, start with a short-term RD for guaranteed returns, but consider a small SIP allocation to equity funds for long-term growth.",
        ts: nowISO(),
      },
    ],
  };

  return [c1, c2];
}

/* ============================
   Streaming helper (unchanged)
   ============================ */

async function streamTextFromResponse(
  res: Response,
  onChunk: (t: string) => void,
  onComplete?: () => void
): Promise<void> {
  if (!res.body) {
    const text = await res.text();
    onChunk(text);
    if (onComplete) onComplete();
    return;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let done = false;
  let buffer = "";
  while (!done) {
    const { value, done: d } = await reader.read();
    done = !!d;
    if (value) {
      const chunk = dec.decode(value, { stream: true });
      buffer += chunk;
      onChunk(chunk);
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const candidate = parsed?.reply ?? parsed?.content ?? parsed?.message?.content ?? parsed?.response;
          if (typeof candidate === "string") onChunk(candidate);
        } catch {}
      }
    }
  }
  if (onComplete) onComplete();
}

/* ============================
   Main Component: Enhanced ChatCenter
   ============================ */

export default function ChatCenter(): JSX.Element {
  /* ----------------------- state: chats + UI ----------------------- */
  const [chats, setChats] = useState<Chat[]>(() => {
    const loaded = loadChatsFromStorage();
    if (loaded.length > 0) return loaded;
    const seeds = createSeedChats();
    saveChatsToStorage(seeds);
    return seeds;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    try {
      const loaded = loadChatsFromStorage();
      return loaded.length ? loaded[0]?.id ?? null : null;
    } catch {
      return null;
    }
  });

  const [filterText, setFilterText] = useState("");
  const [searchChatsQuery, setSearchChatsQuery] = useState("");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const s = loadSettingsFromStorage();
    return s?.dark ?? true;
  });

  const [systemPrompt, setSystemPrompt] = useState<string>(() => {
    const s = loadSettingsFromStorage();
    return s?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
  });
  const [tone, setTone] = useState<"concise" | "friendly" | "formal">(() => {
    const s = loadSettingsFromStorage();
    return s?.tone ?? "concise";
  });
  const [paletteIndex, setPaletteIndex] = useState<number>(() => {
    const s = loadSettingsFromStorage();
    return typeof s?.paletteIndex === "number" ? s.paletteIndex : 0;
  });
  const [streamEnabled, setStreamEnabled] = useState<boolean>(() => {
    const s = loadSettingsFromStorage();
    return typeof s?.streamEnabled === "boolean" ? s.streamEnabled : true;
  });
  const [maxTokens, setMaxTokens] = useState<number>(() => {
    const s = loadSettingsFromStorage();
    return typeof s?.maxTokens === "number" ? s.maxTokens : 512;
  });

  // Enhanced UI state
  const [showNewChatDrawer, setShowNewChatDrawer] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [uiWide, setUiWide] = useState<boolean>(() => {
    const raw = localStorage.getItem(STORAGE_UI);
    try {
      return raw ? JSON.parse(raw)?.wide ?? false : false;
    } catch {
      return false;
    }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // composing message
  const [composerText, setComposerText] = useState("");
  const [sending, setSending] = useState(false);
  const [streamedTextTemp, setStreamedTextTemp] = useState<Record<string, string>>({}); 

  const palette = COLOR_PALETTES[paletteIndex % COLOR_PALETTES.length];

  /* ----------------------- refs ----------------------- */
  const chatsRef = useRef<Chat[]>(chats);
  chatsRef.current = chats;

  const activeChatRef = useRef<Chat | null>(null);
  useEffect(() => {
    activeChatRef.current = chats.find((c) => c.id === activeChatId) ?? null;
  }, [activeChatId, chats]);

  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ----------------------- effects: persist settings & chats ----------------------- */
  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  useEffect(() => {
    saveSettingsToStorage({ 
      dark: darkMode, 
      systemPrompt, 
      tone, 
      paletteIndex, 
      streamEnabled, 
      maxTokens,
      animationsEnabled 
    });
  }, [darkMode, systemPrompt, tone, paletteIndex, streamEnabled, maxTokens, animationsEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_UI, JSON.stringify({ wide: uiWide, sidebarCollapsed }));
    } catch {}
  }, [uiWide, sidebarCollapsed]);

  /* ----------------------- utility: find active chat & helpers ----------------------- */

  const getActiveChat = useCallback(() => {
    return chats.find((c) => c.id === activeChatId) ?? null;
  }, [chats, activeChatId]);

  const setActiveChat = (id: string) => {
    setActiveChatId(id);
    setChats((prev) => {
      const found = prev.find((c) => c.id === id);
      if (!found) return prev;
      const rest = prev.filter((p) => p.id !== id);
      return [found, ...rest];
    });
  };

  /* ----------------------- actions: create / delete / rename chat ----------------------- */

  function createNewChat(title?: string) {
    const c: Chat = {
      id: GEN_ID(),
      title: title ?? `New Chat ${new Date().toLocaleString()}`,
      createdAt: nowISO(),
      messages: [{ id: GEN_ID(), role: "system", content: systemPrompt, ts: nowISO() }],
    };
    setChats((p) => [c, ...p]);
    setActiveChatId(c.id);
  }

  function deleteChat(id: string) {
    if (!confirm("Delete this chat and its history?")) return;
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter((c) => c.id !== id);
      setActiveChatId(remaining.length ? remaining[0].id : null);
    }
  }

  function renameChat(id: string, title: string) {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }

  /* ----------------------- message CRUD ----------------------- */

  function addMessageToChat(chatId: string, role: Role, content: string) {
    const m: Message = { id: GEN_ID(), role, content, ts: nowISO() };
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, m] } : c)));
    return m;
  }

  function updateMessageInChat(chatId: string, messageId: string, patch: Partial<Message>) {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)) } : c
      )
    );
  }

  function deleteMessageFromChat(chatId: string, messageId: string) {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c)));
  }

  /* ----------------------- chat sending logic ----------------------- */

  async function sendChatMessage(chatId: string, userText: string) {
    if (!userText.trim()) return;
    const trimmed = userText.trim();

    const userMsg = addMessageToChat(chatId, "user", trimmed);
    const assistantMsg = addMessageToChat(chatId, "assistant", "⏳ Assistant is thinking...");

    setComposerText("");
    setSending(true);
    setStreamedTextTemp((s) => ({ ...s, [assistantMsg.id]: "" }));

    const payload = {
      message: trimmed,
      chatId,
      systemPrompt,
      tone,
      stream: streamEnabled,
      maxTokens,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorText = `Error ${res.status}`;
        try {
          const j = await res.json();
          errorText = j?.error ?? j?.message ?? JSON.stringify(j);
        } catch {
          try {
            errorText = await res.text();
          } catch {}
        }
        updateMessageInChat(chatId, assistantMsg.id, { content: `⚠️ ${errorText}` });
        setSending(false);
        return;
      }

      if (res.body && streamEnabled) {
        let accumulated = "";
        await streamTextFromResponse(
          res,
          (chunk) => {
            accumulated += chunk;
            updateMessageInChat(chatId, assistantMsg.id, { content: accumulated });
            setStreamedTextTemp((s) => ({ ...s, [assistantMsg.id]: accumulated }));
          },
          () => {
            setStreamedTextTemp((s) => {
              const cp = { ...s };
              delete cp[assistantMsg.id];
              return cp;
            });
          }
        );
      } else {
        const j = await res.json();
        const reply = j?.reply ?? j?.response ?? j?.message?.content ?? String(j);
        updateMessageInChat(chatId, assistantMsg.id, { content: String(reply) });
      }
    } catch (err: any) {
      updateMessageInChat(chatId, assistantMsg.id, { content: `⚠️ Network error: ${String(err?.message ?? err)}` });
    } finally {
      setSending(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }

  /* ----------------------- UI: derived data ----------------------- */

  const filteredChats = useMemo(() => {
    if (!searchChatsQuery.trim()) return chats;
    const q = searchChatsQuery.toLowerCase();
    return chats.filter((c) => c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q)));
  }, [chats, searchChatsQuery]);

  const activeChat = getActiveChat();

  // Enhanced expense data with trends
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [expenseTrends, setExpenseTrends] = useState<any[]>([]);
  
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/expenses");
        if (!r.ok) return;
        const j = await r.json();
        const arr: any[] = Array.isArray(j) ? j : j.expenses ?? [];
        const expenseData = arr.map((e) => ({
          id: e.id ?? GEN_ID(),
          category: e.category ?? "Other",
          amount: Number(e.amount ?? 0),
          date: e.date ?? nowISO(),
        }));
        setExpenses(expenseData);
        
        // Generate trend data
        const trends = expenseData.reduce((acc: any, expense) => {
          const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
          const existing = acc.find((item: any) => item.month === month);
          if (existing) {
            existing.amount += expense.amount;
          } else {
            acc.push({ month, amount: expense.amount });
          }
          return acc;
        }, []);
        setExpenseTrends(trends);
        
      } catch {
        setExpenses(null);
      }
    })();
  }, []);

  const totalsByCategory = useMemo(() => {
    if (!expenses) return [];
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  /* ----------------------- export & utilities ----------------------- */

  function exportChatToText(chatId: string) {
    const c = chats.find((x) => x.id === chatId);
    if (!c) return;
    const txt = c.messages.map((m) => `[${m.role}] ${new Date(m.ts).toLocaleString()}\n${m.content}`).join("\n\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.title.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function copyChatToClipboard(chatId: string) {
    const c = chats.find((x) => x.id === chatId);
    if (!c) return;
    const txt = c.messages.map((m) => `[${m.role}] ${m.content}`).join("\n\n");
    navigator.clipboard.writeText(txt).then(() => alert("Chat copied to clipboard"), () => alert("Failed to copy"));
  }

  /* ----------------------- helpers for UI ----------------------- */

  const startNewChat = () => {
    createNewChat();
    setShowNewChatDrawer(false);
  };

  const quickSend = (prompt: string) => {
    if (!activeChatId) {
      createNewChat("Quick Chat");
      setTimeout(() => {
        const newActive = loadChatsFromStorage()[0]?.id;
        if (newActive) sendChatMessage(newActive, prompt);
      }, 100);
      return;
    }
    sendChatMessage(activeChatId, prompt);
  };

  const handleComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!activeChatId) {
        createNewChat();
        setTimeout(() => {
          const newest = loadChatsFromStorage()[0]?.id;
          if (newest) sendChatMessage(newest, composerText);
        }, 80);
      } else {
        sendChatMessage(activeChatId, composerText);
      }
    }
  };

  /* ----------------------- Enhanced Render ----------------------- */

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen transition-all duration-500`}>
      {/* Enhanced background with animated gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-yellow-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-pulse animation-delay-1000"></div>
      </div>

      {/* Enhanced Top header with glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3 no-underline">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl"
                whileHover={{ rotate: 180, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
            </Link>
            <div>
              <motion.div 
                className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Personal Finance Assistant
              </motion.div>
              <motion.div 
                className="text-sm text-slate-500 dark:text-slate-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Chat, analyze spend, and get money-saving tips
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced header controls */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="hidden md:flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <Search className="w-5 h-5 text-slate-500" />
              <input
                placeholder="Search chats or messages..."
                value={searchChatsQuery}
                onChange={(e) => setSearchChatsQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-72 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                aria-label="Search chats"
              />
            </div>

            <div className="flex items-center gap-2">
              <IconButton title="Toggle UI width" onClick={() => setUiWide((w) => !w)} variant="default">
                <ChevronLeft className="w-5 h-5" />
              </IconButton>

              <IconButton title="Collapse sidebar" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} variant="default">
                {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </IconButton>

              <IconButton title="Settings" onClick={() => setShowSettingsPanel((s) => !s)} variant="primary">
                <Settings className="w-5 h-5" />
              </IconButton>

              <IconButton title="Toggle theme" onClick={() => setDarkMode((d) => !d)} variant="default">
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </IconButton>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main container with enhanced grid */}
      <main className={`max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6 relative z-10 ${uiWide ? "max-w-screen-2xl" : ""}`}>
        
        {/* Enhanced Left sidebar: chats */}
        <motion.aside 
          className={`col-span-12 lg:col-span-3 ${sidebarCollapsed ? "lg:col-span-1" : ""} transition-all duration-300`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassmorphismCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${sidebarCollapsed ? "hidden" : ""}`}>
                  Chats
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => createNewChat("New Chat")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  {!sidebarCollapsed && <span className="font-medium">New Chat</span>}
                </motion.button>
              </div>
            </div>

            {/* Enhanced search for small screens */}
            {!sidebarCollapsed && (
              <div className="mb-4 md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    placeholder="Search chats..."
                    value={searchChatsQuery}
                    onChange={(e) => setSearchChatsQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-white/30 dark:border-gray-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            )}

            {/* Enhanced chats list */}
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-gray-600">
              <AnimatePresence>
                {filteredChats.length === 0 ? (
                  <motion.div 
                    className="text-center text-slate-500 dark:text-slate-400 py-12"
                    {...ANIMATION_VARIANTS.fadeIn}
                  >
                    {!sidebarCollapsed && "No chats yet. Click New Chat to start."}
                  </motion.div>
                ) : (
                  filteredChats.map((c, index) => {
                    const lastMsg = c.messages[c.messages.length - 1];
                    const isActive = c.id === activeChatId;
                    return (
                      <motion.div
                        key={c.id}
                        onClick={() => setActiveChat(c.id)}
                        className={`p-4 rounded-2xl cursor-pointer flex items-start gap-3 transition-all duration-300 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg" 
                            : "hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur border border-white/20 dark:border-gray-700/20"
                        }`}
                        role="button"
                        aria-pressed={isActive}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: sidebarCollapsed ? 1.1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                          <Bot className="w-5 h-5" />
                        </div>
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="font-semibold text-sm truncate text-slate-800 dark:text-slate-200">{c.title}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(c.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">
                              {lastMsg ? lastMsg.content.slice(0, 80) + "..." : "No messages yet..."}
                            </div>
                            <div className="flex items-center gap-1">
                              <GradientBadge variant="info">{c.messages.length} msgs</GradientBadge>
                              {c.messages.some(m => m.pinned) && (
                                <GradientBadge variant="warning">
                                  <Star className="w-3 h-3" />
                                </GradientBadge>
                              )}
                            </div>
                          </div>
                        )}
                        <div className={`flex ${sidebarCollapsed ? "flex-col" : "flex-row"} gap-1 items-center`}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              copyChatToClipboard(c.id);
                            }}
                            title="Copy"
                            size="sm"
                            variant="default"
                          >
                            <Copy className="w-3 h-3" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              exportChatToText(c.id);
                            }}
                            title="Download"
                            size="sm"
                            variant="success"
                          >
                            <Download className="w-3 h-3" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(c.id);
                            }}
                            title="Delete"
                            size="sm"
                            variant="danger"
                          >
                            <Trash2 className="w-3 h-3" />
                          </IconButton>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced small footer */}
            {!sidebarCollapsed && (
              <motion.div 
                className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl border border-white/30 dark:border-gray-700/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-2">Storage Info</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Local chats stored securely in your browser. Data stays private and offline.
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Secure & Private</span>
                </div>
              </motion.div>
            )}
          </GlassmorphismCard>
        </motion.aside>

        {/* Enhanced Center: active chat */}
        <motion.section 
          className={`col-span-12 lg:col-span-6 ${sidebarCollapsed ? "lg:col-span-8" : ""} flex flex-col gap-6 transition-all duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Enhanced top toolbar for active chat */}
          <GlassmorphismCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <IconButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)} variant="primary">
                  <ChevronLeft className="w-5 h-5" />
                </IconButton>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {activeChat ? activeChat.title : "No chat selected"}
                  </div>
                  {activeChat && (
                    <div className="flex items-center gap-2">
                      <GradientBadge variant="info">{activeChat.messages.length} messages</GradientBadge>
                      <GradientBadge variant="success">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Active
                      </GradientBadge>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconButton title="Pin chat" onClick={() => {}} variant="default">
                  <Star className="w-5 h-5" />
                </IconButton>
                <IconButton title="Share chat" onClick={() => {}} variant="default">
                  <Share className="w-5 h-5" />
                </IconButton>
                <IconButton title="Copy chat" onClick={() => activeChat && copyChatToClipboard(activeChat.id)} variant="default">
                  <Copy className="w-5 h-5" />
                </IconButton>
                <IconButton title="Export chat" onClick={() => activeChat && exportChatToText(activeChat.id)} variant="success">
                  <Download className="w-5 h-5" />
                </IconButton>
                <IconButton title="Delete chat" onClick={() => activeChat && deleteChat(activeChat.id)} variant="danger">
                  <Trash2 className="w-5 h-5" />
                </IconButton>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Enhanced messages panel */}
          <GlassmorphismCard className="flex-1 flex flex-col overflow-hidden min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-white/5">
              {activeChat ? (
                <>
                  {activeChat.messages.length === 0 ? (
                    <motion.div 
                      className="text-center text-slate-500 dark:text-slate-400 py-12"
                      {...ANIMATION_VARIANTS.fadeIn}
                    >
                      <Bot className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                      <div className="text-lg font-medium mb-2">No messages — start the conversation</div>
                      <div className="text-sm">Ask about your finances, budgeting tips, or investment advice</div>
                    </motion.div>
                  ) : (
                    <AnimatePresence>
                      {activeChat.messages.map((m, index) => (
                        <motion.div 
                          key={m.id} 
                          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} group`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className={`max-w-[85%] ${m.role === "user" ? "order-2" : "order-1"}`}>
                            <motion.div
                              className={`px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
                                m.role === "user" 
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-300/30 shadow-blue-500/25" 
                                  : "bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/30 text-slate-800 dark:text-slate-200"
                              }`}
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">{m.content}</div>
                              <div className="mt-3 flex items-center justify-between text-xs opacity-70">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(m.ts).toLocaleTimeString()}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <IconButton
                                    onClick={() => updateMessageInChat(activeChat.id, m.id, { pinned: !m.pinned })}
                                    title={m.pinned ? "Unpin" : "Pin"}
                                    size="sm"
                                    variant="default"
                                  >
                                    <Star className={`w-3 h-3 ${m.pinned ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      navigator.clipboard.writeText(m.content);
                                      // Could add toast notification here
                                    }}
                                    title="Copy"
                                    size="sm"
                                    variant="default"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => deleteMessageFromChat(activeChat.id, m.id)}
                                    title="Delete"
                                    size="sm"
                                    variant="danger"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </IconButton>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                          
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                            m.role === "user" 
                              ? "bg-gradient-to-tr from-blue-400 to-purple-500 text-white order-1 mr-3" 
                              : "bg-gradient-to-tr from-emerald-400 to-blue-500 text-white order-2 ml-3"
                          }`}>
                            {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <motion.div 
                  className="h-full flex flex-col items-center justify-center text-center px-8 py-16"
                  {...ANIMATION_VARIANTS.fadeIn}
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-2xl">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                    Welcome to Personal Finance Assistant
                  </div>
                  <div className="max-w-md text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    Start a new chat or pick an existing conversation from the left. Get personalized advice on budgets, 
                    savings, investments, and money management strategies.
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => createNewChat("Financial Planning")}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Planning
                    </motion.button>
                    <motion.button
                      onClick={() => createNewChat("Expense Analysis")}
                      className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-white/30 dark:border-gray-700/30 text-slate-800 dark:text-slate-200 rounded-2xl font-medium shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Analyze Spending
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Enhanced composer */}
            <div className="border-t border-white/20 dark:border-gray-700/30 p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur">
              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea
                    ref={composerRef}
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Ask about your finances... (Enter to send, Shift+Enter for new line)"
                    className="w-full p-4 rounded-2xl border border-white/30 dark:border-gray-700/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    rows={2}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <motion.button
                    onClick={() => {
                      if (!activeChatId) {
                        createNewChat();
                        setTimeout(() => {
                          const newest = loadChatsFromStorage()[0]?.id;
                          if (newest) sendChatMessage(newest, composerText);
                        }, 80);
                      } else {
                        sendChatMessage(activeChatId, composerText);
                      }
                    }}
                    disabled={sending || !composerText.trim()}
                    className={`px-6 py-3 rounded-2xl font-medium shadow-lg transition-all duration-300 flex items-center gap-2 ${
                      sending || !composerText.trim()
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-blue-500/25"
                    }`}
                    whileHover={!sending && composerText.trim() ? { scale: 1.05 } : {}}
                    whileTap={!sending && composerText.trim() ? { scale: 0.95 } : {}}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Sending
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send
                      </>
                    )}
                  </motion.button>
                  <IconButton title="Clear" onClick={() => setComposerText("")} variant="default">
                    <RefreshCw className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>

              {/* Enhanced quick prompts */}
              <div className="mt-4 flex flex-wrap gap-2">
                <AnimatePresence>
                  {QUICK_PROMPTS.slice(0, 6).map((q, index) => (
                    <motion.button
                      key={q}
                      onClick={() => quickSend(q)}
                      className="px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-lg transition-all duration-200"
                      title={q}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {q.length > 35 ? q.slice(0, 35) + "…" : q}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.section>

        {/* Enhanced Right: analytics & assistant settings */}
        <motion.aside 
          className={`col-span-12 lg:col-span-3 space-y-6 ${sidebarCollapsed ? "lg:col-span-3" : ""}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Enhanced analytics card */}
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Analytics
                </div>
              </div>
              <GradientBadge variant="success">Live</GradientBadge>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">Total Spending</div>
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {fmtINR(expenses ? expenses.reduce((s, e) => s + e.amount, 0) : 0)}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">This month</div>
              </div>

              {totalsByCategory.length ? (
                <div className="space-y-4">
                  <div className="h-48 bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-white/30 dark:border-gray-700/30">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={totalsByCategory} 
                          dataKey="value" 
                          nameKey="name" 
                          innerRadius={40} 
                          outerRadius={80} 
                          paddingAngle={2}
                        >
                          {totalsByCategory.map((entry, i) => (
                            <Cell key={i} fill={palette[i % palette.length]} />
                          ))}
                        </Pie>
                        <ReTooltip formatter={(v) => fmtINR(Number(v))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-32 bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-white/30 dark:border-gray-700/30">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={totalsByCategory.slice(0, 4)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ReTooltip formatter={(v) => fmtINR(Number(v))} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {totalsByCategory.slice(0, 4).map((_, i) => (
                            <Cell key={i} fill={palette[i % palette.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {expenseTrends.length > 0 && (
                    <div className="h-32 bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-white/30 dark:border-gray-700/30">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={expenseTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <ReTooltip formatter={(v) => fmtINR(Number(v))} />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke={palette[0]} 
                            strokeWidth={3}
                            dot={{ fill: palette[0], strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <PieChartIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <div className="text-sm font-medium">No expense data</div>
                  <div className="text-xs mt-1">Connect your expense tracking to see beautiful analytics</div>
                </div>
              )}
            </div>
          </GlassmorphismCard>

          {/* Enhanced assistant settings card */}
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Assistant
                </div>
              </div>
              <GradientBadge variant="info">{tone}</GradientBadge>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Conversation Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {["concise", "friendly", "formal"].map((t) => (
                    <motion.button
                      key={t}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                        tone === t 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                          : "bg-white/60 dark:bg-gray-800/60 text-slate-700 dark:text-slate-300 border border-white/30 dark:border-gray-700/30"
                      }`}
                      onClick={() => setTone(t as any)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">System Instructions</label>
                <textarea 
                  value={systemPrompt} 
                  onChange={(e) => setSystemPrompt(e.target.value)} 
                  rows={4} 
                  className="w-full p-3 rounded-xl border border-white/30 dark:border-gray-700/30 bg-white/60 dark:bg-gray-800/60 backdrop-blur text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                  placeholder="Customize how the assistant responds..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Color Palette</label>
                <div className="grid grid-cols-4 gap-3">
                  {COLOR_PALETTES.map((p, i) => (
                    <motion.button 
                      key={i} 
                      onClick={() => setPaletteIndex(i)} 
                      className={`w-full h-12 rounded-xl overflow-hidden shadow-lg transition-all duration-200 ${
                        paletteIndex === i ? "ring-3 ring-white/50 shadow-2xl" : "hover:shadow-xl"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="grid grid-cols-5 w-full h-full">
                        {p.map((c, j) => (
                          <div key={j} style={{ background: c }} className="transition-all duration-200" />
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Streaming</span>
                  </div>
                  <motion.button
                    onClick={() => setStreamEnabled(!streamEnabled)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      streamEnabled ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-slate-300 dark:bg-gray-600"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-lg"
                      animate={{ x: streamEnabled ? 26 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Animations</span>
                  </div>
                  <motion.button
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      animationsEnabled ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-slate-300 dark:bg-gray-600"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-lg"
                      animate={{ x: animationsEnabled ? 26 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Response Length ({maxTokens} tokens)
                </label>
                <input 
                  type="range" 
                  min="128" 
                  max="2048" 
                  step="128"
                  value={maxTokens} 
                  onChange={(e) => setMaxTokens(Number(e.target.value))} 
                  className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>Short</span>
                  <span>Medium</span>
                  <span>Long</span>
                </div>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Enhanced utilities card */}
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <div className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Utilities
                </div>
              </div>
              <GradientBadge variant="warning">{chats.length} chats</GradientBadge>
            </div>

            <div className="space-y-3">
              <motion.button 
                onClick={() => { 
                  if (activeChat) exportChatToText(activeChat.id); 
                  else alert("Select a chat to export") 
                }} 
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                Export Active Chat
              </motion.button>

              <motion.button 
                onClick={() => { 
                  if (activeChat) copyChatToClipboard(activeChat.id); 
                  else alert("Select a chat to copy") 
                }} 
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Copy className="w-4 h-4" />
                Copy Active Chat
              </motion.button>

              <motion.button 
                onClick={() => { 
                  navigator.clipboard.writeText(JSON.stringify(chats, null, 2))
                    .then(() => alert("All chats exported to clipboard"))
                    .catch(() => alert("Export failed")) 
                }} 
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-white/30 dark:border-gray-700/30 text-slate-800 dark:text-slate-200 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Database className="w-4 h-4" />
                Export All (JSON)
              </motion.button>

              <motion.button 
                onClick={() => { 
                  if (confirm("Reset to demo chats? This will overwrite your current chats.")) { 
                    const seeds = createSeedChats(); 
                    setChats(seeds); 
                    setActiveChatId(seeds[0].id); 
                  }
                }} 
                className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-4 h-4" />
                Reset to Demo
              </motion.button>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Quick Tips</div>
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <div>• Use Shift+Enter for multi-line messages</div>
                <div>• Pin important messages with the star icon</div>
                <div>• Try different color palettes for personalization</div>
                <div>• Export chats to save your conversations</div>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Enhanced stats card */}
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-500" />
                <div className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Session Stats
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{chats.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Total Chats</div>
              </div>
              <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {chats.reduce((sum, chat) => sum + chat.messages.length, 0)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Messages</div>
              </div>
              <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {streamEnabled ? "ON" : "OFF"}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Streaming</div>
              </div>
              <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {tone.slice(0, 3).toUpperCase()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Tone</div>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.aside>
      </main>

      {/* Enhanced floating action button */}
      <FloatingActionButton 
        onClick={() => createNewChat("Quick Chat")}
        className="lg:hidden"
      >
        <Plus className="w-6 h-6" />
      </FloatingActionButton>

      {/* Enhanced footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 py-8 text-center">
        <motion.div 
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Built with care for Personal Finance Assistant — connect your 
          </span>
          <code className="px-2 py-1 bg-slate-100 dark:bg-gray-800 rounded text-xs font-mono">
            /api/chat
          </code>
          <span className="text-sm text-slate-600 dark:text-slate-400">backend</span>
        </motion.div>
      </footer>

      {/* Enhanced settings panel overlay */}
      <AnimatePresence>
        {showSettingsPanel && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettingsPanel(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-white/30 dark:border-gray-700/30 p-6 overflow-y-auto"
              initial={{ x: 384 }}
              animate={{ x: 0 }}
              exit={{ x: 384 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Advanced Settings
                </h2>
                <IconButton onClick={() => setShowSettingsPanel(false)} variant="danger">
                  <ChevronRight className="w-5 h-5" />
                </IconButton>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Theme & Appearance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <motion.button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          darkMode ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-slate-300"
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-lg"
                          animate={{ x: darkMode ? 26 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wide Layout</span>
                      <motion.button
                        onClick={() => setUiWide(!uiWide)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          uiWide ? "bg-gradient-to-r from-green-500 to-teal-500" : "bg-slate-300"
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-lg"
                          animate={{ x: uiWide ? 26 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Privacy & Security</h3>
                  <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Data stored locally in browser</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>No data sent to external servers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>Full privacy control</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.5);
          border-radius: 2px;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

/* ============================
   Enhanced Pin Icon Component
   ============================ */

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path 
        d="M12 2v7" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M21 15L12 22 3 15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}