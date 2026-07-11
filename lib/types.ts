export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'تيشيرت' | 'سويت تيشيرت' | 'هودي' | 'بلوفر' | 'إكسسوارات' | 'أخرى';
  price: number;
  cost: number;
  quantity: number;
  minAlert: number;
  notes: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  products: string[]; // List of product IDs
  totalAmount: number;
  paymentMethod: 'كاش' | 'بطاقة' | 'مدى' | 'تحويل بنكي';
  paymentStatus: 'مدفوع مسبقاً' | 'مدفوع' | 'عند الاستلام' | 'غير مدفوع';
  orderStatus: 'جديد' | 'قيد التجهيز' | 'جاهز' | 'مكتمل' | 'ملغي';
  source: 'طلب مباشر' | 'كاشير البوث' | 'واتساب' | 'إنستقرام' | 'أخرى';
  orderDate: string; // ISO string or date
  priority: 'عادي' | 'عاجل' | 'مهم';
  addedToSales: boolean;
  notes: string;
}

export interface Sale {
  id: string;
  orderId?: string;
  products: string[]; // List of product IDs
  amount: number;
  estimatedCost: number;
  paymentMethod: 'كاش' | 'بطاقة' | 'مدى' | 'تحويل بنكي';
  source: 'من طلب' | 'من كاشير' | 'مدفوع مسبقاً';
  customerName: string;
  details: string;
  timestamp: string; // ISO String
  notes: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'تشغيل البوث' | 'مواد وتغليف' | 'تسويق' | 'مواصلات' | 'رسوم الإيفنت' | 'ضيافة' | 'أخرى';
  date: string;
  paymentMethod: 'كاش' | 'بطاقة' | 'تحويل' | 'أخرى';
  supplier: string;
  isConfirmed: boolean;
  notes: string;
  receipt?: string; // Simulated file name or URL
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: 'إضافة مخزون' | 'بيع' | 'مرتجع' | 'تلف' | 'تعديل يدوي';
  quantity: number;
  direction: '➕' | '➖';
  orderId?: string;
  saleId?: string;
  date: string; // ISO String
  handler: string;
  notes: string;
}

export interface DailyReport {
  id: string; // Date string format YYYY-MM-DD
  date: string; // Display date
  cashSales: number;
  cardSales: number;
  transferSales: number;
  expenses: number;
  notesProblems: string;
  notesInventory: string;
  notesRecommendations: string;
  isClosed: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  stage: 'قبل الافتتاح' | 'أثناء التشغيل' | 'قبل الإغلاق' | 'بعد الإغلاق';
  priority: 'منخفضة' | 'متوسطة' | 'عالية';
  status: 'لم تبدأ' | 'قيد التنفيذ' | 'مكتملة' | 'مؤجلة';
  handler: string;
  date: string;
  notes: string;
}

export interface SystemSettings {
  paymentMethods: string[];
  orderStatuses: string[];
  categories: string[];
  boothName: string;
  eventCity: string;
  eventDuration: string;
  cashierName: string;
  adminPin: string;
}
