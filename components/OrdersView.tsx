'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import { Order, Product } from '../lib/types';
import {
  Plus,
  Search,
  Filter,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  LayoutGrid,
  Table as TableIcon,
  Kanban,
  User,
  Phone,
  Calendar,
  Sparkles,
  ChevronDown,
  X,
  CreditCard,
  Check
} from 'lucide-react';

export default function OrdersView() {
  const {
    orders,
    products,
    addOrder,
    editOrder,
    deleteOrder,
    completeOrder,
    settings
  } = useWashi();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'table' | 'kanban' | 'gallery'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'كاش' | 'بطاقة' | 'مدى' | 'تحويل بنكي'>('مدى');
  const [paymentStatus, setPaymentStatus] = useState<'مدفوع مسبقاً' | 'مدفوع' | 'عند الاستلام' | 'غير مدفوع'>('مدفوع');
  const [orderStatus, setOrderStatus] = useState<'جديد' | 'قيد التجهيز' | 'جاهز' | 'مكتمل' | 'ملغي'>('جديد');
  const [source, setSource] = useState<'طلب مباشر' | 'كاشير البوث' | 'واتساب' | 'إنستقرام' | 'أخرى'>('كاشير البوث');
  const [priority, setPriority] = useState<'عادي' | 'عاجل' | 'مهم'>('عادي');
  const [notes, setNotes] = useState('');

  // Search and filter logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Prefill Template helper
  const applyTemplate = (type: 'direct' | 'prepaid') => {
    if (type === 'direct') {
      setCustomerName('عميل عابر');
      setCustomerPhone('0500000000');
      setSource('كاشير البوث');
      setPaymentStatus('مدفوع');
      setOrderStatus('مكتمل');
      setPriority('عادي');
      setNotes('مبيعات فورية مباشرة بالبوث كاشير');
    } else {
      setCustomerName('حجز إنستقرام');
      setCustomerPhone('0599999999');
      setSource('إنستقرام');
      setPaymentStatus('مدفوع مسبقاً');
      setOrderStatus('قيد التجهيز');
      setPriority('مهم');
      setNotes('طلب شحن وتسليم من البوث - مدفوع مسبقاً بالتحويل');
    }
  };

  const handleProductToggle = (prodId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert('الرجاء اختيار منتج واحد على الأقل للطلب!');
      return;
    }

    addOrder({
      customerName: customerName || 'عميل عابر',
      customerPhone: customerPhone || 'غير متوفر',
      products: selectedProducts,
      paymentMethod,
      paymentStatus,
      orderStatus,
      source,
      priority,
      notes,
    });

    // Reset states
    setCustomerName('');
    setCustomerPhone('');
    setSelectedProducts([]);
    setPaymentMethod('مدى');
    setPaymentStatus('مدفوع');
    setOrderStatus('جديد');
    setSource('كاشير البوث');
    setPriority('عادي');
    setNotes('');
    setShowAddModal(false);
  };

  // Kanban groups helper
  const kanbanColumns: { id: 'جديد' | 'قيد التجهيز' | 'جاهز' | 'مكتمل' | 'ملغي'; label: string; color: string }[] = [
    { id: 'جديد', label: '🆕 جديدة', color: 'border-t-blue-400 bg-blue-50/20' },
    { id: 'قيد التجهيز', label: '🟡 قيد التجهيز', color: 'border-t-amber-400 bg-amber-50/20' },
    { id: 'جاهز', label: '🟢 جاهزة للاستلام', color: 'border-t-teal-400 bg-teal-50/20' },
    { id: 'مكتمل', label: '✅ مكتملة', color: 'border-t-emerald-400 bg-emerald-50/20' },
    { id: 'ملغي', label: '❌ ملغية', color: 'border-t-rose-400 bg-rose-50/20' },
  ];

  return (
    <div className="space-y-6" id="orders-view-container">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-wusha-ink)] flex items-center gap-2">
            <span>🛒</span> قاعدة بيانات الطلبات
          </h2>
          <p className="text-xs text-[var(--color-wusha-stone)] mt-1">سجل مبيعات البوث وحجوزات الواتساب والإنستقرام وتحكّم بحالتها التشغيلية.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#1a1a1a] text-white hover:bg-[#333333] px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
          id="btn-add-order-modal"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء طلب جديد</span>
        </button>
      </div>

      {/* Control Bar: Search + Filter Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-[var(--color-wusha-stone)]" />
          <input
            type="text"
            placeholder="البحث برقم الطلب، اسم العميل، أو الجوال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-9 py-1.5 text-xs bg-[var(--color-wusha-cotton)] border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-[var(--color-wusha-ivory)]"
          />
        </div>

        {/* Filters and Views Selection */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-1 bg-[var(--color-wusha-cotton)] border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-[var(--color-wusha-stone)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[var(--color-wusha-stone)] focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">كل الحالات</option>
              <option value="جديد">جديدة</option>
              <option value="قيد التجهيز">قيد التجهيز</option>
              <option value="جاهز">جاهزة للاستلام</option>
              <option value="مكتمل">مكتملة</option>
              <option value="ملغي">ملغية</option>
            </select>
          </div>

          {/* View Tab Switches (Notion style) */}
          <div className="flex bg-[var(--color-wusha-cotton)] p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
                activeTab === 'table' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">جدول</span>
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
                activeTab === 'kanban' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">كانبان</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
                activeTab === 'gallery' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">بطاقات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database View Content */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl">
          <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
          <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm mt-3">لا توجد طلبات مطابقة</h3>
          <p className="text-xs text-[var(--color-wusha-stone)] mt-1">جرب تعديل عبارة البحث أو فلتر الحالات الحالي.</p>
        </div>
      ) : activeTab === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">رقم الطلب</th>
                  <th className="py-3 px-4 font-semibold">العميل والجوال</th>
                  <th className="py-3 px-4 font-semibold">المنتجات المطلوبة</th>
                  <th className="py-3 px-4 font-semibold">المبلغ الإجمالي</th>
                  <th className="py-3 px-4 font-semibold">طريقة الدفع</th>
                  <th className="py-3 px-4 font-semibold">حالة الدفع</th>
                  <th className="py-3 px-4 font-semibold">تاريخ الطلب</th>
                  <th className="py-3 px-4 font-semibold">الحالة التشغيلية</th>
                  <th className="py-3 px-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--color-wusha-cotton)]">
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--color-wusha-ink)]">{order.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[var(--color-wusha-ink)]">{order.customerName}</div>
                      <div className="text-[10px] text-[var(--color-wusha-stone)] font-mono">{order.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {order.products
                        .map((pid) => products.find((p) => p.id === pid)?.name || 'أخرى')
                        .join(' + ')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[var(--color-wusha-ink)]">{order.totalAmount} ر.س</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-ink)] px-2 py-0.5 rounded font-medium text-[10px]">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.paymentStatus === 'مدفوع' || order.paymentStatus === 'مدفوع مسبقاً'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-wusha-stone)] font-mono text-[10px]">
                      {new Date(order.orderDate).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'مكتمل'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'قيد التجهيز'
                            ? 'bg-amber-100 text-amber-800'
                            : order.orderStatus === 'جاهز'
                            ? 'bg-teal-100 text-teal-800'
                            : order.orderStatus === 'ملغي'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.orderStatus === 'جديد'
                          ? '🆕 جديد'
                          : order.orderStatus === 'قيد التجهيز'
                          ? '🟡 قيد التجهيز'
                          : order.orderStatus === 'جاهز'
                          ? '🟢 جاهز'
                          : order.orderStatus === 'ملغي'
                          ? '❌ ملغي'
                          : '✅ مكتمل'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {order.orderStatus !== 'مكتمل' && order.orderStatus !== 'ملغي' ? (
                        <button
                          onClick={() => completeOrder(order.id, settings.cashierName || 'كاشير')}
                          className="bg-[var(--color-wusha-ink)] text-white font-bold px-2.5 py-1 rounded text-[10px] hover:bg-[#3a2828]"
                        >
                          إكمال وتسليم
                        </button>
                      ) : (
                        <span className="text-[var(--color-wusha-stone)] text-[10px]">مغلق ومحمي</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'kanban' ? (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {kanbanColumns.map((col) => {
            const columnOrders = filteredOrders.filter((o) => o.orderStatus === col.id);
            return (
              <div key={col.id} className={`p-3 rounded-2xl border-t-4 border ${col.color} space-y-3 flex flex-col`}>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-xs text-[var(--color-wusha-ink)]">{col.label}</h4>
                  <span className="bg-slate-200/60 text-[var(--color-wusha-stone)] px-1.5 py-0.5 rounded-full font-bold text-[10px]">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] min-h-[150px]">
                  {columnOrders.map((order) => (
                    <div key={order.id} className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3 rounded-lg shadow-sm space-y-2 hover:border-slate-300 transition-all">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] font-bold text-[var(--color-wusha-stone)] bg-[var(--color-wusha-cotton)] px-1 py-0.5 rounded border border-[var(--color-wusha-cotton)]">
                          {order.id}
                        </span>
                        <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-ink)] px-1 py-0.5 rounded text-[8px] font-semibold">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-[var(--color-wusha-ink)]">{order.customerName}</h5>
                        <p className="text-[9px] text-[var(--color-wusha-stone)] mt-0.5 font-mono">{order.customerPhone}</p>
                      </div>
                      <div className="text-[10px] text-[var(--color-wusha-stone)] line-clamp-2">
                        {order.products
                          .map((pid) => products.find((p) => p.id === pid)?.name || 'أخرى')
                          .join(', ')}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <span className="font-black text-xs text-[var(--color-wusha-ink)]">{order.totalAmount} ر.س</span>
                        {col.id !== 'مكتمل' && col.id !== 'ملغي' ? (
                          <button
                            onClick={() => completeOrder(order.id, settings.cashierName || 'كاشير')}
                            className="bg-[var(--color-wusha-ink)] text-white font-bold px-2 py-0.5 rounded text-[9px] hover:bg-[#3a2828]"
                          >
                            تسليم
                          </button>
                        ) : (
                          <span className="text-[9px] text-[var(--color-wusha-stone)] font-medium">✓ تمت</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {columnOrders.length === 0 && (
                    <div className="text-center py-6 text-[var(--color-wusha-stone)] text-[10px]">فارغ</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GALLERY VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden hover:border-slate-300 transition-all">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-[var(--color-wusha-stone)] bg-[var(--color-wusha-cotton)] px-1.5 py-0.5 rounded">
                  {order.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    order.orderStatus === 'مكتمل'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.orderStatus === 'ملغي'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-[var(--color-wusha-ink)] text-sm flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[var(--color-wusha-stone)]" />
                  <span>{order.customerName}</span>
                </h4>
                <p className="text-xs text-[var(--color-wusha-stone)] font-mono mt-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-wusha-stone)]" />
                  <span>{order.customerPhone}</span>
                </p>
              </div>

              <div className="bg-[var(--color-wusha-cotton)] rounded-lg p-2.5 text-xs text-[var(--color-wusha-stone)] space-y-1">
                <p className="font-bold text-[10px] text-[var(--color-wusha-stone)]">المنتجات المطلوبة:</p>
                <div className="divide-y divide-slate-100">
                  {order.products.map((pid, idx) => {
                    const prod = products.find((p) => p.id === pid);
                    return (
                      <div key={idx} className="py-1 flex justify-between">
                        <span className="truncate max-w-[150px]">{prod?.name || 'منتج مجهول'}</span>
                        <span className="font-medium text-[var(--color-wusha-stone)] shrink-0">{prod?.price} ر.س</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[var(--color-wusha-cotton)]">
                <div>
                  <p className="text-[10px] text-[var(--color-wusha-stone)] leading-none">القيمة الإجمالية</p>
                  <p className="font-black text-sm text-[var(--color-wusha-ink)] mt-1">{order.totalAmount} ر.س</p>
                </div>
                {order.orderStatus !== 'مكتمل' && order.orderStatus !== 'ملغي' ? (
                  <button
                    onClick={() => completeOrder(order.id, settings.cashierName || 'كاشير')}
                    className="bg-[var(--color-wusha-ink)] text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-[#3a2828]"
                  >
                    إكمال وتسليم
                  </button>
                ) : (
                  <span className="text-xs text-[var(--color-wusha-stone)] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>تم بنجاح</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW ORDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-backdrop">
          <div className="bg-[var(--color-wusha-ivory)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[var(--color-wusha-cotton)] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[var(--color-wusha-cotton)] px-6 py-4 border-b border-[var(--color-wusha-cotton)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-base">إنشاء طلب جديد بالمعرض</h3>
                <p className="text-xs text-[var(--color-wusha-stone)] mt-0.5">أدخل البيانات أو اختر قالباً للتعبئة الفورية السريعة.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-stone)] p-1 rounded-full hover:bg-slate-200/50">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template shortcuts */}
            <div className="bg-amber-50/40 border-b border-amber-100/50 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-amber-800 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>قوالب التعبئة السريعة لموظفي البوث:</span>
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => applyTemplate('direct')}
                  className="flex-1 sm:flex-none text-right bg-[var(--color-wusha-ivory)] hover:bg-amber-100/50 border border-amber-200 text-[var(--color-wusha-ink)] px-3 py-1 rounded font-bold transition-all text-[11px]"
                >
                  ⚡ طلب بوث كاشير مباشر
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('prepaid')}
                  className="flex-1 sm:flex-none text-right bg-[var(--color-wusha-ivory)] hover:bg-amber-100/50 border border-amber-200 text-[var(--color-wusha-ink)] px-3 py-1 rounded font-bold transition-all text-[11px]"
                >
                  ⚡ حجز مسبق (تجهيز/شحن)
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">اسم العميل</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سارة عبد الله"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">رقم التواصل (جوال)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 0501234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] font-mono text-left focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Row 2: Select Products (Multiple) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)] block">اختر المنتجات المطلوبة من المخزون:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto border border-[var(--color-wusha-cotton)] p-3 rounded-lg bg-[var(--color-wusha-cotton)]">
                  {products.map((prod) => {
                    const isSelected = selectedProducts.includes(prod.id);
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleProductToggle(prod.id)}
                        disabled={prod.quantity <= 0}
                        className={`text-right p-2.5 rounded-lg border flex justify-between items-center text-xs transition-all ${
                          prod.quantity <= 0
                            ? 'opacity-50 cursor-not-allowed bg-[var(--color-wusha-cotton)] border-slate-200'
                            : isSelected
                            ? 'bg-[var(--color-wusha-ivory)] border-amber-400 ring-1 ring-amber-400'
                            : 'bg-[var(--color-wusha-ivory)] border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--color-wusha-ink)] truncate">{prod.name}</p>
                          <p className="text-[10px] text-[var(--color-wusha-stone)] mt-0.5">{prod.price} ر.س | SKU: {prod.sku}</p>
                        </div>
                        <div className="shrink-0">
                          {prod.quantity <= 0 ? (
                            <span className="text-red-600 font-black text-[9px] bg-red-50 px-1 py-0.5 rounded">⚫ نفد</span>
                          ) : isSelected ? (
                            <span className="text-amber-700 bg-amber-50 border border-amber-300 rounded px-1.5 py-0.5 text-[9px] font-bold">✓ اخترت</span>
                          ) : (
                            <span className="text-[var(--color-wusha-stone)] text-[9px] bg-[var(--color-wusha-cotton)] px-1 py-0.5 rounded font-bold">{prod.quantity} عبوة</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Payments and statuses */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">طريقة الدفع</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)]"
                  >
                    <option value="مدى">مدى</option>
                    <option value="بطاقة">بطاقة</option>
                    <option value="كاش">كاش</option>
                    <option value="تحويل بنكي">تحويل بنكي</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">حالة الدفع</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)]"
                  >
                    <option value="مدفوع">مدفوع</option>
                    <option value="غير مدفوع">غير مدفوع</option>
                    <option value="مدفوع مسبقاً">مدفوع مسبقاً</option>
                    <option value="عند الاستلام">عند الاستلام</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">حالة الطلب</label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)]"
                  >
                    <option value="جديد">جديد</option>
                    <option value="قيد التجهيز">قيد التجهيز</option>
                    <option value="جاهز">جاهز للاستلام</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="ملغي">ملغي</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">أولوية الطلب</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)]"
                  >
                    <option value="عادي">عادي</option>
                    <option value="مهم">مهم</option>
                    <option value="عاجل">عاجل</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Sources and Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">مصدر الطلب</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)]"
                  >
                    <option value="كاشير البوث">كاشير البوث</option>
                    <option value="واتساب">واتساب</option>
                    <option value="إنستقرام">إنستقرام</option>
                    <option value="طلب مباشر">طلب مباشر</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">ملاحظات / تفاصيل إضافية</label>
                  <input
                    type="text"
                    placeholder="مثل: يحتاج كرت شيد وهدية..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Modal Footer */}
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
                  id="btn-submit-order"
                >
                  إضافة وتأكيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
