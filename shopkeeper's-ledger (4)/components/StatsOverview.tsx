import React from 'react';
import { formatCurrency } from '../constants';

interface StatsOverviewProps {
  totalIncome: number;
  totalExpense: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ totalIncome, totalExpense }) => {
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 text-8xl opacity-10 rotate-12 group-hover:scale-110 transition-transform">🛍️</div>
        <p className="text-emerald-100 text-sm font-medium mb-1">总收入</p>
        <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
      </div>

      <div className="bg-rose-500 rounded-3xl p-6 text-white shadow-lg shadow-rose-500/20 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 text-8xl opacity-10 rotate-12 group-hover:scale-110 transition-transform">💸</div>
        <p className="text-rose-100 text-sm font-medium mb-1">总支出</p>
        <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
      </div>

      <div className={`rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group ${netProfit >= 0 ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-slate-700 shadow-slate-700/20'}`}>
        <div className="absolute -right-4 -top-4 text-8xl opacity-10 rotate-12 group-hover:scale-110 transition-transform">✨</div>
        <p className="text-indigo-100 text-sm font-medium mb-1">净利润</p>
        <p className="text-3xl font-bold">{formatCurrency(netProfit)}</p>
      </div>
    </div>
  );
};

export default StatsOverview;