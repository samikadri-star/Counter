import React from 'react';
import { 
  Archive, 
  Calendar, 
  FileText, 
  Trash2, 
  ArrowRight,
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
      {/* Header Banner (Variation 1 Style) */}
      <div className="brutal-card p-4 flex items-center justify-between">
        <div>
          <div className="label-mono text-[#E35E2D]">[03] ARCHIVES // HISTORY</div>
          <h2 className="text-base sm:text-lg font-black text-[#111113]">
            سجل الترحيل والأرشفة
          </h2>
        </div>

        <button
          onClick={onNavigateToCalculator}
          className="brutal-btn px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
        >
          <span>الاحتساب الجديد</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>

      {/* Batches List */}
      {batches.length === 0 ? (
        <div className="brutal-card p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-[#FFF9F2] border-2 border-[#111113] flex items-center justify-center mx-auto text-[#E35E2D]">
            <Archive className="w-6 h-6" />
          </div>
          <div className="label-mono">[EMPTY ARCHIVE]</div>
          <h3 className="text-sm font-black text-[#111113]">
            لا توجد سجلات مرحلة حتى الآن
          </h3>
          <p className="text-xs text-[#111113]/70 max-w-sm mx-auto leading-relaxed">
            عند الانتهاء من احتساب عمليات أسبوع في الشاشة الرئيسية، اضغط على زر "ترحيل" لحفظ التقرير هنا كأرشيف دائم.
          </p>
          <button
            onClick={onNavigateToCalculator}
            className="brutal-btn px-4 py-2 text-xs font-bold"
          >
            الذهاب لشاشة الاحتساب
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {batches.map((batch, idx) => {
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
                className="brutal-card p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#111113] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-[#111113] text-white px-2 py-0.5">
                        REC_{String(idx + 1).padStart(3, '0')}
                      </span>
                      <h4 className="text-sm font-black text-[#111113]">{batch.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#111113]/70 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#E35E2D]" />
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span className="font-bold text-[#111113]">{batch.ratePerOp} YER/OP</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewBatchPdf(batch)}
                      className="brutal-btn px-3 py-1.5 text-xs font-black flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#E35E2D]" />
                      <span>عرض وطباعة PDF</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف هذا السجل المؤرشف؟`)) {
                          deleteBatch(batch.id);
                        }
                      }}
                      className="brutal-btn-secondary p-1.5 text-xs text-rose-600 hover:text-rose-800"
                      title="حذف هذا الأرشيف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Batch Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#FFF9F2] border-2 border-[#111113] p-3 text-xs">
                  <div>
                    <span className="label-mono block">المستفيدون:</span>
                    <span className="font-mono font-black text-sm text-[#111113]">
                      {batch.records.length} شخص
                    </span>
                  </div>
                  <div>
                    <span className="label-mono block">إجمالي العمليات:</span>
                    <span className="font-mono font-black text-sm text-[#111113]">
                      {batch.totalOps}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="label-mono block">إجمالي المبلغ:</span>
                    <span className="font-mono font-black text-sm text-[#E35E2D]">
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
