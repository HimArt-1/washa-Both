/* eslint-disable */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, Sale, Expense, InventoryMovement, DailyReport, DailyTask, SystemSettings } from '../lib/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SALES,
  INITIAL_EXPENSES,
  INITIAL_MOVEMENTS,
  INITIAL_REPORTS,
  INITIAL_TASKS,
  DEFAULT_SETTINGS
} from '../lib/seed';

interface WashiContextType {
  products: Product[];
  orders: Order[];
  sales: Sale[];
  expenses: Expense[];
  movements: InventoryMovement[];
  reports: DailyReport[];
  tasks: DailyTask[];
  settings: SystemSettings;
  activePage: string;
  setActivePage: (page: string) => void;
  isLoading: boolean;
  userRole: 'admin' | 'cashier' | null;
  setUserRole: (role: 'admin' | 'cashier' | null) => void;
  logout: () => void;

  // Products
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustProductStock: (id: string, amount: number, type: 'إضافة مخزون' | 'مرتجع' | 'تلف' | 'تعديل يدوي', notes: string, handler: string) => void;

  // Orders
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'addedToSales' | 'totalAmount'>) => Order;
  editOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  completeOrder: (id: string, handler: string) => void;

  // Sales
  addSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
  deleteSale: (id: string) => void;

  // Expenses
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  editExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Inventory Movements
  addMovement: (movement: Omit<InventoryMovement, 'id' | 'date'>) => void;

  // Daily Tasks
  addTask: (task: Omit<DailyTask, 'id' | 'date'>) => void;
  editTask: (id: string, task: Partial<DailyTask>) => void;
  deleteTask: (id: string) => void;

  // Daily Reports
  addReport: (report: DailyReport) => void;
  toggleReportClosed: (id: string) => void;

  // Settings
  updateSettings: (settings: Partial<SystemSettings>) => void;

  // Reset helper
  resetData: () => void;
}

const WashiContext = createContext<WashiContextType | undefined>(undefined);

