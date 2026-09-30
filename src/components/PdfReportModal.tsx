import React, { useRef, useState } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  Share2, 
  FileCheck, 
  Calendar, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { PersonWageRecord, SavedReportBatch } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PersonWageRecord[];
  getRecordTotalOps: (rec: PersonWageRecord) => number;
  getRecordDueAmount: (rec: PersonWageRecord) => number;
  ratePerOp: number;
  selectedBatch?: SavedReportBatch | null;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  records,
  getRecordTotalOps,
  getRecordDueAmount,
  ratePerOp,
  selectedBatch,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Prepare table data either from chosen batch or current active records
  const isFromHistory = !!selectedBatch;

  const dataRows = isFromHistory
    ? selectedBatch.records.map((r) => ({
        name: r.name,
        ops: r.totalOps,
        amount: r.totalAmount,
      }))
    : records
        .filter((r) => r.selectedName.trim() !== '')
        .map((r) => ({
          name: r.selectedName,
          ops: getRecordTotalOps(r),
          amount: getRecordDueAmount(r),
        }));

  const totalOps = isFromHistory
    ? selectedBatch.totalOps
    : dataRows.reduce((acc, row) => acc + row.ops, 0);

  const totalAmount = isFromHistory
    ? selectedBatch.totalAmount
    : dataRows.reduce((acc, row) => acc + row.amount, 0);

  const effectiveRate = isFromHistory ? selectedBatch.ratePerOp : ratePerOp;

  const reportDate = isFromHistory
    ? new Date(selectedBatch.date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  // Handle PDF Download via html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      // Create high-res canvas
      const canvas = await html2canvas(reportRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20; // 10mm margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 15, imgWidth, Math.min(imgHeight, pageHeight - 30));
      pdf.save(`تقرير_مستحق_الأرشفة_${Date.now()}.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Error generating PDF', err);
      alert('حدث خطأ أثناء تصدير ملف PDF. يمكنك استخدام زر الطباعة المباشرة.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Share via Web Share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تقرير مستحق الأرشفة',
          text: `تقرير مستحق الأرشفة بتاريخ ${reportDate} - إجمالي العمليات: ${totalOps} - إجمالي المبلغ: ${totalAmount} ريال`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      alert('المشاركة غير مدعومة مباشرة، يمكنك تحميل ملف PDF ومشاركته عبر الواتساب.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Top Action Bar (No Print) */}
        <div className="no-print bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-white">
              معاينة وتصدير تقرير PDF
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="طباعة مباشرة"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-950/40 disabled:opacity-50"
              title="تنزيل ملف PDF"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري التصدير...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
              title="مشاركة"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success toast inside modal */}
        {downloadSuccess && (
          <div className="no-print bg-emerald-900/90 text-emerald-200 px-4 py-2 text-xs flex items-center justify-center gap-1.5 font-medium border-b border-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تم تصدير ملف PDF بنجاح وحفظه على جهازك!</span>
          </div>
        )}

        {/* Scrollable Printable Area */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-slate-950/60 flex items-center justify-center">
          {/* Paper Container (Replicating Image 03 exactly in format, elevated with crisp layout) */}
          <div
            ref={reportRef}
            className="print-container w-full max-w-lg bg-white text-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-300 p-0"
            style={{ direction: 'rtl', fontFamily: "'Cairo', system-ui, sans-serif" }}
          >
            {/* 1. Header Banner (Image 03: "تقرير مستحق الأرشفة") */}
            <div className="bg-[#3b82f6] text-white py-3.5 px-4 text-center border-b-2 border-black">
              <h2 className="text-xl sm:text-2xl font-black tracking-wide">
                تقرير مستحق الأرشفة
              </h2>
            </div>

            {/* 2. Date row (Image 03: "التاريخ") */}
            <div className="bg-white py-2 px-4 text-center border-b-2 border-black">
              <div className="text-base font-bold text-black flex items-center justify-center gap-2">
                <span>التاريخ:</span>
                <span className="num-tabular font-extrabold text-blue-900">{reportDate}</span>
              </div>
            </div>

            {/* 3. Main Data Table (Image 03 table structure) */}
            <div className="p-0">
              <table className="w-full text-right border-collapse border-b-2 border-black">
                <thead>
                  {/* Lavender/purple header like in Image 03 */}
                  <tr className="bg-[#9384d1] text-white border-b-2 border-black text-sm sm:text-base font-bold text-center">
                    <th className="py-2.5 px-3 border-l-2 border-black w-2/5">
                      الاسم
                    </th>
                    <th className="py-2.5 px-2 border-l-2 border-black w-3/10">
                      عدد العمليات
                    </th>
                    <th className="py-2.5 px-3 w-3/10">
                      المبلغ المستحق
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold divide-y divide-black/40">
                  {dataRows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-500 text-xs">
                        لا توجد سجلات لعرضها حالياً
                      </td>
                    </tr>
                  ) : (
                    dataRows.map((row, i) => (
                      <tr
                        key={i}
                        className={`${
                          i % 2 === 0 ? 'bg-[#dcd7f5]/40' : 'bg-[#dcd7f5]/70'
                        } border-b border-black text-center text-slate-900`}
                      >
                        <td className="py-2 px-3 border-l-2 border-black text-right font-bold pr-4">
                          {row.name}
                        </td>
                        <td className="py-2 px-2 border-l-2 border-black font-extrabold text-blue-950 num-tabular">
                          {row.ops}
                        </td>
                        <td className="py-2 px-3 font-extrabold text-emerald-900 num-tabular">
                          {row.amount.toLocaleString()} ريال
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Empty rows to look authentic like original sheet if few items */}
                  {dataRows.length > 0 && dataRows.length < 5 &&
                    Array.from({ length: 5 - dataRows.length }).map((_, idx) => (
                      <tr
                        key={'empty_' + idx}
                        className={`${
                          (dataRows.length + idx) % 2 === 0 ? 'bg-[#dcd7f5]/30' : 'bg-[#dcd7f5]/60'
                        } border-b border-black text-center text-transparent`}
                      >
                        <td className="py-2 px-3 border-l-2 border-black">-</td>
                        <td className="py-2 px-2 border-l-2 border-black">-</td>
                        <td className="py-2 px-3">-</td>
                      </tr>
                    ))}

                  {/* Total Summary Row */}
                  <tr className="bg-[#ede9fe] text-black font-black text-sm sm:text-base border-t-2 border-b-2 border-black text-center">
                    <td className="py-2.5 px-3 border-l-2 border-black text-right pr-4 text-indigo-950">
                      الإجمالي العام ({dataRows.length} مستفيد)
                    </td>
                    <td className="py-2.5 px-2 border-l-2 border-black text-blue-950 font-black num-tabular">
                      {totalOps} عملية
                    </td>
                    <td className="py-2.5 px-3 text-emerald-900 font-black num-tabular">
                      {totalAmount.toLocaleString()} ريال
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rate footnote */}
            <div className="px-4 py-1.5 bg-slate-50 text-[11px] text-slate-600 border-b border-black flex justify-between">
              <span>سعر احتساب العملية: {effectiveRate} ريال</span>
              <span>الحالة: معتمد</span>
            </div>

            {/* 4. Footer Banner (Image 03: "تصميم وتطوير: سامي القادري 777484160") */}
            <div className="bg-white py-3 px-4 text-center border-t border-slate-200">
              <div className="text-sm sm:text-base font-extrabold text-black tracking-wide">
                <span>تصميم وتطوير: </span>
                <span className="text-blue-900 font-black">سامي القادري</span>
                <span className="mx-2 text-slate-400">|</span>
                <span className="num-tabular font-black text-black">777484160</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>صيغة التقرير: PDF قياسي A4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            إغلاق المعاينة
          </button>
        </div>
      </div>
    </div>
  );
};
