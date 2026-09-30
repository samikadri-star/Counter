import React from 'react';
import { 
  Download, 
  LogOut, 
  Smartphone, 
  Monitor, 
  Share2, 
  FileSpreadsheet,
  Coins
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
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تطبيق احتساب مستحق الأرشفة الذكي',
          text: 'تطبيق احتساب أجور العمل ومستحقات الأرشفة الأسبوعية وتصدير تقارير PDF للأندرويد',
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط التطبيق بنجاح');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-md">
      {/* Top Banner & Developer Signature (As requested in design) */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 py-1 px-4 text-center border-b border-indigo-700/40">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-100">تطبيق الأرشفة الذكي للأندرويد</span>
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-amber-300 flex items-center gap-1.5">
            <span>تصميم وتطوير:</span>
            <span className="font-bold text-white tracking-wide">سامي القادري</span>
            <span className="num-tabular bg-indigo-950/80 px-1.5 py-0.5 rounded text-amber-200 border border-amber-400/20">777484160</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400 font-bold text-lg">
              <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              تطبيق احتساب مستحق الأرشفة
            </h1>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>أجور العمل الأسبوعية</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-medium num-tabular">1 عملية = {ratePerOp} ريال</span>
            </p>
          </div>
        </div>

        {/* Quick Actions (Install, Rate, Share, Exit) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Rate adjuster quick popover trigger */}
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-amber-300 text-xs font-medium border border-slate-700 transition active:scale-95"
            title="تعديل سعر العملية"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="num-tabular font-bold">{ratePerOp}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">ريال/عملية</span>
          </button>

          {/* Desktop mobile frame toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
            title={isMobileFrame ? 'عرض بالشاشة الكاملة' : 'معاينة بمظهر شاشة أندرويد'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[11px]">شاشة كاملة</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px]">مظهر الهاتف</span>
              </>
            )}
          </button>

          {/* Download Build ZIP Quick Button */}
          <button
            onClick={() => setActiveTab('install')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition active:scale-95"
            title="ملف البناء وتثبيت أندرويد"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold">ملف الـ Build</span>
          </button>

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition active:scale-95 animate-pulse"
              title="تثبيت التطبيق على جهازك"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق</span>
            </button>
          )}

          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition active:scale-95"
            title="مشاركة التطبيق"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Exit Button (Requested by user) */}
          <button
            onClick={onExitClick}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 text-xs font-medium border border-rose-800/60 transition active:scale-95"
            title="الخروج من التطبيق"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
};
