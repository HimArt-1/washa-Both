'use client';

import React from 'react';
import { useWashi } from '../context/WashiContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Coins,
  Package,
  History,
  Receipt,
  TrendingUp,
  CheckSquare,
  FileText,
  Sliders,
  Smartphone,
  RotateCcw,
  User,
  Clock
} from 'lucide-react';

export default function NotionSidebar() {
  const { activePage, setActivePage, settings, resetData, products, orders, logout } = useWashi();

  // Find counts for notifications
  const lowStockCount = products.filter((p) => p.quantity <= p.minAlert).length;
  const newOrdersCount = orders.filter((o) => o.orderStatus === 'جديد').length;

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم اليومية', icon: LayoutDashboard, badge: newOrdersCount > 0 ? newOrdersCount : undefined, color: 'text-amber-500' },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart, badge: newOrdersCount > 0 ? newOrdersCount : undefined, color: 'text-blue-500' },
    { id: 'sales', label: 'المبيعات', icon: Coins, color: 'text-emerald-500' },
    { id: 'products', label: 'المنتجات والمخزون', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined, color: 'text-rose-500' },
    { id: 'movements', label: 'حركة المخزون', icon: History, color: 'text-indigo-500' },
    { id: 'expenses', label: 'المصاريف', icon: Receipt, color: 'text-orange-500' },
    { id: 'accounting', label: 'المحاسبة وإغلاق اليوم', icon: TrendingUp, color: 'text-teal-500' },
    { id: 'tasks', label: 'المهام اليومية', icon: CheckSquare, color: 'text-purple-500' },
    { id: 'reports', label: 'التقارير اليومية', icon: FileText, color: 'text-gray-500' },
    { id: 'cashier', label: 'وضع الكاشير السريع', icon: Smartphone, color: 'text-yellow-500', isSpecial: true },
    { id: 'settings', label: 'إعدادات النظام', icon: Sliders, color: 'text-[var(--color-wusha-stone)]' },
  ];

  return (
    <aside className="w-64 bg-[var(--color-wusha-cacao)] border-l border-[#3a2828] h-screen flex flex-col justify-between sticky top-0 shrink-0 select-none hidden md:flex" id="notion-sidebar">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#3a2828] bg-[#221514]">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="Wusha Logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{ filter: 'brightness(0) invert(1) sepia(1) hue-rotate(350deg) saturate(3) brightness(0.9) contrast(0.8)' }} />
            <h1 className="font-bold text-[var(--color-wusha-ivory)] text-base tracking-tight leading-tight">وشى للأزياء</h1>
          </div>
          <p className="text-[10px] text-[var(--color-wusha-muted-gold)] font-mono opacity-80 uppercase tracking-widest">إدارة البوث</p>
        </div>
        <div className="mt-4 bg-[#1e1312] rounded-xl p-3 flex items-center gap-3 border border-[#3a2828] shadow-inner">
          <User className="w-4 h-4 text-[var(--color-wusha-muted-gold)] shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--color-wusha-ivory)] truncate">مسؤول النظام</span>
            <span className="text-[9px] text-[#817E86]">صلاحيات كاملة</span>
          </div>
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-right ${
                isActive
                  ? 'bg-[#3a2828] font-semibold text-[var(--color-wusha-ivory)]'
                  : 'text-[#817E86] hover:bg-[#2a1d1c] hover:text-[var(--color-wusha-ivory)]'
              } ${item.isSpecial ? 'border border-[#3a2828] bg-[#1e1312]' : ''}`}
              id={`sidebar-item-${item.id}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                <span className="text-sm truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-rose-900 text-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Settings & Extras */}
      <div className="p-4 border-t border-[#3a2828] space-y-1 bg-[#221514]">
        <div className="flex items-center gap-2 px-3 pb-2 text-[10px] text-[#554a4a]">
          <Clock className="w-3 h-3" />
          <span>{settings.boothName}</span>
        </div>
        <button
          onClick={() => {
            if (confirm('هل أنت متأكد من إعادة ضبط كل البيانات والمبيعات؟')) {
              resetData();
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-[#817E86] hover:bg-[#3a2828] hover:text-[var(--color-wusha-ivory)] transition-all font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          <span>تصفير البيانات (Demo)</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-[#817E86] hover:bg-rose-950 hover:text-rose-400 transition-all font-bold mt-1"
        >
          <User className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
