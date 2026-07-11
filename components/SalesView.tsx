'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import {
  Coins,
  Search,
  Filter,
  CreditCard,
  Banknote,
  TrendingUp,
  Clock,
  LayoutGrid,
  Table as TableIcon,
  Download,
  Trash2
} from 'lucide-react';

export default function SalesView() {
  const { sales, products, deleteSale, settings } = useWashi();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'كاش' | 'بطاقة_مدى' | 'تحويل بنكي'>('all');
  const [activeTab, setActiveTab] = useState<'table' | 'gallery'>('table');

  // Filter Sales
  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'كاش') return matchesSearch && s.paymentMethod === 'كاش';
    if (activeFilter === 'تحويل بنكي') return matchesSearch && s.paymentMethod === 'تحويل بنكي';
    if (activeFilter === 'بطاقة_مدى') {
      return matchesSearch && (s.paymentMethod === 'بطاقة' || s.paymentMethod === 'مدى');
    }
    return matchesSearch;
  });

  // Calculate stats from filtered sales
  const totalAmount = filteredSales.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCost = filteredSales.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const totalProfit = totalAmount - totalCost;

  const cashSalesSum = sales.filter((s) => s.paymentMethod === 'كاش').reduce((acc, curr) => acc + curr.amount, 0);
  const cardSalesSum = sales.filter((s) => s.paymentMethod === 'بطاقة' || s.paymentMethod === 'مدى').reduce((acc, curr) => acc + curr.amount, 0);
  const transferSalesSum = sales.filter((s) => s.paymentMethod === 'تحويل بنكي').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6" id="sales-view-container">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-wusha-ink)] flex items-center gap-2">
            <span>💰</span> المبيعات المسجلة بالبوث
          </h2>
          <p className="text-xs text-[var(--color-wusha-stone)] mt-1">عرض السجل النهائي لعمليات البيع المؤكدة وحساب أرباح المعرض وتكاليف البضائع.</p>
        </div>
      </div>

      {/* Sales Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="sales-stats-grid">
        <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <span className="p-2.5 bg-emerald-100 rounded-lg text-emerald-800 text-lg shrink-0">📈</span>
          <div>
            <p className="text-[11px] text-emerald-800 font-semibold leading-none">إجمالي قيمة المبيعات</p>
            <p className="text-xl font-black text-emerald-950 mt-1.5">{totalAmount} ر.س</p>
            <p className="text-[10px] text-[var(--color-wusha-stone)] mt-1">تضم كافة قنوات الدفع المفعلة</p>
          </div>
        </div>

        <div className="bg-[var(--color-wusha-cotton)] border border-[var(--color-wusha-cotton)] p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <span className="p-2.5 bg-slate-200 rounded-lg text-[var(--color-wusha-ink)] text-lg shrink-0">📦</span>
          <div>
            <p className="text-[11px] text-[var(--color-wusha-stone)] font-semibold leading-none">التكلفة التقديرية للبضائع</p>
            <p className="text-xl font-black text-[var(--color-wusha-ink)] mt-1.5">{totalCost} ر.s</p>
            <p className="text-[10px] text-[var(--color-wusha-stone)] mt-1">تكلفة تصنيع وشراء السيروم والكريمات</p>
          </div>
        </div>

        <div className="bg-teal-50/40 border border-teal-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <span className="p-2.5 bg-teal-100 rounded-lg text-teal-800 text-lg shrink-0">✨</span>
          <div>
            <p className="text-[11px] text-teal-800 font-semibold leading-none">صافي ربح المبيعات</p>
            <p className="text-xl font-black text-teal-950 mt-1.5">{totalProfit} ر.س</p>
            <p className="text-[10px] text-teal-700 font-semibold mt-1">
              نسبة الربح: {totalAmount > 0 ? Math.round((totalProfit / totalAmount) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel: Search + Payment Filters */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-[var(--color-wusha-stone)]" />
          <input
            type="text"
            placeholder="البحث باسم العميل، تفاصيل المنتجات، رقم الفاتورة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-9 py-1.5 text-xs bg-[var(--color-wusha-cotton)] border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none focus:border-amber-400 focus:bg-[var(--color-wusha-ivory)]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[var(--color-wusha-cotton)] p-0.5 rounded-lg border border-slate-200 text-xs font-medium text-[var(--color-wusha-stone)]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeFilter === 'all' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              الكل ({sales.length})
            </button>
            <button
              onClick={() => setActiveFilter('كاش')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                activeFilter === 'كاش' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              <Banknote className="w-3 h-3 text-emerald-600" />
              <span>كاش ({sales.filter(s => s.paymentMethod === 'كاش').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('بطاقة_مدى')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                activeFilter === 'بطاقة_مدى' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              <CreditCard className="w-3 h-3 text-blue-600" />
              <span>بطاقة ومدى ({sales.filter(s => s.paymentMethod === 'بطاقة' || s.paymentMethod === 'مدى').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('تحويل بنكي')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeFilter === 'تحويل بنكي' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              تحويل ({sales.filter(s => s.paymentMethod === 'تحويل بنكي').length})
            </button>
          </div>

          <div className="flex bg-[var(--color-wusha-cotton)] p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('table')}
              className={`p-1.5 rounded transition-all ${
                activeTab === 'table' ? 'bg-[var(--color-wusha-ivory)] text-[var(--color-wusha-ink)] shadow-sm' : 'text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-stone)]'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`p-1.5 rounded transition-all ${
                activeTab === 'gallery' ? 'bg-[var(--color-wusha-ivory)] text-[var(--color-wusha-ink)] shadow-sm' : 'text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-stone)]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sales Database Content */}
      {filteredSales.length === 0 ? (
        <div className="text-center py-10 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl shadow-sm">
          <Coins className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-xs text-[var(--color-wusha-stone)] mt-2">لا توجد عمليات مبيعات مسجلة في الفلتر الحالي.</p>
        </div>
      ) : activeTab === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">رقم العملية</th>
                  <th className="py-3 px-4 font-semibold">الطلب المرتبط</th>
                  <th className="py-3 px-4 font-semibold">العميل</th>
                  <th className="py-3 px-4 font-semibold">تفاصيل المنتجات</th>
                  <th className="py-3 px-4 font-semibold">قناة الدفع</th>
                  <th className="py-3 px-4 font-semibold">تاريخ البيع</th>
                  <th className="py-3 px-4 font-semibold">المبلغ</th>
                  <th className="py-3 px-4 font-semibold">التكلفة</th>
                  <th className="py-3 px-4 font-semibold">صافي الربح</th>
                  <th className="py-3 px-4 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => {
                  const profit = sale.amount - sale.estimatedCost;
                  const profitPct = sale.amount > 0 ? Math.round((profit / sale.amount) * 100) : 0;
                  return (
                    <tr key={sale.id} className="hover:bg-[var(--color-wusha-cotton)]">
                      <td className="py-3 px-4 font-mono font-bold text-[var(--color-wusha-ink)]">{sale.id}</td>
                      <td className="py-3 px-4 font-mono text-[var(--color-wusha-stone)]">{sale.orderId || 'كاشير مباشر'}</td>
                      <td className="py-3 px-4 font-semibold text-[var(--color-wusha-ink)]">{sale.customerName}</td>
                      <td className="py-3 px-4 max-w-xs truncate text-[var(--color-wusha-stone)]">{sale.details}</td>
                      <td className="py-3 px-4">
                        <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-ink)] px-2 py-0.5 rounded text-[10px] font-bold">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--color-wusha-stone)] text-[10px]">
                        {new Date(sale.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-black text-[var(--color-wusha-ink)]">{sale.amount} ر.س</td>
                      <td className="py-3 px-4 text-[var(--color-wusha-stone)]">{sale.estimatedCost} ر.س</td>
                      <td className="py-3 px-4 font-bold text-teal-700">
                        <span>{profit} ر.س</span>
                        <span className="text-[10px] text-teal-600 font-medium mr-1">({profitPct}%)</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm('هل ترغب بحذف سجل المبيعات هذا؟ لن يعود المخزون تلقائياً.')) {
                              deleteSale(sale.id);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-50 inline-block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GALLERY VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSales.map((sale) => {
            const profit = sale.amount - sale.estimatedCost;
            return (
              <div key={sale.id} className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden hover:border-slate-300 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-[var(--color-wusha-stone)] bg-[var(--color-wusha-cotton)] px-1.5 py-0.5 rounded">
                    {sale.id}
                  </span>
                  <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-ink)] px-2 py-0.5 rounded text-[10px] font-bold">
                    {sale.paymentMethod}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-[var(--color-wusha-ink)] text-sm">{sale.customerName}</h4>
                  <p className="text-[11px] text-[var(--color-wusha-stone)] mt-1 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(sale.timestamp).toLocaleDateString('ar-SA')} - {new Date(sale.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>

                <div className="bg-[var(--color-wusha-cotton)] rounded-lg p-2.5 text-xs text-[var(--color-wusha-stone)] font-medium">
                  {sale.details}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-wusha-cotton)] text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--color-wusha-stone)]">قيمة المبيعات</p>
                    <p className="font-black text-[var(--color-wusha-ink)] mt-0.5">{sale.amount} ر.س</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--color-wusha-stone)]">صافي الربح للعملية</p>
                    <p className="font-bold text-teal-700 mt-0.5">+{profit} ر.س</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cash balancing guide box */}
      <div className="bg-[var(--color-wusha-cotton)]/80 border border-slate-200 p-4 rounded-2xl text-xs text-[var(--color-wusha-stone)] space-y-2">
        <h4 className="font-bold text-[var(--color-wusha-ink)] flex items-center gap-1.5">
          <span>🧾</span> مطابقة مبيعات الكاش والشبكة للكاشير {settings.cashierName}:
        </h4>
        <p className="text-[var(--color-wusha-stone)]">في نهاية اليوم، يجب مطابقة التقارير الرقمية للشبكات وأجهزة مدى مع صندوق النقد الكاش في البوث.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono">
          <div className="bg-[var(--color-wusha-ivory)] p-2 rounded border border-[var(--color-wusha-cotton)] flex justify-between">
            <span className="text-[var(--color-wusha-stone)]">الشبكة ومدى (التقرير):</span>
            <strong className="text-blue-700">{cardSalesSum} ر.س</strong>
          </div>
          <div className="bg-[var(--color-wusha-ivory)] p-2 rounded border border-[var(--color-wusha-cotton)] flex justify-between">
            <span className="text-[var(--color-wusha-stone)]">الكاش (الصندوق):</span>
            <strong className="text-emerald-700">{cashSalesSum} ر.س</strong>
          </div>
          <div className="bg-[var(--color-wusha-ivory)] p-2 rounded border border-[var(--color-wusha-cotton)] flex justify-between">
            <span className="text-[var(--color-wusha-stone)]">التحويلات البنكية:</span>
            <strong className="text-[var(--color-wusha-ink)]">{transferSalesSum} ر.س</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
