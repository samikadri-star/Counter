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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150">
      <div className="brutal-card-lg w-full max-w-sm p-5 sm:p-6 text-[#111113] bg-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 bg-white border-2 border-[#111113] hover:bg-[#FFF9F2] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 bg-[#FFF9F2] border-2 border-[#111113] shadow-[3px_3px_0px_#E35E2D] flex items-center justify-center mx-auto mb-4 text-[#E35E2D]">
          <LogOut className="w-7 h-7" />
        </div>

        <div className="label-mono text-center text-[#E35E2D] mb-1">
          [EXIT CONFIRMATION]
        </div>

        <h3 className="text-lg font-black text-center text-[#111113] mb-2">
          تأكيد الخروج من التطبيق
        </h3>

        <p className="text-xs sm:text-sm text-[#111113]/80 text-center leading-relaxed mb-4">
          هل أنت متأكد من رغبتك في إغلاق التطبيق ومغادرة الصفحة؟
        </p>

        {unsavedOpsCount > 0 && (
          <div className="bg-[#FFF9F2] border-2 border-[#111113] p-3 mb-5 flex items-start gap-2 text-xs text-[#111113]">
            <AlertTriangle className="w-4 h-4 text-[#E35E2D] shrink-0 mt-0.5" />
            <span>
              لديك <strong className="font-mono font-bold text-[#E35E2D]">{unsavedOpsCount}</strong> عملية مدخلة في الأسبوع الحالي، بياناتك محفوظة في ذاكرة التطبيق، ولكن يمكنك أيضاً عمل "ترحيل" لحفظها في الأرشيف.
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onClose}
            className="brutal-btn-secondary py-2.5 px-3 text-xs sm:text-sm font-bold"
          >
            البقاء في التطبيق
          </button>
          
          <button
            onClick={onConfirmExit}
            className="brutal-btn-accent py-2.5 px-3 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>تأكيد الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};
