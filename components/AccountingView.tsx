'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import { DailyReport } from '../lib/types';
import {
  TrendingUp,
  Sparkles,
  Receipt,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  AlertOctagon,
  FileText
} from 'lucide-react';

export default function AccountingView() {
  const {
    sales,
    expenses,
    products,
    reports,
    addReport,
    settings
  } = useWashi();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Form states for closing report
  const [notesProblems, setNotesProblems] = useState('');
  const [notesInventory, setNotesInventory] = useState('');
  const [notesRecommendations, setNotesRecommendations] = useState('');
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  // Calculations for Today (2026-07-05)
  const todayStr = '2026-07-05';
  
  const todaySales = sales.filter((s) => s.timestamp.startsWith(todayStr));
  const totalRevenues = todaySales.reduce((acc, curr) => acc + curr.amount, 0);
  const totalProductCost = todaySales.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  const todayExpenses = expenses.filter((e) => e.date === todayStr);
  const totalExpenses = todayExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalRevenues - totalExpenses;
  const grossProfitMargin = totalRevenues - totalProductCost;
  const marginPct = totalRevenues > 0 ? Math.round((grossProfitMargin / totalRevenues) * 100) : 0;

  // Breakdown by payment methods
  const cashSales = todaySales.filter((s) => s.paymentMethod === 'كاش').reduce((acc, curr) => acc + curr.amount, 0);
  const cardSales = todaySales.filter((s) => s.paymentMethod === 'بطاقة' || s.paymentMethod === 'مدى').reduce((acc, curr) => acc + curr.amount, 0);
  const transferSales = todaySales.filter((s) => s.paymentMethod === 'تحويل بنكي').reduce((acc, curr) => acc + curr.amount, 0);

  // Trigger Gemini API Analysis
  const runAiAnalysis = async () => {
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products,
          sales: todaySales,
          expenses: todayExpenses,
          date: todayStr,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setAiAnalysis(`⚠️ فشل تشغيل الذكاء الاصطناعي: ${data.analysis}`);
      } else {
        setAiAnalysis(data.analysis);
      }
    } catch (error) {
      console.error(error);
      setAiAnalysis('❌ حدث خطأ غير متوقع أثناء إرسال البيانات للتحليل المالي ذكاء اصطناعي.');
    } finally {
      setAiLoading(false);
    }
  };

  // Submit report to database
  const handleCloseDaySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const report: DailyReport = {
      id: todayStr,
      date: 'الأحد، 5 يوليو 2026',
      cashSales,
      cardSales,
      transferSales,
      expenses: totalExpenses,
      notesProblems: notesProblems || 'لم تواجهنا مشاكل تقنية أو تشغيلية بفضل الله.',
      notesInventory: notesInventory || 'المخزون متوفر ومطابق للرفوف.',
      notesRecommendations: notesRecommendations || 'الاستمرار بذات الخطة التسويقية وتجهيز كميات كافية.',
      isClosed: true,
    };

    addReport(report);
    setIsReportSubmitted(true);
    alert('🎉 تم تسليم تقرير إغلاق اليوم ومطابقة الحسابات بنجاح في قاعدة البيانات!');
  };

  const isTodayAlreadyClosed = reports.some(r => r.id === todayStr && r.isClosed);

  return (
    <div className="space-y-6" id="accounting-view-container">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-wusha-ink)] flex items-center gap-2">
          <span>📈</span> شاشة المحاسبة وإغلاق اليوم
        </h2>
        <p className="text-xs text-[var(--color-wusha-stone)] mt-1">راجع الدخل اليومي وقنوات الدفع ونفّذ المطابقة الحسابية وصنف أرباح بوث وشى بدعم الذكاء الاصطناعي.</p>
      </div>

      {/* Financial Statement Sheet */}
      <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-[var(--color-wusha-cotton)] pb-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm">ميزان مراجعة صندوق كاشير وشى — الأحد، 5 يوليو 2026</h3>
            <p className="text-[11px] text-[var(--color-wusha-stone)] mt-1">توليد تلقائي للقيم التشغيلية المسجلة حتى الآن.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isTodayAlreadyClosed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {isTodayAlreadyClosed ? '✓ تم الإغلاق المالي' : '⏳ مفتوح للمطابقة'}
          </span>
        </div>

        {/* Math Equation Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--color-wusha-cotton)] border border-[var(--color-wusha-cotton)] rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">إجمالي إيرادات المبيعات (أ)</p>
            <p className="text-xl font-black text-[var(--color-wusha-ink)] mt-2">+{totalRevenues} ر.س</p>
          </div>
          <div className="bg-[var(--color-wusha-cotton)] border border-[#f5e7e7] rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-[var(--color-wusha-stone)]">إجمالي المصاريف التشغيلية (ب)</p>
            <p className="text-xl font-black text-rose-600 mt-2">-{totalExpenses} ر.س</p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-emerald-800">صافي الربح الفعلي (أ - ب)</p>
            <p className="text-xl font-black text-emerald-900 mt-2">{netProfit} ر.س</p>
          </div>
          <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-teal-800">هامش الربح التجاري (%)</p>
            <p className="text-xl font-black text-teal-900 mt-2">{marginPct}%</p>
          </div>
        </div>

        {/* Detailed Breakdown channels */}
        <div className="border border-[var(--color-wusha-cotton)] rounded-2xl overflow-hidden text-xs">
          <div className="bg-[var(--color-wusha-cotton)]/60 p-3 font-bold text-[var(--color-wusha-ink)] border-b border-[var(--color-wusha-cotton)]">تحليل مصادر التدفقات المالية للمبيعات</div>
          <div className="divide-y divide-slate-100">
            <div className="p-3 flex justify-between">
              <span className="text-[var(--color-wusha-stone)] font-semibold flex items-center gap-1">💵 نقد كاش بالصندوق (Cash)</span>
              <strong className="text-[var(--color-wusha-ink)] font-mono">{cashSales} ر.س</strong>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[var(--color-wusha-stone)] font-semibold flex items-center gap-1">💳 الشبكة وبطاقات مدى والمستندات (POS)</span>
              <strong className="text-[var(--color-wusha-ink)] font-mono">{cardSales} ر.س</strong>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[var(--color-wusha-stone)] font-semibold flex items-center gap-1">🏦 تحويلات بنكية مباشرة (Bank)</span>
              <strong className="text-[var(--color-wusha-ink)] font-mono">{transferSales} ر.س</strong>
            </div>
          </div>
        </div>
      </div>

      {/* GEMINI AI ANALYZER */}
      <div className="bg-[#fcfbf6] border border-[#dfdbcf] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-3 items-center">
            <span className="text-2xl p-1.5 bg-[#f0eee4] border border-[#dfddd1] rounded-2xl shrink-0">✨</span>
            <div>
              <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm">مستشار وشى المالي والتشغيلي بالذكاء الاصطناعي (Gemini)</h3>
              <p className="text-[11px] text-[var(--color-wusha-stone)] mt-0.5">حلل مبيعات البوث الحالية، نسب النقد كاش والشبكة، ومستوى المخزون لابتكار توصيات تسويقية لليوم التالي.</p>
            </div>
          </div>
          <button
            onClick={runAiAnalysis}
            disabled={aiLoading}
            className="flex items-center gap-1.5 bg-[var(--color-wusha-ink)] hover:bg-[#3a2828] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-all shrink-0"
            id="btn-run-gemini-analysis"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>يرجى الانتظار...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>توليد توصيات الذكاء الاصطناعي</span>
              </>
            )}
          </button>
        </div>

        {/* AI response panel */}
        {aiLoading && (
          <div className="p-10 text-center border border-dashed border-slate-200 rounded-2xl bg-[var(--color-wusha-ivory)] space-y-2">
            <RefreshCw className="w-8 h-8 text-[var(--color-wusha-stone)] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[var(--color-wusha-stone)]">يقوم الذكاء الاصطناعي بدراسة قوائم المحاسبة وتحركات مبيعات بوث وشى الحالية...</p>
            <p className="text-[11px] text-[var(--color-wusha-stone)]">سيتم توليد تقرير فني منسق بأسلوب Notion خلال ثوانٍ معدودة.</p>
          </div>
        )}

        {!aiLoading && aiAnalysis && (
          <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-5 rounded-2xl text-xs text-[var(--color-wusha-ink)] leading-relaxed shadow-inner space-y-3 whitespace-pre-wrap font-sans">
            <div className="flex justify-between items-center border-b border-[var(--color-wusha-cotton)] pb-2 mb-3">
              <span className="font-bold text-[var(--color-wusha-ink)] flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>تحليل الأداء الذكي للبوث:</span>
              </span>
              <span className="text-[10px] text-[var(--color-wusha-stone)] font-mono">توليد حقيقي عبر Gemini • 2026-07-05</span>
            </div>
            {aiAnalysis}
          </div>
        )}
      </div>

      {/* FORM: EXECUTE AND CLOSE THE EVENT DAY */}
      {!isTodayAlreadyClosed && !isReportSubmitted ? (
        <form onSubmit={handleCloseDaySubmit} className="bg-[#fffdf9] border border-amber-200/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-amber-100 pb-3">
            <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
              <span>🔒</span> نموذج إغلاق اليوم ومطابقة الأرصدة
            </h3>
            <p className="text-[11px] text-[var(--color-wusha-ink)] mt-1">تعبئة نموذج الإغلاق تمنع أي إدخال إضافي في هذا التاريخ وتحفظ التقرير النهائي للأرشيف.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--color-wusha-ink)]">1. مشاكل تشغيلية واجهت البوث اليوم (اختياري)</label>
              <textarea
                rows={2}
                placeholder="مثال: ازدحام شديد عند الدفع، تعطل بسيط في قارئ مدى اللاسلكي وتم تلافيه بالدفع المباشر، تلف عبوة سيروم جلو..."
                value={notesProblems}
                onChange={(e) => setNotesProblems(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--color-wusha-ink)]">2. ملاحظات رصد المخزون وحاجة التعبئة بالرفوف (اختياري)</label>
              <textarea
                rows={2}
                placeholder="مثال: كريم البابونج البري نفد بالكامل ونحتاج جلب كرتون إضافي من المستودع المركزي قبل الافتتاح غداً..."
                value={notesInventory}
                onChange={(e) => setNotesInventory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--color-wusha-ink)]">3. توصيات تشغيلية وتوزيع العينات للغد (اختياري)</label>
              <textarea
                rows={2}
                placeholder="مثال: فصل موظف التعبئة للتجهيز والترتيب وتسريع عملية المحاسبة..."
                value={notesRecommendations}
                onChange={(e) => setNotesRecommendations(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-wusha-cotton)] flex justify-between items-center flex-wrap gap-3">
            <p className="text-[11px] text-[var(--color-wusha-stone)]">ملاحظة: تأكد من مطابقة مبالغ الكاشير الفعلي قبل التسليم.</p>
            <button
              type="submit"
              className="bg-[var(--color-wusha-ink)] hover:bg-[#3a2828] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm"
              id="btn-close-day-report"
            >
              تأكيد وإغلاق الحسابات اليومية
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-emerald-950 text-sm">تم إغلاق حسابات اليوم بالكامل بنجاح!</h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            تم حفظ ميزان المراجعة، قيمة الإيرادات، قنوات الدفع، التكاليف والملاحظات وتصديرها لقاعدة بيانات <strong>«التقارير اليومية»</strong>. الحسابات محمية حالياً من أي تعديل يدوياً.
          </p>
        </div>
      )}
    </div>
  );
}
