/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calculator, 
  Info, 
  ChevronRight, 
  Apple, 
  Wheat, 
  Milk, 
  LeafyGreen, 
  ArrowLeft,
  Sparkles,
  RefreshCcw,
  BarChart3,
  List as ListIcon,
  PieChart as PieChartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { cn } from './lib/utils';
import { CARB_EXCHANGE_DATA, FoodCategory, FoodItem } from './constants';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'charts'>('list');
  const [activeChart, setActiveChart] = useState<'distribution' | 'comparison'>('distribution');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [calculatorInput, setCalculatorInput] = useState({ value: '', type: 'carbs' as 'carbs' | 'exchanges' });
  const [aiFact, setAiFact] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Chart Data
  const chartData = useMemo(() => {
    return CARB_EXCHANGE_DATA.map(cat => ({
      name: cat.name,
      value: cat.items.length,
      avgCarbs: cat.items.reduce((acc, item) => acc + item.carbs, 0) / cat.items.length,
      color: cat.id === 'starches' ? '#10b981' : cat.id === 'fruits' ? '#f59e0b' : cat.id === 'milk' ? '#3b82f6' : '#8b5cf6'
    }));
  }, []);

  // Calculate total items and items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    CARB_EXCHANGE_DATA.forEach(cat => {
      counts[cat.id] = cat.items.length;
      total += cat.items.length;
    });
    return { ...counts, all: total };
  }, []);

  const icons: Record<string, React.ReactNode> = {
    Wheat: <Wheat className="w-6 h-6" />,
    Apple: <Apple className="w-6 h-6" />,
    Milk: <Milk className="w-6 h-6" />,
    LeafyGreen: <LeafyGreen className="w-6 h-6" />,
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const allItems: (FoodItem & { category: string; categoryId: string })[] = [];
    
    CARB_EXCHANGE_DATA.forEach(cat => {
      cat.items.forEach(item => {
        if (!query || item.name.toLowerCase().includes(query)) {
          if (!selectedCategory || selectedCategory.id === cat.id) {
            allItems.push({ ...item, category: cat.name, categoryId: cat.id });
          }
        }
      });
    });
    return allItems;
  }, [searchQuery, selectedCategory]);

  const calculateResult = () => {
    const val = parseFloat(calculatorInput.value);
    if (isNaN(val)) return null;
    if (calculatorInput.type === 'carbs') {
      return { result: (val / 15).toFixed(1), unit: 'Pertukaran' };
    } else {
      return { result: (val * 15).toFixed(0), unit: 'Gram Karbohidrat' };
    }
  };

  const fetchAiFact = async () => {
    setIsAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Berikan saya satu fakta menarik dan praktikal tentang pengiraan karbohidrat atau senarai pertukaran diabetik dalam Bahasa Melayu. Pastikan ia ringkas dan membantu.",
      });
      setAiFact(response.text || "Tidak dapat mengambil fakta buat masa ini.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiFact("Fokus pada karbohidrat kompleks untuk tahap gula darah yang lebih stabil.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const calculation = calculateResult();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg text-white">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CarbExchange</h1>
          </div>
          <button 
            onClick={fetchAiFact}
            disabled={isAiLoading}
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Sparkles className={cn("w-4 h-4", isAiLoading && "animate-pulse")} />
            {isAiLoading ? "Berfikir..." : "Tip Harian"}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex">
          <button 
            onClick={() => setActiveTab('list')}
            className={cn(
              "px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all",
              activeTab === 'list' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <ListIcon className="w-4 h-4" />
            Senarai Makanan
          </button>
          <button 
            onClick={() => setActiveTab('charts')}
            className={cn(
              "px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all",
              activeTab === 'charts' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Analisis Carta
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Top Disclaimer */}
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-bold">Penafian Penting</p>
              <p>Data ini adalah untuk tujuan pendidikan sahaja. Sila rujuk profesional penjagaan kesihatan untuk nasihat perubatan peribadi.</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {aiFact && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-emerald-800 font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Tahukah anda?
              </h3>
              <div className="text-emerald-700 prose prose-sm max-w-none">
                <ReactMarkdown>{aiFact}</ReactMarkdown>
              </div>
              <button 
                onClick={() => setAiFact(null)}
                className="mt-4 text-xs font-bold text-emerald-600 uppercase tracking-wider hover:underline"
              >
                Tutup
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Content */}
          <div className="md:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'list' ? (
                <motion.div 
                  key="list-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Cari makanan (cth: epal, nasi)..."
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Category Filter Bar */}
                    <div className="flex flex-wrap gap-2 pb-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-2",
                          !selectedCategory 
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-md" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
                        )}
                      >
                        Semua
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                          !selectedCategory ? "bg-emerald-400 text-white" : "bg-slate-100 text-slate-500"
                        )}>
                          {categoryCounts.all}
                        </span>
                      </button>
                      {CARB_EXCHANGE_DATA.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-2",
                            selectedCategory?.id === cat.id 
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-md" 
                              : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
                          )}
                        >
                          {cat.name}
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                            selectedCategory?.id === cat.id ? "bg-emerald-400 text-white" : "bg-slate-100 text-slate-500"
                          )}>
                            {categoryCounts[cat.id]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        {searchQuery ? "Hasil Carian" : selectedCategory ? selectedCategory.name : "Senarai Pertukaran Karbohidrat"}
                      </h2>
                      {selectedCategory && (
                        <button 
                          onClick={() => setSelectedCategory(null)}
                          className="text-xs font-bold text-emerald-600 hover:underline"
                        >
                          Kosongkan Penapis
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="popLayout">
                      {filteredItems.length > 0 ? (
                        <motion.div 
                          key={selectedCategory?.id || 'all'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="grid grid-cols-1 gap-3"
                        >
                          {filteredItems.map((item, idx) => (
                            <motion.div 
                              layout
                              key={`${item.categoryId}-${item.name}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.03 }}
                              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 items-center hover:border-emerald-200 transition-colors"
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                <motion.img 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, ease: "easeOut" }}
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-slate-500">{item.amount} {!selectedCategory && `• ${item.category}`}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-emerald-600">{item.exchanges} Tukar</p>
                                <p className="text-xs text-slate-400">{item.carbs}g karbo</p>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
                          <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-6 h-6 text-slate-300" />
                          </div>
                          <p className="text-slate-500 font-medium">Tiada makanan dijumpai</p>
                          <p className="text-slate-400 text-sm">Cuba tukar carian atau penapis anda</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="charts-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-2">Visualisasi Data Karbohidrat</h2>
                    <p className="text-slate-500 text-sm mb-6">Analisis taburan dan perbandingan karbohidrat mengikut kategori makanan.</p>
                    
                    {/* Chart Sub-Navigation */}
                    <div className="flex gap-2 mb-8 bg-slate-50 p-1 rounded-xl">
                      <button 
                        onClick={() => setActiveChart('distribution')}
                        className={cn(
                          "flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all",
                          activeChart === 'distribution' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        <PieChartIcon className="w-4 h-4" />
                        Taburan Kategori
                      </button>
                      <button 
                        onClick={() => setActiveChart('comparison')}
                        className={cn(
                          "flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all",
                          activeChart === 'comparison' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        <BarChart3 className="w-4 h-4" />
                        Perbandingan Karbo
                      </button>
                    </div>

                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {activeChart === 'distribution' ? (
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        ) : (
                          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis label={{ value: 'Purata Karbo (g)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Legend />
                            <Bar dataKey="avgCarbs" name="Purata Karbohidrat (g)" radius={[4, 4, 0, 0]}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jumlah Item</p>
                        <p className="text-2xl font-black text-slate-900">{categoryCounts.all}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Purata Karbo/Item</p>
                        <p className="text-2xl font-black text-slate-900">
                          {(chartData.reduce((acc, curr) => acc + curr.avgCarbs, 0) / chartData.length).toFixed(1)}g
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Calculator & Info */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold">Kalkulator Pantas</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Tukar Dari
                  </label>
                  <div className="flex bg-slate-800 rounded-lg p-1">
                    <button 
                      onClick={() => setCalculatorInput(prev => ({ ...prev, type: 'carbs' }))}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-md transition-all",
                        calculatorInput.type === 'carbs' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Karbo (g)
                    </button>
                    <button 
                      onClick={() => setCalculatorInput(prev => ({ ...prev, type: 'exchanges' }))}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-md transition-all",
                        calculatorInput.type === 'exchanges' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Pertukaran
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    type="number"
                    value={calculatorInput.value}
                    onChange={(e) => setCalculatorInput(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Masukkan jumlah..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-white"
                  />
                </div>

                {calculation && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center"
                  >
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Hasil</p>
                    <p className="text-3xl font-black text-white">{calculation.result}</p>
                    <p className="text-emerald-400 text-sm font-medium">{calculation.unit}</p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-500" />
                Peraturan Emas
              </h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-emerald-500">
                  <p className="font-bold text-slate-900">1 Pertukaran = 15g Karbo</p>
                </div>
                <p>Ini adalah unit standard yang digunakan untuk memudahkan perancangan hidangan bagi penghidap diabetes.</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Membantu mengekalkan tahap gula darah yang konsisten.</li>
                  <li>Membolehkan "pertukaran" makanan dalam kumpulan yang sama.</li>
                  <li>Fokus pada jumlah kiraan karbohidrat berbanding gula sahaja.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} CarbExchange</p>
        <p className="mt-1">Developed by: <a href="mailto:drfendiameen@kliacustoms.net" className="text-emerald-600 hover:underline">drfendiameen@kliacustoms.net</a></p>
      </footer>
    </div>
  );
}
