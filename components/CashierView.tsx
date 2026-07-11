'use client';

import React, { useState, useMemo } from 'react';
import { useWashi } from '../context/WashiContext';
import { Product } from '../lib/types';
import {
  Smartphone,
  Plus,
  Minus,
  ShoppingBag,
  ShoppingCart,
  AlertTriangle,
  Check,
  Search,
  Banknote,
  CreditCard,
  Building,
  Trash2,
  Clock
} from 'lucide-react';

export default function CashierView() {
  const {
    products,
    orders,
    addOrder,
    completeOrder,
    settings
  } = useWashi();

  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'كاش' | 'بطاقة' | 'مدى' | 'تحويل بنكي'>('كاش');
  const [orderStatus, setOrderStatus] = useState<'جديد' | 'قيد التجهيز'>('جديد');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  // Helpers
  const addToCart = (pId: string) => {
    const prod = products.find(p => p.id === pId);
    if (!prod) return;
    if (prod.quantity <= (cart[pId] || 0)) {
      alert('⚠️ عذراً! الرصيد المتاح من هذا الصنف لا يكفي.');
      return;
    }
    setCart(prev => ({ ...prev, [pId]: (prev[pId] || 0) + 1 }));
  };

  const removeFromCart = (pId: string) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[pId] <= 1) delete copy[pId];
      else copy[pId] -= 1;
      return copy;
    });
  };

  const clearCart = () => {
    if(Object.keys(cart).length === 0) return;
    if(confirm('هل تريد فعلاً إفراغ السلة الحالية؟')) {
      setCart({});
      setCustomerName('');
      setCustomerPhone('');
    }
  };

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [pId, qty]) => {
      const prod = products.find(p => p.id === pId);
      return sum + (prod ? prod.price * qty : 0);
    }, 0);
  }, [cart, products]);

  const cartItemsCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(cart).length === 0) {
      alert('السلة فارغة!');
      return;
    }

    const selectedProductIds = Object.keys(cart);
    const detailsStr = Object.entries(cart)
      .map(([pId, qty]) => {
        const prod = products.find(p => p.id === pId);
        return `${prod?.name} (عدد ${qty})`;
      })
      .join(' + ');

    addOrder({
      customerName: customerName || 'عميل نقدي سريع',
      customerPhone: customerPhone || 'بلا رقم',
      products: selectedProductIds, // Store unique product IDs
      paymentMethod,
      paymentStatus: 'مدفوع',
      orderStatus: orderStatus,
      source: 'كاشير البوث',
      priority: 'عادي',
      notes: `تفاصيل البيع: ${detailsStr}`,
    });

    setCart({});
    setCustomerName('');
    setCustomerPhone('');
    // Optionally play a sound or show a more immersive success feedback
    alert('🎉 تم قيد الفاتورة بنجاح!');
  };

  // Filtered Products
  const categories = ['الكل', ...(settings.categories || [])];
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'الكل' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const activeOrders = orders.filter(o => o.orderStatus === 'جديد' || o.orderStatus === 'قيد التجهيز');
  const lowStockItems = products.filter(p => p.quantity <= p.minAlert);

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-7rem)]" id="cashier-view-container">
      
      {/* ----------------- RIGHT PANEL: PRODUCTS GRID ----------------- */}
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
        
        {/* Top Header & Search */}
        <div className="p-4 border-b border-[var(--color-wusha-cotton)] bg-[#faf8f5] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-wusha-cacao)] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[var(--color-wusha-muted-gold)]" />
            </div>
            <div>
              <h1 className="font-black text-lg text-[var(--color-wusha-ink)]">كاشير وشى</h1>
              <p className="text-[10px] text-[var(--color-wusha-stone)]">الكاشير الحالي: <span className="font-bold">{settings.cashierName}</span></p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[var(--color-wusha-stone)]" />
            </div>
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="px-4 py-3 bg-white border-b border-[var(--color-wusha-cotton)] shrink-0 overflow-x-auto custom-scrollbar flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[var(--color-wusha-cacao)] text-[var(--color-wusha-ivory)] shadow-sm'
                  : 'bg-slate-100 text-[var(--color-wusha-ink)] hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex items-center justify-center flex-col text-[var(--color-wusha-stone)]">
              <Search className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-bold">لا يوجد منتجات تطابق البحث.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(p => {
                const isOut = p.quantity <= 0;
                const qtyInCart = cart[p.id] || 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p.id)}
                    disabled={isOut}
                    className={`relative p-4 rounded-2xl border text-right transition-all flex flex-col justify-between aspect-square group overflow-hidden shadow-sm hover:shadow-md ${
                      qtyInCart > 0
                        ? 'border-amber-500 bg-amber-50'
                        : isOut
                        ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-[var(--color-wusha-muted-gold)]'
                    }`}
                  >
                    {qtyInCart > 0 && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500 rounded-bl-xl text-white flex items-center justify-center font-black text-xs z-10 shadow-sm animate-fade-in-up">
                        {qtyInCart}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--color-wusha-ink)] text-sm leading-snug line-clamp-2">{p.name}</h3>
                      <p className="text-[10px] text-[var(--color-wusha-stone)] mt-1">{p.category}</p>
                    </div>

                    <div className="mt-2 flex items-end justify-between w-full">
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOut ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-[var(--color-wusha-stone)]'}`}>
                        {isOut ? 'نفدت الكمية' : `متاح: ${p.quantity}`}
                      </div>
                      <span className="font-black text-[var(--color-wusha-cacao)] text-sm">{p.price} ر.س</span>
                    </div>

                    {/* Hover Overlay effect */}
                    {!isOut && (
                      <div className="absolute inset-0 bg-[var(--color-wusha-cacao)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>


      {/* ----------------- LEFT PANEL: TERMINAL / CART ----------------- */}
      <div className="w-full xl:w-[400px] flex flex-col bg-white border border-[var(--color-wusha-cotton)] rounded-2xl shadow-lg shrink-0 overflow-hidden animate-fade-in-up animate-delay-100">
        
        {/* Cart Header */}
        <div className="p-4 bg-[var(--color-wusha-cacao)] text-[var(--color-wusha-ivory)] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[var(--color-wusha-muted-gold)]" />
            <h2 className="font-bold text-sm">سلة المبيعات</h2>
          </div>
          <button 
            onClick={clearCart}
            disabled={Object.keys(cart).length === 0}
            className="text-[10px] font-bold text-rose-300 hover:text-white disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> إفراغ
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-2 bg-[#faf8f5]">
          {Object.keys(cart).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-wusha-stone)] opacity-60">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="text-sm font-bold">السلة فارغة</p>
              <p className="text-[10px]">انقر على المنتجات للإضافة</p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(cart).map(([pId, qty]) => {
                const prod = products.find(p => p.id === pId);
                if(!prod) return null;
                return (
                  <div key={pId} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-2 animate-fade-in-up">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[var(--color-wusha-ink)] truncate">{prod.name}</h4>
                      <p className="text-[10px] text-amber-600 font-bold mt-0.5">{prod.price * qty} ر.س</p>
                    </div>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 shrink-0">
                      <button onClick={() => removeFromCart(pId)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-slate-200 rounded-md transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="w-6 text-center text-xs font-black text-[var(--color-wusha-ink)]">{qty}</span>
                      <button onClick={() => addToCart(pId)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-slate-200 rounded-md transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Checkout Section (Fixed Bottom) */}
        <div className="bg-white border-t border-[var(--color-wusha-cotton)] shrink-0">
          
          {/* Totals */}
          <div className="p-4 space-y-2 border-b border-slate-100 bg-[#faf8f5]">
            <div className="flex justify-between items-center text-xs text-[var(--color-wusha-stone)]">
              <span>إجمالي الكمية</span>
              <span className="font-bold">{cartItemsCount} قطع</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-[var(--color-wusha-ink)]">الإجمالي المطلوب</span>
              <span className="text-2xl font-black text-emerald-600">{cartTotal} ر.س</span>
            </div>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="p-4 space-y-4">
            {/* Quick Customer Info */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="اسم العميل (اختياري)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="wusha-input text-[11px]"
              />
              <input
                type="text"
                placeholder="رقم الجوال (اختياري)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="wusha-input text-[11px] font-mono"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-[10px] font-bold text-[var(--color-wusha-stone)] mb-2 uppercase tracking-wide">طريقة الدفع</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('كاش')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[10px] font-bold transition-all ${paymentMethod === 'كاش' ? 'bg-[var(--color-wusha-cacao)] text-[var(--color-wusha-ivory)] border-transparent shadow-md' : 'bg-slate-50 text-[var(--color-wusha-stone)] border-slate-200 hover:bg-slate-100'}`}
                >
                  <Banknote className="w-4 h-4 mb-1" />
                  كاش
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('مدى')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[10px] font-bold transition-all ${paymentMethod === 'مدى' ? 'bg-[var(--color-wusha-cacao)] text-[var(--color-wusha-ivory)] border-transparent shadow-md' : 'bg-slate-50 text-[var(--color-wusha-stone)] border-slate-200 hover:bg-slate-100'}`}
                >
                  <CreditCard className="w-4 h-4 mb-1" />
                  مدى
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('تحويل بنكي')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[10px] font-bold transition-all ${paymentMethod === 'تحويل بنكي' ? 'bg-[var(--color-wusha-cacao)] text-[var(--color-wusha-ivory)] border-transparent shadow-md' : 'bg-slate-50 text-[var(--color-wusha-stone)] border-slate-200 hover:bg-slate-100'}`}
                >
                  <Building className="w-4 h-4 mb-1" />
                  تحويل
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={Object.keys(cart).length === 0}
              className="w-full bg-[var(--color-wusha-ink)] text-[var(--color-wusha-ivory)] hover:bg-black py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-wusha-ink)]/20"
            >
              <Check className="w-5 h-5" />
              <span>تنفيذ وإصدار الفاتورة</span>
            </button>
          </form>
        </div>
      </div>

      {/* ----------------- ALERTS & ACTIVE ORDERS DRAWER ----------------- */}
      {(activeOrders.length > 0 || lowStockItems.length > 0) && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none w-72">
          
          {/* Low stock alerts floating */}
          {lowStockItems.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl shadow-lg pointer-events-auto">
              <h3 className="font-bold text-rose-800 text-[10px] flex items-center gap-1 mb-2">
                <AlertTriangle className="w-3 h-3" /> منتجات قاربت على النفاد ({lowStockItems.length})
              </h3>
              <div className="max-h-24 overflow-y-auto space-y-1 custom-scrollbar">
                {lowStockItems.map(p => (
                  <div key={p.id} className="text-[10px] flex justify-between text-rose-700 bg-white p-1 rounded">
                    <span className="truncate ml-2">{p.name}</span>
                    <span className="font-bold shrink-0">{p.quantity} متبقي</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active orders floating */}
          {activeOrders.length > 0 && (
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg pointer-events-auto">
              <h3 className="font-bold text-[var(--color-wusha-ink)] text-[10px] flex items-center gap-1 mb-2">
                <Clock className="w-3 h-3 text-amber-500" /> طلبات معلقة بانتظار الإكمال ({activeOrders.length})
              </h3>
              <div className="max-h-32 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                {activeOrders.map(ord => (
                  <div key={ord.id} className="bg-slate-50 p-2 rounded-lg text-[10px] flex justify-between items-center gap-2 border border-slate-100">
                    <div className="flex-1 truncate">
                      <p className="font-bold text-[var(--color-wusha-ink)] truncate">{ord.customerName}</p>
                      <p className="text-slate-500">{ord.totalAmount} ر.س</p>
                    </div>
                    <button
                      onClick={() => completeOrder(ord.id, settings.cashierName || 'كاشير')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded-md font-bold transition-colors shrink-0"
                    >
                      إكمال
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
