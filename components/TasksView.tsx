'use client';

import React, { useState } from 'react';
import { useWashi } from '../context/WashiContext';
import { DailyTask } from '../lib/types';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  AlertCircle,
  X,
  Trash2,
  CheckCircle2,
  Sun,
  Coffee,
  Moon,
  ToggleLeft
} from 'lucide-react';

export default function TasksView() {
  const { tasks, addTask, editTask, deleteTask, settings } = useWashi();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<DailyTask['stage']>('أثناء التشغيل');
  const [priority, setPriority] = useState<DailyTask['priority']>('متوسطة');
  const [status, setStatus] = useState<DailyTask['status']>('لم تبدأ');
  const [handler, setHandler] = useState('');
  const [notes, setNotes] = useState('');

  const stagesList: DailyTask['stage'][] = [
    'قبل الافتتاح',
    'أثناء التشغيل',
    'قبل الإغلاق',
    'بعد الإغلاق',
  ];

  // Filters
  const filteredTasks = tasks.filter((t) => {
    return activeStageFilter === 'all' ? true : t.stage === activeStageFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('الرجاء إدخال عنوان المهمة!');
      return;
    }

    addTask({
      title,
      stage,
      priority,
      status,
      handler: handler || settings.cashierName || 'غير محدد',
      notes,
    });

    setTitle('');
    setStage('أثناء التشغيل');
    setPriority('متوسطة');
    setStatus('لم تبدأ');
    setHandler('');
    setNotes('');
    setShowAddModal(false);
  };

  const cycleStatus = (id: string, current: DailyTask['status']) => {
    const nextStatus: DailyTask['status'] =
      current === 'لم تبدأ'
        ? 'قيد التنفيذ'
        : current === 'قيد التنفيذ'
        ? 'مكتملة'
        : 'لم تبدأ';
    editTask(id, { status: nextStatus });
  };

  const getStageEmoji = (s: DailyTask['stage']) => {
    if (s === 'قبل الافتتاح') return '🌅';
    if (s === 'أثناء التشغيل') return '🧴';
    if (s === 'قبل الإغلاق') return '🌙';
    return '🔒';
  };

  return (
    <div className="space-y-6" id="tasks-view-container">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-wusha-ink)] flex items-center gap-2">
            <span>✅</span> المهام اليومية بالمعرض
          </h2>
          <p className="text-xs text-[var(--color-wusha-stone)] mt-1">نسّق جدول الأعمال بين الموظفين لترتيب الرفوف والمبيعات والمطابقة النقدية بنجاح.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#1a1a1a] text-white hover:bg-[#333333] px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
          id="btn-add-task"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مهمة جديدة</span>
        </button>
      </div>

      {/* Control tab filters */}
      <div className="flex bg-[var(--color-wusha-cotton)] p-1 rounded-2xl border border-slate-200 text-xs font-medium text-[var(--color-wusha-stone)] flex-wrap gap-1">
        <button
          onClick={() => setActiveStageFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeStageFilter === 'all' ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-xs' : 'hover:text-[var(--color-wusha-ink)]'
          }`}
        >
          كل المهام ({tasks.length})
        </button>
        {stagesList.map((stg) => (
          <button
            key={stg}
            onClick={() => setActiveStageFilter(stg)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              activeStageFilter === stg ? 'bg-[var(--color-wusha-ivory)] font-bold text-[var(--color-wusha-ink)] shadow-xs' : 'hover:text-[var(--color-wusha-ink)]'
            }`}
          >
            <span>{getStageEmoji(stg)}</span>
            <span>{stg} ({tasks.filter(t => t.stage === stg).length})</span>
          </button>
        ))}
      </div>

      {/* Task List board */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 bg-[var(--color-wusha-ivory)] border border-[var(--color-wusha-cotton)] rounded-2xl shadow-sm">
          <CheckSquare className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <p className="text-xs text-[var(--color-wusha-stone)] mt-2">لا توجد مهام مسجلة لهذه المرحلة.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'مكتملة';
            const isPending = task.status === 'قيد التنفيذ';
            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--color-wusha-ivory)] shadow-xs ${
                  isCompleted ? 'border-[var(--color-wusha-cotton)] opacity-70 bg-[var(--color-wusha-cotton)]' : 'border-[var(--color-wusha-cotton)] hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => cycleStatus(task.id, task.status)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-slate-800 border-slate-800 text-white'
                        : isPending
                        ? 'bg-amber-100 border-amber-400 text-amber-700'
                        : 'bg-[var(--color-wusha-ivory)] border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    {!isCompleted && isPending && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-wusha-muted-gold)]" />}
                  </button>

                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold text-[var(--color-wusha-ink)] leading-tight ${isCompleted ? 'line-through text-[var(--color-wusha-stone)]' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 text-[10px] text-[var(--color-wusha-stone)]">
                      <span className="bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)] font-semibold px-1.5 py-0.5 rounded">
                        {getStageEmoji(task.stage)} {task.stage}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        task.priority === 'عالية'
                          ? 'bg-rose-50 text-rose-700'
                          : task.priority === 'متوسطة'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-[var(--color-wusha-cotton)] text-[var(--color-wusha-stone)]'
                      }`}>
                        أولوية {task.priority}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <User className="w-3 h-3" />
                        <span>المسؤول: {task.handler}</span>
                      </span>
                    </div>
                    {task.notes && (
                      <p className="text-[11px] text-[var(--color-wusha-stone)] italic mt-1 font-medium">«{task.notes}»</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0">
                  <button
                    onClick={() => cycleStatus(task.id, task.status)}
                    className="bg-[var(--color-wusha-cotton)] border border-slate-200 text-[var(--color-wusha-stone)] hover:bg-[var(--color-wusha-cotton)] font-bold px-2.5 py-1 rounded text-[10px]"
                  >
                    {task.status === 'لم تبدأ' ? 'بدء العمل' : task.status === 'قيد التنفيذ' ? 'إكمال' : 'إعادة فتح'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('هل ترغب بحذف هذه المهمة؟')) {
                        deleteTask(task.id);
                      }
                    }}
                    className="text-[var(--color-wusha-stone)] hover:text-rose-600 p-1 rounded-full hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-wusha-ivory)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-[var(--color-wusha-cotton)]">
            <div className="bg-[var(--color-wusha-cotton)] px-6 py-4 border-b border-[var(--color-wusha-cotton)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[var(--color-wusha-ink)] text-base">تسجيل مهمة تشغيلية بالبوث</h3>
                <p className="text-xs text-[var(--color-wusha-stone)] mt-0.5">تابع ووزع أعمال الافتتاح والإغلاق على الفريق.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--color-wusha-stone)] hover:text-[var(--color-wusha-stone)] p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">المهمة المطلوبة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مطابقة وتنسيق أجهزة مدى ونقاط البيع"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">المرحلة التشغيلية</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 bg-[var(--color-wusha-ivory)] rounded-lg"
                  >
                    {stagesList.map((stg) => (
                      <option key={stg} value={stg}>
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">الأولوية</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 bg-[var(--color-wusha-ivory)] rounded-lg"
                  >
                    <option value="منخفضة">منخفضة</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="عالية">عالية</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">الحالة الأولية</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 bg-[var(--color-wusha-ivory)] rounded-lg"
                  >
                    <option value="لم تبدأ">لم تبدأ</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتملة">مكتملة</option>
                    <option value="مؤجلة">مؤجلة</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--color-wusha-ink)]">المسؤول عن التنفيذ</label>
                  <input
                    type="text"
                    placeholder="مثال: ريم السعد"
                    value={handler}
                    onChange={(e) => setHandler(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--color-wusha-ink)]">ملاحظات توجيهية</label>
                <input
                  type="text"
                  placeholder="ملاحظات توضيحية حول كيفية الأداء..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                >
                  إضافة المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
