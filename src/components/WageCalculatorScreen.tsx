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
  AlertCircle
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
      {/* 1. Stat Card (Exact Variation 1 Style: #FFF9F2 background, 2px solid #111113, 4px shadow) */}
      <div className="brutal-card-tint p-4 sm:p-5 relative">
        <div className="flex items-center justify-between border-b-2 border-[#111113] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E35E2D] border border-[#111113]" />
            <span className="label-mono">WEEKLY SUMMARY // إجمالي الأسبوع</span>
          </div>
          <span className="font-mono text-xs font-bold bg-[#111113] text-white px-2 py-0.5">
            {ratePerOp} YER / OP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <div>
            <div className="label-mono text-[#111113]/70 mb-1">المبلغ الإجمالي المستحق</div>
            <div className="text-3xl sm:text-4xl font-black text-[#111113] font-mono tracking-tight flex items-baseline gap-2">
              <span>{summary.grandTotalAmount.toLocaleString()}</span>
              <span className="text-base font-bold text-[#E35E2D] font-sans">ريال</span>
            </div>
          </div>

          <div className="bg-white border-2 border-[#111113] p-2.5 flex items-center justify-between">
            <div>
              <span className="label-mono block">إجمالي العمليات</span>
              <span className="text-xl font-black font-mono text-[#111113]">
                {summary.grandTotalOps.toLocaleString()}
              </span>
              <span className="text-xs text-[#111113]/60 mr-1 font-bold">عملية</span>
            </div>
            <div className="text-left font-mono text-[11px] text-[#111113]/70 border-r-2 border-[#111113] pr-3">
              <div>المعادلة:</div>
              <div className="font-bold text-[#E35E2D]">{summary.grandTotalOps} × {ratePerOp}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {postingSuccessMessage && (
        <div className="brutal-card p-3 bg-emerald-100 flex items-center gap-2 text-emerald-950 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{postingSuccessMessage}</span>
        </div>
      )}

      {/* If No Names Registered */}
      {names.length === 0 && (
        <div className="brutal-card p-4 bg-amber-100 flex items-center justify-between gap-3 text-amber-950 text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <span>لا توجد أسماء مسجلة حالياً! قم بإضافة أسماء لتتمكن من اختيارها.</span>
          </div>
          <button
            onClick={onNavigateToNames}
            className="brutal-btn px-3 py-1.5 text-xs font-bold shrink-0"
          >
            إضافة أسماء
          </button>
        </div>
      )}

      {/* 2. Record Cards List (Variation 1 Card Structure) */}
      <div className="space-y-4">
        {records.map((record, index) => {
          const totalOps = getRecordTotalOps(record);
          const dueAmount = getRecordDueAmount(record);

          return (
            <div
              key={record.id}
              className="brutal-card bg-white p-3 sm:p-4 transition-all"
            >
              {/* Record Header */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-[#111113] pb-2.5 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-mono text-xs font-black bg-[#111113] text-white px-2 py-0.5">
                    [{String(index + 1).padStart(2, '0')}]
                  </span>

                  {/* Dropdown for Name Selection */}
                  <div className="relative flex-1 max-w-xs">
                    <select
                      value={record.selectedName}
                      onChange={(e) => updateRecordName(record.id, e.target.value)}
                      className="w-full bg-[#FFF9F2] text-[#111113] text-sm font-black py-1.5 px-3 pr-8 border-2 border-[#111113] shadow-[2px_2px_0px_#111113] focus:outline-none focus:shadow-[2px_2px_0px_#E35E2D] appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        -- اختار الاسم --
                      </option>
                      {names.map((n) => (
                        <option key={n.id} value={n.name}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-xs text-[#111113]">
                      ▼
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onNavigateToNames}
                    className="p-1.5 bg-white border-2 border-[#111113] text-[#111113] shadow-[2px_2px_0px_#111113] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                    title="إضافة اسم جديد"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => removeRecord(record.id)}
                    className="p-1.5 bg-white border-2 border-[#111113] text-rose-600 shadow-[2px_2px_0px_#111113] hover:bg-rose-50 hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                    title="حذف هذا السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Workdays Input Group (Variation 1 Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                {/* Saturday */}
                <div>
                  <div className="label-mono mb-1">السبت // SAT</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    value={record.days.sat === 0 ? '' : record.days.sat}
                    onChange={(e) =>
                      updateRecordDay(record.id, 'sat', parseInt(e.target.value) || 0)
                    }
                    className="brutal-input w-full py-2 px-2 text-center font-mono font-bold text-base"
                  />
                </div>

                {/* Sunday */}
                <div>
                  <div className="label-mono mb-1">الأحد // SUN</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    value={record.days.sun === 0 ? '' : record.days.sun}
                    onChange={(e) =>
                      updateRecordDay(record.id, 'sun', parseInt(e.target.value) || 0)
                    }
                    className="brutal-input w-full py-2 px-2 text-center font-mono font-bold text-base"
                  />
                </div>

                {/* Monday */}
                <div>
                  <div className="label-mono mb-1">الإثنين // MON</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    value={record.days.mon === 0 ? '' : record.days.mon}
                    onChange={(e) =>
                      updateRecordDay(record.id, 'mon', parseInt(e.target.value) || 0)
                    }
                    className="brutal-input w-full py-2 px-2 text-center font-mono font-bold text-base"
                  />
                </div>

                {/* Tuesday */}
                <div>
                  <div className="label-mono mb-1">الثلاثاء // TUE</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    value={record.days.tue === 0 ? '' : record.days.tue}
                    onChange={(e) =>
                      updateRecordDay(record.id, 'tue', parseInt(e.target.value) || 0)
                    }
                    className="brutal-input w-full py-2 px-2 text-center font-mono font-bold text-base"
                  />
                </div>

                {/* Wednesday */}
                <div>
                  <div className="label-mono mb-1">الأربعاء // WED</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    value={record.days.wed === 0 ? '' : record.days.wed}
                    onChange={(e) =>
                      updateRecordDay(record.id, 'wed', parseInt(e.target.value) || 0)
                    }
                    className="brutal-input w-full py-2 px-2 text-center font-mono font-bold text-base"
                  />
                </div>

                {/* Thursday */}
                <div>
                  <div className="label-mono mb-1">الخميس // THU</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    value={record.days.thu === 0 ? '' : record.days.thu}
                    onChange={(e) =>
                      updateRecordDay(record.id, 'thu', parseInt(e.target.value) || 0)
                    }
                    className="brutal-input w-full py-2 px-2 text-center font-mono font-bold text-base"
                  />
                </div>
              </div>

              {/* Record Summary Footer */}
              <div className="bg-[#FFF9F2] border-2 border-[#111113] p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="label-mono">العمليات:</span>
                  <span className="font-mono font-black text-sm bg-[#111113] text-white px-2 py-0.5">
                    {totalOps}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="label-mono">المستحق:</span>
                  <span className="font-mono font-black text-sm text-[#E35E2D] bg-white border border-[#111113] px-2 py-0.5">
                    {dueAmount.toLocaleString()} ريال
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button: Add Record */}
      <div className="pt-1">
        <button
          onClick={() => addRecord()}
          className="brutal-btn-secondary w-full py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E35E2D]" />
          <span>+ إضافة سجل موظف جديد</span>
        </button>
      </div>

      {/* 4 Action Buttons Bar (Neo-brutalist Variation 1) */}
      <div className="pt-2">
        <div className="label-mono mb-2 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-[#E35E2D]" />
          <span>ACTIONS // إجراءات وعمليات السجلات</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Post/Archive */}
          <button
            onClick={() => setShowPostingConfirm(true)}
            disabled={summary.grandTotalOps === 0}
            className={`py-3 px-2 font-black text-xs flex flex-col items-center justify-center gap-1.5 transition ${
              summary.grandTotalOps > 0
                ? 'brutal-btn-accent cursor-pointer'
                : 'bg-slate-200 text-slate-500 border-2 border-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>ترحيل السجلات</span>
          </button>

          {/* Clear Inputs */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="brutal-btn-secondary py-3 px-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#E35E2D]" />
            <span>مسح الحقول</span>
          </button>

          {/* Print PDF */}
          <button
            onClick={onOpenPdfModal}
            className="brutal-btn py-3 px-2 font-black text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#E35E2D]" />
            <span>طباعة PDF</span>
          </button>

          {/* Add Name Screen */}
          <button
            onClick={onNavigateToNames}
            className="brutal-btn-secondary py-3 px-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#111113]" />
            <span>إضافة اسم جديد</span>
          </button>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="brutal-card-lg w-full max-w-sm p-5 text-[#111113] bg-white">
            <div className="label-mono text-[#E35E2D] mb-1">[ALERT] CLEAR DATA</div>
            <h3 className="text-base font-black mb-2">مسح جميع الحقول؟</h3>
            <p className="text-xs text-[#111113]/70 mb-5">
              سيتم تصفير أعداد العمليات لكافة أيام الأسبوع. الأسماء ستبقى محفوظة.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="brutal-btn-secondary py-2 px-3 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmClear}
                className="brutal-btn-accent py-2 px-3 text-xs font-black"
              >
                تأكيد المسح
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Post Batch Modal */}
      {showPostingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="brutal-card-lg w-full max-w-sm p-5 text-[#111113] bg-white">
            <div className="label-mono text-[#E35E2D] mb-1">[ARCHIVE] BATCH POST</div>
            <h3 className="text-base font-black mb-2">ترحيل وحفظ السجلات</h3>
            <p className="text-xs text-[#111113]/70 mb-4">
              سيتم حفظ هذا الأسبوع في سجل الأرشيف لتوثيق مستحقات العمل.
            </p>

            <div className="brutal-card-tint p-3 mb-4 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span>إجمالي العمليات:</span>
                <span className="font-bold">{summary.grandTotalOps}</span>
              </div>
              <div className="flex justify-between">
                <span>المبلغ المستحق:</span>
                <span className="font-bold text-[#E35E2D]">{summary.grandTotalAmount.toLocaleString()} ريال</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowPostingConfirm(false)}
                className="brutal-btn-secondary py-2 px-3 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handlePostBatch}
                className="brutal-btn-accent py-2 px-3 text-xs font-black"
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
