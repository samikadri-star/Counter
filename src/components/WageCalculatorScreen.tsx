import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  RotateCcw, 
  Send, 
  UserPlus, 
  Calculator, 
  Sparkles,
  TrendingUp,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { EmployeeName, PersonWageRecord, DayKey } from '../types';
import confetti from 'canvas-confetti';

interface WageCalculatorScreenProps {
  names: EmployeeName[];
  records: PersonWageRecord[];
  addRecord: (preferredName?: string) => void;
  removeRecord: (id: string) => void;
  updateRecordName: (id: string, name: string) => void;
  updateRecordDay: (id: string, day: DayKey, value: number) => void;
  clearAllInputs: () => void;
  getRecordTotalOps: (rec: PersonWageRecord) => number;
  getRecordDueAmount: (rec: PersonWageRecord) => number;
  ratePerOp: number;
  summary: {
    grandTotalOps: number;
    grandTotalAmount: number;
    totalRecords: number;
    activePersonsCount: number;
  };
  onOpenPdfModal: () => void;
  onNavigateToNames: () => void;
  onArchiveBatch: () => void;
}

export const WageCalculatorScreen: React.FC<WageCalculatorScreenProps> = ({
  names,
  records,
  addRecord,
  removeRecord,
  updateRecordName,
  updateRecordDay,
  clearAllInputs,
  getRecordTotalOps,
  getRecordDueAmount,
  ratePerOp,
  summary,
  onOpenPdfModal,
  onNavigateToNames,
  onArchiveBatch,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPostingConfirm, setShowPostingConfirm] = useState(false);
  const [postingSuccessMessage, setPostingSuccessMessage] = useState<string | null>(null);

  const handlePostBatch = () => {
    onArchiveBatch();
    setShowPostingConfirm(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setPostingSuccessMessage('تم ترحيل وحفظ مستحقات الأسبوع الحالي بنجاح!');
    setTimeout(() => setPostingSuccessMessage(null), 4000);
  };

  const handleConfirmClear = () => {
    clearAllInputs();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* Grand Summary Stat Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-3.5 sm:p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                <Calculator className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-semibold text-slate-200">
                إجمالي مستحقات الأسبوع الحالي
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              معادلة الاحتساب: <span className="text-indigo-300 font-semibold">مجموع العمليات × {ratePerOp} ريال</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-center sm:text-right px-2">
              <span className="text-[11px] text-slate-400 block font-medium">إجمالي العمليات</span>
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <span className="text-xl sm:text-2xl font-black text-cyan-400 num-tabular">
                  {summary.grandTotalOps.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">عملية</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div className="text-center sm:text-right px-2">
              <span className="text-[11px] text-slate-400 block font-medium">المبلغ المستحق</span>
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 num-tabular">
                  {summary.grandTotalAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">ريال</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {postingSuccessMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs shadow-lg animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{postingSuccessMessage}</span>
        </div>
      )}

      {/* If No Names are registered warning */}
      {names.length === 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>لا توجد أسماء مسجلة حالياً! قم بإضافة أسماء لتتمكن من اختيارها.</span>
          </div>
          <button
            onClick={onNavigateToNames}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shrink-0 transition"
          >
            إضافة أسماء
          </button>
        </div>
      )}

      {/* Record Cards List (Styled with high fidelity reflecting Image 01) */}
      <div className="space-y-4">
        {records.map((record, index) => {
          const totalOps = getRecordTotalOps(record);
          const dueAmount = getRecordDueAmount(record);

          return (
            <div
              key={record.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl shadow-lg overflow-hidden transition-all duration-200"
            >
              {/* Card Header: Dropdown for Name Selection */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 px-3.5 py-2.5 border-b border-indigo-700/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 num-tabular">
                    {index + 1}
                  </span>
                  
                  {/* Select Name Dropdown */}
                  <div className="relative flex-1">
                    <select
                      value={record.selectedName}
                      onChange={(e) => updateRecordName(record.id, e.target.value)}
                      className="w-full bg-slate-950/90 text-white text-sm font-semibold py-1.5 px-3 pr-8 rounded-xl border border-indigo-500/40 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 appearance-none cursor-pointer transition"
                    >
                      <option value="" disabled>
                        -- اختار الاسم --
                      </option>
                      {names.map((n) => (
                        <option key={n.id} value={n.name} className="bg-slate-900 text-white">
                          {n.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Quick Add Name shortcut */}
                  <button
                    onClick={onNavigateToNames}
                    className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-700/40 transition active:scale-95"
                    title="إضافة اسم جديد للقائمة"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>

                  {/* Remove Record Button */}
                  <button
                    onClick={() => removeRecord(record.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 transition active:scale-95"
                    title="حذف هذا السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Workdays Grid (2 Columns × 3 Rows like in Image 01) */}
              <div className="p-3 bg-slate-950/40">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Pair 1: السبت (Sat) and الثلاثاء (Tue) */}
                  {/* Column 1 (Right): السبت */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <label className="font-semibold text-slate-300 shrink-0 select-none">
                      السبت
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={record.days.sat === 0 ? '' : record.days.sat}
                      onChange={(e) =>
                        updateRecordDay(record.id, 'sat', parseInt(e.target.value) || 0)
                      }
                      className="w-20 sm:w-24 text-center font-bold text-sm text-cyan-300 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 num-tabular transition"
                    />
                  </div>

                  {/* Column 2 (Left): الثلاثاء */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <label className="font-semibold text-slate-300 shrink-0 select-none">
                      الثلاثاء
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={record.days.tue === 0 ? '' : record.days.tue}
                      onChange={(e) =>
                        updateRecordDay(record.id, 'tue', parseInt(e.target.value) || 0)
                      }
                      className="w-20 sm:w-24 text-center font-bold text-sm text-cyan-300 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 num-tabular transition"
                    />
                  </div>

                  {/* Pair 2: الأحد (Sun) and الأربعاء (Wed) */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <label className="font-semibold text-slate-300 shrink-0 select-none">
                      الأحد
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={record.days.sun === 0 ? '' : record.days.sun}
                      onChange={(e) =>
                        updateRecordDay(record.id, 'sun', parseInt(e.target.value) || 0)
                      }
                      className="w-20 sm:w-24 text-center font-bold text-sm text-cyan-300 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 num-tabular transition"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <label className="font-semibold text-slate-300 shrink-0 select-none">
                      الأربعاء
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={record.days.wed === 0 ? '' : record.days.wed}
                      onChange={(e) =>
                        updateRecordDay(record.id, 'wed', parseInt(e.target.value) || 0)
                      }
                      className="w-20 sm:w-24 text-center font-bold text-sm text-cyan-300 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 num-tabular transition"
                    />
                  </div>

                  {/* Pair 3: الإثنين (Mon) and الخميس (Thu) */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <label className="font-semibold text-slate-300 shrink-0 select-none">
                      الإثنين
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={record.days.mon === 0 ? '' : record.days.mon}
                      onChange={(e) =>
                        updateRecordDay(record.id, 'mon', parseInt(e.target.value) || 0)
                      }
                      className="w-20 sm:w-24 text-center font-bold text-sm text-cyan-300 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 num-tabular transition"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <label className="font-semibold text-slate-300 shrink-0 select-none">
                      الخميس
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={record.days.thu === 0 ? '' : record.days.thu}
                      onChange={(e) =>
                        updateRecordDay(record.id, 'thu', parseInt(e.target.value) || 0)
                      }
                      className="w-20 sm:w-24 text-center font-bold text-sm text-cyan-300 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 num-tabular transition"
                    />
                  </div>
                </div>
              </div>

              {/* Record Summary Footer (matching the blue bar in Image 01) */}
              <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/70 to-blue-900/80 px-3.5 py-2.5 border-t border-indigo-600/30 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-200">عدد العمليات:</span>
                  <span className="font-extrabold text-white text-base num-tabular bg-blue-950/90 px-2.5 py-0.5 rounded-lg border border-blue-400/30">
                    {totalOps}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-200">المبلغ:</span>
                  <div className="flex items-center gap-1 bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-400/30">
                    <span className="font-extrabold text-emerald-300 text-base num-tabular">
                      {dueAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-medium">ريال</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button: إضافة سجل (Add new record button) */}
      <div className="pt-2">
        <button
          onClick={() => addRecord()}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-800 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 border border-indigo-500/30 active:scale-[0.99] transition"
        >
          <Plus className="w-5 h-5 text-cyan-300" />
          <span>إضافة سجل جديد</span>
        </button>
      </div>

      {/* Main Operations Action Bar (Recreating the 4 bottom buttons from Image 01 in modern palette) */}
      <div className="pt-3">
        <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5 px-1">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          <span>إجراءات وعمليات المستحقات</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Button 1: ترحيل */}
          <button
            onClick={() => setShowPostingConfirm(true)}
            disabled={summary.grandTotalOps === 0}
            className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 shadow-md transition active:scale-95 ${
              summary.grandTotalOps > 0
                ? 'bg-gradient-to-b from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white border border-indigo-400/40 shadow-indigo-900/40'
                : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <Send className="w-4 h-4 text-cyan-300" />
            <span>ترحيل السجلات</span>
          </button>

          {/* Button 2: مسح الحقول */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="py-3 px-3 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 border border-slate-700 shadow-md transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>مسح الحقول</span>
          </button>

          {/* Button 3: طباعة PDF */}
          <button
            onClick={onOpenPdfModal}
            className="py-3 px-3 rounded-xl bg-gradient-to-b from-emerald-600 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 border border-emerald-400/40 shadow-md shadow-emerald-950/40 transition active:scale-95"
          >
            <FileText className="w-4 h-4 text-emerald-200" />
            <span>طباعة PDF</span>
          </button>

          {/* Button 4: شاشة إضافة اسم جديد */}
          <button
            onClick={onNavigateToNames}
            className="py-3 px-3 rounded-xl bg-gradient-to-b from-sky-700 to-blue-900 hover:from-sky-600 hover:to-blue-800 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 border border-sky-400/40 shadow-md shadow-blue-950/40 transition active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-sky-200" />
            <span>شاشة إضافة اسم</span>
          </button>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center mb-1">مسح جميع الحقول؟</h3>
            <p className="text-xs text-slate-400 text-center mb-5">
              سيتم تصفير أعداد العمليات لجميع الأيام في السجلات الحالية. الأسماء ستبقى محفوظة.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmClear}
                className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-md shadow-amber-900/30"
              >
                نعم، مسح الحقول
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Post Batch Modal */}
      {showPostingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-indigo-500/30 p-5 shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center mb-1">ترحيل وحفظ السجلات</h3>
            <p className="text-xs text-slate-400 text-center mb-4">
              سيتم حفظ هذا التقرير الأسبوعي في سجل الترحيل والأرشيف لتوثيق أجور الأسبوع.
            </p>
            
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">إجمالي العمليات:</span>
                <span className="font-bold text-cyan-400 num-tabular">{summary.grandTotalOps} عملية</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">المبلغ المستحق:</span>
                <span className="font-bold text-emerald-400 num-tabular">{summary.grandTotalAmount.toLocaleString()} ريال</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowPostingConfirm(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                إلغاء
              </button>
              <button
                onClick={handlePostBatch}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-900/40"
              >
                تأكيد الترحيل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
