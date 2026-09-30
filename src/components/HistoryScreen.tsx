import React from 'react';
import { 
  Archive, 
  Calendar, 
  FileText, 
  Trash2, 
  Coins, 
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { SavedReportBatch } from '../types';

interface HistoryScreenProps {
  batches: SavedReportBatch[];
  deleteBatch: (id: string) => void;
  onViewBatchPdf: (batch: SavedReportBatch) => void;
  onNavigateToCalculator: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  batches,
  deleteBatch,
  onViewBatchPdf,
  onNavigateToCalculator,
}) => {
  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-cyan-400">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              سجل الترحيل والأرشفة
            </h2>
            <p className="text-xs text-indigo-200">
              أرشيف التقارير والأسابيع السابقة التي تم ترحيلها
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToCalculator}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-400/30 transition active:scale-95"
        >
          <span>الاحتساب الجديد</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>

      {/* Batches List */}
      {batches.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Archive className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-300">
            لا توجد سجلات مرحلة حتى الآن
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            عند الانتهاء من احتساب عمليات أسبوع في الشاشة الرئيسية، اضغط على زر "ترحيل" لحفظ التقرير هنا كأرشيف دائم.
          </p>
          <button
            onClick={onNavigateToCalculator}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
          >
            الذهاب لشاشة الاحتساب
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {batches.map((batch) => {
            const dateStr = new Date(batch.date).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={batch.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg space-y-3 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                      <h4 className="text-sm font-bold text-white">{batch.title}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-medium num-tabular">
                        {batch.ratePerOp} ريال/عملية
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewBatchPdf(batch)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>عرض وطباعة PDF</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف هذا السجل المؤرشف؟`)) {
                          deleteBatch(batch.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
                      title="حذف هذا الأرشيف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Batch Stats & Records preview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">عدد الموظفين:</span>
                    <span className="font-bold text-slate-200 num-tabular">
                      {batch.records.length} مستفيد
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">إجمالي العمليات:</span>
                    <span className="font-bold text-cyan-400 num-tabular">
                      {batch.totalOps} عملية
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block text-[11px]">إجمالي المبلغ:</span>
                    <span className="font-extrabold text-emerald-400 num-tabular">
                      {batch.totalAmount.toLocaleString()} ريال
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
