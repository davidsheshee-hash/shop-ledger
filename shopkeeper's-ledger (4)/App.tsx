import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import StatsOverview from './components/StatsOverview';
import AnalysisCharts from './components/AnalysisCharts';
import TransactionList from './components/TransactionList';
import { Transaction } from './types';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('shop_ledger_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shop_ledger_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏪</span>
            <h1 className="text-xl font-black bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              网店账单助手
            </h1>
          </div>
          <button 
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href",     dataStr);
              downloadAnchorNode.setAttribute("download", "ledger_backup.json");
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
            className="text-xs text-slate-500 hover:text-brand-600 underline"
          >
            备份数据
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form (Sticky on Desktop) */}
          <div className="lg:col-span-4 lg:relative">
            <TransactionForm onAddTransaction={handleAddTransaction} />
            
            {/* Mobile-only spacer if needed, or put List here on mobile? 
                Actually, List is better below charts generally. 
                We can put a small summary list here for Desktop later.
            */}
          </div>

          {/* Right Column: Stats & Charts */}
          <div className="lg:col-span-8 space-y-8">
            <StatsOverview totalIncome={totalIncome} totalExpense={totalExpense} />
            
            <AnalysisCharts transactions={transactions} />
            
            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;