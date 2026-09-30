import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  unsavedOpsCount: number;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
  unsavedOpsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-rose-500/30 p-5 sm:p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-center text-white mb-2">
          تأكيد الخروج من التطبيق
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 text-center leading-relaxed mb-4">
          هل أنت متأكد من رغبتك في إغلاق التطبيق ومغادرة الصفحة؟
        </p>

        {unsavedOpsCount > 0 && (
          <div className="bg-amber-950/50 border border-amber-500/30 p-3 rounded-xl mb-5 flex items-start gap-2 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              لديك <strong className="num-tabular font-bold text-white">{unsavedOpsCount}</strong> عملية مدخلة في الأسبوع الحالي، بياناتك محفوظة تلقائياً في ذاكرة التطبيق، ولكن يمكنك أيضاً عمل "ترحيل" لتوثيقها.
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition active:scale-95"
          >
            البقاء في التطبيق
          </button>
          
          <button
            onClick={onConfirmExit}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/50 transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>تأكيد الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};
