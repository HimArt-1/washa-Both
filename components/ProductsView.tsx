'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import { Product } from '../lib/types';
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  DollarSign,
  Briefcase,
  History,
  LayoutGrid,
  Table as TableIcon,
  X,
  PlusSquare,
  MinusSquare,
  Check
} from 'lucide-react';

export default function ProductsView() {
  const {
    products,
    addProduct,
    editProduct,
    deleteProduct,
    adjustProductStock,
    settings
  } = useWashi();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeView, setActiveView] = useState<'table' | 'cashier' | 'low'>('table');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // New product form states
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState<'تيشيرت' | 'سويت تيشيرت' | 'هودي' | 'بلوفر' | 'إكسسوارات' | 'أخرى'>('تيشيرت');
  const [newPrice, setNewPrice] = useState(0);
  const [newCost, setNewCost] = useState(0);
  const [newQty, setNewQty] = useState(10);
  const [newMinAlert, setNewMinAlert] = useState(3);
  const [newNotes, setNewNotes] = useState('');

  // Adjust stock form states
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustType, setAdjustType] = useState<'إضافة مخزون' | 'مرتجع' | 'تلف' | 'تعديل يدوي'>('إضافة مخزون');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Search/Filter logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' ? true : p.category === activeCategory;
    
    if (activeView === 'low') {
      return matchesSearch && matchesCategory && p.quantity <= p.minAlert;
    }
    return matchesSearch && matchesCategory;
  });

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSku) {
      alert('يرجى تعبئة الحقول الإلزامية!');
      return;
    }

    addProduct({
      name: newName,
      sku: newSku,
      category: newCategory,
      price: Number(newPrice),
      cost: Number(newCost),
      quantity: Number(newQty),
      minAlert: Number(newMinAlert),
      notes: newNotes,
    });

    // Reset states
    setNewName('');
    setNewSku('');
    setNewCategory('تيشيرت');
    setNewPrice(0);
    setNewCost(0);
    setNewQty(10);
    setNewMinAlert(3);
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    adjustProductStock(
      selectedProduct.id,
      Number(adjustQty),
      adjustType,
      adjustNotes || 'تحديث رصيد يدوي بالبوث',
      settings.cashierName || 'كاشير البوث'
    );

    setAdjustQty(1);
    setAdjustType('إضافة مخزون');
    setAdjustNotes('');
    setShowAdjustModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6" id="products-view-container">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-wusha-ink)] flex items-center gap-2">
            <span>📦</span> المنتجات وإدارة مستودع البوث
          </h2>
          <p className="text-xs text-[var(--color-wusha-stone)] mt-1">تابع كميات الأصناف المتوفرة على الرفوف وتلقَّ إشعارات النفاد والطلب المسبق.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#1a1a1a] text-white hover:bg-[#333333] px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
          id="btn-add-product-modal"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Control row: Search + Category switchers */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-[var(--color-wusha-stone)]" />
          <input
            type="text"
            placeholder="البحث باسم الصنف، أو الرمز SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-9 py-1.5 text-xs bg-[var(--color-wusha-cotton)] border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none focus:border-amber-400 focus:bg-[var(--color-wusha-ivory)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1 bg-[var(--color-wusha-cotton)] border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-[var(--color-wusha-stone)]" />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="bg-transparent text-[var(--color-wusha-stone)] focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">كل الفئات</option>
              {settings.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-[var(--color-wusha-cotton)] p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveView('table')}
              className={`px-3 py-1 rounded transition-all ${
                activeView === 'table' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              الجدول الكامل
            </button>
            <button
              onClick={() => setActiveView('cashier')}
              className={`px-3 py-1 rounded transition-all ${
                activeView === 'cashier' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-sm' : 'text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-ink)]'
              }`}
            >
              معرض الكاشير
            </button>
            <button
              onClick={() => setActiveView('low')}
              className={`px-3 py-1 rounded transition-all text-rose-700 flex items-center gap-1 ${
                activeView === 'low' ? 'bg-[var(--color-wusha-ivory)] font-black shadow-sm' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-500" />
              <span>منخفض ومفقود ({products.filter(p => p.quantity <= p.minAlert).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl">
          <Package className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-xs text-[var(--color-wusha-stone)] mt-2">لا توجد منتجات مسجلة مطابقة للفلاتر المعنية.</p>
        </div>
      ) : activeView === 'table' || activeView === 'low' ? (
        /* TABLE VIEW */
        <div className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">اسم المنتج</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">الفئة</th>
                  <th className="py-3 px-4 font-semibold">سعر البيع</th>
                  <th className="py-3 px-4 font-semibold">التكلفة</th>
                  <th className="py-3 px-4 font-semibold">هامش الربح</th>
                  <th className="py-3 px-4 font-semibold">الكمية المتاحة</th>
                  <th className="py-3 px-4 font-semibold">الحد الأدنى للتنبيه</th>
                  <th className="py-3 px-4 font-semibold">حالة المخزون</th>
                  <th className="py-3 px-4 text-center font-semibold">تعديل المخزون</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const profitUnit = p.price - p.cost;
                  const profitPct = p.price > 0 ? Math.round((profitUnit / p.price) * 100) : 0;
                  const isLow = p.quantity <= p.minAlert;
                  const isOutOfStock = p.quantity <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-[var(--color-wusha-cotton)]">
                      <td className="py-3.5 px-4 font-bold text-[var(--color-wusha-ink)]">{p.name}</td>
                      <td className="py-3.5 px-4 font-mono text-[var(--color-wusha-stone)]">{p.sku}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] px-2 py-0.5 rounded text-[10px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[var(--color-wusha-ink)]">{p.price} ر.س</td>
                      <td className="py-3.5 px-4 text-[var(--color-wusha-stone)]">{p.cost} ر.س</td>
                      <td className="py-3.5 px-4 text-[var(--color-wusha-stone)] font-medium">
                        <span>{profitUnit} ر.س</span>
                        <span className="text-[10px] text-emerald-600 mr-1">({profitPct}%)</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className={`px-2 py-0.5 rounded font-black text-xs ${isOutOfStock ? 'bg-red-500 text-white' : isLow ? 'bg-rose-100 text-rose-800 font-bold' : 'text-[var(--color-wusha-ink)]'}`}>
                          {p.quantity} عبوة
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--color-wusha-stone)]">{p.minAlert} عبوات</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold px-2.5 py-0.5 rounded text-[10px] ${
                            isOutOfStock
                              ? 'bg-red-100 text-red-700'
                              : isLow
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isOutOfStock ? '⚫ نفد' : isLow ? '🔴 منخفض' : '🟢 كافٍ'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setShowAdjustModal(true);
                          }}
                          className="bg-[var(--color-wusha-muted-gold)] hover:bg-[#b0946a] text-white font-bold px-2 py-1 rounded text-[10px] shadow-xs"
                          id={`btn-adjust-stock-${p.id}`}
                        >
                          تعديل رصيد
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
        /* CASHIER GALLERY VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const isLow = p.quantity <= p.minAlert;
            const isOutOfStock = p.quantity <= 0;
            return (
              <div key={p.id} className="bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] px-2 py-0.5 rounded text-[9px] font-bold">
                      {p.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        isOutOfStock ? 'bg-red-100 text-red-700' : isLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isOutOfStock ? 'نفد' : isLow ? 'منخفض' : 'متوفر'}
                    </span>
                  </div>
                  <h4 className="font-bold text-[var(--color-wusha-ink)] text-sm mt-2.5">{p.name}</h4>
                  <p className="text-[10px] text-[var(--color-wusha-stone)] mt-1 font-mono">SKU: {p.sku}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[var(--color-wusha-cotton)]">
                  <div>
                    <p className="text-[9px] text-[var(--color-wusha-stone)]">سعر المنتج</p>
                    <p className="font-black text-sm text-[var(--color-wusha-ink)]">{p.price} ر.س</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--color-wusha-stone)] text-left">الرصيد المتاح</p>
                    <p className={`font-black text-xs text-left ${isOutOfStock ? 'text-red-500' : isLow ? 'text-rose-600' : 'text-[var(--color-wusha-ink)]'}`}>
                      {p.quantity} عبوة
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setShowAdjustModal(true);
                    }}
                    className="w-full text-center bg-[var(--color-wusha-ink)] text-white font-bold py-1.5 rounded-lg text-xs hover:bg-[#3a2828]"
                  >
                    إضافة كمية شحنة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-wusha-ivory)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[var(--color-wusha-cotton)]">
            <div className="bg-[var(--color-wusha-cotton)] px-6 py-4 border-b border-[var(--color-wusha-cotton)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-base">تسجيل منتج جديد بالبوث</h3>
                <p className="text-xs text-[var(--color-wusha-stone)] mt-0.5">سجل الأصناف والأسعار لتتمكن من إضافتها للفواتير.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-stone)] p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: هودي وشى الصوفي الكلاسيكي"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">رمز المنتج (SKU) *</label>
                  <input
                    type="text"
                    required
                    placeholder="WSH-MIST-08"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">الفئة</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)]"
                  >
                    {settings.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">سعر البيع للعميل (ر.س) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">تكلفة شراء المنتج (ر.س) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">الكمية الافتتاحية المتاحة *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">حد التنبيه للمخزون المنخفض *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newMinAlert}
                    onChange={(e) => setNewMinAlert(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">ملاحظات تشغيلية</label>
                <input
                  type="text"
                  placeholder="بلد المنشأ، كيفية العرض أو تفاصيل التعبئة..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
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
                  id="btn-submit-new-product"
                >
                  إضافة المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST PRODUCT STOCK MODAL */}
      {showAdjustModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-wusha-ivory)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-[var(--color-wusha-cotton)]">
            <div className="bg-[var(--color-wusha-cotton)] px-6 py-4 border-b border-[var(--color-wusha-cotton)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-base">تحديث رصيد صنف: {selectedProduct.name}</h3>
                <p className="text-xs text-[var(--color-wusha-stone)] mt-0.5">حدد الكمية وسجل الحركة لتوثيق السجل التفتيشي.</p>
              </div>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedProduct(null);
                }}
                className="text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-stone)] p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-xs text-[var(--color-wusha-stone)] flex justify-between">
                <span>الرصيد الفعلي الحالي بالرفوف:</span>
                <strong className="text-amber-950 font-bold">{selectedProduct.quantity} عبوة</strong>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">نوع حركة المخزون</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-[var(--color-wusha-ivory)]"
                >
                  <option value="إضافة مخزون">إضافة مخزون شحنة (➕ زيادة)</option>
                  <option value="مرتجع">مرتجع بضاعة لعميل (➕ زيادة)</option>
                  <option value="تلف">تلف وتكسر عبوات (➖ نقص)</option>
                  <option value="تعديل يدوي">تعديل يدوي وجرد عيني (➖ نقص)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">الكمية بالعبوات</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">سبب الحركة (ملاحظة) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: توريد دفعة شحنة يومية من المستودع"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-[var(--color-wusha-ink)] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-4 border-t border-[var(--color-wusha-cotton)] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedProduct(null);
                  }}
                  className="bg-[var(--color-wusha-cotton)] hover:bg-slate-200 text-[var(--color-wusha-ink)] font-bold px-4 py-2 rounded-lg text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[var(--color-wusha-ink)] hover:bg-[#3a2828] text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm"
                  id="btn-confirm-adjust"
                >
                  تأكيد وتحديث
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
