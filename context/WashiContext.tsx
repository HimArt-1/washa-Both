/* eslint-disable */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, Sale, Expense, InventoryMovement, DailyReport, DailyTask, SystemSettings } from '../lib/types';
import { supabase, toCamelCaseObj, toSnakeCaseObj } from '../lib/supabase';
import { DEFAULT_SETTINGS } from '../lib/seed';

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
  adjustProductStock: (id: string, amount: number, type: 'إضافة مخزون' | 'بيع' | 'مرتجع' | 'تلف' | 'تعديل يدوي', notes: string, handler: string) => void;

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

  // Helper to generate UUIDs locally for optimistic updates
  const generateUUID = () => {
    return crypto.randomUUID();
  };

  // Initial Load from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedRole = localStorage.getItem('washi_role');
        if (storedRole) setUserRole(storedRole as 'admin' | 'cashier');

        const [
          { data: prodData },
          { data: ordData },
          { data: salData },
          { data: expData },
          { data: movData },
          { data: repData },
          { data: tskData },
          { data: setData }
        ] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('sales').select('*').order('created_at', { ascending: false }),
          supabase.from('expenses').select('*').order('created_at', { ascending: false }),
          supabase.from('inventory_movements').select('*').order('created_at', { ascending: false }),
          supabase.from('daily_reports').select('*').order('date', { ascending: false }),
          supabase.from('daily_tasks').select('*').order('created_at', { ascending: false }),
          supabase.from('system_settings').select('*').limit(1)
        ]);

        if (prodData) setProducts(toCamelCaseObj(prodData));
        if (ordData) setOrders(toCamelCaseObj(ordData));
        if (salData) setSales(toCamelCaseObj(salData));
        if (expData) setExpenses(toCamelCaseObj(expData));
        if (movData) setMovements(toCamelCaseObj(movData));
        if (repData) setReports(toCamelCaseObj(repData));
        if (tskData) setTasks(toCamelCaseObj(tskData));
        
        if (setData && setData.length > 0) {
          setSettings(toCamelCaseObj(setData[0]));
        } else {
          // Initialize settings if empty
          await supabase.from('system_settings').insert(toSnakeCaseObj({ id: '00000000-0000-0000-0000-000000000000', ...DEFAULT_SETTINGS }));
          setSettings(DEFAULT_SETTINGS);
        }

      } catch (e) {
        console.error('Error loading data from Supabase:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Supabase Realtime Subscription
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        const table = payload.table;
        const event = payload.eventType;
        const newRec = payload.new ? toCamelCaseObj(payload.new) : null;
        const oldRec = payload.old ? toCamelCaseObj(payload.old) : null;

        const handleRealtimeList = (setFn: React.Dispatch<React.SetStateAction<any[]>>) => {
          if (event === 'INSERT') {
            setFn(prev => prev.some((i: any) => i.id === newRec.id) ? prev : [newRec, ...prev]);
          } else if (event === 'UPDATE') {
            setFn(prev => prev.map((i: any) => i.id === newRec.id ? newRec : i));
          } else if (event === 'DELETE') {
            setFn(prev => prev.filter((i: any) => i.id !== oldRec.id));
          }
        };

        switch (table) {
          case 'products': handleRealtimeList(setProducts); break;
          case 'orders': handleRealtimeList(setOrders); break;
          case 'sales': handleRealtimeList(setSales); break;
          case 'expenses': handleRealtimeList(setExpenses); break;
          case 'inventory_movements': handleRealtimeList(setMovements); break;
          case 'daily_reports': handleRealtimeList(setReports); break;
          case 'daily_tasks': handleRealtimeList(setTasks); break;
          case 'system_settings':
            if (event === 'UPDATE' && newRec) setSettings(newRec);
            break;
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('washi_role', userRole);
    } else {
      localStorage.removeItem('washi_role');
    }
  }, [userRole]);

  const resetData = async () => {
    if (!confirm('هل أنت متأكد من تصفير جميع البيانات السحابية؟')) return;
    
    // Simple way to clear tables for demo purposes (Dangerous in production)
    await Promise.all([
      supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('sales').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('expenses').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('inventory_movements').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('daily_reports').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('daily_tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
    ]);
    
    setProducts([]);
    setOrders([]);
    setSales([]);
    setExpenses([]);
    setMovements([]);
    setReports([]);
    setTasks([]);
    setActivePage('dashboard');
  };

  const logout = () => {
    setUserRole(null);
    localStorage.removeItem('washi_role');
    setActivePage('dashboard');
  };

  // --- Products ---
  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    const id = generateUUID();
    const product: Product = { ...newProduct, id };
    
    setProducts((prev) => [product, ...prev]);
    const { error } = await supabase.from('products').insert(toSnakeCaseObj(product));
    if (error) console.error("Error inserting product:", error);

    if (product.quantity > 0) {
      addMovement({
        productId: id,
        type: 'إضافة مخزون',
        quantity: product.quantity,
        direction: '➕',
        handler: 'System',
        notes: 'الرصيد الافتتاحي'
      });
    }
  };

  const editProduct = async (id: string, productUpdates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...productUpdates } : p)));
    const { error } = await supabase.from('products').update(toSnakeCaseObj(productUpdates)).eq('id', id);
    if (error) console.error("Error updating product:", error);
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error("Error deleting product:", error);
  };

  const adjustProductStock = async (id: string, amount: number, type: 'إضافة مخزون' | 'بيع' | 'مرتجع' | 'تلف' | 'تعديل يدوي', notes: string, handler: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const direction = amount > 0 ? '➕' : '➖';
    const newQuantity = product.quantity + amount;

    // 1. Optimistic Update Product
    editProduct(id, { quantity: newQuantity });

    // 2. Add Movement
    addMovement({
      productId: id,
      type,
      quantity: Math.abs(amount),
      direction,
      handler,
      notes
    });
  };

  // --- Orders ---
  const addOrder = (newOrder: Omit<Order, 'id' | 'orderDate' | 'addedToSales' | 'totalAmount'>): Order => {
    const id = generateUUID();
    
    let totalAmount = 0;
    newOrder.products.forEach(pid => {
      const p = products.find(prod => prod.id === pid);
      if (p) totalAmount += p.price;
    });

    const order: Order = {
      ...newOrder,
      id,
      orderDate: new Date().toISOString(),
      addedToSales: false,
      totalAmount
    };

    setOrders((prev) => [order, ...prev]);
    supabase.from('orders').insert(toSnakeCaseObj(order)).then(({ error }) => {
      if (error) console.error("Error inserting order:", error);
    });

    // Reduce stock
    order.products.forEach(pid => {
      adjustProductStock(pid, -1, 'بيع', `محجوز لطلب رقم ${id.substring(0,6)}`, newOrder.customerName || 'النظام');
    });

    return order;
  };

  const editOrder = async (id: string, orderUpdates: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...orderUpdates } : o)));
    const { error } = await supabase.from('orders').update(toSnakeCaseObj(orderUpdates)).eq('id', id);
    if (error) console.error("Error updating order:", error);
  };

  const deleteOrder = async (id: string) => {
    const order = orders.find(o => o.id === id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
    
    // Return stock if it wasn't sold yet
    if (order && !order.addedToSales) {
      order.products.forEach(pid => {
        adjustProductStock(pid, 1, 'مرتجع', `إلغاء طلب رقم ${id.substring(0,6)}`, 'النظام');
      });
    }

    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) console.error("Error deleting order:", error);
  };

  const completeOrder = async (id: string, handler: string) => {
    const order = orders.find(o => o.id === id);
    if (!order || order.addedToSales) return;

    let totalCost = 0;
    order.products.forEach(pid => {
      const p = products.find(prod => prod.id === pid);
      if (p) totalCost += p.cost;
    });

    addSale({
      orderId: order.id,
      products: order.products,
      amount: order.totalAmount,
      estimatedCost: totalCost,
      paymentMethod: order.paymentMethod,
      source: 'من طلب',
      customerName: order.customerName,
      details: `إتمام طلب ${order.id.substring(0,6)}`,
      notes: ''
    });

    editOrder(id, { 
      orderStatus: 'مكتمل',
      paymentStatus: 'مدفوع',
      addedToSales: true 
    });
  };

  // --- Sales ---
  const addSale = async (newSale: Omit<Sale, 'id' | 'timestamp'>) => {
    const id = generateUUID();
    const sale: Sale = {
      ...newSale,
      id,
      timestamp: new Date().toISOString()
    };

    setSales((prev) => [sale, ...prev]);
    const { error } = await supabase.from('sales').insert(toSnakeCaseObj(sale));
    if (error) console.error("Error inserting sale:", error);
  };

  const deleteSale = async (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) console.error("Error deleting sale:", error);
  };

  // --- Expenses ---
  const addExpense = async (newExpense: Omit<Expense, 'id'>) => {
    const id = generateUUID();
    const expense: Expense = { ...newExpense, id };
    
    setExpenses((prev) => [expense, ...prev]);
    const { error } = await supabase.from('expenses').insert(toSnakeCaseObj(expense));
    if (error) console.error("Error inserting expense:", error);
  };

  const editExpense = async (id: string, expenseUpdates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...expenseUpdates } : e)));
    const { error } = await supabase.from('expenses').update(toSnakeCaseObj(expenseUpdates)).eq('id', id);
    if (error) console.error("Error updating expense:", error);
  };

  const deleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) console.error("Error deleting expense:", error);
  };

  // --- Movements ---
  const addMovement = async (newMovement: Omit<InventoryMovement, 'id' | 'date'>) => {
    const id = generateUUID();
    const movement: InventoryMovement = {
      ...newMovement,
      id,
      date: new Date().toISOString()
    };
    
    setMovements((prev) => [movement, ...prev]);
    const { error } = await supabase.from('inventory_movements').insert(toSnakeCaseObj(movement));
    if (error) console.error("Error inserting movement:", error);
  };

  // --- Tasks ---
  const addTask = async (newTask: Omit<DailyTask, 'id' | 'date'>) => {
    const id = generateUUID();
    const task: DailyTask = {
      ...newTask,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    
    setTasks((prev) => [task, ...prev]);
    const { error } = await supabase.from('daily_tasks').insert(toSnakeCaseObj(task));
    if (error) console.error("Error inserting task:", error);
  };

  const editTask = async (id: string, taskUpdates: Partial<DailyTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...taskUpdates } : t)));
    const { error } = await supabase.from('daily_tasks').update(toSnakeCaseObj(taskUpdates)).eq('id', id);
    if (error) console.error("Error updating task:", error);
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    const { error } = await supabase.from('daily_tasks').delete().eq('id', id);
    if (error) console.error("Error deleting task:", error);
  };

  // --- Reports ---
  const addReport = async (report: DailyReport) => {
    // Check if exists
    const exists = reports.find(r => r.id === report.id);
    if (exists) {
      setReports((prev) => prev.map((r) => (r.id === report.id ? report : r)));
      const { error } = await supabase.from('daily_reports').update(toSnakeCaseObj(report)).eq('id', report.id);
      if (error) console.error("Error updating report:", error);
    } else {
      setReports((prev) => [report, ...prev]);
      const { error } = await supabase.from('daily_reports').insert(toSnakeCaseObj(report));
      if (error) console.error("Error inserting report:", error);
    }
  };

  const toggleReportClosed = async (id: string) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    const isClosed = !report.isClosed;
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, isClosed } : r)));
    
    const { error } = await supabase.from('daily_reports').update(toSnakeCaseObj({ isClosed })).eq('id', id);
    if (error) console.error("Error updating report status:", error);
  };

  // --- Settings ---
  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Update the single row (id = 'settings_1')
    const { error } = await supabase.from('system_settings').update(toSnakeCaseObj(updated)).eq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
       // if it doesn't exist, try to insert it
       await supabase.from('system_settings').insert(toSnakeCaseObj({ id: '00000000-0000-0000-0000-000000000000', ...updated }));
    }
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
        resetData
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
