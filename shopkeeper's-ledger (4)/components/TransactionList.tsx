import React from 'react';
import { Transaction } from '../types';
import { getCategoryIcon, formatCurrency, formatDate } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  // Show only last 20 for performance in list view, reversed (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (transactions.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span>🕒</span> 近期账单
      </h3>
      
      <div className="space-y-4">
        {sortedTransactions.map((t) => (
          <div key={t.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                t.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
              }`}>
                {getCategoryIcon(t.category)}
              </div>
              <div>
                <p className="font-bold text-slate-800">{t.category}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{formatDate(t.date)}</span>
                  {t.description && <span>• {t.description}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`font-bold font-mono text-lg ${
                t.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
              }`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              <button 
                onClick={() => onDelete(t.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                title="删除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;