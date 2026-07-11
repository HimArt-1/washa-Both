'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import {
  History,
  Search,
  Filter,
  PlusCircle,
  MinusCircle,
  Clock,
  User,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

export default function MovementsView() {
  const { movements, products } = useWashi();
  const [searchTerm, setSearchTerm] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'all' | '➕' | '➖'>('all');

  // Search logic
  const filteredMovements = movements.filter((m) => {
    const prod = products.find((p) => p.id === m.productId);
    const prodName = prod ? prod.name.toLowerCase() : '';
    const skuName = prod ? prod.sku.toLowerCase() : '';
    
    const matchesSearch =
      prodName.includes(searchTerm.toLowerCase()) ||
      skuName.includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDirection = directionFilter === 'all' ? true : m.direction === directionFilter;

    return matchesSearch && matchesDirection;
  });

  return (
    <div className="space-y-6" id="movements-view-container">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-wusha-ink)] flex items-center gap-2">
            <span>🔁</span> سجل حركة المخزون (Audit Log)
          </h2>
          <p className="text-xs text-[var(--color-wusha-stone)] mt-1">سجل تفصيلي مؤتمت يوثق كل عمليات الزيادة والنقصان في عبوات البوث لتجنّب أي تلاعب.</p>
        </div>
      </div>

      {/* Statistics board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3.5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">إجمالي العمليات المسجلة</p>
          <p className="text-lg font-black text-[var(--color-wusha-ink)] mt-1">{movements.length} حركات</p>
        </div>
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3.5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">عمليات التوريد (➕)</p>
          <p className="text-lg font-black text-emerald-700 mt-1">
            {movements.filter(m => m.direction === '➕').length} توريدات
          </p>
        </div>
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3.5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">عمليات السحب والمبيعات (➖)</p>
          <p className="text-lg font-black text-rose-700 mt-1">
            {movements.filter(m => m.direction === '➖').length} سحوبات
          </p>
        </div>
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3.5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">تلفيات وهدر البوث</p>
          <p className="text-lg font-black text-amber-700 mt-1">
            {movements.filter(m => m.type === 'تلف').length} عبوات تالفة
          </p>
        </div>
      </div>

      {/* Controls: Search & Direction tabs */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-[var(--color-wusha-stone)]" />
          <input
            type="text"
            placeholder="البحث باسم الصنف، رقم الحركة، أو الملاحظة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-9 py-1.5 text-xs bg-[var(--color-wusha-cotton)] border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--color-wusha-cotton)] p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setDirectionFilter('all')}
              className={`px-3 py-1 rounded transition-all ${
                directionFilter === 'all' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'text-[var(--color-wusha-stone)]'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setDirectionFilter('➕')}
              className={`px-3 py-1 rounded transition-all text-emerald-700 flex items-center gap-1 ${
                directionFilter === '➕' ? 'bg-[var(--color-wusha-ivory)] font-bold shadow-sm' : 'opacity-80'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إضافة (➕)</span>
            </button>
            <button
              onClick={() => setDirectionFilter('➖')}
              className={`px-3 py-1 rounded transition-all text-rose-700 flex items-center gap-1 ${
                directionFilter === '➖' ? 'bg-[var(--color-wusha-ivory)] font-bold shadow-sm' : 'opacity-80'
              }`}
            >
              <MinusCircle className="w-3.5 h-3.5" />
              <span>سحب (➖)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movements list/table */}
      {filteredMovements.length === 0 ? (
        <div className="text-center py-10 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl shadow-sm">
          <History className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-xs text-[var(--color-wusha-stone)] mt-2">لا توجد حركات مخزون مطابقة للخيارات الحالية.</p>
        </div>
      ) : (
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">رقم الحركة</th>
                  <th className="py-3 px-4 font-semibold">المنتج المستهدف</th>
                  <th className="py-3 px-4 font-semibold">SKU المنتج</th>
                  <th className="py-3 px-4 font-semibold">نوع الحركة</th>
                  <th className="py-3 px-4 font-semibold">الاتجاه</th>
                  <th className="py-3 px-4 font-semibold">الكمية</th>
                  <th className="py-3 px-4 font-semibold">التاريخ والوقت</th>
                  <th className="py-3 px-4 font-semibold">المسؤول</th>
                  <th className="py-3 px-4 font-semibold">الملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredMovements.map((move) => {
                  const prod = products.find((p) => p.id === move.productId);
                  return (
                    <tr key={move.id} className="hover:bg-[var(--color-wusha-cotton)]/40">
                      <td className="py-3 px-4 font-mono font-bold text-[var(--color-wusha-stone)]">{move.id}</td>
                      <td className="py-3 px-4 font-bold text-[var(--color-wusha-ink)]">{prod?.name || 'صنف محذوف'}</td>
                      <td className="py-3 px-4 font-mono text-[var(--color-wusha-stone)]">{prod?.sku || '-'}</td>
                      <td className="py-3 px-4">
                        <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-ink)] px-2 py-0.5 rounded text-[10px] font-bold">
                          {move.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-black text-sm ${
                            move.direction === '➕' ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {move.direction}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-[var(--color-wusha-ink)]">{move.quantity} عبوة</td>
                      <td className="py-3 px-4 text-[var(--color-wusha-stone)] font-mono text-[10px]">
                        {new Date(move.date).toLocaleDateString('ar-SA')} - {new Date(move.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-wusha-stone)]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[var(--color-wusha-stone)]" />
                          <span>{move.handler}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-wusha-stone)] max-w-xs truncate">{move.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
