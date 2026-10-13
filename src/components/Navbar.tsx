import React from 'react';
import { 
  Download, 
  LogOut, 
  Smartphone, 
  Monitor, 
  Share2, 
  Coins,
  FileSpreadsheet
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  activeTab: 'calculator' | 'names' | 'history' | 'install';
  setActiveTab: (tab: 'calculator' | 'names' | 'history' | 'install') => void;
  onExitClick: () => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  ratePerOp: number;
  onRateChange: (newRate: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onExitClick,
  isMobileFrame,
  setIsMobileFrame,
  ratePerOp,
  onRateChange,
}) => {
  const { isInstallable, install } = usePWAInstall();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تطبيق احتساب مستحق الأرشفة الذكي',
          text: 'تطبيق احتساب أجور العمل ومستحقات الأرشفة الأسبوعية وتصدير تقارير PDF للأندرويد',
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط التطبيق بنجاح');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F4] border-b-2 border-[#111113] text-[#111113] transition-all">
      {/* Top System Kicker & Developer Credit (Variation 1 aesthetic) */}
      <div className="bg-[#111113] text-white py-1 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-[#E35E2D] font-bold">[01] SYS</span>
            <span className="font-medium text-slate-200">تطبيق الأرشفة الذكي</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-100">
            <span className="text-slate-400 font-normal">تطوير:</span>
            <span>سامي القادري</span>
            <span className="num-tabular font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-amber-300">
              777484160
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#111113] text-white border-2 border-[#111113] shadow-[2px_2px_0px_#E35E2D] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-[#E35E2D]" />
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#111113]/60 font-bold leading-none mb-0.5">
              ARCHIVE CALC // V1.0
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-[#111113] leading-none">
              تطبيق احتساب مستحق الأرشفة
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Rate adjuster button */}
          <button
            onClick={() => {
              const res = prompt('أدخل قيمة العملية الواحدة بالريال (الافتراضي 17):', String(ratePerOp));
              if (res !== null) {
                const val = Number(res);
                if (!isNaN(val) && val > 0) {
                  onRateChange(val);
                }
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-none bg-[#FFF9F2] text-[#111113] border-2 border-[#111113] shadow-[2px_2px_0px_#111113] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111113] transition text-xs font-bold active:translate-x-[2px] active:translate-y-[2px]"
            title="تعديل سعر العملية"
          >
            <Coins className="w-3.5 h-3.5 text-[#E35E2D]" />
            <span className="font-mono font-bold text-xs">{ratePerOp}</span>
            <span className="text-[10px] text-[#111113]/70 hidden sm:inline">ريال</span>
          </button>

          {/* Desktop phone frame toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-white text-[#111113] border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-xs font-bold transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111113]"
            title={isMobileFrame ? 'عرض بالشاشة الكاملة' : 'معاينة بمظهر شاشة أندروID'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">DESKTOP</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#E35E2D]" />
                <span className="text-[10px] font-mono">MOBILE</span>
              </>
            )}
          </button>

          {/* Quick Build / Download Tab Trigger */}
          <button
            onClick={() => setActiveTab('install')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#E35E2D] text-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-xs font-bold transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111113] active:translate-x-[2px] active:translate-y-[2px]"
            title="ملف البناء وحزم APK"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] font-black">BUILD</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-8 h-8 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] flex items-center justify-center text-[#111113] hover:translate-x-[1px] hover:translate-y-[1px] transition"
            title="مشاركة التطبيق"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Exit */}
          <button
            onClick={onExitClick}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#111113] text-white border-2 border-[#111113] shadow-[2px_2px_0px_#E35E2D] hover:bg-rose-900 transition text-xs font-bold"
            title="خروج"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E35E2D]" />
            <span className="text-[11px]">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
};
