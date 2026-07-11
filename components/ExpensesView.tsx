'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import { Expense } from '../lib/types';
import {
  Receipt,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  Briefcase,
  X,
  CreditCard,
  Check,
  Trash2,
  Paperclip
} from 'lucide-react';

export default function ExpensesView() {
  const { expenses, addExpense, editExpense, deleteExpense } = useWashi();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New expense form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<Expense['category']>('تشغيل البوث');
  const [date, setDate] = useState('2026-07-05');
  const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>('بطاقة');
  const [supplier, setSupplier] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [notes, setNotes] = useState('');

  // Categories helper
  const categoriesList: Expense['category'][] = [
    'تشغيل البوث',
    'مواد وتغليف',
    'تسويق',
    'مواصلات',
    'رسوم الإيفنت',
    'ضيافة',
    'أخرى',
  ];

  // Filter
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' ? true : e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculations
  const totalSum = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const confirmedSum = filteredExpenses.filter(e => e.isConfirmed).reduce((acc, curr) => acc + curr.amount, 0);
  const pendingSum = totalSum - confirmedSum;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) {
      alert('يرجى إدخال اسم البند والمبلغ بشكل صحيح!');
      return;
    }

    addExpense({
      title,
      amount: Number(amount),
      category,
      date,
      paymentMethod,
      supplier: supplier || 'غير محدد',
      isConfirmed,
      notes,
    });

    // Reset
    setTitle('');
    setAmount(0);
    setCategory('تشغيل البوث');
    setPaymentMethod('بطاقة');
    setSupplier('');
    setIsConfirmed(true);
    setNotes('');
    setShowAddModal(false);
  };

  const toggleConfirm = (id: string, current: boolean) => {
    editExpense(id, { isConfirmed: !current });
  };

  return (
    <div className="space-y-6" id="expenses-view-container">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-wusha-ink)] flex items-center gap-2">
            <span>🧾</span> مصاريف المعرض والبوث
          </h2>
          <p className="text-xs text-[var(--color-wusha-stone)] mt-1">سجل التكاليف التشغيلية والتسويقية ومصاريف تغليف منتجات وشى لحساب الأرباح الصافية بدقة.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#1a1a1a] text-white hover:bg-[#333333] px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
          id="btn-add-expense"
        >
          <Plus className="w-4 h-4" />
          <span>سجل مصروف جديد</span>
        </button>
      </div>

      {/* Expenses Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--color-wusha-ivory)] border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <span className="p-2.5 bg-orange-50 border border-orange-100 rounded-lg text-orange-600 text-lg">💰</span>
          <div>
            <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">إجمالي التكاليف المسجلة</p>
            <p className="text-lg font-black text-[var(--color-wusha-ink)] mt-1">{totalSum} ر.س</p>
          </div>
        </div>
        <div className="bg-[var(--color-wusha-ivory)] border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <span className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-lg">✓</span>
          <div>
            <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">فواتير مؤكدة (مدفوعة)</p>
            <p className="text-lg font-black text-emerald-800 mt-1">{confirmedSum} ر.س</p>
          </div>
        </div>
        <div className="bg-[var(--color-wusha-ivory)] border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <span className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-600 text-lg">⏳</span>
          <div>
            <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">قيد الانتظار (تحتاج مراجعة)</p>
            <p className="text-lg font-black text-amber-800 mt-1">{pendingSum} ر.س</p>
          </div>
        </div>
      </div>

      {/* Control row: Search & Categories filter */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-[var(--color-wusha-stone)]" />
          <input
            type="text"
            placeholder="البحث بالبند، المورد، أو الملاحظة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-9 py-1.5 text-xs bg-[var(--color-wusha-cotton)] border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-[var(--color-wusha-cotton)] border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
          <Filter className="w-3.5 h-3.5 text-[var(--color-wusha-stone)]" />
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="bg-transparent text-[var(--color-wusha-stone)] focus:outline-none font-medium cursor-pointer"
          >
            <option value="all">كل التصنيفات</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses list */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-10 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl shadow-sm">
          <Receipt className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-xs text-[var(--color-wusha-stone)] mt-2">لا توجد مصاريف مسجلة مطابقة للخيارات الحالية.</p>
        </div>
      ) : (
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs font-medium">
              <thead>
                <tr className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">بند المصروف</th>
                  <th className="py-3 px-4 font-semibold">التصنيف</th>
                  <th className="py-3 px-4 font-semibold">تاريخ الصرف</th>
                  <th className="py-3 px-4 font-semibold">قناة السداد</th>
                  <th className="py-3 px-4 font-semibold">المورد أو الجهة</th>
                  <th className="py-3 px-4 font-semibold">القيمة</th>
                  <th className="py-3 px-4 font-semibold text-center">هل المصروف مؤكد؟</th>
                  <th className="py-3 px-4 font-semibold">الملاحظات</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[var(--color-wusha-cotton)]/40">
                    <td className="py-3.5 px-4 text-[var(--color-wusha-ink)] font-bold">{exp.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] px-2.5 py-0.5 rounded text-[10px] font-bold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[var(--color-wusha-stone)]">{exp.date}</td>
                    <td className="py-3.5 px-4 text-[var(--color-wusha-stone)]">{exp.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-[var(--color-wusha-stone)]">{exp.supplier}</td>
                    <td className="py-3.5 px-4 font-black text-rose-600">{exp.amount} ر.س</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleConfirm(exp.id, exp.isConfirmed)}
                        className={`mx-auto flex items-center justify-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold shadow-xs border transition-colors ${
                          exp.isConfirmed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {exp.isConfirmed ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>مؤكد</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>مسودة</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-wusha-stone)] max-w-xs truncate">{exp.notes || '-'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm('هل ترغب بحذف هذا المصروف نهائياً؟')) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-50 inline-block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-wusha-ivory)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[var(--color-wusha-cotton)]">
            <div className="bg-[var(--color-wusha-cotton)] px-6 py-4 border-b border-[var(--color-wusha-cotton)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-base">تسجيل مصروف جديد بالبوث</h3>
                <p className="text-xs text-[var(--color-wusha-stone)] mt-0.5">سجل التكاليف التشغيلية ومطبوعات وشى الفاخرة.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-stone)] p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">بند المصروف (البيان) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شراء كراسي وجلسة مريحة للموظفين"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">القيمة بالريال (ر.س) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)] text-[var(--color-wusha-ink)]"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">تاريخ الصرف</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">قناة الدفع</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)] text-[var(--color-wusha-ink)]"
                  >
                    <option value="بطاقة">بطاقة مدى / شبكة</option>
                    <option value="كاش">كاش (صندوق الصرف)</option>
                    <option value="تحويل">تحويل بنكي</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">المورد أو الجهة</label>
                <input
                  type="text"
                  placeholder="مثال: هوم سنتر، ايكيا، مطبعة الرياض..."
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">ملاحظات الفاتورة</label>
                <input
                  type="text"
                  placeholder="ملاحظات تشغيلية حول المصروف..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="confirm-check"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="rounded border-slate-300 text-[var(--color-wusha-ink)] focus:ring-slate-500 accent-slate-800 shrink-0"
                />
                <label htmlFor="confirm-check" className="text-xs font-bold text-[var(--color-wusha-ink)] cursor-pointer user-select-none">
                  هل المصروف مدفوع ومؤكد بالكامل؟ (سيتم خصمه فوراً من صندوق النقد)
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--color-wusha-cotton)] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-[var(--color-wusha-cotton)] hover:bg-slate-200 text-[var(--color-wusha-ink)] font-bold px-4 py-2 rounded-lg text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[var(--color-wusha-ink)] hover:bg-[#3a2828] text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm"
                >
                  سجل المصروف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
