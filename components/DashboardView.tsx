'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import {
  Sparkles,
  ShoppingCart,
  Coins,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  TrendingUp,
  Lock,
  Plus,
  ArrowLeft,
  Check,
  ChevronRight
} from 'lucide-react';

export default function DashboardView() {
  const {
    products,
    orders,
    sales,
    expenses,
    completeOrder,
    setActivePage,
    settings,
    addTask
  } = useWashi();

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'مراجعة كافة الطلبات المكتملة وتأكيد تسليمها', checked: true },
    { id: 2, text: 'تحويل الطلبات المكتملة المسجلة إلى مبيعات فعلية', checked: true },
    { id: 3, text: 'مطابقة نقدية صندوق الكاشير الفعلي مع الكاشير الرقمي', checked: false },
    { id: 4, text: 'مطابقة وتأكيد فواتير مدى والشبكة المطبوعة مع المبيعات الرقمية', checked: false },
    { id: 5, text: 'تسجيل كافة فواتير المصاريف التي تم سدادها خلال اليوم', checked: false },
    { id: 6, text: 'مراجعة مستويات المخزون وحصر الأصناف المنخفضة', checked: false },
    { id: 7, text: 'إنشاء التقرير اليومي النهائي وحساب الأرباح وعمل الإغلاق', checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Calculate metrics for Today (2026-07-05)
  const todayStr = '2026-07-05';

  const getIsToday = (isoString: string) => {
    return isoString.startsWith(todayStr);
  };

  // Sales Today
  const todaySales = sales.filter(s => getIsToday(s.timestamp));
  const todaySalesSum = todaySales.reduce((acc, curr) => acc + curr.amount, 0);

  // Orders Today
  const todayOrders = orders.filter(o => getIsToday(o.orderDate));
  const newOrders = todayOrders.filter(o => o.orderStatus === 'جديد');
  const preparingOrders = orders.filter(o => o.orderStatus === 'قيد التجهيز');
  const completedOrdersToday = todayOrders.filter(o => o.orderStatus === 'مكتمل');
  
  // Expenses Today
  const todayExpensesSum = expenses
    .filter(e => e.date === todayStr)
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Stock Warns
  const lowStockProducts = products.filter(p => p.quantity <= p.minAlert);

  // Net Profit Today
  const netProfitToday = todaySalesSum - todayExpensesSum;

  // Prepaid Today
  const prepaidTodayCount = todayOrders.filter(o => o.paymentStatus === 'مدفوع مسبقاً').length;

  return (
    <div className="space-y-6" id="dashboard-view-container">
      {/* Welcome Callout Header */}
      <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex gap-4 items-start">
          <img src="/logo.png" alt="Washa Logo" className="w-14 h-14 object-contain bg-white p-2 rounded-2xl border border-[var(--color-wusha-pale-gold)] shrink-0 shadow-sm" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div>
            <h2 className="text-lg font-bold text-[var(--color-wusha-ink)]">لوحة تحكم وشى</h2>
            <p className="text-sm text-[var(--color-wusha-stone)] mt-1">
              أهلاً بك في نظام تشغيل بوث براند <strong>{settings.boothName}</strong>. تابع المبيعات، الطلبات، المخزون وأنجز إغلاق اليوم بكفاءة.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActivePage('cashier')}
            className="flex items-center gap-2 bg-[var(--color-wusha-muted-gold)] text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-[#b0946a] transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>وضع الكاشير السريع (الجوال)</span>
          </button>
          <button
            onClick={() => setActivePage('orders')}
            className="flex items-center gap-1.5 border border-[#dfdeb6] bg-[#f8f7eb] text-[var(--color-wusha-ink)] font-medium px-3 py-2 rounded-lg text-sm hover:bg-[#efeedb] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>طلب جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {/* KPI 1 */}
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[var(--color-wusha-stone)]">مبيعات اليوم</span>
            <span className="bg-emerald-50 text-emerald-700 p-1.5 rounded-lg border border-emerald-100">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[var(--color-wusha-ink)]">{todaySalesSum} <span className="text-xs font-medium text-[var(--color-wusha-stone)]">ر.س</span></h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ {todaySales.length} عمليات بيع مؤكدة</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[var(--color-wusha-stone)]">طلبات اليوم</span>
            <span className="bg-blue-50 text-blue-700 p-1.5 rounded-lg border border-blue-100">
              <ShoppingCart className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[var(--color-wusha-ink)]">{todayOrders.length} <span className="text-xs font-medium text-[var(--color-wusha-stone)]">طلب</span></h3>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">✓ {completedOrdersToday.length} مكتمل | {newOrders.length} جديد</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[var(--color-wusha-stone)]">مصاريف اليوم</span>
            <span className="bg-orange-50 text-orange-700 p-1.5 rounded-lg border border-orange-100">
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[var(--color-wusha-ink)]">{todayExpensesSum} <span className="text-xs font-medium text-[var(--color-wusha-stone)]">ر.س</span></h3>
            <p className="text-[11px] text-orange-600 font-semibold mt-1">تم سدادها نقدياً أو بطاقة</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[var(--color-wusha-stone)]">صافي ربح اليوم</span>
            <span className="bg-teal-50 text-teal-700 p-1.5 rounded-lg border border-teal-100">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-black ${netProfitToday >= 0 ? 'text-teal-700' : 'text-rose-600'}`}>
              {netProfitToday} <span className="text-xs font-medium text-[var(--color-wusha-stone)]">ر.س</span>
            </h3>
            <p className="text-[11px] text-[var(--color-wusha-stone)] mt-1">صافي الإيرادات بعد خصم المصاريف</p>
          </div>
        </div>
      </div>

      {/* Mini KPI indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-amber-50/70 border border-amber-100/80 rounded-lg px-3 py-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-wusha-stone)] leading-none">طلبات قيد التجهيز</p>
            <p className="text-xs font-bold text-amber-800 mt-0.5">{preparingOrders.length} طلبات نشطة</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-wusha-stone)] leading-none">مخزون حرج / نافد</p>
            <p className="text-xs font-bold text-rose-800 mt-0.5">{lowStockProducts.length} منتجات تحتاج انتباه</p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-600" />
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-wusha-stone)] leading-none">طلبات مدفوعة مسبقاً</p>
            <p className="text-xs font-bold text-purple-800 mt-0.5">{prepaidTodayCount} شحنات محجوزة</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-wusha-stone)] leading-none">مبيعات مكتملة اليوم</p>
            <p className="text-xs font-bold text-emerald-800 mt-0.5">{completedOrdersToday.length} طلبات تم تسليمها</p>
          </div>
        </div>
      </div>

      {/* Main Core Columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side (66% Width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active / New Orders View */}
          <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--color-wusha-cotton)] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-50 rounded text-amber-600">🆕</span>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm">الطلبات الجديدة والنشطة بالمعرض</h3>
              </div>
              <button
                onClick={() => setActivePage('orders')}
                className="text-xs text-amber-700 hover:underline font-semibold flex items-center gap-1"
              >
                <span>إدارة كافة الطلبات ({orders.length})</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {newOrders.length === 0 && preparingOrders.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-wusha-stone)]">
                <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs font-medium mt-2">لا توجد طلبات جديدة أو قيد التجهيز حالياً.</p>
                <p className="text-[11px] text-[var(--color-wusha-stone)]">جميع طلبات المعرض اليوم مكتملة ومغلقة!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Render New Orders First */}
                {[...newOrders, ...preparingOrders].slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className={`p-3.5 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors ${
                      order.orderStatus === 'جديد'
                        ? 'border-amber-100 bg-amber-50/20 hover:bg-amber-50/40'
                        : 'border-[var(--color-wusha-cotton)] bg-[var(--color-wusha-ivory)] hover:bg-[var(--color-wusha-cotton)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--color-wusha-ink)] bg-[var(--color-wusha-cotton)] px-1.5 py-0.5 rounded">
                          {order.id}
                        </span>
                        <h4 className="font-bold text-[var(--color-wusha-ink)] text-sm">{order.customerName}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            order.priority === 'عاجل'
                              ? 'bg-rose-100 text-rose-700'
                              : order.priority === 'مهم'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)]'
                          }`}
                        >
                          {order.priority}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-wusha-stone)] mt-1">
                        المنتجات: {order.products.length} أصناف | القيمة: <strong className="text-[var(--color-wusha-ink)]">{order.totalAmount} ر.س</strong>
                      </p>
                      {order.notes && (
                        <p className="text-[11px] text-[var(--color-wusha-stone)] italic mt-0.5 truncate max-w-md">«{order.notes}»</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {order.orderStatus === 'جديد' ? (
                        <button
                          onClick={() => {
                            completeOrder(order.id, settings.cashierName || 'الكاشير');
                          }}
                          className="w-full sm:w-auto text-xs bg-[var(--color-wusha-ink)] text-white font-semibold px-3 py-1.5 rounded hover:bg-[#3a2828] transition-colors"
                        >
                          تسليم واستلام الكاشير
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            completeOrder(order.id, settings.cashierName || 'الكاشير');
                          }}
                          className="w-full sm:w-auto text-xs bg-[var(--color-wusha-muted-gold)] text-white font-semibold px-3 py-1.5 rounded hover:bg-[#b0946a] transition-colors"
                        >
                          إكمال وتسليم الطلب
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Sales Summary */}
          <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--color-wusha-cotton)] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-emerald-50 rounded text-emerald-600">💰</span>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm">عمليات المبيعات المؤكدة اليوم ({todaySales.length})</h3>
              </div>
              <button
                onClick={() => setActivePage('sales')}
                className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1"
              >
                <span>شاشة المبيعات</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySales.length === 0 ? (
              <div className="text-center py-6 text-[var(--color-wusha-stone)]">
                <p className="text-xs">لم تسجل مبيعات فعلية بعد لهذا اليوم.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-[var(--color-wusha-ivory)] text-[var(--color-wusha-stone)] border-b border-[var(--color-wusha-cotton)]">
                      <th className="py-2.5 px-2 font-semibold">رقم العملية</th>
                      <th className="py-2.5 px-2 font-semibold">العميل</th>
                      <th className="py-2.5 px-2 font-semibold">المنتجات المباعة</th>
                      <th className="py-2.5 px-2 font-semibold">طريقة الدفع</th>
                      <th className="py-2.5 px-2 font-semibold">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todaySales.slice(0, 5).map((sale) => (
                      <tr key={sale.id} className="hover:bg-[var(--color-wusha-cotton)]">
                        <td className="py-2.5 px-2 font-bold text-[var(--color-wusha-stone)] font-mono">{sale.id}</td>
                        <td className="py-2.5 px-2 text-[var(--color-wusha-ink)] font-medium">{sale.customerName}</td>
                        <td className="py-2.5 px-2 text-[var(--color-wusha-stone)] truncate max-w-xs">{sale.details}</td>
                        <td className="py-2.5 px-2">
                          <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-ink)] px-1.5 py-0.5 rounded font-medium text-[10px]">
                            {sale.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-bold text-emerald-700">{sale.amount} ر.س</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side (33% Width) */}
        <div className="space-y-6">
          {/* Inventory Warn Board */}
          <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--color-wusha-cotton)] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-rose-50 rounded text-rose-600">⚠️</span>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm">تنبيهات المخزون بالبوث</h3>
              </div>
              <button
                onClick={() => setActivePage('products')}
                className="text-xs text-rose-700 hover:underline font-semibold"
              >
                تعبئة الرفوف
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="text-center py-4 text-[var(--color-wusha-stone)]">
                <p className="text-xs">🟢 جميع مستويات المنتجات بالرفوف كافية ومستقرة!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.slice(0, 4).map((prod) => (
                  <div key={prod.id} className="flex justify-between items-center p-2.5 rounded-lg border border-rose-100 bg-rose-50/30 text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--color-wusha-ink)] truncate">{prod.name}</p>
                      <p className="text-[10px] text-[var(--color-wusha-stone)] mt-0.5">SKU: {prod.sku}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <span className={`px-2 py-0.5 rounded font-black ${prod.quantity === 0 ? 'bg-red-500 text-white' : 'bg-rose-100 text-rose-800'}`}>
                        {prod.quantity === 0 ? '⚫ نفد' : `${prod.quantity} عبوة`}
                      </span>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length > 4 && (
                  <p className="text-[11px] text-[var(--color-wusha-stone)] text-center font-medium">
                    + هناك {lowStockProducts.length - 4} منتجات أخرى منخفضة المخزون
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Daily Close of Day checklist */}
          <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-[var(--color-wusha-pale-gold)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌙</span>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm">خطوات إغلاق يوم البوث</h3>
              </div>
              <p className="text-[11px] text-[var(--color-wusha-stone)] mt-1">قائمة فحص تشغيلية تضمن تطابق الكاشير والمخزون قبل مغادرة المعرض.</p>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-2.5 text-xs text-[var(--color-wusha-ink)] cursor-pointer user-select-none hover:text-[var(--color-wusha-ink)]"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 accent-slate-800 rounded border-slate-300 text-[var(--color-wusha-ink)] focus:ring-slate-500"
                  />
                  <span className={`${item.checked ? 'line-through text-[var(--color-wusha-stone)]' : 'font-medium'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-2 border-t border-[var(--color-wusha-pale-gold)]">
              <button
                onClick={() => {
                  // Add a closing task automatically
                  addTask({
                    title: 'تقرير نهاية يوم المعرض وتحليل الأداء مع هشام',
                    stage: 'بعد الإغلاق',
                    priority: 'عالية',
                    status: 'قيد التنفيذ',
                    handler: settings.cashierName || 'هشام',
                    notes: 'مراجعة المبيعات الكلية والمخازن.',
                  });
                  setActivePage('accounting');
                }}
                className="w-full flex items-center justify-center gap-1 bg-[var(--color-wusha-ink)] hover:bg-[#3a2828] text-white font-medium py-2 rounded-lg text-xs shadow-sm transition-colors"
                id="btn-goto-close"
              >
                <span>الذهاب لشاشة إغلاق اليوم</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
