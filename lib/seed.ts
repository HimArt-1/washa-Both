import { Product, Order, Sale, Expense, InventoryMovement, DailyReport, DailyTask, SystemSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_SALES: Sale[] = [];
export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_MOVEMENTS: InventoryMovement[] = [];
export const INITIAL_TASKS: DailyTask[] = [];
export const INITIAL_REPORTS: DailyReport[] = [];

export const DEFAULT_SETTINGS: SystemSettings = {
  paymentMethods: ['كاش', 'بطاقة', 'مدى', 'تحويل بنكي'],
  orderStatuses: ['جديد', 'قيد التجهيز', 'جاهز', 'مكتمل', 'ملغي'],
  categories: ['تيشيرت', 'سويت تيشيرت', 'هودي', 'بلوفر', 'إكسسوارات', 'أخرى'],
  boothName: 'وشى للأزياء',
  eventCity: '',
  eventDuration: '',
  cashierName: '',
  adminPin: '0000'
};


