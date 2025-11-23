import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Transaction, MonthlyStats, CategoryStat } from '../types';
import { DEFAULT_CATEGORIES, getCategoryIcon } from '../constants';

interface AnalysisChartsProps {
  transactions: Transaction[];
}

const COLORS_INCOME = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
const COLORS_EXPENSE = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#e11d48', '#be123c'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 rounded-xl shadow-xl text-sm z-50">
        <p className="font-bold text-slate-700 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="flex items-center gap-2">
            <span>{entry.name}:</span>
            <span className="font-mono font-bold">
               {typeof entry.value === 'number' ? `¥${entry.value.toFixed(2)}` : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Y-axis formatter: ¥1.50k
const formatYAxis = (value: number) => {
  if (value === 0) return '¥0.00';
  return `¥${(value / 1000).toFixed(2)}k`;
};

// Pie chart label renderer with percentages
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5; 
  const x = cx + radius * Math.cos(-midAngle * RADIAN); 
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ transactions }) => {
  
  // 1. Process Monthly Data
  const monthlyData = useMemo(() => {
    const map = new Map<string, MonthlyStats>();

    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      // Format: MM.YYYY (e.g., 02.2024)
      const label = `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

      if (!map.has(key)) {
        map.set(key, { monthKey: key, income: 0, expense: 0, profit: 0, label });
      }
      const stat = map.get(key)!;
      if (t.type === 'income') {
        stat.income += t.amount;
      } else {
        stat.expense += t.amount;
      }
      stat.profit = stat.income - stat.expense;
    });

    // Sort by date
    return Array.from(map.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [transactions]);

  // 2. Process Category Data
  const getCategoryStats = (type: 'income' | 'expense'): CategoryStat[] => {
    const map = new Map<string, number>();
    transactions.filter(t => t.type === type).forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });

    return Array.from(map.entries()).map(([name, value]) => {
      const def = DEFAULT_CATEGORIES.find(c => c.name === name);
      return {
        name,
        value,
        icon: def ? def.icon : getCategoryIcon(name),
        color: def ? def.color : '#94a3b8'
      };
    }).sort((a, b) => b.value - a.value);
  };

  const incomeStats = useMemo(() => getCategoryStats('income'), [transactions]);
  const expenseStats = useMemo(() => getCategoryStats('expense'), [transactions]);

  // Totals for percentage calculation in legends
  const totalIncomeVal = incomeStats.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenseVal = expenseStats.reduce((acc, curr) => acc + curr.value, 0);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl p-8 text-slate-400 border border-slate-100 border-dashed">
        <span className="text-4xl mb-4">📊</span>
        <p>暂无数据，请先记一笔账吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Monthly Bar Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>📅</span> 月度收支对比
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              {/* Darker grid lines: slate-500 #64748b */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.4} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 12 }} 
                tickFormatter={formatYAxis}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend iconType="circle" />
              <Bar dataKey="income" name="收入" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expense" name="支出" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Net Profit Trend Line Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>📈</span> 净利润趋势
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.4} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 12 }}
                tickFormatter={formatYAxis}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="profit" 
                name="净利润" 
                stroke="#4f46e5" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Income Pie */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 w-full flex items-center gap-2">
            <span>💰</span> 收入构成
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {incomeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex flex-wrap gap-2 justify-center mt-4">
             {incomeStats.map((stat, i) => (
               <div key={i} className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                 <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS_INCOME[i % COLORS_INCOME.length]}}></span>
                 <span>{stat.icon} {stat.name} <span className="font-bold">{totalIncomeVal > 0 ? ((stat.value / totalIncomeVal) * 100).toFixed(1) : 0}%</span></span>
               </div>
             ))}
          </div>
        </div>

        {/* Expense Pie */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 w-full flex items-center gap-2">
            <span>💸</span> 支出构成
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {expenseStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_EXPENSE[index % COLORS_EXPENSE.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex flex-wrap gap-2 justify-center mt-4">
             {expenseStats.map((stat, i) => (
               <div key={i} className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                 <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS_EXPENSE[i % COLORS_EXPENSE.length]}}></span>
                 <span>{stat.icon} {stat.name} <span className="font-bold">{totalExpenseVal > 0 ? ((stat.value / totalExpenseVal) * 100).toFixed(1) : 0}%</span></span>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisCharts;