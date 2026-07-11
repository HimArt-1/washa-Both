'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import { Shield, User, ChevronLeft, Lock } from 'lucide-react';

export default function LoginView() {
  const { setUserRole, settings, updateSettings, setActivePage } = useWashi();
  const [view, setView] = useState<'selection' | 'admin' | 'cashier'>('selection');
  const [pin, setPin] = useState('');
  const [cashierName, setCashierName] = useState(settings.cashierName || '');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize Arabic numerals to English numerals
    const normalizedPin = pin.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    const validPin = settings.adminPin || '0000';
    
    if (normalizedPin === validPin) {
      setUserRole('admin');
      setActivePage('dashboard');
    } else {
      setError('رمز المرور غير صحيح');
    }
  };

  const handleCashierLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashierName.trim()) {
      setError('يرجى إدخال اسم الكاشير');
      return;
    }
    updateSettings({ cashierName: cashierName.trim() });
    setUserRole('cashier');
    setActivePage('cashier');
  };

  return (
    <div className="min-h-screen bg-[var(--color-wusha-cotton)] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-64 bg-[var(--color-wusha-cacao)] opacity-5 rounded-b-[100px] pointer-events-none transform -translate-y-1/2"></div>
      
      <div className="wusha-card max-w-md w-full animate-fade-in-up z-10">
        
        {/* Header */}
        <div className="p-10 text-center border-b border-[var(--color-wusha-cotton)] bg-[#ffffff]">
          <div className="mb-4 text-center">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Wusha Logo" className="w-28 h-28 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <h1 className="text-2xl font-black text-[var(--color-wusha-ink)]">وشى للأزياء</h1>
            <p className="text-xs font-bold text-[var(--color-wusha-muted-gold)] mt-2 tracking-wide uppercase">W A S H I</p>
          </div>
        </div>

        <div className="p-8 bg-[#ffffff]">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm text-center font-bold animate-fade-in-up">
              {error}
            </div>
          )}

          {view === 'selection' && (
            <div className="space-y-4 animate-fade-in-up animate-delay-100">
              <h2 className="text-center font-bold text-[var(--color-wusha-stone)] text-xs mb-6 uppercase tracking-wider">حدد بوابة الدخول</h2>
              
              <button
                onClick={() => setView('admin')}
                className="w-full flex items-center justify-between p-5 rounded-xl border border-[var(--color-wusha-cotton)] bg-[var(--color-wusha-ivory)] hover:border-[var(--color-wusha-pale-gold)] hover:shadow-md transition-all text-[var(--color-wusha-ink)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-wusha-pale-gold)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-[var(--color-wusha-cacao)] rounded-lg text-[var(--color-wusha-muted-gold)] shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">إدارة البوث (Admin)</p>
                    <p className="text-[10px] text-[var(--color-wusha-stone)] mt-1">التحكم، التقارير، والإعدادات</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-[var(--color-wusha-muted-gold)] group-hover:-translate-x-1 transition-transform relative z-10" />
              </button>

              <button
                onClick={() => setView('cashier')}
                className="w-full flex items-center justify-between p-5 rounded-xl border border-[var(--color-wusha-cotton)] bg-[var(--color-wusha-ivory)] hover:border-[var(--color-wusha-pale-gold)] hover:shadow-md transition-all text-[var(--color-wusha-ink)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-wusha-pale-gold)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-pale-gold)] rounded-lg text-[var(--color-wusha-cacao)] shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">محطة الكاشير (Cashier)</p>
                    <p className="text-[10px] text-[var(--color-wusha-stone)] mt-1">المبيعات السريعة والإيصالات</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-[var(--color-wusha-muted-gold)] group-hover:-translate-x-1 transition-transform relative z-10" />
              </button>
            </div>
          )}

          {view === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-6 animate-fade-in-up animate-delay-100">
              <button
                type="button"
                onClick={() => { setView('selection'); setError(''); setPin(''); }}
                className="text-[10px] uppercase tracking-wider text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-cacao)] mb-2 inline-flex items-center gap-1 font-bold transition-colors"
              >
                <ChevronLeft className="w-3 h-3 rotate-180" /> العودة للبوابات
              </button>
              
              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 bg-[var(--color-wusha-cacao)] rounded-2xl flex items-center justify-center text-[var(--color-wusha-muted-gold)] mb-4 shadow-sm transform rotate-3">
                  <Lock className="w-6 h-6 -rotate-3" />
                </div>
                <h2 className="font-bold text-[var(--color-wusha-ink)] text-lg">دخول الإدارة</h2>
                <p className="text-xs text-[var(--color-wusha-stone)] mt-1">يرجى إدخال رمز المرور السري</p>
              </div>

              <div>
                <input
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="wusha-input text-center text-2xl tracking-[1em] py-4"
                  dir="ltr"
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                className="w-full wusha-btn-primary py-4 text-base mt-4"
              >
                دخول
              </button>
            </form>
          )}

          {view === 'cashier' && (
            <form onSubmit={handleCashierLogin} className="space-y-6 animate-fade-in-up animate-delay-100">
              <button
                type="button"
                onClick={() => { setView('selection'); setError(''); }}
                className="text-[10px] uppercase tracking-wider text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-cacao)] mb-2 inline-flex items-center gap-1 font-bold transition-colors"
              >
                <ChevronLeft className="w-3 h-3 rotate-180" /> العودة للبوابات
              </button>
              
              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-pale-gold)] rounded-2xl flex items-center justify-center text-[var(--color-wusha-cacao)] mb-4 shadow-sm transform -rotate-3">
                  <User className="w-6 h-6 rotate-3" />
                </div>
                <h2 className="font-bold text-[var(--color-wusha-ink)] text-lg">بوابة الكاشير</h2>
                <p className="text-xs text-[var(--color-wusha-stone)] mt-1">أدخل اسمك ليظهر كبائع في الإيصالات</p>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="اسم الكاشير (مثال: هشام)"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="wusha-input text-center text-lg py-4"
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                className="w-full wusha-btn-primary py-4 text-base mt-4"
                style={{ backgroundColor: 'var(--color-wusha-cacao)', color: 'var(--color-wusha-ivory)' }}
              >
                بدء الوردية
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
