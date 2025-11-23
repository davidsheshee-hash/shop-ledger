import { CategoryDef } from './types';

// Default categories with "Cartoon" icons (Emojis)
export const DEFAULT_CATEGORIES: CategoryDef[] = [
  // Income
  { id: 'inc_sales', name: '商品销售', icon: '🛍️', color: '#10b981', type: 'income' },
  { id: 'inc_service', name: '代购服务', icon: '🤝', color: '#34d399', type: 'income' },
  { id: 'inc_refund', name: '平台退款', icon: '↩️', color: '#6ee7b7', type: 'income' },
  { id: 'inc_other', name: '其他收入', icon: '💰', color: '#a7f3d0', type: 'income' },
  
  // Expense
  { id: 'exp_stock', name: '进货成本', icon: '📦', color: '#f43f5e', type: 'expense' },
  { id: 'exp_logistics', name: '快递物流', icon: '🚚', color: '#fb7185', type: 'expense' },
  { id: 'exp_marketing', name: '广告推广', icon: '📣', color: '#fda4af', type: 'expense' },
  { id: 'exp_packaging', name: '包装耗材', icon: '🎀', color: '#fecdd3', type: 'expense' },
  { id: 'exp_platform', name: '平台扣点', icon: '🧾', color: '#e11d48', type: 'expense' },
  { id: 'exp_other', name: '杂项支出', icon: '💸', color: '#be123c', type: 'expense' },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Helper to get icon for any category name (fallback if custom entered)
export const getCategoryIcon = (categoryName: string): string => {
  const found = DEFAULT_CATEGORIES.find(c => c.name === categoryName);
  if (found) return found.icon;
  if (categoryName.includes('吃') || categoryName.includes('餐')) return '🍔';
  if (categoryName.includes('车') || categoryName.includes('行')) return '🚕';
  if (categoryName.includes('房') || categoryName.includes('租')) return '🏠';
  return '✨';
};