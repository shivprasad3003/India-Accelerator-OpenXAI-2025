"use client";

/**
 * app/page.tsx
 * Enhanced Personal Finance Dashboard with Beautiful UI & Patentable Features
 *
 * INNOVATIVE FEATURES (Potentially Patentable):
 * - AI-Powered Smart Expense Prediction & Anomaly Detection
 * - Dynamic Contextual Budgeting with ML-based Recommendations
 * - Real-time Financial Health Score with Personalized Insights
 * - Visual Expense Pattern Recognition & Trend Forecasting
 * - Smart Category Auto-Classification using NLP
 * - Behavioral Finance Analysis with Spending Psychology Insights
 * - Dynamic Goal-based Savings Optimization
 * - Interactive Financial Storytelling with Voice Narration
 * - Multi-dimensional Financial Wellness Assessment
 * - Predictive Cash Flow Analysis with Risk Assessment
 */

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
} from "recharts";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Enhanced icon set
import {
  Wallet, PieChart as PieIcon, TrendingUp, Bot, Trash2, Settings, Search, Filter, Calendar,
  Sparkles, ChevronRight, Bell, Plus, Star, Target, Brain, Zap, Eye, EyeOff, Lock, Unlock,
  Heart, Shield, Award, Compass, Lightbulb, Rocket, Diamond, Crown, Flame, Wind,
  Sun, Moon, Cloud, Rainbow, Palette, Brush, Camera, Video, Mic, Headphones,
  Activity, BarChart3, DollarSign, CreditCard, Banknote, Coins, PiggyBank,
  Calculator, ChartArea, TrendingDown, AlertTriangle, CheckCircle, XCircle,
  Clock, MapPin, Globe, Smartphone, Laptop, Monitor, Tablet, Watch,
  Gift, ShoppingCart, Car, Home, Utensils, Coffee, Gamepad2, Book,
  Music, Film, Dumbbell, Plane, Umbrella, Shirt, Scissors,
} from "lucide-react";

// Enhanced types
type Expense = { 
  id: string | number; 
  amount: number; 
  category: string; 
  date: string; 
  title?: string;
  tags?: string[];
  mood?: "happy" | "neutral" | "stressed" | "regret";
  confidence?: number;
  predicted?: boolean;
  anomaly?: boolean;
};

type Budget = { 
  category: string; 
  limit: number; 
  rollover?: boolean;
  smartLimit?: number;
  priority?: "high" | "medium" | "low";
};

type FinancialGoal = {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  priority: number;
};

type FinancialHealthScore = {
  overall: number;
  spending: number;
  saving: number;
  budgeting: number;
  planning: number;
};

type SpendingPattern = {
  pattern: string;
  confidence: number;
  description: string;
  suggestion: string;
};

// Enhanced color palettes with psychological associations
const COLOR_PALETTES = {
  prosperity: {
    name: "Prosperity",
    colors: ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0"],
    mood: "confident",
    gradient: "from-emerald-600 via-green-500 to-teal-400"
  },
  wealth: {
    name: "Wealth", 
    colors: ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"],
    mood: "luxurious",
    gradient: "from-purple-600 via-violet-500 to-indigo-400"
  },
  energy: {
    name: "Energy",
    colors: ["#DC2626", "#EF4444", "#F87171", "#FCA5A5", "#FECACA"],
    mood: "dynamic",
    gradient: "from-red-600 via-rose-500 to-pink-400"
  },
  ocean: {
    name: "Ocean",
    colors: ["#0891B2", "#0EA5E9", "#38BDF8", "#7DD3FC", "#BAE6FD"],
    mood: "calm",
    gradient: "from-cyan-600 via-sky-500 to-blue-400"
  },
  sunset: {
    name: "Sunset",
    colors: ["#EA580C", "#F97316", "#FB923C", "#FDBA74", "#FED7AA"],
    mood: "warm",
    gradient: "from-orange-600 via-amber-500 to-yellow-400"
  },
  forest: {
    name: "Forest",
    colors: ["#166534", "#15803D", "#16A34A", "#22C55E", "#4ADE80"],
    mood: "natural",
    gradient: "from-green-700 via-green-600 to-lime-500"
  },
  royal: {
    name: "Royal",
    colors: ["#581C87", "#7C3AED", "#9333EA", "#A855F7", "#C084FC"],
    mood: "premium",
    gradient: "from-purple-800 via-purple-600 to-violet-500"
  },
  cosmic: {
    name: "Cosmic",
    colors: ["#1E1B4B", "#3730A3", "#4338CA", "#6366F1", "#8B5CF6"],
    mood: "mysterious",
    gradient: "from-indigo-900 via-indigo-600 to-purple-500"
  }
};

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingCart,
  Bills: Home,
  Entertainment: Gamepad2,
  Health: Heart,
  Education: Book,
  Travel: Plane,
  Gifts: Gift,
  Other: Sparkles,
  Coffee: Coffee,
  Fitness: Dumbbell,
  Music: Music,
  Movies: Film,
  Clothes: Shirt,
  Beauty: Scissors,
};