export function WashiProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'admin' | 'cashier' | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('washi_products');
      const storedOrders = localStorage.getItem('washi_orders');
      const storedSales = localStorage.getItem('washi_sales');
      const storedExpenses = localStorage.getItem('washi_expenses');
      const storedMovements = localStorage.getItem('washi_movements');
      const storedReports = localStorage.getItem('washi_reports');
      const storedTasks = localStorage.getItem('washi_tasks');
      const storedSettings = localStorage.getItem('washi_settings');
      const storedRole = localStorage.getItem('washi_role');

      // Detect old skincare/cosmetics data and force-reset to fashion
      let shouldMigrate = false;
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings);
          if (parsed.categories?.includes('سيروم') || parsed.categories?.includes('كريم')) {
            shouldMigrate = true;
          }
        } catch (_) {}
      }

      if (shouldMigrate) {
        localStorage.clear();
        setProducts(INITIAL_PRODUCTS);
        setOrders(INITIAL_ORDERS);
        setSales(INITIAL_SALES);
        setExpenses(INITIAL_EXPENSES);
        setMovements(INITIAL_MOVEMENTS);
        setReports(INITIAL_REPORTS);
        setTasks(INITIAL_TASKS);
        setSettings(DEFAULT_SETTINGS);
      } else {
        if (storedProducts) setProducts(JSON.parse(storedProducts));
        else setProducts(INITIAL_PRODUCTS);

        if (storedOrders) setOrders(JSON.parse(storedOrders));
        else setOrders(INITIAL_ORDERS);

        if (storedSales) setSales(JSON.parse(storedSales));
        else setSales(INITIAL_SALES);

        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        else setExpenses(INITIAL_EXPENSES);

        if (storedMovements) setMovements(JSON.parse(storedMovements));
        else setMovements(INITIAL_MOVEMENTS);

        if (storedReports) setReports(JSON.parse(storedReports));
        else setReports(INITIAL_REPORTS);

        if (storedTasks) setTasks(JSON.parse(storedTasks));
        else setTasks(INITIAL_TASKS);

        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          // Auto-migrate old dummy booth name
          if (parsedSettings.boothName === 'وشى للأزياء - الرياض بارك') {
            parsedSettings.boothName = 'وشى للأزياء';
          }
          setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
        } else {
          setSettings(DEFAULT_SETTINGS);
        }

        if (storedRole) setUserRole(storedRole as 'admin' | 'cashier');
      }
    } catch (e) {
      console.error('Error loading washi data from localStorage:', e);
      // Fallbacks
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setSales(INITIAL_SALES);
      setExpenses(INITIAL_EXPENSES);
      setMovements(INITIAL_MOVEMENTS);
      setReports(INITIAL_REPORTS);
      setTasks(INITIAL_TASKS);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('washi_products', JSON.stringify(products));
  }, [products, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('washi_orders', JSON.stringify(orders));
  }, [orders, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('washi_sales', JSON.stringify(sales));
  }, [sales, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('washi_expenses', JSON.stringify(expenses));
  }, [expenses, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('washi_movements', JSON.stringify(movements));
  }, [movements, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('washi_reports', JSON.stringify(reports));
  }, [reports, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('washi_tasks', JSON.stringify(tasks));
  }, [tasks, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('washi_settings', JSON.stringify(settings));
  }, [settings, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (userRole) {
      localStorage.setItem('washi_role', userRole);
    } else {
      localStorage.removeItem('washi_role');
    }
  }, [userRole, isLoading]);

  // Reset helper
  const resetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setSales(INITIAL_SALES);
    setExpenses(INITIAL_EXPENSES);
    setMovements(INITIAL_MOVEMENTS);
    setReports(INITIAL_REPORTS);
    setTasks(INITIAL_TASKS);
    setSettings(DEFAULT_SETTINGS);
    setActivePage('dashboard');
  };

  const logout = () => {
    setUserRole(null);
    localStorage.removeItem('washi_role');
    setActivePage('dashboard');
  };

  // --- Products ---
  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProduct, id };
    setProducts((prev) => [product, ...prev]);

    // Log movement if starting quantity is > 0
    if (product.quantity > 0) {
      addMovement({
        productId: id,
        type: 'إضافة مخزون',
        quantity: product.quantity,
        direction: '➕',
        handler: settings.cashierName || 'المشرف',
        notes: 'الكمية الافتتاحية عند تسجيل المنتج الجديد',
      });
    }
  };

  const editProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const adjustProductStock = (
    id: string,
    amount: number,
    type: 'إضافة مخزون' | 'مرتجع' | 'تلف' | 'تعديل يدوي',
    notes: string,
    handler: string
  ) => {
    if (amount === 0) return;
    const direction = (type === 'إضافة مخزون' || type === 'مرتجع') ? '➕' : '➖';
    
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const finalQty = direction === '➕' ? p.quantity + amount : Math.max(0, p.quantity - amount);
          return { ...p, quantity: finalQty };
        }
        return p;
      })
    );

    addMovement({
      productId: id,
      type,
      quantity: amount,
      direction,
      handler,
      notes,
    });
  };

  // --- Orders ---
  const addOrder = (newOrder: Omit<Order, 'id' | 'orderDate' | 'addedToSales' | 'totalAmount'>) => {
    // Generate Order ID like #0005
    const lastNum = orders.length > 0 
      ? parseInt(orders[0].id.replace('#', ''), 10) || orders.length 
      : 0;
    const nextNum = Math.max(lastNum + 1, orders.length + 1);
    const id = `#${String(nextNum).padStart(4, '0')}`;
    
    // Calculate total amount
    let total = 0;
    newOrder.products.forEach((pid) => {
      const prod = products.find((p) => p.id === pid);
      if (prod) total += prod.price;
    });

    const order: Order = {
      ...newOrder,
      id,
      totalAmount: total,
      orderDate: new Date().toISOString(),
      addedToSales: false,
    };

    setOrders((prev) => [order, ...prev]);

    // If order starts as Completed (مكتمل), trigger sales and inventory updates!
    if (order.orderStatus === 'مكتمل') {
      // Run completing logic with a slight microtask defer to let states align
      setTimeout(() => {
        completeOrder(id, settings.cashierName || 'الكاشير');
      }, 50);
    }

    return order;
  };

  const editOrder = (id: string, updatedFields: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = { ...o, ...updatedFields };
          // Recalculate total if products updated
          if (updatedFields.products) {
            let total = 0;
            updatedFields.products.forEach((pid) => {
              const prod = products.find((p) => p.id === pid);
              if (prod) total += prod.price;
            });
            updated.totalAmount = total;
          }
          return updated;
        }
        return o;
      })
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const completeOrder = (orderId: string, handler: string) => {
    // Find order
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    if (order.addedToSales) {
      // Already processed
      if (order.orderStatus !== 'مكتمل') {
        editOrder(orderId, { orderStatus: 'مكتمل', paymentStatus: 'مدفوع' });
      }
      return;
    }

    // 1. Calculate cost
    let estimatedCost = 0;
    order.products.forEach((pid) => {
      const prod = products.find((p) => p.id === pid);
      if (prod) estimatedCost += prod.cost;
    });

    // 2. Generate Sale ID like S0003
    const lastSaleNum = sales.length > 0
      ? parseInt(sales[0].id.replace('S', ''), 10) || sales.length
      : 0;
    const nextSaleNum = Math.max(lastSaleNum + 1, sales.length + 1);
    const saleId = `S${String(nextSaleNum).padStart(4, '0')}`;

    // Get item detail strings
    const itemDetails = order.products
      .map((pid) => products.find((p) => p.id === pid)?.name || 'منتج غير معروف')
      .join(' + ');

    // 3. Create Sale record
    const newSale: Sale = {
      id: saleId,
      orderId: order.id,
      products: order.products,
      amount: order.totalAmount,
      estimatedCost,
      paymentMethod: order.paymentMethod,
      source: order.paymentStatus === 'مدفوع مسبقاً' ? 'مدفوع مسبقاً' : 'من طلب',
      customerName: order.customerName || 'عميل بوث',
      details: itemDetails || 'مبيعات قطع الأزياء',
      timestamp: new Date().toISOString(),
      notes: `تم تحويل الطلب المكتمل ${order.id} مبيعات تلقائية.`,
    };

    setSales((prev) => [newSale, ...prev]);

    // 4. Update products quantities and record inventory movements
    order.products.forEach((pid) => {
      setProducts((prevProds) =>
        prevProds.map((p) => {
          if (p.id === pid) {
            return { ...p, quantity: Math.max(0, p.quantity - 1) };
          }
          return p;
        })
      );

      // Add movement log
      addMovement({
        productId: pid,
        type: 'بيع',
        quantity: 1,
        direction: '➖',
        orderId: order.id,
        saleId: saleId,
        handler,
        notes: `عملية مبيعات تلقائية ناتجة عن إكمال الطلب ${order.id}`,
      });
    });

    // 5. Update Order status to Completed and check "addedToSales"
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'مكتمل',
              paymentStatus: o.paymentStatus === 'غير مدفوع' ? 'مدفوع' : o.paymentStatus,
              addedToSales: true,
              salesLinkedId: saleId,
            }
          : o
      )
    );
  };

  // --- Sales ---
  const addSale = (newSale: Omit<Sale, 'id' | 'timestamp'>) => {
    const lastSaleNum = sales.length > 0
      ? parseInt(sales[0].id.replace('S', ''), 10) || sales.length
      : 0;
    const nextSaleNum = Math.max(lastSaleNum + 1, sales.length + 1);
    const id = `S${String(nextSaleNum).padStart(4, '0')}`;

    const sale: Sale = {
      ...newSale,
      id,
      timestamp: new Date().toISOString(),
    };

    setSales((prev) => [sale, ...prev]);

    // Deduct stock for manual sales as well!
    sale.products.forEach((pid) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === pid ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p))
      );

      addMovement({
        productId: pid,
        type: 'بيع',
        quantity: 1,
        direction: '➖',
        saleId: id,
        handler: settings.cashierName || 'كاشير البوث',
        notes: 'مبيعات كاشير مباشرة وسريعة',
      });
    });
  };

  const deleteSale = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Expenses ---
  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const id = `exp-${Date.now()}`;
    const expense: Expense = { ...newExpense, id };
    setExpenses((prev) => [expense, ...prev]);
  };

  const editExpense = (id: string, updatedFields: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // --- Inventory Movements ---
  const addMovement = (newMovement: Omit<InventoryMovement, 'id' | 'date'>) => {
    const id = `INV-${String(movements.length + 1).padStart(3, '0')}`;
    const movement: InventoryMovement = {
      ...newMovement,
      id,
      date: new Date().toISOString(),
    };
    setMovements((prev) => [movement, ...prev]);
  };

  // --- Daily Tasks ---
  const addTask = (newTask: Omit<DailyTask, 'id' | 'date'>) => {
    const id = `task-${Date.now()}`;
    const task: DailyTask = {
      ...newTask,
      id,
      date: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [task, ...prev]);
  };

  const editTask = (id: string, updatedFields: Partial<DailyTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Daily Reports ---
  const addReport = (newReport: DailyReport) => {
    setReports((prev) => {
      const filtered = prev.filter((r) => r.id !== newReport.id);
      return [newReport, ...filtered];
    });
  };

  const toggleReportClosed = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isClosed: !r.isClosed } : r))
    );
  };

  // --- Settings ---
  const updateSettings = (updatedSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updatedSettings }));
  };

  return (
    <WashiContext.Provider
      value={{
        products,
        orders,
        sales,
        expenses,
        movements,
        reports,
        tasks,
        settings,
        activePage,
        setActivePage,
        isLoading,
        userRole,
        setUserRole,
        logout,
        addProduct,
        editProduct,
        deleteProduct,
        adjustProductStock,
        addOrder,
        editOrder,
        deleteOrder,
        completeOrder,
        addSale,
        deleteSale,
        addExpense,
        editExpense,
        deleteExpense,
        addMovement,
        addTask,
        editTask,
        deleteTask,
        addReport,
        toggleReportClosed,
        updateSettings,
        resetData,
      }}
    >
      {children}
    </WashiContext.Provider>
  );
}

export function useWashi() {
  const context = useContext(WashiContext);
  if (context === undefined) {
    throw new Error('useWashi must be used within a WashiProvider');
  }
  return context;
}
