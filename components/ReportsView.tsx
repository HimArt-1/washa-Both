'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import { DailyReport } from '../lib/types';
import {
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Receipt
} from 'lucide-react';

export default function ReportsView() {
  const { reports } = useWashi();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6" id="reports-view-container">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-wusha-ink)] flex items-center gap-2">
          <span>📅</span> أرشيف التقارير اليومية وإغلاق المعرض
        </h2>
        <p className="text-xs text-[var(--color-wusha-stone)] mt-1">شاهد السجلات المالية والتشغيلية المعتمدة لليام السابقة وإحصاءات الأداء العام لبراند وشى.</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl shadow-sm">
          <FileText className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
          <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm mt-3">الأرشيف فارغ حالياً</h3>
          <p className="text-xs text-[var(--color-wusha-stone)] mt-1">يتم تعبئة الأرشيف تلقائياً فور قيام مدير البوث بعمل إغلاق الحسابات من شاشة المحاسبة.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const isExpanded = expandedId === report.id;
            const totalSales = report.cashSales + report.cardSales + report.transferSales;
            const netProfit = totalSales - report.expenses;
            const profitMargin = totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0;

            return (
              <div
                key={report.id}
                className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(report.id)}
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-[var(--color-wusha-cotton)] transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <span className="text-2xl p-2 bg-[var(--color-wusha-cotton)] border border-slate-200 rounded-2xl shrink-0">📅</span>
                    <div>
                      <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm">{report.date}</h3>
                      <p className="text-[11px] text-[var(--color-wusha-stone)] font-mono mt-0.5">رمز التقرير: REP-{report.id}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="text-right">
                      <p className="text-[10px] text-[var(--color-wusha-stone)]">إجمالي المبيعات</p>
                      <p className="font-black text-[var(--color-wusha-ink)] mt-0.5">{totalSales} ر.س</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[var(--color-wusha-stone)]">صافي الربح</p>
                      <p className="font-black text-emerald-700 mt-0.5">+{netProfit} ر.س</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[var(--color-wusha-stone)]">تم الإغلاق</p>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold block mt-0.5">✓ مؤكد</span>
                    </div>
                    <button className="text-[var(--color-wusha-stone)] p-1 hover:text-[var(--color-wusha-stone)]">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-[var(--color-wusha-cotton)] bg-[#fafafa]/50 p-6 space-y-6 text-xs text-[var(--color-wusha-ink)] leading-relaxed">
                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-4 rounded-2xl shadow-xs">
                      <div>
                        <h4 className="font-bold text-[var(--color-wusha-ink)] flex items-center gap-1 mb-2">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span>تفاصيل مبيعات اليوم</span>
                        </h4>
                        <ul className="space-y-1 bg-[var(--color-wusha-cotton)] p-2.5 rounded text-[11px] font-medium text-[var(--color-wusha-stone)]">
                          <li className="flex justify-between">
                            <span>مبيعات كاش:</span>
                            <strong>{report.cashSales} ر.س</strong>
                          </li>
                          <li className="flex justify-between">
                            <span>مبيعات مدى وبطاقة:</span>
                            <strong>{report.cardSales} ر.س</strong>
                          </li>
                          <li className="flex justify-between">
                            <span>مبيعات تحويلات:</span>
                            <strong>{report.transferSales} ر.س</strong>
                          </li>
                          <li className="flex justify-between border-t border-slate-200 pt-1 font-bold text-[var(--color-wusha-ink)]">
                            <span>المجموع الكلي:</span>
                            <strong>{totalSales} ر.س</strong>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-[var(--color-wusha-ink)] flex items-center gap-1 mb-2">
                          <Receipt className="w-4 h-4 text-orange-600" />
                          <span>مصاريف التشغيل</span>
                        </h4>
                        <div className="bg-[var(--color-wusha-cotton)] p-3 rounded h-[85px] flex flex-col justify-center">
                          <p className="text-[10px] text-[var(--color-wusha-stone)]">المجموع المصروف:</p>
                          <p className="text-base font-black text-rose-600 mt-1">{report.expenses} ر.س</p>
                          <p className="text-[9px] text-[var(--color-wusha-stone)] mt-1">تضم مطبوعات وشى ومصاريف الضيافة</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-[var(--color-wusha-ink)] flex items-center gap-1 mb-2">
                          <TrendingUp className="w-4 h-4 text-teal-600" />
                          <span>النتيجة والربحية</span>
                        </h4>
                        <div className="bg-[var(--color-wusha-cotton)] p-3 rounded h-[85px] flex flex-col justify-center">
                          <p className="text-[10px] text-[var(--color-wusha-stone)]">صافي الأرباح المحققة:</p>
                          <p className="text-base font-black text-emerald-800 mt-1">+{netProfit} ر.س</p>
                          <p className="text-[10px] text-emerald-600 font-bold mt-1">نسبة هامش الربح: {profitMargin}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Text Areas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1.5 bg-[var(--color-wusha-ivory)] p-4 rounded-2xl border border-[var(--color-wusha-cotton)]">
                        <h5 className="font-bold text-[var(--color-wusha-ink)] flex items-center gap-1 text-[11px] border-b pb-1 mb-2 text-rose-800">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>العقبات والمشاكل المرصودة:</span>
                        </h5>
                        <p className="italic text-[var(--color-wusha-stone)]">«{report.notesProblems}»</p>
                      </div>

                      <div className="space-y-1.5 bg-[var(--color-wusha-ivory)] p-4 rounded-2xl border border-[var(--color-wusha-cotton)]">
                        <h5 className="font-bold text-[var(--color-wusha-ink)] flex items-center gap-1 text-[11px] border-b pb-1 mb-2 text-amber-800">
                          <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>رصد المخزون والرفوف:</span>
                        </h5>
                        <p className="italic text-[var(--color-wusha-stone)]">«{report.notesInventory}»</p>
                      </div>

                      <div className="space-y-1.5 bg-[var(--color-wusha-ivory)] p-4 rounded-2xl border border-[var(--color-wusha-cotton)]">
                        <h5 className="font-bold text-[var(--color-wusha-ink)] flex items-center gap-1 text-[11px] border-b pb-1 mb-2 text-teal-800">
                          <Lightbulb className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>أهم توصيات ومقترحات الغد:</span>
                        </h5>
                        <p className="italic text-[var(--color-wusha-stone)]">«{report.notesRecommendations}»</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