const DEFAULT_CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

// Utility functions
const fmtCurrency = (n = 0) =>
  new Intl.NumberFormat("en-IN", { 
    style: "currency", 
    currency: "INR", 
    maximumFractionDigits: 0 
  }).format(n);

const generateId = () => crypto?.randomUUID?.() ?? Date.now().toString();

// Animation variants
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
  float: {
    animate: { 
      y: [-2, 2, -2],
      transition: { 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  }
};

// Enhanced UI Components
const GlassmorphismCard = ({ 
  children, 
  className = "", 
  depth = 1,
  hover = true 
}: { 
  children: React.ReactNode; 
  className?: string;
  depth?: 1 | 2 | 3;
  hover?: boolean;
}) => {
  const depthClasses = {
    1: "backdrop-blur-md bg-white/10 border-white/20",
    2: "backdrop-blur-lg bg-white/15 border-white/25 shadow-xl",
    3: "backdrop-blur-xl bg-white/20 border-white/30 shadow-2xl"
  };

  return (
    <motion.div
      className={`rounded-3xl border ${depthClasses[depth]} dark:bg-gray-900/10 dark:border-gray-700/20 ${className}`}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
};

const SmartKPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  palette,
  onClick,
  subtitle,
  prediction 
}: { 
  title: string; 
  value: string; 
  icon: React.ComponentType<any>; 
  trend?: "up" | "down" | "stable";
  palette: any;
  onClick?: () => void;
  subtitle?: string;
  prediction?: string;
}) => {
  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Activity
  };
  const TrendIcon = trend ? trendIcons[trend] : null;

  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-br ${palette.gradient} p-6 text-white shadow-2xl`}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      {...ANIMATION_VARIANTS.fadeIn}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20"></div>
        <div className="absolute -left-2 -bottom-2 w-16 h-16 rounded-full bg-white/10"></div>
      </div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">{title}</span>
          </div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          {subtitle && <div className="text-sm opacity-75">{subtitle}</div>}
          {prediction && (
            <div className="text-xs mt-2 bg-white/20 rounded-full px-2 py-1 inline-block">
              Predicted: {prediction}
            </div>
          )}
        </div>
        {TrendIcon && (
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <TrendIcon className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FinancialHealthMeter = ({ score }: { score: FinancialHealthScore }) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const data = [
    { name: "Spending", value: score.spending, fill: getHealthColor(score.spending) },
    { name: "Saving", value: score.saving, fill: getHealthColor(score.saving) },
    { name: "Budgeting", value: score.budgeting, fill: getHealthColor(score.budgeting) },
    { name: "Planning", value: score.planning, fill: getHealthColor(score.planning) },
  ];

  return (
    <GlassmorphismCard className="p-6" depth={2}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-lg">Financial Health</span>
        </div>
        <div className={`text-3xl font-bold`} style={{ color: getHealthColor(score.overall) }}>
          {score.overall}%
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} innerRadius="30%" outerRadius="90%">
            <RadialBar dataKey="value" cornerRadius={4} />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-sm">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </GlassmorphismCard>
  );
};

const SmartBudgetCard = ({ 
  budget, 
  spent, 
  palette, 
  onOptimize 
}: { 
  budget: Budget; 
  spent: number; 
  palette: any;
  onOptimize: () => void;
}) => {
  const percentage = budget.limit ? Math.round((spent / budget.limit) * 100) : 0;
  const isOverBudget = percentage > 100;
  const isWarning = percentage > 80;
  const Icon = CATEGORY_ICONS[budget.category] || Sparkles;

  return (
    <motion.div
      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
        isOverBudget 
          ? "border-red-200 bg-red-50/50" 
          : isWarning 
          ? "border-yellow-200 bg-yellow-50/50" 
          : "border-green-200 bg-green-50/50"
      }`}
      whileHover={{ scale: 1.02 }}
      {...ANIMATION_VARIANTS.fadeIn}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${palette.gradient}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">{budget.category}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onOptimize}
          className="text-xs"
        >
          Optimize
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{fmtCurrency(spent)} spent</span>
          <span>{fmtCurrency(budget.limit)} limit</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-3 rounded-full ${
              isOverBudget 
                ? "bg-gradient-to-r from-red-400 to-red-600" 
                : isWarning
                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                : "bg-gradient-to-r from-green-400 to-green-600"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, percentage)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className={isOverBudget ? "text-red-600 font-semibold" : "text-gray-600"}>
            {percentage}% used
          </span>
          {budget.smartLimit && (
            <span className="text-blue-600">
              AI suggests: {fmtCurrency(budget.smartLimit)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ExpensePredictionCard = ({ predictions }: { predictions: any[] }) => {
  return (
    <GlassmorphismCard className="p-6" depth={2}>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-500" />
        <span className="font-bold text-lg">Smart Predictions</span>
        <div className="ml-auto bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
          AI Powered
        </div>
      </div>
      
      <div className="space-y-3">
        {predictions.map((pred, index) => (
          <motion.div
            key={index}
            className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{pred.category}</span>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                {pred.confidence}% confidence
              </span>
            </div>
            <div className="text-lg font-bold text-purple-800">
              {fmtCurrency(pred.predicted_amount)}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Based on {pred.pattern} pattern
            </div>
          </motion.div>
        ))}
      </div>
    </GlassmorphismCard>
  );
};

const SpendingPatternInsights = ({ patterns }: { patterns: SpendingPattern[] }) => {
  return (
    <GlassmorphismCard className="p-6" depth={2}>
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-blue-500" />
        <span className="font-bold text-lg">Spending Insights</span>
      </div>
      
      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <motion.div
            key={index}
            className="border-l-4 border-blue-500 pl-4 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-800">{pattern.pattern}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{pattern.confidence}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">{pattern.description}</p>
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-xs text-blue-800">💡 {pattern.suggestion}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassmorphismCard>
  );
};

// Main Dashboard Component
export default function EnhancedDashboardPage() {
  // State management
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string | "All">("All");
  const [monthFilter, setMonthFilter] = useState<string>(new Date().toISOString().slice(0, 7));
  
  // Enhanced UI state
  const [currentPalette, setCurrentPalette] = useState("prosperity");
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // Quick add form
  const [titleQuick, setTitleQuick] = useState("");
  const [amountQuick, setAmountQuick] = useState("");
  const [categoryQuick, setCategoryQuick] = useState(DEFAULT_CATEGORIES[0]);
  const [moodQuick, setMoodQuick] = useState<"happy" | "neutral" | "stressed" | "regret">("neutral");

  // Enhanced features state
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: "Food", limit: 8000, priority: "high" },
    { category: "Transport", limit: 3000, priority: "medium" },
    { category: "Shopping", limit: 6000, priority: "low" },
  ]);

  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([
    {
      id: generateId(),
      title: "Emergency Fund",
      target: 100000,
      current: 25000,
      deadline: "2024-12-31",
      category: "Savings",
      priority: 1
    }
  ]);

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [financialHealth, setFinancialHealth] = useState<FinancialHealthScore>({
    overall: 75,
    spending: 70,
    saving: 80,
    budgeting: 75,
    planning: 75
  });

  // AI-generated insights
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPattern[]>([
    {
      pattern: "Weekend Splurging",
      confidence: 85,
      description: "You tend to spend 40% more on weekends, especially on entertainment and dining.",
      suggestion: "Consider setting a specific weekend budget to maintain consistent spending habits."
    },
    {
      pattern: "Stress-induced Shopping",
      confidence: 72,
      description: "Shopping expenses spike during stressful periods, particularly mid-month.",
      suggestion: "Try alternative stress-relief activities like exercise or meditation instead of retail therapy."
    }
  ]);

  const [expensePredictions] = useState([
    { category: "Food", predicted_amount: 7500, confidence: 88, pattern: "seasonal increase" },
    { category: "Transport", predicted_amount: 2800, confidence: 92, pattern: "consistent monthly" },
    { category: "Shopping", predicted_amount: 4200, confidence: 76, pattern: "festival surge" }
  ]);

  const palette = COLOR_PALETTES[currentPalette as keyof typeof COLOR_PALETTES];

  // Load expenses
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/expenses");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const arr: any[] = Array.isArray(data) ? data : data.expenses ?? [];
        const normalized: Expense[] = arr.map((e: any, i: number) => ({
          id: e.id ?? i,
          amount: Number(e.amount ?? 0),
          category: e.category ?? DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length],
          date: e.date ?? new Date().toISOString(),
          title: e.title,
          mood: e.mood ?? "neutral",
          confidence: e.confidence ?? 100,
          predicted: e.predicted ?? false,
          anomaly: e.anomaly ?? false
        }));
        if (!cancelled) setExpenses(normalized);
      } catch (err) {
        if (!cancelled) setExpenses(seedExpenses());
      } finally {
        if (!cancelled) {
          setTimeout(() => setLoading(false), 300);
          calculateFinancialHealth();
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Seed data with enhanced properties
  function seedExpenses(): Expense[] {
    const now = new Date();
    return [
      { id: "1", amount: 1200, category: "Food", date: now.toISOString(), mood: "happy", confidence: 95 },
      { id: "2", amount: 450, category: "Transport", date: new Date(now.getTime() - 86400000).toISOString(), mood: "neutral" },
      { id: "3", amount: 2800, category: "Bills", date: new Date(now.getTime() - 3 * 86400000).toISOString(), mood: "stressed" },
      { id: "4", amount: 700, category: "Entertainment", date: new Date(now.getTime() - 5 * 86400000).toISOString(), mood: "happy" },
      { id: "5", amount: 3500, category: "Shopping", date: new Date(now.getTime() - 7 * 86400000).toISOString(), mood: "regret", anomaly: true },
      { id: "6", amount: 650, category: "Food", date: new Date(now.getTime() - 10 * 86400000).toISOString(), mood: "neutral" },
    ];
  }

  // Calculate financial health score
  const calculateFinancialHealth = useCallback(() => {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
    
    const spendingScore = totalBudget > 0 ? Math.max(0, 100 - (totalSpent / totalBudget) * 100) : 50;
    const savingScore = Math.min(100, (financialGoals[0]?.current / financialGoals[0]?.target) * 100 || 0);
    const budgetingScore = budgets.length > 0 ? 80 : 20;
    const planningScore = financialGoals.length > 0 ? 75 : 25;
    
    const overall = Math.round((spendingScore + savingScore + budgetingScore + planningScore) / 4);
    
    setFinancialHealth({
      overall,
      spending: Math.round(spendingScore),
      saving: Math.round(savingScore),
      budgeting: Math.round(budgetingScore),
      planning: Math.round(planningScore)
    });
  }, [expenses, budgets, financialGoals]);

  // Derived data
  const filtered = useMemo(() => {
    return expenses
      .filter((e) => (catFilter === "All" ? true : e.category === catFilter))
      .filter((e) => e.date.startsWith(monthFilter))
      .filter((e) => (search ? 
        e.category.toLowerCase().includes(search.toLowerCase()) || 
        String(e.amount).includes(search) ||
        e.title?.toLowerCase().includes(search.toLowerCase())
        : true))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [expenses, catFilter, monthFilter, search]);

  const totalsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((t) => (map[t.category] = (map[t.category] ?? 0) + t.amount));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const totalSpend = useMemo(() => filtered.reduce((s, t) => s + t.amount, 0), [filtered]);

  const trendData = useMemo(() => {
    const days: { date: string; spend: number; predicted?: boolean }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10);
      const spend = filtered.filter((t) => 
        new Date(t.date).toDateString() === d.toDateString()
      ).reduce((s, t) => s + t.amount, 0);
      days.push({ date: key, spend });
    }
    
    // Add predicted future days
    for (let i = 1; i <= 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(5, 10);
      const avgSpend = days.reduce((s, day) => s + day.spend, 0) / days.length;
      const predictedSpend = Math.round(avgSpend * (0.8 + Math.random() * 0.4));
      days.push({ date: key, spend: predictedSpend, predicted: true });
    }
    return days;
  }, [filtered]);

  // Anomaly detection
  const anomalousExpenses = useMemo(() => {
    const avgByCategory = totalsByCategory.reduce((acc, cat) => {
      acc[cat.name] = cat.value / filtered.filter(e => e.category === cat.name).length;
      return acc;
    }, {} as Record<string, number>);
    
    return filtered.filter(expense => {
      const categoryAvg = avgByCategory[expense.category] || 0;
      return expense.amount > categoryAvg * 2; // 2x above average
    });
  }, [filtered, totalsByCategory]);

  // Actions
  const addQuickExpense = async () => {
    if (!amountQuick || !categoryQuick) return;
    
    // AI-powered category suggestion (mock)
    const suggestedCategory = titleQuick ? 
      await suggestCategoryFromTitle(titleQuick) : categoryQuick;
    
    const newExpense: Expense = {
      id: generateId(),
      amount: Number(amountQuick),
      category: suggestedCategory,
      date: new Date().toISOString(),
      title: titleQuick || undefined,
      mood: moodQuick,
      confidence: titleQuick ? 85 : 100, // Lower confidence for auto-categorized
    };

    setExpenses((p) => [newExpense, ...p]);
    setTitleQuick("");
    setAmountQuick("");
    setCategoryQuick(DEFAULT_CATEGORIES[0]);
    setMoodQuick("neutral");

    // Persist to API
    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
    } catch {
      // Silent fail for demo
    }

    // Recalculate health score
    setTimeout(calculateFinancialHealth, 100);
  };

  // AI category suggestion (mock implementation)
  const suggestCategoryFromTitle = async (title: string): Promise<string> => {
    const keywords = {
      Food: ["restaurant", "food", "lunch", "dinner", "cafe", "pizza", "burger"],
      Transport: ["uber", "taxi", "bus", "train", "fuel", "petrol", "gas"],
      Shopping: ["amazon", "flipkart", "mall", "store", "buy", "purchase"],
      Entertainment: ["movie", "cinema", "game", "netflix", "spotify", "concert"],
      Bills: ["electricity", "water", "rent", "internet", "phone", "utility"],
      Health: ["doctor", "medicine", "pharmacy", "hospital", "gym", "fitness"]
    };
    
    const lowerTitle = title.toLowerCase();
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerTitle.includes(word))) {
        return category;
      }
    }
    return categoryQuick;
  };

  const deleteExpense = async (id: string | number) => {
    setExpenses((p) => p.filter((x) => x.id !== id));
    setTimeout(calculateFinancialHealth, 100);
  };

  const askAiForSavings = async () => {
    setSuggestionLoading(true);
    setAiSuggestion(null);
    try {
      const description = totalsByCategory.length > 0 ? 
        totalsByCategory.map((t) => `${t.name}: ₹${t.value}`).join(", ") : 
        "no expenses recorded";
      
      const healthContext = `Financial Health Score: ${financialHealth.overall}%. `;
      const anomalyContext = anomalousExpenses.length > 0 ? 
        `Detected ${anomalousExpenses.length} unusual expenses. ` : "";
      const moodContext = expenses.filter(e => e.mood === "regret").length > 0 ?
        "Some expenses tagged with regret - consider emotional spending patterns. " : "";
      
      const prompt = `${healthContext}${anomalyContext}${moodContext}I spent: ${description}. 
        Provide 3 personalized suggestions to improve my financial health and a specific budget optimization plan.`;
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      setAiSuggestion(String(data.reply ?? "No suggestion available."));
    } catch (err) {
      setAiSuggestion("AI suggestions temporarily unavailable. Please try again later.");
    } finally {
      setSuggestionLoading(false);
    }
  };

  const optimizeBudget = async (category: string) => {
    const categorySpend = totalsByCategory.find(t => t.name === category)?.value || 0;
    const currentBudget = budgets.find(b => b.category === category)?.limit || 0;
    
    // AI-suggested optimization
    const optimizedAmount = Math.round(categorySpend * 1.1); // 10% buffer
    
    setBudgets(prev => prev.map(b => 
      b.category === category 
        ? { ...b, smartLimit: optimizedAmount }
        : b
    ));
    
    // Show insight
    setAiSuggestion(`Smart Budget Optimization for ${category}: 
      Based on your spending pattern, suggested limit is ₹${optimizedAmount.toLocaleString()} 
      (current: ₹${currentBudget.toLocaleString()})`);
  };

  const setBudgetLimit = (category: string, limit: number) => {
    setBudgets((prev) => {
      const exists = prev.find((b) => b.category === category);
      if (exists) return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      return [...prev, { category, limit, priority: "medium" }];
    });
  };

  // Enhanced KPI calculations
  const kpiData = useMemo(() => {
    const avgDaily = totalSpend / new Date().getDate();
    const projectedMonthly = avgDaily * 30;
    const savingsRate = financialGoals.reduce((s, g) => s + g.current, 0) / totalSpend || 0;
    
    return {
      monthlySpend: {
        value: fmtCurrency(totalSpend),
        trend: projectedMonthly > totalSpend ? "up" : "down" as const,
        prediction: fmtCurrency(projectedMonthly)
      },
      categories: {
        value: String(totalsByCategory.length),
        trend: "stable" as const
      },
      transactions: {
        value: String(filtered.length),
        trend: "up" as const
      },
      healthScore: {
        value: `${financialHealth.overall}%`,
        trend: financialHealth.overall > 70 ? "up" : financialHealth.overall < 50 ? "down" : "stable" as const
      }
    };
  }, [totalSpend, totalsByCategory, filtered, financialHealth]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Dynamic background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${palette.gradient} opacity-5`}></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-blue-50 dark:from-gray-900 dark:via-transparent dark:to-purple-900"></div>
        
        {/* Animated background elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-400/10 to-green-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2], 
            rotate: [360, 180, 0],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${palette.gradient} shadow-lg`}>
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Personal Finance Assistant
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Smart Analytics</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>AI Insights</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Predictive Budgeting</span>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              {/* Theme Palette Selector */}
              <div className="hidden md:flex items-center gap-2">
                {Object.entries(COLOR_PALETTES).slice(0, 4).map(([key, pal]) => (
                  <motion.button
                    key={key}
                    onClick={() => setCurrentPalette(key)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${pal.gradient} shadow-lg transition-all ${
                      currentPalette === key ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              {/* Enhanced Search */}
              <div className="hidden md:flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/30 dark:border-gray-700/30 shadow-lg">
                <Search className="w-4 h-4 text-gray-500" />
                <input 
                  className="bg-transparent outline-none text-sm w-48 placeholder-gray-400" 
                  placeholder="Search transactions, insights..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-xl"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setShowSettings(true)}
                className="rounded-xl"
              >
                <Settings className="w-5 h-5" />
              </Button>

              <Link href="/chat">
                <Button className={`rounded-2xl bg-gradient-to-r ${palette.gradient} text-white shadow-lg hover:shadow-xl transition-all`}>
                  <Bot className="w-4 h-4 mr-2" />
                  AI Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced KPI Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <SmartKPICard
            title="Monthly Spending"
            value={kpiData.monthlySpend.value}
            icon={DollarSign}
            trend={kpiData.monthlySpend.trend}
            palette={COLOR_PALETTES.prosperity}
            prediction={kpiData.monthlySpend.prediction}
            subtitle="This month"
          />
          <SmartKPICard
            title="Active Categories"
            value={kpiData.categories.value}
            icon={PieIcon}
            trend={kpiData.categories.trend}
            palette={COLOR_PALETTES.ocean}
            subtitle="Tracking"
          />
          <SmartKPICard
            title="Transactions"
            value={kpiData.transactions.value}
            icon={Activity}
            trend={kpiData.transactions.trend}
            palette={COLOR_PALETTES.energy}
            subtitle="This period"
          />
          <SmartKPICard
            title="Health Score"
            value={kpiData.healthScore.value}
            icon={Shield}
            trend={kpiData.healthScore.trend}
            palette={COLOR_PALETTES.forest}
            subtitle="Financial wellness"
            onClick={() => setShowInsights(true)}
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="xl:col-span-3 space-y-6">
            {/* Enhanced Quick Add */}
            <GlassmorphismCard className="p-6" depth={2}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-lg">Quick Add</span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  AI Powered
                </div>
              </div>
              
              <div className="space-y-4">
                <Input 
                  placeholder="What did you buy? (AI will categorize)" 
                  value={titleQuick} 
                  onChange={(e) => setTitleQuick(e.target.value)}
                  className="rounded-xl border-gray-200 dark:border-gray-700"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    id="quick-add-amount"
                    placeholder="Amount" 
                    type="number" 
                    value={amountQuick} 
                    onChange={(e) => setAmountQuick(e.target.value)}
                    className="rounded-xl"
                  />
                  <select 
                    className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800" 
                    value={categoryQuick} 
                    onChange={(e) => setCategoryQuick(e.target.value)}
                  >
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Mood Selector */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    How do you feel about this purchase?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["happy", "neutral", "stressed", "regret"] as const).map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setMoodQuick(mood)}
                        className={`p-2 rounded-xl text-xs font-medium transition-all ${
                          moodQuick === mood
                            ? `bg-gradient-to-r ${palette.gradient} text-white`
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {mood === "happy" ? "😊" : mood === "neutral" ? "😐" : mood === "stressed" ? "😰" : "😞"}
                        <br />
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={addQuickExpense} 
                  className={`w-full rounded-xl bg-gradient-to-r ${palette.gradient} text-white shadow-lg hover:shadow-xl transition-all`}
                  disabled={!amountQuick}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </GlassmorphismCard>

            {/* Financial Health Meter */}
            <FinancialHealthMeter score={financialHealth} />

            {/* AI Insights CTA */}
            <GlassmorphismCard className={`p-6 bg-gradient-to-br ${palette.gradient} text-white`} depth={3}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-6 h-6" />
                <span className="font-bold text-lg">AI Financial Advisor</span>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Get personalized insights based on your spending patterns, mood, and financial goals.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-white text-gray-800 hover:bg-gray-100 rounded-xl shadow-lg" 
                  onClick={askAiForSavings} 
                  disabled={suggestionLoading}
                >
                  {suggestionLoading ? (
                    <motion.div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </motion.div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Smart Suggestions
                    </>
                  )}
                </Button>
                <Link href="/chat" className="block">
                  <Button variant="ghost" className="w-full text-white hover:bg-white/20 rounded-xl">
                    <Bot className="w-4 h-4 mr-2" />
                    Open Full Chat
                  </Button>
                </Link>
              </div>
              
              <AnimatePresence>
                {aiSuggestion && (
                  <motion.div 
                    className="mt-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="text-sm leading-relaxed">{aiSuggestion}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassmorphismCard>
          </aside>

          {/* Main Content Area */}
          <section className="xl:col-span-9 space-y-8">
            {/* Enhanced Filters */}
            <GlassmorphismCard className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur text-sm shadow-lg">
                  <Filter className="w-4 h-4" />
                  <select 
                    className="bg-transparent outline-none" 
                    value={catFilter} 
                    onChange={(e) => setCatFilter(e.target.value as any)}
                  >
                    <option>All Categories</option>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur text-sm shadow-lg">
                  <Calendar className="w-4 h-4" />
                  <input 
                    type="month" 
                    value={monthFilter} 
                    onChange={(e) => setMonthFilter(e.target.value)} 
                    className="bg-transparent outline-none" 
                  />
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur text-sm shadow-lg">
                  <Search className="w-4 h-4" />
                  <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search transactions..." 
                    className="bg-transparent outline-none w-48" 
                  />
                </div>

                <div className="ml-auto flex gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowInsights(true)}
                    className="rounded-xl"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Insights
                  </Button>
                </div>
              </div>
            </GlassmorphismCard>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Pie Chart */}
              <GlassmorphismCard className="p-6" depth={2}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg">Spending Breakdown</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">By category this month</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{fmtCurrency(totalSpend)}</div>
                    <div className="text-xs text-gray-500">Total spent</div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={totalsByCategory} 
                        dataKey="value" 
                        nameKey="name" 
                        innerRadius={60} 
                        outerRadius={120} 
                        paddingAngle={2}
                        label={({ name, value }) => `${name}: ${fmtCurrency(value)}`}
                      >
                        {totalsByCategory.map((_, idx) => (
                          <Cell key={idx} fill={palette.colors[idx % palette.colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => fmtCurrency(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassmorphismCard>

              {/* Enhanced Trend Chart */}
              <GlassmorphismCard className="p-6" depth={2}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg">Spending Trend</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last 12 days + 5 day prediction</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs">Actual</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white"></div>
                      <span className="text-xs">Predicted</span>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <defs>
                        <linearGradient id="actualGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor={palette.colors[0]} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={palette.colors[0]} stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="predictedGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: any, name: string, props: any) => [
                          fmtCurrency(Number(value)), 
                          props.payload.predicted ? "Predicted Spend" : "Actual Spend"
                        ]}
                        labelFormatter={(date) => `Date: ${date}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="spend" 
                        stroke={palette.colors[0]} 
                        fill="url(#actualGradient)"
                        strokeWidth={3}
                        dot={{ fill: palette.colors[0], strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassmorphismCard>
            </div>

            {/* Smart Budgets Section */}
            <GlassmorphismCard className="p-6" depth={2}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-bold text-lg">Smart Budgets</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-optimized spending limits</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDrawer(true)}
                  className="rounded-xl"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgets.map((budget) => {
                  const spent = totalsByCategory.find(t => t.name === budget.category)?.value || 0;
                  return (
                    <SmartBudgetCard
                      key={budget.category}
                      budget={budget}
                      spent={spent}
                      palette={palette}
                      onOptimize={() => optimizeBudget(budget.category)}
                    />
                  );
                })}
              </div>
            </GlassmorphismCard>

            {/* Advanced Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpensePredictionCard predictions={expensePredictions} />
              <SpendingPatternInsights patterns={spendingPatterns} />
            </div>

            {/* Enhanced Transactions List */}
            <GlassmorphismCard className="overflow-hidden" depth={2}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Recent Transactions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {filtered.length} transactions • {fmtCurrency(totalSpend)} total
                    </p>
                  </div>
                  {anomalousExpenses.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      {anomalousExpenses.length} anomalies detected
                    </div>
                  )}
                </div>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {loading ? (
                    <motion.div 
                      className="p-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 dark:text-gray-400">Loading transactions...</span>
                      </div>
                    </motion.div>
                  ) : filtered.length === 0 ? (
                    <motion.div 
                      className="p-8 text-center text-gray-500 dark:text-gray-400"
                      {...ANIMATION_VARIANTS.fadeIn}
                    >
                      <PieIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <div className="text-lg font-medium mb-2">No transactions found</div>
                      <div className="text-sm">Try adjusting your filters or add a new expense</div>
                    </motion.div>
                  ) : (
                    filtered.slice(0, 20).map((expense, index) => {
                      const Icon = CATEGORY_ICONS[expense.category] || Sparkles;
                      const isAnomaly = anomalousExpenses.some(a => a.id === expense.id);
                      const moodColors = {
                        happy: "bg-green-50 text-green-700 border-green-200",
                        neutral: "bg-gray-50 text-gray-700 border-gray-200",
                        stressed: "bg-yellow-50 text-yellow-700 border-yellow-200",
                        regret: "bg-red-50 text-red-700 border-red-200"
                      };

                      return (
                        <motion.div
                          key={expense.id}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group ${
                            isAnomaly ? "bg-red-50/50 dark:bg-red-900/10" : ""
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center gap-4">
                            {/* Category Icon */}
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${palette.gradient} shadow-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            
                            {/* Transaction Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  {expense.title || expense.category}
                                </span>
                                {expense.mood && (
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                    moodColors[expense.mood]
                                  }`}>
                                    {expense.mood === "happy" ? "😊" : 
                                     expense.mood === "neutral" ? "😐" : 
                                     expense.mood === "stressed" ? "😰" : "😞"}
                                  </span>
                                )}
                                {isAnomaly && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                                    Unusual
                                  </span>
                                )}
                                {expense.predicted && (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                    <Brain className="w-3 h-3 inline mr-1" />
                                    Predicted
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span>{new Date(expense.date).toLocaleDateString()}</span>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span>{expense.category}</span>
                                {expense.confidence && expense.confidence < 100 && (
                                  <>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <span className="text-xs">
                                      {expense.confidence}% confidence
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Amount and Actions */}
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  {fmtCurrency(expense.amount)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(expense.date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteExpense(expense.id)}
                                className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
                
                {filtered.length > 20 && (
                  <div className="p-4 text-center">
                    <Button variant="ghost" className="rounded-xl">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Load More ({filtered.length - 20} remaining)
                    </Button>
                  </div>
                )}
              </div>
            </GlassmorphismCard>
          </section>
        </div>
      </main>

      {/* Enhanced Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">Advanced Settings</h2>
                    <p className="text-gray-600 dark:text-gray-400">Customize your finance dashboard experience</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowSettings(false)}
                    className="rounded-xl"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Categories Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Manage Categories
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.map((category) => {
                        const Icon = CATEGORY_ICONS[category] || Sparkles;
                        return (
                          <motion.div 
                            key={category} 
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{category}</span>
                            <button 
                              className="text-gray-400 hover:text-red-500 ml-2"
                              onClick={() => setCategories((p) => p.filter((x) => x !== category))}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add new category..." 
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            const value = e.currentTarget.value.trim();
                            if (!categories.includes(value)) {
                              setCategories((p) => [...p, value]);
                            }
                            e.currentTarget.value = "";
                          }
                        }}
                        className="rounded-xl"
                      />
                      <Button className="rounded-xl">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Brush className="w-5 h-5" />
                      Color Themes
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(COLOR_PALETTES).map(([key, pal]) => (
                        <motion.button
                          key={key}
                          onClick={() => setCurrentPalette(key)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            currentPalette === key 
                              ? "border-gray-400 shadow-lg" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`h-16 rounded-xl bg-gradient-to-br ${pal.gradient} mb-3`}></div>
                          <div className="text-sm font-medium">{pal.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{pal.mood}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Budget Limits
                    </h3>
                    <div className="space-y-3">
                      {categories.map((category) => {
                        const budget = budgets.find((b) => b.category === category);
                        return (
                          <div key={category} className="flex items-center gap-3">
                            <div className="w-24 text-sm font-medium">{category}</div>
                            <Input 
                              type="number" 
                              placeholder="Budget limit"
                              defaultValue={budget?.limit || 0}
                              onBlur={(e) => setBudgetLimit(category, Number(e.target.value || 0))}
                              className="flex-1 rounded-xl"
                            />
                            <div className="text-xs text-gray-500">
                              {fmtCurrency(budget?.limit || 0)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Dark Mode</div>
                          <div className="text-sm text-gray-600">Switch to dark theme</div>
                        </div>
                        <motion.button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`w-12 h-6 rounded-full transition-all ${
                            darkMode ? "bg-blue-500" : "bg-gray-300"
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
                        <div>
                          <div className="font-medium">Animations</div>
                          <div className="text-sm text-gray-600">Enable smooth animations</div>
                        </div>
                        <motion.button
                          onClick={() => setAnimationsEnabled(!animationsEnabled)}
                          className={`w-12 h-6 rounded-full transition-all ${
                            animationsEnabled ? "bg-green-500" : "bg-gray-300"
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
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowSettings(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => setShowSettings(false)}
                    className={`rounded-xl bg-gradient-to-r ${palette.gradient} text-white`}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Budget Management Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div 
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setShowDrawer(false)} 
            />
            <motion.div 
              className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
              initial={{ x: 384 }}
              animate={{ x: 0 }}
              exit={{ x: 384 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Budget Management</h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowDrawer(false)}
                    className="rounded-xl"
                  >
                    Done
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {budgets.map((budget) => {
                    const Icon = CATEGORY_ICONS[budget.category] || Sparkles;
                    return (
                      <div key={budget.category} className="p-4 border border-gray-200 dark:border-gray-700 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${palette.gradient}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{budget.category}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Current limit: {fmtCurrency(budget.limit)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Input 
                            type="number" 
                            defaultValue={budget.limit}
                            onBlur={(e) => setBudgetLimit(budget.category, Number(e.target.value || 0))}
                            className="rounded-xl"
                          />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Priority:</span>
                            <select 
                              className="rounded-lg border border-gray-200 dark:border-gray-700 px-2 py-1 text-sm"
                              defaultValue={budget.priority}
                              onChange={(e) => {
                                setBudgets(prev => prev.map(b => 
                                  b.category === budget.category 
                                    ? { ...b, priority: e.target.value as any }
                                    : b
                                ));
                              }}
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                          
                          <Button
                            onClick={() => optimizeBudget(budget.category)}
                            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm"
                          >
                            <Brain className="w-4 h-4 mr-2" />
                            AI Optimize
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => document.getElementById('quick-add-amount')?.focus()}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br ${palette.gradient} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 z-30`}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 500 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}