"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Home() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const addExpense = () => {
    if (!amount || !category) return;
    const newExpense = {
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString(),
    };
    setExpenses([...expenses, newExpense]);
    setAmount("");
    setCategory("");
  };

  // Group expenses by category
  const categoryData = expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const pieData = Object.keys(categoryData).map((key) => ({
    name: key,
    value: categoryData[key],
  }));

  // 🔹 Chatbot API call
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    setChatResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: chatInput }),
      });

      const data = await res.json();

      if (data.reply) {
        setChatResponse(data.reply);
      } else {
        setChatResponse("⚠️ No reply from AI");
      }
    } catch (err) {
      console.error(err);
      setChatResponse("❌ Error: Could not reach chatbot API");
    }

    setLoading(false);
    setChatInput("");
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        💸 Personal Finance Assistant
      </h1>

      {/* Expense Input + Chatbot */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Expense Input */}
        <Card className="p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">➕ Add Expense</h2>
          <div className="flex flex-col gap-3">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter category (Food, Transport...)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Button onClick={addExpense}>Add Expense</Button>
          </div>
        </Card>

        {/* AI Chatbot */}
        <Card className="p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">🤖 Finance Chatbot</h2>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask me anything about your spending..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChat()}
            />
            <Button onClick={handleChat} disabled={loading}>
              {loading ? "Thinking..." : "Ask"}
            </Button>
          </div>
          {chatResponse && (
            <p className="mt-3 p-2 bg-gray-100 rounded-lg">{chatResponse}</p>
          )}
        </Card>
      </motion.div>

      {/* Expense History + Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Expense History */}
        <Card className="p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">📜 Expense History</h2>
          <ul className="space-y-2">
            {expenses.map((exp, index) => (
              <li key={index} className="flex justify-between border-b pb-1">
                <span>
                  {exp.date} - {exp.category}
                </span>
                <span>₹{exp.amount}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Charts */}
        <Card className="p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">📊 Spending Breakdown</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Pie Chart */}
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            {/* Bar Chart */}
            <BarChart width={250} height={200} data={pieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </div>
        </Card>
      </div>
    </main>
  );
}
