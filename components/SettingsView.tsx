'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import {
  Settings,
  User,
  Tags,
  Building2,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Store,
  FolderTree,
  Sliders
} from 'lucide-react';

export default function SettingsView() {
  const { settings, updateSettings, resetData } = useWashi();
  const [cashierName, setCashierName] = useState(settings.cashierName);
  const [boothName, setBoothName] = useState(settings.boothName);
  const [adminPin, setAdminPin] = useState(settings.adminPin || '');
  const [newCategory, setNewCategory] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      cashierName,
      boothName,
      adminPin,
    });
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (settings.categories.includes(newCategory.trim())) {
      alert('هذه الفئة موجودة بالفعل!');
      return;
    }
    updateSettings({
      categories: [...settings.categories, newCategory.trim()],
    });
    setNewCategory('');
  };

  const handleDeleteCategory = (cat: string) => {
    if (confirm(`هل ترغب بحذف فئة "${cat}"؟ لن يتم حذف منتجات هذه الفئة ولكن ستفقد إمكانية التصنيف التلقائي بها.`)) {
      updateSettings({
        categories: settings.categories.filter((c) => c !== cat),
      });
    }
  };

  const handleResetData = () => {
    if (confirm('🚨 تحذير خطير: سيتم مسح كافة المبيعات والمصاريف وإعادة المخزون لحالته الصفرية (Demo). لا يمكن التراجع عن هذه الخطوة. هل أنت متأكد؟')) {
      resetData();
      setCashierName(settings.cashierName);
      setBoothName(settings.boothName);
      alert('تمت إعادة ضبط النظام للبيانات الافتراضية بنجاح.');
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[var(--color-wusha-ivory)] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-[var(--color-wusha-cotton)] rounded-2xl border border-[var(--color-wusha-pale-gold)] shadow-sm">
            <Sliders className="w-8 h-8 text-[var(--color-wusha-cacao)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-wusha-ink)]">إعدادات نظام البوث</h1>
            <p className="text-sm font-medium text-[var(--color-wusha-stone)] mt-1 tracking-wide">التحكم الفني والإداري لمعرض وشى</p>
          </div>
        </div>

        {showSavedToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-sm animate-fade-in-up">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>تم حفظ تحديثات إعدادات التشغيل بنجاح!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Booth Settings Card */}
          <div className="wusha-card p-8 animate-fade-in-up animate-delay-100">
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-wusha-cotton)] pb-4">
              <Store className="w-5 h-5 text-[var(--color-wusha-muted-gold)]" />
              <h2 className="text-lg font-bold text-[var(--color-wusha-ink)]">بيانات التشغيل</h2>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)] uppercase tracking-wide">الاسم الرمزي للبوث</label>
                <input
                  type="text"
                  value={boothName}
                  onChange={(e) => setBoothName(e.target.value)}
                  className="wusha-input"
                  placeholder="مثال: وشى - واجهة الرياض"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)] uppercase tracking-wide">اسم بائع الكاشير الحالي</label>
                <input
                  type="text"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="wusha-input"
                  placeholder="مثال: هشام"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)] uppercase tracking-wide">رمز المرور للمسؤول (PIN)</label>
                <input
                  type="text"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="wusha-input font-mono tracking-[0.5em] text-center"
                  dir="ltr"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full wusha-btn-primary"
                >
                  <Save className="w-4 h-4" />
                  حفظ إعدادات البوث
                </button>
              </div>
            </form>
          </div>

          {/* Categories Card */}
          <div className="wusha-card p-8 animate-fade-in-up animate-delay-200">
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-wusha-cotton)] pb-4">
              <FolderTree className="w-5 h-5 text-[var(--color-wusha-muted-gold)]" />
              <h2 className="text-lg font-bold text-[var(--color-wusha-ink)]">تصنيفات المنتجات</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {settings.categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-wusha-cotton)] border border-[var(--color-wusha-pale-gold)] rounded-full text-xs text-[var(--color-wusha-ink)] font-bold group">
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-rose-400 hover:text-rose-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                      title="حذف التصنيف"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddCategory} className="flex gap-2 pt-4 border-t border-[var(--color-wusha-cotton)]">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="اسم التصنيف الجديد"
                  className="wusha-input flex-1"
                />
                <button
                  type="submit"
                  className="wusha-btn-outline"
                >
                  <Plus className="w-4 h-4" />
                  إضافة
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="wusha-card p-8 border-rose-100 mt-6 animate-fade-in-up animate-delay-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-rose-600">منطقة الخطر: تصفير النظام (Factory Reset)</h2>
              <p className="text-sm text-[var(--color-wusha-stone)] mt-2 leading-relaxed">
                إذا كنت ترغب بإفراغ قواعد البيانات بالكامل من مبيعات التجارب، أو حذف الطلبات المضافة وإعادة مستويات المخزون للمستويات الافتتاحية التأسيسية التي وفرتها براند وشى لتشغيل البوث لأول مرة، يمكنك تشغيل التصفير الكامل.
              </p>
              
              <button
                type="button"
                onClick={handleResetData}
                className="mt-6 px-6 py-3 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-transparent font-bold rounded-lg transition-all shadow-sm flex items-center gap-2"
                id="btn-reset-all-data"
              >
                <Trash2 className="w-4 h-4" />
                تصفير النظام ومسح المبيعات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
