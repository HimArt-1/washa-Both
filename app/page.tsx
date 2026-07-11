'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';

// Import View Components
import NotionSidebar from '../components/NotionSidebar';
import LoginView from '../components/LoginView';
import DashboardView from '../components/DashboardView';
import OrdersView from '../components/OrdersView';
import SalesView from '../components/SalesView';
import ProductsView from '../components/ProductsView';
import MovementsView from '../components/MovementsView';
import ExpensesView from '../components/ExpensesView';
import AccountingView from '../components/AccountingView';
import TasksView from '../components/TasksView';
import ReportsView from '../components/ReportsView';
import SettingsView from '../components/SettingsView';
import CashierView from '../components/CashierView';

import { Menu, X, Smartphone, User, Sparkles, LayoutDashboard } from 'lucide-react';

export default function Page() {
  const { activePage, setActivePage, settings, isLoading, userRole, logout } = useWashi();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Render the appropriate view
  const renderView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'orders':
        return <OrdersView />;
      case 'sales':
        return <SalesView />;
      case 'products':
        return <ProductsView />;
      case 'movements':
        return <MovementsView />;
      case 'expenses':
        return <ExpensesView />;
      case 'accounting':
        return <AccountingView />;
      case 'tasks':
        return <TasksView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return userRole === 'admin' ? <SettingsView /> : <CashierView />;
      case 'cashier':
        return <CashierView />;
      default:
        return userRole === 'admin' ? <DashboardView /> : <CashierView />;
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'لوحة التحكم اليومية';
      case 'orders':
        return 'الطلبات والعهدة';
      case 'sales':
        return 'قائمة المبيعات';
      case 'products':
        return 'المنتجات والمخزون';
      case 'movements':
        return 'حركة المخزون';
      case 'expenses':
        return 'مصاريف البوث';
      case 'accounting':
        return 'المحاسبة وإغلاق اليوم';
      case 'tasks':
        return 'المهام اليومية';
      case 'reports':
        return 'التقارير المعتمدة';
      case 'settings':
        return 'إعدادات النظام';
      case 'cashier':
        return '📱 الكاشير السريع';
      default:
        return userRole === 'admin' ? 'لوحة التحكم' : '📱 الكاشير السريع';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <span className="text-4xl animate-bounce inline-block">🧥</span>
          <h2 className="text-sm font-bold text-[var(--color-wusha-ink)] animate-pulse">جاري تحميل نظام تشغيل وشى للأزياء...</h2>
          <p className="text-[10px] text-[var(--color-wusha-stone)] font-mono">Initializing Washi Retail Engine v1.0</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return <LoginView />;
  }

  const menuItemsMobile = [
    { id: 'dashboard', label: 'لوحة التحكم اليومية', icon: '📊' },
    { id: 'orders', label: 'الطلبات', icon: '🛒' },
    { id: 'sales', label: 'المبيعات', icon: '💰' },
    { id: 'products', label: 'المنتجات والمخزون', icon: '📦' },
    { id: 'movements', label: 'حركة المخزون', icon: '🔁' },
    { id: 'expenses', label: 'المصاريف', icon: '🧾' },
    { id: 'accounting', label: 'المحاسبة والتقارير', icon: '📈' },
    { id: 'tasks', label: 'المهام اليومية', icon: '✅' },
    { id: 'reports', label: 'التقارير اليومية', icon: '📅' },
    { id: 'cashier', label: 'وضع الكاشير السريع', icon: '📱', isSpecial: true },
    { id: 'settings', label: 'إعدادات النظام', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex font-sans text-[var(--color-wusha-ink)]" dir="rtl" id="washi-workspace">
      
      {/* 1. NOTION SIDEBAR (Desktop only, 256px wide) */}
      {userRole === 'admin' && <NotionSidebar />}

      {/* 2. MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0" id="main-content-layout">
        
        {/* Mobile Responsive Header */}
        <header className="md:hidden bg-[var(--color-wusha-cotton)] border-b border-[var(--color-wusha-pale-gold)] px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧴</span>
            <div>
              <h2 className="text-xs font-black text-[var(--color-wusha-ink)] leading-none">{settings.boothName || 'وشى بالبوث'}</h2>
              <p className="text-[9px] text-[var(--color-wusha-stone)] font-bold mt-1">{getPageTitle()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Logout on Mobile */}
            <button
              onClick={logout}
              className="p-2 bg-[var(--color-wusha-ivory)] border border-slate-200 rounded-lg text-rose-600 focus:outline-none"
              title="تسجيل خروج"
            >
              <User className="w-4 h-4" />
            </button>

            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => setActivePage('cashier')}
                  className={`p-2 rounded-lg border ${
                    activePage === 'cashier'
                      ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                      : 'bg-[var(--color-wusha-ivory)] border-slate-200 text-[var(--color-wusha-stone)]'
                  }`}
                  title="الكاشير السريع"
                >
                  <Smartphone className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 bg-[var(--color-wusha-ivory)] border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </header>

        {/* Mobile menu navigation drawer */}
        {mobileMenuOpen && userRole === 'admin' && (
          <div className="md:hidden fixed inset-x-0 top-[49px] bottom-0 bg-black/30 backdrop-blur-xs z-30 transition-all">
            <nav className="bg-[var(--color-wusha-cotton)] border-b border-[var(--color-wusha-pale-gold)] p-4 max-h-[80vh] overflow-y-auto space-y-1 shadow-lg">
              <p className="text-[10px] font-black text-[var(--color-wusha-stone)] uppercase tracking-widest px-2 mb-2">تصفح أقسام النظام</p>
              {menuItemsMobile.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-right text-xs ${
                      isActive
                        ? 'bg-[#E2DDD6] font-bold text-[var(--color-wusha-ink)] shadow-xs'
                        : 'text-[var(--color-wusha-stone)] hover:bg-[var(--color-wusha-cotton)]'
                    } ${item.isSpecial ? 'border border-dashed border-[#8C7D6B] bg-[#F7F5F2]' : ''}`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* 3. SCROLLABLE VIEW CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl w-full mx-auto space-y-8" id="workspace-viewport">
          {/* Top subtle display bar */}
          <div className="hidden md:flex justify-between items-center border-b border-[var(--color-wusha-pale-gold)] pb-3 mb-1 text-xs">
            <div className="flex items-center gap-2 text-[var(--color-wusha-stone)]">
              <span>وشى</span>
              <span>/</span>
              <span className="text-[var(--color-wusha-stone)] font-bold">{getPageTitle()}</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--color-wusha-stone)]">
              <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] px-2 py-0.5 rounded text-[10px] font-bold">
                {settings.boothName}
              </span>
              <span>•</span>
              {userRole === 'cashier' && (
                <>
                  <button onClick={logout} className="text-rose-600 font-bold hover:underline">
                    تسجيل الخروج ({settings.cashierName})
                  </button>
                  <span>•</span>
                </>
              )}
              <span className="font-mono text-[11px] font-medium text-[var(--color-wusha-stone)]">الأحد، 5 يوليو 2026</span>
            </div>
          </div>

          {/* Mount Active view Component */}
          <div className="animate-fade-in" key={activePage}>
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
