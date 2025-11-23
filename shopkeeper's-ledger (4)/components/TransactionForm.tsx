import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

interface TransactionFormProps {
  onAddTransaction: (t: Omit<Transaction, 'id' | 'date'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const availableCategories = DEFAULT_CATEGORIES.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description
    });

    // Reset form
    setAmount('');
    setDescription('');
    // Keep category or reset? Resetting is cleaner
    setCategory('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 sticky top-4 z-20">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📝</span> 记一笔
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'income' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            收入 💰
          </button>
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'expense' 
                ? 'bg-white text-rose-500 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            支出 💸
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-lg font-bold text-slate-800 placeholder-slate-300"
              required
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-4 gap-2">
          {availableCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.name)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                category === cat.name
                  ? type === 'income' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-slate-100 bg-white hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className="text-xl mb-1">{cat.icon}</span>
              <span className="text-xs truncate w-full text-center">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Description */}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="备注 (选填)"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-700"
        />

        <button
          type="submit"
          className={`w-full py-3 rounded-xl font-bold text-white shadow-lg shadow-brand-500/30 active:scale-95 transition-transform ${
            type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
          }`}
        >
          确认{type === 'income' ? '入账' : '支出'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;